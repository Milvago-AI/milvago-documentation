---
sidebar_position: 2
title: Grupos de dispositivos
---

# Grupos de dispositivos

## Acessar esta tela

Na barra lateral, clique em **Parque > Grupos**. Requer `devices.read` e não está disponível para consulta somente agregada.

1. Com `devices.manage`, crie um grupo, abra seu nome, use **Adicionar dispositivos**, selecione-os e confirme.
2. Renomeie, remova ou exclua confirmando; dispositivos removidos voltam à política da organização.
3. Com `policy.manage`, salve a política do grupo: a revisão é distribuída na próxima sincronização e a sensibilidade só aparece no Enterprise.

Os grupos de dispositivos portam uma política Shadow AI comum a vários dispositivos de uma vez. Eles respondem à pergunta: como aplicar a mesma derrogação a um conjunto de máquinas sem redigitá-la dispositivo por dispositivo.

A linha de informação sob o título porta as duas regras de leitura: "Um grupo aplica uma mesma política Shadow AI a todos os dispositivos que contém. A derrogação própria de um dispositivo prevalece sempre sobre seu grupo."

[IMAGEAMETTREICI 01]

## Quem vê o quê

| Ação | Condição |
| --- | --- |
| Ver os grupos e suas fichas | direito `devices.read` |
| Criar, renomear, suprimir, afetar dispositivos | direito `devices.manage` |
| Regular a política do grupo | direito `policy.manage` |

Os grupos existem nas duas edições: um grupo é uma ferramenta de organização do parque, não uma função de inventário.

## A cadeia de política

A política efetiva de um dispositivo lê-se em três andares: **dispositivo > grupo > organização**. Um grupo não sobrescreve senão as seções que ele define; as seções deixadas em herança seguem a organização. A derrogação mais próxima do dispositivo prevalece: uma derrogação própria ao dispositivo prevalece sobre seu grupo.

Um dispositivo pertence a **um único grupo** por vez — sem prioridade entre grupos a arbitrar. Retirá-lo de um grupo o faz voltar à política da organização, e seu histórico é conservado.

## A lista de grupos

A tabela porta quatro colunas:

| Coluna | Conteúdo |
| --- | --- |
| **Nome** | clicável para a ficha do grupo |
| **Descrição** | texto livre, ou "—" |
| **Dispositivos** | número de dispositivos membros |
| **Ações** | "Renomear" e "Suprimir" para quem tem o direito de gestão; "—" senão |

Um contador exibe o número de grupos. À falta de grupo, a tela lê "Nenhum grupo de dispositivos".

O botão "**Novo grupo**" abre um diálogo com dois campos: **Nome do grupo** (obrigatório) e **Descrição**. Dois nomes não diferem apenas pela caixa, e a descrição permanece curta — as duas fronteiras são controladas na gravação.

[IMAGEAMETTREICI 02]

## A ficha de um grupo

A ficha abre-se pelo nome do grupo na lista. Ela porta duas abas: **Informações**, sempre presente, e **Política do grupo** com o direito `policy.manage`.

### Informações

O cartão Informações reúne o identificador do grupo, sua descrição e sua contagem de dispositivos. Sob o cartão, a tabela dos dispositivos membros retoma as colunas da lista de dispositivos — Dispositivo (clicável para sua ficha), Plataforma, Estado, Último contato — mais a ação "**Retirar do grupo**", que traz o dispositivo de volta à política da organização.

A tabela oferece 10, 20, 50, 100 ou 200 dispositivos por página e mantém acessíveis a primeira página, a última e as páginas vizinhas.

[IMAGEAMETTREICI 03]

### Afetar dispositivos

O botão "**Adicionar dispositivos**" abre um painel lateral listando os dispositivos da organização que ainda não pertencem ao grupo. Cada linha porta uma caixa de seleção, e um dispositivo já membro de outro grupo exibe o nome desse grupo: movê-lo é uma mudança a ver antes de cometê-la. O botão de confirmação porta seu efetivo — "Adicionar (N)" — e permanece inativo enquanto nada é marcado.

Esse painel usa a mesma paginação; os dispositivos marcados permanecem selecionados ao mudar de página.

Dois estados vazios são enunciados tal como são:

- nenhum dispositivo membro: "Nenhum dispositivo neste grupo";
- mais nenhum candidato: "Todos os dispositivos já pertencem a este grupo."

A afetação envia uma requisição por dispositivo: uma recusa é sinalizada dispositivo por dispositivo ("Atualização impossível para: …") em vez de interromper os outros. Reaffectar a um dispositivo o grupo que ele já porta não reescreve nada.

Afetar um dispositivo a um grupo cuja política retém o texto das solicitações e respostas exige a mesma verificação de segundo fator recente que ativá-la no Shadow AI.

### Política do grupo

A aba porta a **derrogação do grupo**. O editor é o mesmo que o de [Shadow AI](../administration/shadow-ai.md), restrito às seções que um grupo pode sobrescrever: **Registro e coleta**, **Serviços**, **Proteções**, **Mascaramento local**, e na Enterprise **Sensibilidade dos usos**. As seções deixadas em herança seguem a organização — a caixa "Herdar" a nomeia.

O cabeçalho de seção exibe o escopo ("Derrogação do grupo") e a revisão corrente. Cada gravação produz uma nova revisão; as instalações a recebem em sua próxima sincronização, e a aplicação efetiva observa-se no Monitoring.

[IMAGEAMETTREICI 04]

## Revisões e anti-retrocesso

Cada mudança no lado do grupo — gravação da política, afetação, retirada, supressão — produz uma revisão mais recente, e a política efetiva de um dispositivo a herda. Um dispositivo nunca aplica uma revisão mais antiga do que a que detém: passar de um grupo a outro, e depois voltar, apenas faz crescer. Essa regra impede que um dispositivo fique bloqueado em uma política ultrapassada por um jogo de datas desfavorável.

## Suprimir um grupo

A confirmação porta a consequência exata: "Os dispositivos de um grupo suprimido voltam à política da organização. Seu histórico é conservado." Os dispositivos são primeiro desvinculados — cada um recebe uma revisão fresca — e depois o grupo desaparece com sua política. A contagem de dispositivos do grupo figura na confirmação. Excluir um grupo cujos dispositivos passariam então a reter o texto das solicitações e respostas — a organização o retém, o grupo não retinha — exige a mesma verificação de segundo fator recente que afetar um dispositivo a um grupo assim.

[IMAGEAMETTREICI 05]

Veja também: [Dispositivos](postes.md), [Shadow AI](../administration/shadow-ai.md).
