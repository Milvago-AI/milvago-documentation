---
sidebar_position: 4
title: Instância de demonstração
---

# Instância de demonstração

Uma instância de demonstração publica o produto na Internet: qualquer um pode visitá-lo com um identificador simples, sem poder modificar nada, com dados que se movem a cada cinco minutos. Ela apoia-se em duas variáveis de ambiente e uma pilha Docker dedicada.

[IMAGEAMETTREICI 01]

## Colocar a demonstração em serviço

1. No host de operações Docker, prepare as duas variáveis de demonstração nos segredos da implantação.
2. Inicie a pilha dedicada `compose.demo.yaml` sem expor nenhum serviço além do proxy.
3. Abra a URL pública e entre com a conta de demonstração.
4. Verifique que uma ação de modificação é recusada e que os dados sintéticos estão visíveis antes de compartilhar a URL.

## As duas variáveis

| Variável | Efeito |
| --- | --- |
| `MILVAGO_DEMO_READONLY` | recusa **toda** mutação do console na instância, qualquer que seja o papel do chamador, **antes do roteamento** — uma rota adicionada mais tarde é coberta sem pensar nisso. Segunda guarda, mais grosseira, por cima do papel: duas rotas do console são registradas sem permissão (`PUT /api/profile`, `POST /auth/logout`), portanto um papel em somente leitura não cobre tudo |
| `MILVAGO_DEMO_MCP_KEY` | chave MCP de demonstração exibida na página de perfil — **e em nenhum outro lugar**, e apenas se a instância está em somente leitura: uma instância que aceita escritas pode fabricar suas próprias chaves, e uma instância cliente nunca deve exibir uma credencial que ela não criou |

A **ingestão dos dispositivos** (`/v1`, `/v2`, `/v3`) permanece voluntariamente fora do escopo do sinalizador: é por aí que os dados chegam, e ela exige uma credencial de aparelho que nenhum visitante detém.

## A pilha

`compose.demo.yaml` é uma pilha autônoma, distinta do compose principal: nenhuma porta publicada exceto as do **proxy**, sem instância Community, e tudo o que não é o proxy está cortado da Internet. Quatro camadas fazem respeitar o somente leitura:

1. **A borda**: apenas `GET`/`HEAD` passam, mais a desconexão; os caminhos de ingestão, `/mcp`, `/metrics` e `/ext` respondem 404 publicamente.
2. **O servidor**: `MILVAGO_DEMO_READONLY`.
3. **O papel**: um papel `demo` em leitura (`overview.read`, `events.read`, `devices.read`, `members.read`, `content.read`, `reports.aggregate`), nenhuma permissão de gestão — o console oculta portanto todas as ações.
4. **A identidade**: mudança de senha e inscrição desativadas — senão um visitante muda a senha compartilhada e tranca os seguintes.

[IMAGEAMETTREICI 02]

## Nenhum agente baixável

Uma demonstração mostra o produto; ela **não distribui um agente** capaz de registrar uma máquina real. As rotas de instalador e de chave de implantação exigem uma permissão que o papel não porta, e a borda recusa explicitamente os caminhos de extensões e de instaladores em 404 — uma regra que não depende nem do papel, nem do conteúdo da imagem. Consequência assumida: as páginas de configurações Shadow AI e Discovery não são visíveis; os **dados** são.

## Os dados de demonstração

O gerador provisiona o que uma credencial de aparelho não pode alcançar, e depois fala o **protocolo agente real**: nada é escrito nas tabelas de eventos às costas do servidor — lacramento, classificação, atribuição e retenção passam pelo código que a frota de um cliente exercita.

- Histórico de 30 dias postado uma vez, e depois uma **onda a cada cinco minutos**: a retenção delimita o banco, nada é apagado em bloco.
- Conteúdo inteiramente inventado (faixas de documentação, domínios de exemplo), portanto apresentado em claro: o visitante vê a extensão do que o produto pode reter.
- Uma frota sintética por padrão de 25 dispositivos, um quarto nativos (os dois canais de coleta lado a lado), sem nenhum nome de pessoa.
- Doze temas giram em uma hora — pico de uploads bloqueados, segredos detectados, plataforma não coberta, modelo recusado… — portanto um visitante que permanece vê a **forma** mudar, e não apenas os contadores subir.

[IMAGEAMETTREICI 03]
