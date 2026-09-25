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

[IMAGEAMETTREICI 01]

## Duas distribuições de uma mesma semana

Cada semana publicada lê-se segundo dois eixos, colocados lado a lado:

- **Equipes** — o atributo OIDC portado pelas pessoas (configurado em Privacidade);
- **Grupos de dispositivos** — a distribuição Fleet > Grupos.

A aba só aparece se a distribuição existe realmente; se nem o atributo de equipe nem os grupos existem, um aviso o diz e propõe onde agir: "todas as linhas saem como não atribuído — preencha o atributo de equipe em Privacidade, ou crie grupos no Parque".

[IMAGEAMETTREICI 02]

Uma semana publicada **antes** da existência da distribuição por grupos não a porta: a tela exibe "sem distribuição por grupo de dispositivos para esta semana" em vez de um zero enganador — a ausência do dado nunca vale "zero requisição".

## Tabela ou cartão

Cada semana lê-se em **tabela** (equipe ou grupo, ferramenta, serviço, modelo, requisições, respostas, temas) ou em **cartografia**: o mesmo diagrama em fitas que a Cartografia do Monitoring, onde cada equipe (ou grupo) torna-se o ponto de partida dos fluxos. A seleção de um nó é possível, sem codificação de sensibilidade.

[IMAGEAMETTREICI 03]

## O que o k-anonimato faz às linhas

Uma linha (equipe ou grupo, ferramenta, serviço, modelo) só é publicada quando pelo menos *k* pessoas distintas a usaram durante a semana. Esse limite é definido em [Privacidade](../administration/confidentialite.md). Linhas menores são retiradas. As que ficam abaixo do limite na outra distribuição (equipes ou grupos) também: caso contrário, poderiam ser deduzidas por subtração entre as duas visões. A atividade não vinculada a nenhuma pessoa também é excluída.

As linhas que superam o limite continuam exibidas. Uma semana incompleta leva o selo **Linhas ocultas**, e um aviso acima das semanas explica o motivo. Feche-o com o X: a escolha fica salva no seu navegador, o selo permanece em cada semana afetada e o link **Por que há linhas ocultas?** reabre a explicação. Uma linha ausente nunca é um zero: o que é omitido é sinalizado como omitido.

[IMAGEAMETTREICI 04]

## Export

O botão de exportação produz um **CSV** de todas as semanas segundo a distribuição corrente: semana, equipe (ou grupo), ferramenta, serviço, modelo, requisições, respostas, temas. O arquivo abre corretamente no Excel sem assistente de importação (BOM UTF-8, separador anunciado), e os valores vindos de um token de identidade ou de um campo do console são neutralizados contra a injeção de fórmulas — uma célula começando por `=`, `+`, `-`, `@` nunca é interpretada.

[IMAGEAMETTREICI 05]

A zero semana publicada, a tela lê "Dados insuficientes": os agregados se acumulam com as publicações, eles não se retrocalculam.

[IMAGEAMETTREICI 06]
