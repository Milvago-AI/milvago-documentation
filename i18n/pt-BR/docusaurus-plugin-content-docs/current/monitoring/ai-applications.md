---
sidebar_position: 4
title: AI applications
tags: [Enterprise]
---

# AI applications

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Aplicações de IA**. Requer Milvago Enterprise, `events.read` e uma organização sem consulta somente agregada.

1. Escolha **Por página** para percorrer a lista.
2. Clique em **Postos afetados** e depois no nome de um dispositivo para abrir sua ficha.
3. Feche o diálogo ao terminar; ele não modifica dados.

:::enterprise

Esta página concerne apenas a edição Enterprise: ela só aparece na navegação com o papel de análise. A Community limita-se ao navegador — o código e as dependências de inventário estão ausentes do binário entregue.

:::

A página lista as **aplicações de IA** detectadas nos dispositivos: softwares nativos, assistentes integrados, aplicações de IA locais, levantados pelo inventário do agente e descritos pelo **catálogo assinado**. Ela completa os usos de navegador do Monitoring pelo parque de software.

A frase de cabeçalho fixa a regra de leitura: **Uma presença detectada não comprova nem um uso nem um envio.** As solicitações são lidas em Shadow AI; uma ferramenta instalada mas nunca solicitada não é um evento Shadow AI.

![Milvago - Acessar esta tela](/img/docs/en/monitoring-ai-applications-01.png)

## A tabela das aplicações observadas

Uma linha por **ferramenta** detectada (todas as observações são agrupadas por ferramenta, não por dispositivo), classificadas da mais difundida à mais rara, e depois por ordem alfabética:

O seletor **Por página** oferece 10, 20, 50, 100 ou 200 ferramentas. Uma ferramenta e todas as suas observações permanecem na mesma página; os controles numerados dão acesso à primeira página, à última e às páginas vizinhas.

| Coluna | Conteúdo |
| --- | --- |
| **Aplicação** | o nome do catálogo (ou o identificador bruto se a ferramenta é desconhecida do catálogo) |
| **Editor** | o nome do editor, "—" se o catálogo não o conhece |
| **Risco** | badge de tonalidade segundo o nível do catálogo |
| **Dispositivos** | número de dispositivos onde a ferramenta foi encontrada |
| **Postos afetados** | os três primeiros nomes de máquinas, e depois "e mais N"; a célula é um **botão** (veja abaixo) |
| **Reconhecida por** | como a ferramenta foi identificada (extensão de navegador, aplicação local…) |
| **Primeira observação** | a data mais antiga de detecção da ferramenta |

![Milvago - A tabela das aplicações observadas](/img/docs/en/monitoring-ai-applications-02.png)

A zero detecção, a tela o assume: "Nenhuma aplicação de IA observada — Os dispositivos Enterprise informam as aplicações descritas pelo catálogo assinado. Uma presença não é um uso."

## Postos afetados

Uma contagem apenas obrigava a reabrir cada máquina para saber em qual intervir. A célula abre, portanto, um diálogo que lista **todos** os dispositivos portando a ferramenta — sem segunda requisição, a lista completa já está na carga da página: dispositivo (link para sua ficha), forma de ser reconhecida, primeira observação. Esse diálogo usa a mesma lista ampla e com altura limitada de Discovery: o cabeçalho permanece visível e a tabela rola dentro da janela. O dispositivo aparece ali com o nome real para quem possui `devices.read` fora da consulta somente agregada; os demais leitores veem o alias do dispositivo. Em consulta somente agregada, a API e o servidor MCP retornam apenas contagens: número de dispositivos por ferramenta e por forma de ser reconhecida, primeira e última observação da ferramenta; nenhum dispositivo é designado, e a lista de ferramentas de um dispositivo específico é recusada.

![Milvago - Postos afetados](/img/docs/en/monitoring-ai-applications-03.png)

O que esta página não diz: ela não deduz um uso de uma presença. Uma ferramenta sinalizada, e depois suprimida do dispositivo, desaparece da lista no sinal seguinte — seu histórico permanece nas conversas.
