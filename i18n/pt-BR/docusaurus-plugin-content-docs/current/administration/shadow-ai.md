---
sidebar_position: 3
title: Shadow AI
---

# Shadow AI

## Acessar a tela

Clique em **Administração** > **Shadow AI**. Você precisa de `policy.manage`.

1. Selecione uma seção.
2. Altere os campos.
3. Salve as alterações; a confirmação informa a próxima sincronização.

A tela "Administração do Shadow AI" carrega a **política aplicada aos usos de IA**: o que é coletado, quais serviços são observados, bloqueados ou redirecionados, o que é mascarado na saída do dispositivo, o que a Descoberta tem o direito de nomear. Ela responde à pergunta "**quais regras os meus dispositivos aplicam**". O acesso exige a permissão `policy.manage` ("Gerenciar a política (Shadow AI)").

A linha sob o título fixa o quadro: "Coleta, proteção e operações em uma única política coerente." A política é **assinada e revisada** — cada salvamento produz uma nova revisão, distribuída às instalações na próxima sincronização delas; um dispositivo nunca aplica uma revisão mais antiga que a sua.

## As seções

Uma navegação vertical divide a tela, numerada na ordem da política:

1. **Inscrição e coleta** — como um dispositivo obtém o direito de reportar, e o que a coleta conserva.
2. **Serviços** — os serviços cobertos e o comportamento deles; na Enterprise, os controles de modelos.
3. **Proteções** — bloqueio de anexos e palavras protegidas.
4. **Mascaramento local** — substituição dos dados detectados antes de qualquer envio.
5. **Sensibilidade dos usos** — somente Enterprise; a seção não existe no restante.
6. **Plataformas de IA** — o que a Descoberta informa, no nível da organização.
7. **Operações** — atualizações assinadas e parque piloto, sob a bandeira de diagnóstico.

Cada salvamento lê "Configuração salva. As instalações a receberão na próxima sincronização." Enquanto houver campos alterados, um badge "Rascunho" sinaliza o estado não salvo.

![Milvago - As seções](/img/docs/en/administration-shadow-ai-01.png)

## Inscrição e coleta

### Aprovação de dispositivos

"Escolha como uma nova instalação recebe permissão para reportar." Três modos:

- **Aprovação manual** — cada dispositivo instalado aparece como pendente e não reporta nada até ser aprovado em Dispositivos.
- **Aprovação automática** — o dispositivo reporta desde a inscrição.
- **Redes e domínios autorizados** — uma lista de regras, até 50 (**Adicionar uma regra** / **Excluir a regra**). Cada regra leva uma **Rede (CIDR)** obrigatória e um **Domínio da máquina (opcional)**. Um dispositivo é aprovado automaticamente quando seu endereço de conexão, como constatado pelo servidor, está na rede de uma regra e, quando a regra indica um domínio, a máquina declarou esse domínio na inscrição.

  Uma solicitação recebida atrás de um proxy reverso, um Ingress ou um Gateway — que carrega um cabeçalho `Forwarded`, `X-Forwarded-For` ou `X-Real-IP` — nunca é aprovada por rede: o dispositivo aguarda a aprovação manual em Dispositivos. Atrás de tal intermediário, use a aprovação manual ou a aprovação automática.

  Domínios declarados: domínio DNS do Active Directory (Windows ingressado em um AD), identificador de tenant do Entra ID (Windows ingressado no Entra) ou realm Kerberos do Linux (`realm join`, `default_realm` de `/etc/krb5.conf`). A comparação é exata e insensível a maiúsculas/minúsculas, sem correspondência parcial nem de sufixo.

  Um domínio nunca aprova sozinho: uma regra sempre exige um CIDR, pois o domínio é declarado pela própria máquina e o servidor não pode verificá-lo — alguém com o instalador da organização em uma máquina fora do parque poderia declarar qualquer domínio. As regras escritas antes desta versão (lista simples de redes) continuam funcionando como regras sem domínio. Agentes anteriores à versão 0.5.45 não declaram nenhum domínio: só as regras sem domínio podem aprová-los.

Esta seção só existe no nível da organização: nem um grupo, nem um dispositivo redefinem a inscrição.

### Coleta no navegador

- **Ativar a coleta** — os usos no navegador. Desativá-la interrompe as novas coletas.
- **Reter o texto das solicitações e das respostas** — "Desativado por padrão. Ativar exige um segundo fator verificado há instantes, nunca uma chave de API. Ler exige uma permissão separada." O console então redireciona para a verificação do segundo fator e reaplica a alteração ao retornar. A retenção dos textos é limitada por "Retenção do texto (dias)", de 1 a 30. Desativar o conteúdo interrompe as novas coletas e remove o texto em fila na próxima atualização da política; ele não apaga os metadados já recebidos.
- **Reter os nomes dos arquivos enviados** — "Apenas nomes, nunca conteúdos." Eles são coletados onde um arquivo realmente entra no compositor — seleção, arraste, colagem; um arquivo adicionado por um caminho que a página não expõe permanece invisível.

A descrição da seção carrega o limite da edição: "O Community conecta a extensão à ponte Rust aberta. As conversas de aplicações locais continuam sendo um recurso Enterprise."

## Serviços

"O catálogo e os domínios autorizados vêm do servidor. Um serviço ativado não implica cobertura exaustiva da interface." Cada serviço coberto porta:

- uma chave de ativação;
- seus domínios, exibidos tal como o catálogo os declara;
- um **comportamento**: Observar, Bloquear, Redirecionar;
- em redirecionamento, um **destino do redirecionamento** obrigatório.

:::enterprise

O pacote Community constrói apenas os adaptadores ChatGPT e Claude: o catálogo de fábrica e a execução dele nunca nomeiam os outros serviços. A Enterprise cobre nove provedores — ChatGPT, Claude, Le Chat, Copilot, Gemini, NotebookLM, DeepSeek, Perplexity, Grok.

### Controles de modelos

Quando a edição qualifica os controles de modelos, a seção Serviços ganha um bloco "Controles de modelos": "As restrições de serviço têm prioridade. Estas regras refinam os modelos permitidos ou negados em cada plataforma." Cada plataforma, por canal (Navegador ou Aplicação local), porta uma regra — "Nenhuma restrição", "Permitir todos, exceto os listados", "Negar todos, exceto os listados" — e, quando for o caso, uma lista de identificadores exatos de modelos: um identificador por linha, no máximo 100, jamais aproximados. "Os modelos Unknown ou Auto não verificáveis são bloqueados enquanto houver uma restrição ativa."

Uma tabela "Status aplicado nos dispositivos" recenseia, por dispositivo e plataforma, o estado (Requer atualização, Pendente, Aplicada, Indisponível), a revisão esperada e o motivo eventual: "As regras salvas continuam distintas das revisões efetivamente aplicadas." O dispositivo aparece ali com o nome real para quem possui `devices.read` fora da consulta somente agregada; os demais leitores veem o alias do dispositivo. Em consulta somente agregada, a tabela conta apenas os dispositivos por plataforma, canal e estado, sem designar um dispositivo. A observação do nome do modelo que respondeu permanece aberta às duas edições; a decisão de autorizar ou negar um modelo é Enterprise.

O confinamento em nível de sistema (WFP no Windows, SELinux no Linux) cobre apenas os executáveis registrados em seu caminho de instalação. Uma cópia do executável colocada em outro local não é confinada.

:::

![Milvago - Controles de modelos](/img/docs/en/administration-shadow-ai-03.png)

## Proteções

### Anexos

**Bloquear o envio de arquivos** lacra as rotas de upload **medidas** do catálogo (`kind:"file"`) — as URL que um envio realmente desencadeia no site, levantadas no local e publicadas no catálogo assinado, jamais adivinhadas. Nenhuma heurística sobre o método, o host ou a forma do corpo: apenas as rotas de upload medidas são lacradas, para nunca interceptar um envio legítimo. "A interceptação depende do navegador e das interfaces compatíveis."

### Palavras e frases protegidas

"As detecções são aplicadas localmente conforme a política assinada." O bloco porta:

- **Frases protegidas** — uma frase por linha; não coloque nelas credenciais de acesso.
- Três níveis de correspondência, ajustados separadamente: **Correspondência exata**, **Variantes Unicode**, **Correspondência aproximada** (esta última pode estar Desativada).
- **Exceções** — uma por linha; elas reduzem a cobertura de detecção.
- **Mensagem exibida ao bloquear**.

![Milvago - Palavras e frases protegidas](/img/docs/en/administration-shadow-ai-04.png)

## Mascaramento local

"Atua sobre o texto capturado, no dispositivo, antes de qualquer envio: cada item detectado é substituído pelo seu rótulo, por exemplo [email]. É independente da sensibilidade dos usos (painéis) e da retenção do texto. A detecção é heurística e se limita aos formatos compatíveis; revise os resultados antes de ampliar a implantação." Duas chaves: **Ativar o mascaramento**, e **Exigir uma revisão antes do envio**.

:::enterprise

As **categorias integradas** — E-mail, Telefone, IBAN, Cartão de pagamento, Identificador social (França), Número de Seguro Social (Estados Unidos), Endereço IP — são um recurso Enterprise. A guarda de rede retém apenas o que porta um prompt: uma rota de prompt do catálogo, ou um corpo com a forma de um prompt — o compositor já deteve ou mascarou o texto na origem. Os marcadores portam o **rótulo da regra** e um número por valor distinta assim que houver várias: `[IP]`, ou `[IP1]` e `[IP2]`.

:::

### Regras de mascaramento personalizadas

As duas edições definem regras personalizadas: um **rótulo**, uma **expressão regular** limitada (sem retrorreferências nem asserções — o servidor rejeita padrões inseguros), **Ativada**, **Ignorar maiúsculas**. Um rótulo que a própria expressão reconhece é sinalizado e bloqueia o salvamento: o rótulo se torna o marcador inserido no texto mascarado (`[ROTULO]`, `[ROTULO1]`…), e uma expressão que o capturasse mascararia os próprios marcadores a cada passagem, sem fim.

Na Community, sem categorias integradas, a tela o explicita: "Esta edição não inclui padrões de detecção integrados: defina suas próprias expressões regulares em "Regras de mascaramento personalizadas" abaixo."

![Milvago - Regras de mascaramento personalizadas](/img/docs/en/administration-shadow-ai-05.png)

:::enterprise

## Sensibilidade dos usos

A seção só existe na Enterprise quando a edição qualifica a sensibilidade — caso contrário, ela não é exibida de forma alguma, nunca vazia. "Define quais categorias detectadas marcam um evento como sensível no registro, na cartografia e nas exportações. Não altera o texto capturado: o mascaramento é configurado em Mascaramento local. As categorias indicam sensibilidade; elas não certificam conformidade."

Três blocos:

- **Sensibilidade dos usos no navegador** e **Sensibilidade das aplicações locais** — as categorias que marcam um evento como sensível: os dados pessoais, mais Código-fonte, Dados médicos e Palavras-chave.
- **Termos médicos** — "Um texto que contenha um destes termos recebe o rótulo "Dados médicos". Busca de subcadeia sem diferenciar maiúsculas, no dispositivo." Um termo por linha, no máximo 100, com 60 caracteres cada; lista vazia, nenhuma detecção.

As palavras-chave vêm das frases protegidas de "Proteções".

:::

## Plataformas de IA

Esta seção se configura **no nível da organização**: a Descoberta se lê aí, as plataformas que ela tem o direito de nomear se escolhem aí. Ela porta dois ajustes distintos:

- **Descobrir domínios candidatos** — "Quando ativada, a descoberta inspeciona localmente a estrutura das solicitações em memória, sem armazená-las." O interruptor escreve nas configurações de privacidade: ele exige `settings.manage`, um MFA recente e um motivo escrito de no mínimo 8 caracteres, conservado no registro de auditoria. Desativado por padrão, a tela Descoberta permanece vazia com o aviso que remete para cá.
- **A lista de plataformas conhecidas** — agrupadas por categoria (Assistentes gerais, Assistentes de programação, Agregadores de múltiplos modelos…), com busca e a contagem "Plataformas: N · ocultas da Descoberta: N". Desmarcar uma plataforma a **oculta da Descoberta**: "Apenas presença: estas plataformas são reportadas como acessadas, e nada é lido de suas páginas. Ocultar uma mantém o registro das visitas e a remove de Descoberta; exibi-la novamente traz o histórico de volta." O ocultamento não atravessa o catálogo assinado: é uma escolha de leitura, não uma mudança de detecção, e ele não produz nenhuma nova revisão de política.

Uma plataforma que a edição já captura jamais aparece na lista: o servidor envia apenas o que esta edição não captura por inteiro, e uma plataforma capturada não pode alcançar a Descoberta.

![Milvago - Plataformas de IA](/img/docs/en/administration-shadow-ai-06.png)

## Operações

Sob a bandeira de diagnóstico da instância, a seção "Atualizações e dispositivos piloto" configura as **atualizações assinadas**: ativação, percentual do parque piloto, identificadores dos dispositivos piloto, versões pausadas. Sem uma cadeia de entrega assinada anunciada, a chave fica inerte com o aviso "Nenhuma cadeia de entrega de atualizações assinadas é reportada como operacional." A desativação porta o próprio aviso dela: "Os agentes permanecem na versão instalada, inclusive quando uma correção de segurança é publicada."

Um bloco "Status informado pelo servidor" mostra o estado anunciado e as versões assinadas disponíveis.

## Herança e exceções

A política se lê em cascata: **organização → grupo de dispositivos → dispositivo**. No nível da organização, cada seção pode ser **imposta** aos descendentes que herdam; um grupo ou um dispositivo pode se excetuar seção por seção, a exceção mais próxima do dispositivo prevalece. Veja [Herança da configuração](../introduction/heritage-configuration.md), [Grupos de dispositivos](../fleet/groupes.md) e [Dispositivos](../fleet/postes.md).
