---
sidebar_position: 2
title: Conversas
---

# Conversas

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Conversas**. Requer `events.read` e não está disponível para consulta somente agregada.

1. Escolha **24 h**, **7 d**, **30 d** ou **Personalizado**, preencha os critérios e clique em **Aplicar**; a tabela retorna à primeira página.
2. Abra uma linha e carregue mensagens anteriores quando necessário; salve o escopo com **Salvar esta visualização**.
3. Escolha JSON ou CSV e clique em **Exportar**. O arquivo e o relatório de síntese usam exatamente os filtros; identidades reveladas exigem `identity.reveal`.

O registro das conversas reúne as trocas Shadow AI observadas nos dispositivos da organização: quem falou com qual serviço, a partir de qual dispositivo, com qual resultado (observado, bloqueado, mascarado). Ele responde à pergunta "**quê**" que a visão geral deixa aberta após o "quanto".

A linha de informação sob o título define o grão da leitura: uma conversa agrupa os registros de uma mesma troca em um mesmo dispositivo; um registro sem identificador de conversa permanece isolado.

![Milvago - Acessar esta tela](/img/docs/en/monitoring-conversations-01.png)

## A barra de filtros

Ela é exibida de início, sem botão "Refinar os filtros". Ela porta:

- o **período**, em segmentos diretos (24 h, 7 d, 30 d) ou personalizado (de / até, ambas as fronteiras sendo obrigatórias e ordenadas);
- os **identificadores**: pessoa (ator) e dispositivo;
- as **dimensões de uso**: navegador ou aplicação, serviço, modelo, e uma busca em texto integral;
- a **ação** (observada, bloqueada, redirecionada) e a **natureza** (prompt, resposta, navegação);
- a presença de um **anexo**.

![Milvago - A barra de filtros](/img/docs/en/monitoring-conversations-02.png)

As **visualizações salvas** completam a barra: uma visualização porta um nome, pode ser **compartilhada com a organização** (sendo então gerível pelos Proprietários e Admins), e aplicá-la reinicializa a paginação. Mudar um filtro traz sempre de volta à página 1.

## A tabela

Cada linha é uma conversa, e a linha inteira a abre — com um verdadeiro botão na primeira célula para a navegação por teclado. Colunas:

| Coluna | Conteúdo |
| --- | --- |
| **Ferramenta / serviço** | o provedor (botão de abertura) e a ferramenta precisa (navegador ou aplicação local) |
| **Modelo** | o modelo utilizado, e seu esforço de raciocínio, se houver; "Desconhecido" quando nada pôde ser observado |
| **Dispositivo** | nome da máquina, ou "Nome da máquina indisponível"; um identificador de dispositivo truncado em 8 caracteres é sempre exibido, passar o mouse revela o identificador completo |
| **Pessoa** | veja a regra de atribuição abaixo |
| **Última atividade** | com a hora de início da troca |
| **Mensagens** | prompts + respostas trocadas |
| **Arquivos anexados** | badge âmbar "Com arquivo" — um documento partiu com a conversa |
| **Ação** | badge vermelho "N bloqueados", badge âmbar "N redirecionados", senão status observado |
| **Sensibilidade** | apenas Enterprise (veja mais abaixo) |

![Milvago - A tabela](/img/docs/en/monitoring-conversations-03.png)

### A regra de atribuição das pessoas

A coluna Pessoa aplica a mesma regra na lista, no filtro e no detalhe, e a fórmula é honesta sobre o que sabe:

1. Uma **associação OIDC verificada** nomeia a pessoa, com a menção "Pessoa verificada".
2. À falta disso, a **conta do SO** por trás do navegador ou da ferramenta é exibida *a título informativo* — e dita como tal. Para uma ferramenta nativa, é o perfil coletado pela aplicação.
3. À falta disso, se o servidor sabe que uma pessoa existe sem dizer quem (pseudonimato), a célula lê "Pseudonimizado"; sem nenhuma pista, "Não atribuído". A expressão "Não atribuído" não designa uma conta mascarada: ela designa a ausência total de pista.

Uma ferramenta presente em um dispositivo jamais permite inferir seu usuário.

## O fio de uma conversa

Abrir uma conversa desdobra um diálogo em tela cheia: resumo da troca (pessoa, ferramenta, modelo, início, última atividade, número de mensagens) na cabeça, e depois as mensagens renderizadas da mais antiga à mais recente, como a troca ocorreu.

![Milvago - O fio de uma conversa](/img/docs/en/monitoring-conversations-04.png)

- O fio se **carrega por páginas**: "Carregar as mensagens anteriores" sobe no tempo. Cada página é uma requisição independente — se um direito de revelação de identidade expira, as páginas seguintes não portam mais o dado revelado, em vez de um tampão que o manteria além de seu vencimento.
- O texto das mensagens é um texto **bruto**, selecionável e copiável, jamais reescrito nem interpretado. Um clique na bolha abre seu detalhe, salvo se um texto está em curso de seleção (senão, destacar para reler abriria um diálogo ao soltar); a bolha também abre com Enter ou Espaço quando está em foco, e seu pequeno ícone de detalhe continua acessível pelo teclado.

### O que uma bolha mostra

- **PROMPT OCULTO / RESPOSTA OCULTA**, com a causa nomeada: "leitura não autorizada" (direito faltante), "texto não conservado" (a coleta do texto está desativada ou o conteúdo purgado), "identidade não revelada".
- Os **arquivos anexos** são listados com um ícone por tipo — lido na extensão do nome, a única informação disponível: nenhum byte de arquivo é jamais lido.
- Um envio **acompanhado de um arquivo** produz dois registros (o arquivo parte para o provedor desde o anexo); na exibição, o anexo junta-se à bolha de sua mensagem — um recolhimento de exibição apenas; cada registro guarda seu horário e seu detalhe.
- Uma bolha **bloqueada** porta o motivo da recusa, nomeado e não bruto: "Modelo negado pela política", "Não foi possível identificar o modelo", "Controle local indisponível".
- As **navegações** aparecem como linhas de referência no fio, clicáveis para seu detalhe.

![Milvago - O que uma bolha mostra](/img/docs/en/monitoring-conversations-05.png)

### O detalhe de um registro

O detalhe concerne apenas um sentido — um envio **ou** uma resposta — e seu título o nomeia. Ele reúne: horário, pessoa, dispositivo, origem (navegador ou aplicação local), serviço e modelo, ação, motivo de recusa, se houver, plataforma, número de caracteres, categorias detectadas, arquivos anexos, revisão de política aplicada, URL, identificadores de conversa e de correlação.

O texto conservado, se existe, exibe-se com o aviso **"Esta leitura de conteúdo foi auditada."**: toda consulta de um texto armazenado é rastreada. Sem direito de leitura explícito, a tela mostra um quadro que o diz em vez de um quadro vazio.

<img className="mv-doc-image--compact" src="/img/docs/en/monitoring-conversations-06.png" alt="Milvago - O detalhe de um registro" />

## Exports e paginação

- Os **exports** contêm os metadados correspondendo exatamente aos filtros correntes; os textos eventuais exigem um direito de leitura explícito, e cada consulta é auditada. A menção figura sob a tabela, não em um aviso enterrado.
- A **paginação** é numerada (primeira e última páginas sempre alcançáveis, reticências nos saltos) com um seletor de tamanho de página no alto à direita e a contagem total dos resultados. A zero resultado, a tela propõe alargar o período ou retirar um filtro.

![Milvago - Exports e paginação](/img/docs/en/monitoring-conversations-07.png)

:::enterprise

O filtro e a coluna de **sensibilidade dos usos** são reservados à Enterprise: a Community nunca os exibe, no registro como no cartão. Na Enterprise, um evento sensível porta um badge âmbar, e os conteúdos mascarados portam os rótulos das regras de mascaramento que os detectaram.

:::
