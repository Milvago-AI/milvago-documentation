---
sidebar_position: 3
title: Cartografia
---

# Cartografia das solicitações

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Cartografia**. Requer `events.read` e não está disponível para consulta somente agregada.

1. Clique em **Refinar os filtros**, defina período e critérios e clique em **Aplicar**.
2. Selecione ou exclua valores nos trilhos; remova uma etiqueta ou use **Limpar**. **Ocultar pessoas** mostra a visão global.
3. Um nó, fita ou **Ver estas solicitações** abre Conversas com o escopo desenhado. A exportação e o relatório preservam filtros, seleções e exclusões; identidade revelada exige `identity.reveal`.

A cartografia responde a uma única pergunta: **quem fala com o quê**. Ela desenha, no período escolhido, os fluxos entre as pessoas, as ferramentas, os serviços e os modelos, em fitas cuja largura representa as solicitações e cuja cor representa o editor do serviço.

Ela não responde a "será que observo bem": a saúde da captura vive na Discovery, com o resto do que fala de cobertura. Navegações e inventários não são convertidos em solicitações — o pé do cartão o diz quando o período está vazio.

![Milvago - Acessar esta tela](/img/docs/en/monitoring-cartographie-01.png)

## O que a tela conta

Quatro indicadores sob a barra de filtros: **Solicitações**, **Respostas**, **Conversas identificadas** e, na Enterprise, **Eventos sensíveis** (tonalidade âmbar assim que o valor é > 0). Uma linha de informação nomeia o que o cartão não pode fazer: "N eventos sem pessoa verificada" — a identidade verificada vem de uma associação OIDC; à falta disso, a conta do SO por trás da ferramenta é exibida a título informativo. As navegações são contadas à parte.

![Milvago - O que a tela conta](/img/docs/en/monitoring-cartographie-02.png)

## O cartão: trilhos e fitas

O diagrama organiza-se em quatro colunas ligadas por fitas:

- à esquerda, **Pessoas** e **Navegadores / aplicações**;
- ao centro, as **fitas** mesmas, uma por fluxo (pessoa × ferramenta × serviço × modelo);
- à direita, **Serviços** e **Modelos**.

Cada coluna porta sua contagem de valores presentes no período ("10 / 47"). Ao passar o mouse sobre uma fita ou um nó, uma dica detalha o volume, os bloqueados e, na Enterprise, o número de eventos sensíveis.

![Milvago - O cartão: trilhos e fitas](/img/docs/en/monitoring-cartographie-04.png)

- **Ocultar pessoas (uso geral)**: uma caixa da barra de filtros alterna a vista para "Ferramentas → serviços → modelos" — o polo pessoas desaparece, o uso torna-se global. É uma vista cliente: os filtros laterais **nunca alargam** o que o servidor devolveu, eles decidem apenas o que é desenhado.
- Os **filtros laterais** (trilhos, recolhíveis) excluem ou isolam valores de cada coluna. Uma seleção que a nova vista não desenha mais é retirada automaticamente em vez de falsear o link para o registro.
- Clicar um nó ou uma fita **aprofunda nas Conversas**: o link transmite o período e a seleção corrente, natureza "prompt". A seleção lê-se no pé do cartão (chips removíveis, botão "Limpar"), com um "Ver estas solicitações" que leva exatamente o que a tela mostra — seleção e exclusões compreendidas.

![Milvago - O cartão: trilhos e fitas](/img/docs/en/monitoring-cartographie-05-gauche.png)

## Legenda e estados

- A legenda porta "Não atribuído" (os fluxos sem pessoa) e, na Enterprise, "Sensível".
- A zero solicitação no período, o cartão o assume: "Nenhuma solicitação neste período", com a precisão de que as navegações e inventários não são convertidos em solicitações.
- A barra de filtros é recolhível aqui (o cartão permanece compacto); o botão "Refinar os filtros" a abre, e um "Redefinir" dedicado retira os filtros laterais.

![Milvago - Legenda e estados](/img/docs/en/monitoring-cartographie-05-droite.png)

:::enterprise

Na Enterprise, a largura das fitas vem acompanhada de uma codificação de **sensibilidade detectada**: hachuras sobre as fitas, contador por nó, KPI dedicado e trilho de filtragem. Na Community, o cartão limita-se ao par solicitações/bloqueadas — nada é nomeado sensibilidade, nem no cartão nem no registro.

:::

![Milvago - Legenda e estados](/img/docs/en/monitoring-cartographie-06.png)

## Exports

A exportação cobre o que você olha, não a barra de filtros nua: os chips de seleção e as exclusões dos trilhos recolhem-se no relatório, exatamente como os links de detalhe. Como no registro, a exportação contém os metadados correspondendo exatamente aos filtros; os textos eventuais exigem um direito de leitura explícito, e cada consulta é auditada.

![Milvago - Exports](/img/docs/en/monitoring-cartographie-07.png)
