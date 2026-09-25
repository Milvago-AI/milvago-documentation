---
sidebar_position: 5
title: Variáveis de ambiente
---

# Variáveis de ambiente

Toda a configuração do servidor passa pelo ambiente: o console nunca lê uma delas e nada se regula a quente. Uma variável ausente ou inválida para o servidor com a mensagem exata do problema — sem substituição silenciosa. As variáveis necessárias também dependem do papel do processo.

[IMAGEAMETTREICI 01]

## Papéis de processo

`MILVAGO_ROLE` seleciona a responsabilidade do processo. Seu valor padrão, `all`, preserva o processo combinado para implantações existentes. No Kubernetes, separe os papéis e monte apenas os segredos necessários para cada pod.

| Valor | Responsabilidade | Particularidades |
| --- | --- | --- |
| `all` | API, manutenção, exportações Enterprise e migrações | modo de compatibilidade; reúne os segredos dos papéis envolvidos |
| `migrate` | migrações e inicialização | usa `MIGRATION_DATABASE_URL`; é executado como Job antes da API |
| `api` | HTTP, console e agentes | não recebe URL de migração nem identidade de inicialização |
| `exports` | exportações Enterprise | não serve o console e não executa migrações |
| `maintenance` | tarefas de manutenção | não serve o console e não executa migrações |

## Obrigatórias conforme o papel

| Variável | Papel |
| --- | --- |
| `DATABASE_URL` | conexão PostgreSQL de runtime |
| `MIGRATION_DATABASE_URL` | conexão usada apenas por `all` e `migrate` nas migrações (papel privilegiado) |
| `APP_URL` | origem HTTPS da aplicação (HTTP tolerado apenas em loopback explícito); dirige o modo cookies seguros |
| `OIDC_ISSUER` | emissor Keycloak (HTTPS ou loopback explícito) |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | cliente OIDC do console |
| `SESSION_KEY` | raiz de criptografia dos tokens OIDC de sessão (AES-256-GCM, 32 bytes em base64 padrão) |
| `CONTENT_KEYS` | raízes do conteúdo lacrado, formato `version:base64` (`1:<32 bytes base64>,2:…`); a versão mais alta lacra, as anteriores apenas abrem |
| `POLICY_SIGNING_KEY` | semente Ed25519 de assinatura das políticas e catálogos (32 bytes em base64) |

`DATABASE_URL` e `CONTENT_KEYS` continuam necessários para os papéis que acessam dados. A API exige `APP_URL`, configuração OIDC, `SESSION_KEY` e `POLICY_SIGNING_KEY`. `migrate` também exige `APP_URL`, e `maintenance` exige o emissor OIDC. O papel `exports` é aceito somente no Milvago Enterprise e não precisa de segredos de sessão do console, URL de migração nem identidade de inicialização.

:::warning
`SESSION_KEY` e `CONTENT_KEYS` têm papéis distintos **por construção**: a sessão é descartável (uma rotação custa novas conexões), o conteúdo lacrado é durável. Uma entrada `CONTENT_KEYS` igual a `SESSION_KEY` é recusada na inicialização.
:::

## Com valor padrão

| Variável | Padrão | Papel |
| --- | --- | --- |
| `DB_RUNTIME_ROLE` | `milvago_runtime` | papel PostgreSQL do runtime (RLS na Enterprise); formato `^[a-z_][a-z0-9_]{0,62}$` |
| `STATIC_DIR` | `../console/dist` | bundle do console servido pelo mesmo binário |
| `LISTEN_ADDR` | `:4020` | porta de escuta HTTP |
| `COMMUNITY_ORG_NAME` | `Milvago` | nome da organização Community criada na inicialização |
| `PUBLIC_URL` | valor de `APP_URL` | origem pública exibida aos agentes (origem apenas: nem caminho, nem requisição, nem fragmento) |
| `OIDC_INTERNAL_URL` | — | emissor OIDC visto desde a rede interna, se diferente |
| `EDITION` | fixada na compilação | deve corresponder à composição compilada do binário, senão recusa na inicialização |
| `BOOTSTRAP_EMAIL` | vazia | endereço da primeira conta, criada automaticamente por `all` ou `migrate` ("modo automático"). Deixada vazia, é o assistente de [primeira instalação](premiere-installation.md) que cria essa conta em vez de uma importação. |
| `OIDC_ADMIN_CLIENT_ID` / `OIDC_ADMIN_CLIENT_SECRET` | — | necessário para operações de perfil, convites e diretório dos papéis `api` ou `all`, para o assistente de [primeira instalação](premiere-installation.md) e para verificações de manutenção do Keycloak; não é exigido na inicialização e as exportações não o usam |

## Facultativas `MILVAGO_*`

| Variável | Efeito |
| --- | --- |
| `MILVAGO_INSTALLER_DIRECTORY` | diretório dos MSI e manifestos servidos aos dispositivos; as atualizações se servem ao lado dos instaladores |
| `MILVAGO_UPDATE_PUBLIC_KEY` | chave de verificação dos manifestos de atualização (32 bytes base64), separada da chave de assinatura das políticas |
| `MILVAGO_SETUP_TOKEN` | token de uso único com no mínimo 32 caracteres que abre o assistente de [primeira instalação](premiere-installation.md) enquanto `BOOTSTRAP_EMAIL` está vazia; o servidor guarda apenas sua impressão SHA-256, nunca registrada em log |
| `MILVAGO_SHADOW_METRICS` | fecha `GET /api/shadow/metrics` na instância se `0`/`false`/`off`/`no`; aberto por padrão |
| `MILVAGO_MCP` | fecha o servidor MCP Enterprise se `0`/`false`/`off`/`no`; servido por padrão (a ausência da variável é o estado normal) |
| `MILVAGO_DEBUG` | abre o editor do catálogo de detecção e suas rotas de escrita se `1`/`true`/`on`/`yes`; a publicação permanece sujeita ao Proprietário raiz e a uma MFA recente — é um ajuste de ruído, não uma fronteira de segurança |
| `MILVAGO_DEMO_READONLY` | recusa qualquer mutação do console, qualquer que seja o papel (instância de demonstração não supervisionada); a ingestão dos dispositivos permanece voluntariamente fora do escopo |
| `MILVAGO_DEMO_MCP_KEY` | chave MCP exibida na página de perfil de uma instância de demonstração — conservada apenas se `MILVAGO_DEMO_READONLY` estiver ativo: uma instância que aceita escritas nunca exibe uma chave que ela não serviu |
| `MILVAGO_PUBLISHER_URL` + `MILVAGO_PUBLISHER_CREDENTIAL` + `MILVAGO_PUBLISHER_PUBLIC_KEY` | conexão ao serviço do editor: os três valores são fornecidos juntos; consulte [Conectar ao serviço do editor](../avance/service-editeur.md) |
| `MILVAGO_METRICS_TOKEN` | token deliberado que expõe a rota de métricas além do console |
| `MILVAGO_OTEL_HTTP_HOSTS` | hosts HTTP OTLP autorizados, separados por vírgulas; cada entrada é validada estritamente (host apenas, sem usuário, caminho, requisição nem fragmento) |
| `MILVAGO_EXPORT_CA_FILE` | arquivo PEM (≤ 1 MB) de autoridades raiz para os destinos de exportação; deve conter pelo menos um certificado explorável |

[IMAGEAMETTREICI 02]

## Funcionalidades do Keycloak a desativar

"O Milvago desativa no Keycloak as funcionalidades que não usa e que um cliente que se registra sozinho poderia ativar para obter tokens sem endereço de redirecionamento: `KC_FEATURES_DISABLED=device-flow,ciba,token-exchange-standard`. Um provedor de identidade existente que atenda ao Milvago deve aplicar o mesmo ajuste."

## As recusas de inicialização são salvaguardas

A configuração é validada em bloco: raízes de exatamente 32 bytes, versões `CONTENT_KEYS` positivas e únicas, chaves de conteúdo distintas de `SESSION_KEY`, origens HTTPS (loopback explícito tolerado para os ensaios), emissor OIDC seguro, papéis de base bem formados. Um defeito de configuração é um erro, não uma substituição silenciosa por uma raiz de outro uso.
