---
sidebar_position: 6
title: Reports
---

# Reports

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Relatórios**. Requer `reports.aggregate` e existe nas duas edições.

1. Escolha **Equipes** ou **Grupos** quando ambos existirem e depois **Tabela** ou **Cartografia**.
2. Clique em um nó para isolar ou retirar uma seleção.
3. Clique em **Exportar** para baixar todas as semanas publicadas da divisão atual; sem semanas, o botão não aparece.

O Reports é a vista de síntese **agregada e publicada** dos usos: semanas completas e fixas, publicadas uma vez, jamais recalculadas. Ele responde a "o que está acontecendo, semana após semana, por equipe ou por parque?" sem expor os indivíduos: os pequenos grupos e os vínculos identificantes são omitidos.

Ele exige a permissão `reports.aggregate` — é a única tela do Monitoring acessível a um leitor de agregados sem leitura dos dispositivos nem das conversas.

![Milvago - Acessar esta tela](/img/docs/en/monitoring-reports-01.png)

## Duas distribuições de uma mesma semana

Cada semana publicada lê-se segundo dois eixos, colocados lado a lado:

- **Equipes** — o atributo OIDC portado pelas pessoas (configurado em Privacidade);
- **Grupos** — a distribuição Parque > Grupos.

A aba só aparece se a distribuição existe realmente; se nem o atributo de equipe nem os grupos existem, um aviso o diz e propõe onde agir: "Nenhum atributo OIDC de equipe está configurado e nenhum grupo de máquinas existe, portanto todas as linhas aparecem como não atribuídas. Defina o atributo de equipe em Privacidade ou crie grupos em Parque."

Uma semana publicada **antes** da existência da distribuição por grupos não a porta: a tela exibe "Não há divisão por grupo de máquinas para esta semana: ela foi publicada antes de essa divisão existir, e um relatório publicado nunca é recalculado." em vez de um zero enganador — a ausência do dado nunca vale "zero solicitação".

## Tabela ou cartão

Cada semana lê-se em **tabela** (equipe ou grupo, ferramenta, serviço, modelo, solicitações, respostas, titulares distintos) ou em **cartografia**: o mesmo diagrama em fitas que a Cartografia do Monitoring, onde cada equipe (ou grupo) torna-se o ponto de partida dos fluxos. A seleção de um nó é possível, sem codificação de sensibilidade.

![Milvago - Tabela ou cartão](/img/docs/en/monitoring-reports-03.png)

## O que o k-anonimato faz às linhas

Uma linha (equipe ou grupo, ferramenta, serviço, modelo) só é publicada quando pelo menos *k* pessoas distintas a usaram durante a semana. Esse limite é definido em [Privacidade](../administration/confidentialite.md). Linhas menores são retiradas. As que ficam abaixo do limite na outra distribuição (equipes ou grupos) também: caso contrário, poderiam ser deduzidas por subtração entre as duas visões. A atividade não vinculada a nenhuma pessoa também é excluída.

As linhas que superam o limite continuam exibidas. Uma semana incompleta leva o selo **Linhas ocultas**, e um aviso acima das semanas explica o motivo. Feche-o com o X: a escolha fica salva no seu navegador, o selo permanece em cada semana afetada e o link **Por que há linhas ocultas?** reabre a explicação. Uma linha ausente nunca é um zero: o que é omitido é sinalizado como omitido.

![Milvago - O que o k-anonimato faz às linhas](/img/docs/en/monitoring-reports-04.png)

## Export

O botão de exportação produz um **CSV** de todas as semanas segundo a distribuição corrente: semana, equipe (ou grupo), ferramenta, serviço, modelo, solicitações, respostas, titulares distintos. O arquivo abre corretamente no Excel sem assistente de importação (BOM UTF-8, separador anunciado), e os valores vindos de um token de identidade ou de um campo do console são neutralizados contra a injeção de fórmulas — uma célula começando por `=`, `+`, `-`, `@` nunca é interpretada.

![Milvago - Export](/img/docs/en/monitoring-reports-05.png)

A zero semana publicada, a tela lê "Dados insuficientes para publicar": os agregados se acumulam com as publicações, eles não se retrocalculam.

![Milvago - Export](/img/docs/en/monitoring-reports-06.png)
