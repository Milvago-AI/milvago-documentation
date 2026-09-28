---
sidebar_position: 2
title: Chaves de API e servidor MCP
---

# Chaves de API e servidor MCP

## Acessar a tela

Clique no bloco de usuário no canto inferior esquerdo e depois em **Meu perfil**. **Chaves de API** é um cartão separado depois de **Segurança e acesso**.

1. Crie uma chave.
2. Copie o segredo exibido uma única vez.
3. Confirme a tabela.

As chaves de API encontram-se na página **Meu perfil**, sob o bloco "Segurança e acesso". Elas respondem à pergunta "**como um script ou uma ferramenta externa chama a API**": "Para que um script ou uma ferramenta externa chame a API com suas permissões, sem compartilhar sua senha."

## Criar uma chave

O botão "Nova chave de API" abre o diálogo de criação, limitado a 5 chaves ativas por conta ("Limite de 5 chaves ativas atingido: revogue uma para continuar."). Quatro ajustes:

- **Nome da chave** — uma frase humana, por exemplo "Exportação SIEM".
- **Período de validade** — 30, 90 ou 365 dias; além disso, a chave expira e a tela a marca "Expirada".
- **Permissões** — a lista de direitos que **você** possui, nada pré-marcado, e nada que o servidor não lhe concederia: "Limitadas às suas próprias permissões e recalculadas a cada chamada: a chave perde uma permissão assim que você a perde."
- **Permitir a leitura do conteúdo dos prompts** — uma caixa à parte, que só se apresenta se a sua instância a propõe: "Ative apenas se a ferramenta precisar: sem esta caixa, a chave vê apenas metadados."

![Milvago - Criar uma chave](/img/docs/en/mon-profil-cles-api-01.png)

Dois avisos se apresentam no momento em que a decisão é tomada, não depois:

- Marcar `installers.manage` ("Gerenciar os instaladores") lê "Esta permissão sobrevive à chave": "Uma chave que pode baixar o instalador consegue ler a chave de implantação da organização, que não expira. A capacidade de inscrever dispositivos sobreviverá, portanto, a esta chave: para retirá-la, faça a rotação da chave de implantação em Configurações."
- Na Enterprise, ativar a leitura do conteúdo lê "O texto dos prompts poderá sair para um LLM externo": "Esta chave também abre o servidor MCP. Um modelo conectado com ela poderá ler o texto que seus usuários enviaram, e esse texto será transmitido ao provedor daquele modelo. Sem esta caixa, a mesma ferramenta vê apenas metadados."

A chave secreta é exibida **uma única vez**, em um diálogo que sobrevive ao recarregamento da lista: "Copie esta chave agora: ela não será exibida novamente, a ninguém." Se você a perder, revogue a chave e crie outra.

## A tabela de chaves

Colunas: **Nome** (com o badge âmbar "Conteúdo" se a chave lê os conteúdos), **Permissões** (até duas por extenso, além disso um badge "N permissões" com o detalhe ao passar o mouse), **Criada**, **Expiração** ("Expira em N dias", "Expira amanhã", ou "Expirada"), **Último uso** ("Nunca utilizada" caso contrário). **Revogar** pede confirmação e surte efeito imediatamente: "Qualquer ferramenta que use "…" deixará de se autenticar imediatamente. Isso é definitivo."

![Milvago - A tabela de chaves](/img/docs/en/mon-profil-cles-api-02.png)

:::enterprise

## Servidor MCP

Sob a tabela de chaves, o cartão "Servidor MCP" só aparece na Enterprise: "Para conectar um modelo de linguagem ao Milvago. Ele lê o mesmo escopo que o console — com os direitos de quem faz login, ou os de uma das chaves acima." Ele dá os três elementos de configuração:

- **Ponto de entrada** — `<URL do seu console>/mcp`, a declarar como servidor MCP remoto por HTTP; "O ponto de entrada aceita apenas POST."
- **Entre com sua conta** — o identificador de cliente público `milvago-mcp-client`, para um cliente que o exija; "A maioria dos clientes precisa apenas do endereço acima: eles abrem uma página de login, pedem seu consentimento e o modelo passa a ler com seus próprios direitos, na sua própria organização." A troca é protegida por PKCE.
- **Cabeçalho de autenticação** — `Authorization: Bearer <chave de API>`: "Obrigatório em todos os métodos, descoberta incluída: sem credencial o servidor não responde nada. Um cookie de sessão é recusado, nunca aceito no lugar."

Duas revisões do protocolo são servidas — a do próprio produto e a revisão publicada — e o aviso o diz para que um cliente que começa por "initialize" saiba qual recebe.

Uma conexão feita com sua conta não é permanente: um conector que fique sem uso por sete dias, e todo conector ao final de trinta dias, pedirá que você entre novamente. O servidor também recusa um token emitido para o próprio console, e um conector que se registra sozinho deve solicitar explicitamente o acesso `milvago:mcp` no momento da conexão — o que os conectores comuns fazem. O mesmo vale para qualquer outro aplicativo declarado no provedor de identidade: na inicialização, o Milvago retira o acesso `milvago:mcp` dos acessos concedidos por padrão a esses aplicativos, inclusive os criados antes desta regra.

### Somente leitura, e dados não confiáveis

"Nenhuma ferramenta altera uma política, um dispositivo, um membro ou uma configuração. As respostas contêm, sim, dados escritos pelos seus usuários: nomes de máquina, rótulos e o texto dos prompts quando a chave tem acesso; esses dados saem para o provedor do modelo." O servidor MCP não é um contorno: ele atravessa o mesmo RBAC e o mesmo isolamento por organização, e uma chave MCP jamais pode escrever. Uma chave de API ou um token de conector MCP lista apenas os membros da própria organização, nunca os de uma organização filha, mesmo quando a sua função abrange um subárvore mais amplo na Enterprise.

### O registro automático de conectores

Quando um conector deve obter credenciais próprias em vez de uma chave pessoal, o registro se configura em [Configurações](../administration/parametres.md), no provedor de identidade, com os hosts autorizados dele e o teto de clientes dele.

"Em uma organização que exige autenticação multifator, um conector que se registra sozinho só é aceito se o seu token atestar um segundo fator por meio da sua lista de métodos de autenticação (`amr`); o nível declarado (`acr`) só é confiável para o conector fornecido pelo Milvago. Um token válido por mais de uma hora é recusado, assim como um cliente que tenha atribuído a si mesmo mappers, uma conta de serviço, ou um fluxo diferente do código de autorização com consentimento."

:::
