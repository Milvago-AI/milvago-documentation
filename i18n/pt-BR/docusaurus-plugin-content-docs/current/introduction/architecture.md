---
sidebar_position: 3
title: Arquitetura técnica
---

# Arquitetura técnica

import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';

O Milvago compõe-se de quatro partes, ligadas por canais delimitados e assinados: a **extensão de navegador**, o **agente local**, o **servidor** e o **console**.

<ArchitectureDiagram />

## Fluxos e portas

As setas do diagrama indicam **quem abre a conexão**. As respostas usam o mesmo canal. O agente contata o servidor; o servidor não se conecta às estações. O tráfego do navegador para um site de IA não passa pelo servidor Milvago.

### Rede da plataforma

| Iniciador → destino | Protocolo e porta | Uso e configuração |
| --- | --- | --- |
| Agente → ponto de entrada da instância | HTTPS, geralmente TCP **443** | Políticas assinadas, eventos, heartbeat, catálogo e atualizações. A porta vem da URL de provisionamento. |
| Navegador do console → ponto de entrada da instância | HTTPS, geralmente TCP **443** | Console React e API na mesma origem; sem servidor Node.js separado. |
| Proxy reverso / Ingress / Gateway API → servidor Go | HTTP, TCP **4020** por padrão | Escuta em `LISTEN_ADDR=:4020`. A terminação TLS deve ser configurada upstream; o binário chama `ListenAndServe`, não um servidor TLS integrado. |
| Servidor Go → PostgreSQL | PostgreSQL, TCP **5432** no Compose | Conexões `DATABASE_URL` e `MIGRATION_DATABASE_URL`, em rede privada. |
| Navegador do console → Keycloak | HTTPS, geralmente TCP **443** em produção | Login, MFA e redirecionamentos OIDC pela URL pública do emissor. O acesso apenas do servidor ao Keycloak não é suficiente. |
| Servidor Go → Keycloak | HTTP **8080** no Compose; caso contrário, porta da URL escolhida | Descoberta OIDC, chaves públicas, troca de código e administração de identidade. `OIDC_INTERNAL_URL` pode encaminhar essas chamadas pela rede privada mantendo o emissor público. |
| Keycloak → PostgreSQL | PostgreSQL, TCP **5432** no Compose | Banco de identidade dedicado, separado dos bancos de dados da aplicação. |
| Cliente API / cliente MCP → instância | HTTPS, porta da URL pública | API REST; MCP Enterprise em `/mcp`, sem porta de escuta adicional. |
| Servidor → coletor OTLP externo | OTLP/HTTP JSON, porta da URL configurada | Enterprise: `/v1/logs` e `/v1/metrics`. **4318** é a porta do coletor de exemplo, não uma escuta Milvago nem uma porta obrigatória. HTTP interno exige a autorização `MILVAGO_OTEL_HTTP_HOSTS`. |
| Ferramenta de supervisão → servidor | HTTP(S), mesma porta da instância | `/metrics` quando há um token de supervisão configurado; as sondas `/health/live` e `/health` também usam a porta da aplicação. |

Os manifestos Kubernetes separam a API, a manutenção e as exportações Enterprise. A API e as exportações têm HPAs independentes; o **Service ClusterIP 4020 → 4020** da API permanece interno. Provisione separadamente a entrada HTTPS por Ingress ou Gateway API, os certificados, PostgreSQL e Keycloak. Não publique as portas privadas acima na Internet. Consulte [Implantação Kubernetes](../installation/helm.md) e [Dimensionar PostgreSQL e o autoscaling](../avance/dimensionnement-postgresql-hpa.md).

### Comunicações locais na estação

| Iniciador → destino | Transporte / porta local | Função |
| --- | --- | --- |
| Extensão → relé Native Messaging | Entrada/saída padrão enquadrada; **sem porta TCP** | Trocas entre a extensão e o binário iniciado pelo navegador. |
| Relé → serviço do agente | Windows: named pipe `milvago-browser` ou `milvago-commercial`; Linux: `/run/milvago/browser.sock` ou `commercial.sock` | Política, decisões e eventos por IPC; nenhuma abertura de rede é necessária. |
| Navegadores baseados em Chromium → agente | HTTP **127.0.0.1:17641** (Community), **:17642** (Enterprise) | CRX e manifesto `/ext/update.xml`, a partir do pacote incorporado. |
| Firefox → agente | HTTPS **127.0.0.1:17651** (Community), **:17652** (Enterprise) | XPI assinado e `/ext/updates.json`; certificado local gerenciado pela instalação. |
| Navegador → site de IA | HTTPS, geralmente TCP **443** | Tráfego direto para o fornecedor, controlado pela extensão nos sites cobertos. |
| Agente Enterprise → coletor nativo | IPC local, sem TCP | O agente solicita as observações e depois confirma sua persistência. O coletor não envia diretamente ao servidor. |
| Ferramentas nativas → coletor nativo Enterprise | OTLP/HTTP protobuf em **127.0.0.1**, porta atribuída no primeiro início e depois conservada | `/v1/logs`, autenticação e atribuição ao processo chamador; essa porta não é fixada em 4318. |
| Clientes nativos cobertos → filtro Enterprise | Proxy TLS em **127.0.0.1:47831–47834** | Respectivamente Codex, Claude Code, Claude Desktop, Claude Desktop Agent; conexões de saída do filtro para os fornecedores em **443**. Apenas para clientes configurados. |
| Detecção Enterprise → serviços de modelos locais | Sondas loopback **11434, 1234, 1337, 4891** | Portas de destino autorizadas para o inventário local; não são servidores abertos pelo Milvago. |

As escutas loopback permanecem acessíveis somente na estação. Elas não justificam nenhuma regra de entrada a partir da LAN. A presença de uma porta na tabela não significa que sua funcionalidade opcional esteja ativa.

### Portas do Compose de desenvolvimento

Todas as publicações são vinculadas a `127.0.0.1`: **4020 → 4020** para Community, **4120 → 4020** para Enterprise, **4080 → 8080** para Keycloak, **55432 → 5432** para PostgreSQL e **4081 → 8025** para a interface do servidor de e-mail de teste. Esses valores são os padrões do Compose e podem ser substituídos por suas variáveis. Eles não constituem um plano de portas de produção.

## A extensão de navegador

Um service worker no Chrome, Edge, Brave, Vivaldi e Arc, e scripts em segundo plano no Firefox, aplicam a política nos sites de IA cobertos. A extensão é controlada por um **catálogo de detecção assinado** — um motor e dados: rotas medidas dos sites (rotas de prompt, rotas de upload), seletores DOM do compositor, caminhos dos campos. Ela não aplica nenhuma heurística fora dessas rotas medidas, e a cobertura depende da edição servida.

Sem política válida (agente parado, revogação), ela **falha em modo fechado**: a superfície de IA coberta é lacrada, jamais deixada aberta por padrão. A política assinada é persistida localmente e relida pelo componente em segundo plano, com revisão e expiração verificadas a cada leitura.

## Navegadores compatíveis

O escopo do produto inclui seis navegadores: Google Chrome, Microsoft Edge, Brave, Vivaldi, Mozilla Firefox e Arc. O Chromium independente não faz parte dele, mesmo que ainda apareça em scripts históricos. Nenhum agente para macOS, Safari ou dispositivos móveis é declarado.

| Navegador | Família | Windows | Linux |
| --- | --- | --- | --- |
| Google Chrome | Chromium | Política MSI e CRX local. Um CRX fora da Chrome Web Store depende das condições de gerenciamento Active Directory do computador. | Integração Native Messaging pelo script de sistema; a extensão e o perfil precisam ser administrados. |
| Microsoft Edge | Chromium | Política MSI e CRX local. | Integração Native Messaging pelo script de sistema; a extensão e o perfil precisam ser administrados. |
| Brave | Chromium | Política MSI e CRX local. | Integração Native Messaging pelo script de sistema; a extensão e o perfil precisam ser administrados. |
| Vivaldi | Chromium | Política MSI, CRX local e host Native Messaging. | Não há caminho automatizado dedicado para Vivaldi; a extensão e o perfil precisam ser administrados. |
| Mozilla Firefox | Gecko | Política MSI, XPI assinado e host Native Messaging. | Integração Native Messaging pelo script de sistema; a extensão e o perfil precisam ser administrados. |
| Arc | Chromium | Compatível: política Arc e CRX local. A instalação por MSI e o controle de conteúdo ainda precisam de qualificação separada. | Não declarado. |

Firefox 140.0 ou posterior é obrigatório em todos os sistemas operacionais; Firefox Release e Beta exigem um XPI assinado. Os navegadores Chromium não têm uma versão mínima fixada no manifesto; as versões estáveis alvo ainda precisam de qualificação. O bundle Linux não configura perfis de navegador por si só: `deploy/install-browser.sh` instala o serviço de sistema e os manifestos Native Messaging. O RPM distribuído pela plataforma instala o mesmo serviço systemd de sistema, sob o usuário `milvago-agent`, e os mesmos manifestos Native Messaging de máquina que `deploy/install-browser.sh`.

Controles de rede que usam `webRequestBlocking` exigem uma extensão gerenciada nos navegadores que reservam essa capacidade para extensões instaladas por política. Uma instalação manual não demonstra o mesmo controle.

A cobertura dos sites de IA é independente do navegador. Community incorpora a captura para ChatGPT e Claude, enquanto as duas edições relatam separadamente a presença em plataformas conhecidas sem reativar a captura. Enterprise cobre nove provedores. Os resultados de qualificação só se aplicam à edição, ao navegador, ao sistema operacional e ao cenário executado: uma nota datada ou um artefato construído não se generaliza para outro contexto.

## O agente: um serviço, não uma tarefa de usuário

O núcleo do agente é um **serviço** (Rust): `endpoint` na Community e `bridge` na Enterprise. No Windows, roda sem sessão de usuário sob NetworkService, com um conjunto de privilégios reduzido (apenas `SeChangeNotifyPrivilege` e `SeCreateGlobalPrivilege`) e pastas ProgramData cuja ACL agora nomeia o SID próprio do serviço, em vez de NetworkService como um todo. No Linux, o RPM e o script autônomo `deploy/install-browser.sh` instalam os dois um serviço systemd de sistema, sob o usuário `milvago-agent`, com os manifestos Native Messaging de máquina. Ele executa dois loops:

- o loop de **sincronização**: política, fila de eventos, atualizações, e o inventário na Enterprise;
- um **servidor IPC local**, o único ponto de contato do navegador.

O navegador não pode falar com um serviço (session 0). O mesmo binário, iniciado pelo navegador como host Native Messaging, atua como **relé**: ele transmite as tramas ao serviço por um canal local (named pipe do Windows com descritor endurecido, socket Unix). A identidade do dispositivo permanece a do serviço, jamais a do cliente.

O estado do dispositivo vive em um armazenamento **criptografado pela máquina** (DPAPI no Windows): credenciais, política em cache, fila de eventos. Uma interrupção entre o agente e o servidor não para o navegador: enquanto o agente local responder pelo canal autenticado, ele aplica a última política local verificada e mantém os eventos até a retomada da sincronização. A tolerância de **cinco minutos** começa somente quando o serviço SYSTEM não consegue mais alcançar esse agente local; ao expirar, a superfície de IA é bloqueada. Uma revogação ou recusa explícita bloqueia imediatamente.

## O servidor

Um backend **Go** que serve:

- a **ingestão** dos agentes: eventos, heartbeats (usuário do SO da sessão ativa, puramente informativo), inventário, com limites de taxa por dispositivo;
- o **catálogo de detecção** assinado e sua publicação versionada;
- o **console** e a **API REST** com RBAC por permissões;
- as **atualizações**: MSI assinado e manifesto de atualização assinado, congelados na imagem;
- o armazenamento: **PostgreSQL**, com isolamento por **Row-Level Security** na Enterprise.

O console (React) é servido pelo mesmo binário; **nenhum recurso externo** é carregado em tempo de execução — bundle, fontes e tema são embarcados. A autenticação passa pelo Keycloak (OIDC Authorization Code + PKCE); o tema de conexão segue os mesmos tokens.

## Na Enterprise, três componentes privilegiados suplementares

- O **coletor nativo** (`collector`, LocalSystem) lê as aplicações de IA nativas declaradas pela política, sem jamais compartilhar o armazenamento do agente: ele tem sua própria âncora, sua própria chave, e não confia em nada do que o agente armazena. O agente **extrai** os registros do coletor, jamais o inverso.
- O **filtro de rede** (`filter`) observa o tráfego dos serviços cobertos no lado da máquina.
- O **inventário** funde as aplicações de IA por dispositivo (jamais um instantâneo destrutivo: um levantamento vazio não apaga nada), com `first_seen` para colocar a pergunta "o que apareceu esta semana?".

## Os canais, em resumo

Para `event_v2`, o agente primeiro grava o evento em seu armazenamento local criptografado. O servidor só devolve o identificador em `accepted_ids` depois de validar o dispositivo e confirmar a transação no PostgreSQL. Se o PostgreSQL estiver indisponível, a API responde temporariamente `503`: o agente mantém o mesmo identificador e tenta novamente. A repetição é esperada e continua idempotente; uma confirmação recebida significa que o PostgreSQL assumiu a guarda do evento.

| Canal | Sentido | Conteúdo |
| --- | --- | --- |
| `policy_v3` | extensão → agente → servidor | política **projetada**: serviços, coleta, controle de modelos; as palavras-chave e exceções não saem dela |
| `event_v2` | agente → servidor | eventos Shadow AI, em lotes, confirmados |
| `/v2/heartbeat` | agente → servidor | usuário do SO da sessão ativa (informação, jamais uma autoridade), extensões vistas |
| `/v1/inventory` | agente → servidor | aplicações de IA detectadas (Enterprise) |

Uma falha de sincronização não se esconde: o agente registra um estado único (`sincronizado`, `adiado` com autorização em cache válida, `bloqueado`), com a causa classificada e o remédio proposto — jamais detalhe de transporte nem identificador.
