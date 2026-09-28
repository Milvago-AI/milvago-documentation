---
sidebar_position: 1
title: Dispositivos
---

# Dispositivos

## Acessar esta tela

Na barra lateral, clique em **Parque > Dispositivos**. Requer `devices.read` e não está disponível para consulta somente agregada.

1. Com `installers.manage`, clique em **Baixar agente**, escolha o ZIP do Windows ou o RPM do Linux, instale-o, volte e atualize. Com `devices.manage`, aprove um dispositivo pendente quando aplicável.
2. Abra um dispositivo e escolha Detalhes, política ou, no Enterprise com `events.read`, ferramentas locais. Altere o grupo pela etiqueta; a revisão é aplicada na próxima sincronização.
3. Aprovar, revogar e excluir exigem `devices.manage` e confirmação; a exclusão em massa informa falhas por dispositivo.

A tela **Dispositivos** recense os aparelhos registrados junto ao servidor e responde à pergunta: quais dispositivos reportam informação, e quais ainda têm o direito de fazê-lo. Ela se encontra na seção **Parque** da navegação, com [Grupos de dispositivos](groupes.md).

A linha de informação sob o título fixa o perímetro do agente, segundo a edição:

- **Community**: "O agente Community cobre o uso no navegador. Não inclui o inventário de aplicações instaladas. Dispositivos pendentes ou revogados não podem enviar eventos."
- **Enterprise**: "O agente Enterprise cobre o navegador e o inventário dirigido de ferramentas. Dispositivos pendentes ou revogados não podem enviar eventos."

![Milvago - Acessar esta tela](/img/docs/en/fleet-postes-01.png)

## Quem vê o quê

| Ação | Condição |
| --- | --- |
| Ver a lista e as fichas | direito `devices.read`, e não uma consulta agregada apenas |
| Baixar o agente | direito `installers.manage` |
| Aprovar, revogar, excluir | direito `devices.manage` |
| Mudar o grupo de um dispositivo | direito `devices.manage` |
| Regular a política do dispositivo | direito `policy.manage` |

## A lista de dispositivos

A seção intitula-se **Dispositivos registrados**, com a regra de leitura "Uma identidade revogável por dispositivo": cada dispositivo detém sua própria identidade, que o console pode retirar individualmente. Um contador exibe o número de dispositivos correspondendo aos filtros.

O seletor **Por página** oferece 10, 20, 50, 100 ou 200 dispositivos. Os filtros aplicam-se a todo o parque antes da paginação, e os controles numerados dão acesso à primeira página, à última e às páginas vizinhas.

A barra de filtros só aparece se existe pelo menos um dispositivo. Ela porta três critérios cumulativos:

- **Nome do dispositivo** — contém o texto digitado;
- **Usuário** — contém o texto digitado, sobre a conta do SO sinalizada;
- **Sistema** — lista suspensa das plataformas efetivamente presentes no parque ("Todos os sistemas" por padrão).

![Milvago - A lista de dispositivos](/img/docs/en/fleet-postes-02.png)

Colunas da tabela:

| Coluna | Conteúdo |
| --- | --- |
| **Dispositivo** | nome da máquina clicável para a ficha, ou "Nome da máquina indisponível"; os primeiros caracteres do identificador aparecem abaixo |
| **Usuário** | conta do SO conectada, ou "—" enquanto nada foi sinalizado |
| **Grupo** | etiqueta clicável para o grupo, ou "—" |
| **Plataforma** | sistema do dispositivo, com a versão do agente em detalhe |
| **Estado** | badge **Em espera**, **Ativo** ou **Revogado** |
| **Última conexão** | horário do último sinal |
| **Ações** | "Aprovar" (dispositivo em espera) e "Revogar" (dispositivo não revogado) para quem tem o direito; "—" senão |

Duas telas vazias distintas, que não dizem a mesma coisa:

- nenhum dispositivo de todo: "**Pronto para o seu primeiro dispositivo**" — "Baixe o ZIP do Windows ou o RPM do Linux. O dispositivo aparece automaticamente após a instalação e a conexão.";
- nenhum dispositivo correspondendo aos filtros: "**Nenhum dispositivo corresponde**" — "Ajuste os critérios de busca."

## Baixar o agente

O botão "**Baixar o agente**" abre um diálogo de download apenas: ele não cria nada, a organização já detém uma chave de implantação. Três salvaguardas, na ordem do código:

1. **URL pública confirmada**: sem ela, o diálogo exibe um quadro de aviso — "Defina e confirme a URL HTTPS pública em Administração → Configurações antes de baixar um instalador. Os agentes se conectarão a essa URL." — ou pede a intervenção de um proprietário quando a URL não é modificável.
2. **Chave de implantação ativa**: se a chave foi revogada, o quadro "Nenhuma chave de implantação ativa" convida a fazê-la girar em Administração → Configurações.
3. **Modo de aprovação anunciado antes do download**:
   - aprovação manual — quadro âmbar "A aprovação manual está ativada": "Cada dispositivo instalado aparecerá como pendente e não reportará nada até que você o aprove em Dispositivos." Um dispositivo em espera não recebe nenhuma política: a partir da instalação do agente e até a aprovação, **nenhum acesso às plataformas de IA** é permitido nesse dispositivo — a extensão falha fechada e sela a superfície de IA coberta, em vez de deixá-la aberta por padrão;
   - aprovação segundo a rede — "A aprovação depende da rede": "Um dispositivo instalado a partir de uma rede autorizada reporta imediatamente; os demais ficam pendentes de aprovação."

O diálogo oferece **Windows ZIP** (um download com o MSI, o script de instalação e o JSON de provisionamento desta organização) e **Linux RPM** (serviço systemd para todo o dispositivo). Se sua conta usar um segundo fator, o download do Windows será retomado automaticamente após a verificação. O RPM Linux ainda contém a chave de implantação. Após a instalação, o dispositivo se registra uma única vez e mantém o estado em um cache criptografado. A versão baixada aparece abaixo do cartão.

O MSI incluído em cada ZIP do Windows é idêntico para todas as organizações; o JSON é específico desta organização. Proteja o ZIP e o JSON. Girar a chave invalida os arquivos de provisionamento Windows e RPM Linux anteriores, sem afetar os dispositivos registrados.

![Milvago - Baixar o agente](/img/docs/fr/fleet-postes-03.png)

## A ficha de um dispositivo

Abrir um dispositivo na lista exibe sua ficha. A linha de informação sob o título resume o conteúdo: "Identidade revogável do dispositivo, exceções e observações locais."

As ações da ficha dependem do estado: "Aprovar" em um dispositivo em espera, "Revogar" em todo dispositivo não revogado, "Excluir" em todos os casos para quem tem o direito. Abas se somam quando suas condições estão reunidas:

- **Detalhes** — sempre presente;
- **Política do dispositivo** — direito `policy.manage`, nas duas edições;
- **Ferramentas locais** — Enterprise, com um acesso de analista.

![Milvago - A ficha de um dispositivo](/img/docs/en/fleet-postes-04.png)

### Detalhes

| Campo | Conteúdo |
| --- | --- |
| **Identificador** | identificador único do dispositivo, em fonte de largura fixa |
| **Plataforma** | sistema sinalizado pelo agente |
| **Agente** | versão do agente instalada |
| **Atualização** | badge "A atualizar", "Em espera", "Aplicado" ou "Indisponível", com a data do último sinal quando existe |
| **Usuário conectado** | conta do SO no momento do sinal, ou "Não sinalizado" |
| **Domínio declarado** | domínio de máquina declarado na inscrição e seu tipo (Active Directory, Entra ID, realm Linux), ou ausente se o dispositivo não declarou nenhum — caso dos agentes anteriores à versão 0.5.45 |
| **Grupo** | etiqueta de afetação, detalhada abaixo |
| **Coletores nativos** | apenas Enterprise: estado de cada coletor de inventário, versão, último sucesso, árvores ignoradas e modificações de configuração gerida detectadas |
| **Extensões de navegador** | presença viva da extensão por navegador, detalhada abaixo |
| **Estado** | Em espera / Ativo / Revogado |
| **Última conexão** | horário |

![Milvago - Detalhes](/img/docs/en/fleet-postes-05.png)

#### O grupo de um dispositivo

A linha Grupo lê-se em dois tempos. Fechada, ela mostra a afetação corrente — a etiqueta do grupo, clicável para sua ficha, ou "Nenhum grupo" — seguida do link "Abrir o grupo". Um clique na etiqueta transforma a linha em lista de escolha: uma etiqueta por grupo da organização, mais "Nenhum grupo" para desvincular o dispositivo. Clicar o grupo já portado fecha a linha sem registrar nada.

#### As extensões de navegador

Um navegador é apresentado **ativo** apenas se sua extensão falou com o agente recentemente; todo contato mais antigo é datado ("Silencioso desde" com a data) em vez de apresentado como presente. A regra separa duas situações que a coluna Usuário não pode distinguir: uma extensão desativada pelo usuário, e um dispositivo que simplesmente não usa ferramentas de IA. À falta de todo sinal, a linha lê "Nenhuma extensão sinalizada".

### Política do dispositivo

A aba porta a **exceção do dispositivo** à política da organização — ou à de seu grupo. O editor é o mesmo que o de [Shadow AI](../administration/shadow-ai.md), restrito às seções que um dispositivo pode sobrescrever: **Registro e coleta**, **Serviços**, **Proteções**, **Mascaramento local**, e na Enterprise **Sensibilidade dos usos**. As seções deixadas em herança seguem o grupo, se existir, senão a organização — a caixa "Herdar" nomeia a tela de onde a seção é herdada.

O cabeçalho de seção exibe o escopo ("Exceção do dispositivo") e a revisão corrente. Cada gravação produz uma nova revisão, distribuída aos dispositivos em sua próxima sincronização; a aplicação efetiva observa-se no Monitoring.

:::enterprise

A seção **Sensibilidade dos usos** só existe no editor se a edição servir essa capacidade: sem ela, a seção não é exibida de todo, em vez de uma grade inutilizável.

:::

![Milvago - Política do dispositivo](/img/docs/en/fleet-postes-06.png)

### Ferramentas locais

:::enterprise

Esta aba só existe na Enterprise, para um acesso de analista. Ela lista as aplicações locais observadas neste dispositivo pelo módulo de inventário: ferramenta, tipo de observação (processo, executável, instalação, extensão, porta), primeira e última observação.

Duas regras de leitura, assumidas pela própria tela:

- as observações "não provam a utilização de uma ferramenta";
- "uma presença local detectada é distinta de um evento de navegador ou de um prompt emitido" — uma aplicação instalada não é um uso.

À falta de observação, a tela o enuncia: "Nenhuma ferramenta local sinalizada", e as observações do módulo de inventário aparecerão aqui.

:::

## Aprovar, revogar, excluir

Três ações diferentes, a não confundir:

- **Aprovar**: dar acesso. Reservada ao dispositivo em espera; o dispositivo passa ao estado ativo e começa a transmitir.
- **Revogar**: cortar o acesso conservando o histórico. A confirmação o enuncia: o dispositivo "perderá o acesso ao envio de eventos e às novas políticas. Será necessária uma nova inscrição para restabelecer o acesso."
- **Excluir**: ir mais longe que a revogação, definitivamente. A confirmação porta o texto completo: "A exclusão remove a identidade do dispositivo: ele perde imediatamente o direito de reportar, exatamente como se estivesse revogado, e seu agente descarta a fila local. É permanente e vai além da revogação: o dispositivo desaparece do console junto com seus eventos, sua exceção de política e suas observações locais. A revogação interrompe os envios, mas preserva o histórico." Excluir um dispositivo exige um segundo fator verificado há instantes e nunca está disponível para uma chave de API, porque a exclusão apaga todo o histórico dele — eventos e o texto retido das solicitações e respostas incluído. Enquanto o dispositivo ainda tiver texto retido, excluí-lo também exige o direito de purgar conteúdos (`content.purge`, reservado ao proprietário por padrão); caso contrário, o servidor recusa com "Este dispositivo ainda tem texto de prompt retido: excluí-lo exige o direito de purgar conteúdos."

![Milvago - Aprovar, revogar, excluir](/img/docs/en/fleet-postes-08.png)

A exclusão funciona também em massa: marcar vários dispositivos na lista exibe o botão "Excluir (N)", e a confirmação lista os nomes (dez exibidos, e depois "e N outros"). Cada dispositivo é excluído por uma requisição própria: uma falha é sinalizada dispositivo por dispositivo ("Não foi possível excluir: …") em vez de interromper toda a seleção, e os sucessos são contados à parte.
