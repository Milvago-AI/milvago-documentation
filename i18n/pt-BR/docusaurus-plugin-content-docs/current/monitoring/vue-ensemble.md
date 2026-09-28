---
sidebar_position: 1
title: Visão geral
---

# Visão geral

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Visão geral**. Requer `overview.read` e `events.read`, exceto que uma organização em consulta somente agregada, um perfil sem `events.read`, ou um perfil com `reports.aggregate` mas sem `devices.read`, vê Relatórios em vez disso, se tiver `reports.aggregate`.

1. Use **Ver os dispositivos** para abrir **Parque > Dispositivos** e aprovar um dispositivo pendente com `members.manage`.
2. Use **Abrir as conversas** ou **Abrir a cartografia** para investigar; os atalhos não aplicam filtros.
3. Clique em **Atualizar** para recarregar os indicadores.

A visão geral é a primeira tela do console, a que se exibe na conexão (`#overview`). Ela responde a uma única pergunta, em uma janela de 24 horas: **o que está acontecendo, neste momento, nos usos de IA da organização?**

Ela não substitui nem o detalhe (Conversas), nem a geografia dos fluxos (Cartografia), nem a gestão (Fleet, Administração). Seu papel é permitir a decisão do dia: há uma anomalia a aprofundar, um dispositivo a aprovar, uma política a ajustar?

![Milvago - Acessar esta tela](/img/docs/en/monitoring-vue-ensemble-01.png)

## O princípio de leitura

Duas regras guiam toda a tela, e toda a plataforma:

1. **Os números são fatos observados.** A página não projeta, não estima e nem extrapola nada. O que um navegador não pode captar não é adivinhado — e a linha de informação sob o título o lembra em letras claras: um evento de navegador não é um inventário de software. Ver "12 provedores" não significa "12 softwares instalados".
2. **Duas famílias de eventos, contadas separadamente.** Uma **navegação** (um dispositivo visita um site de IA) não é uma **solicitação** (um prompt partiu). O bloco "Solicitações" carrega o número de solicitações e nomeia as navegações à parte, em seu índice.

Os números são formatados segundo o idioma do console (separadores, espaços) e permanecem tabulares.

## O percurso da página

A tela lê-se na ordem do código, do mais urgente ao mais analítico. Cada bloco só aparece se sua condição for verdadeira.

### 1. A faixa "A fazer"

Se dispositivos esperam a aprovação **e** você tem o direito de aprová-los, uma faixa de alerta exibe-se na cabeça: "N dispositivos aguardam sua aprovação.", com um botão para Dispositivos. Enquanto um dispositivo está em espera, nada dele sobe: é o único bloqueio que vale uma faixa permanente.

![Milvago - 1. A faixa A fazer](/img/docs/en/monitoring-vue-ensemble-02.png)

### 2. O cartão de partida

Se **nenhum dispositivo** está registrado, a página mostra os três passos do primeiro percurso, com um link de atalho para cada tela:

1. **Baixar o agente** — o servidor fornece o ZIP do Windows (MSI, script de instalação e arquivo de provisionamento) ou o RPM do Linux.
2. **Aprovar o primeiro dispositivo** — um dispositivo aparece em espera após sua instalação, segundo a política de aprovação da organização.
3. **Configurar os serviços** — no Shadow AI, escolher os serviços de IA observados, bloqueados ou redirecionados.

Este cartão desaparece assim que a frota existe. No lugar da página vazia, a tela mostra então os indicadores abaixo, eventualmente a zero — um zero é exibido, não mascarado.

![Milvago - 2. O cartão de partida](/img/docs/en/monitoring-vue-ensemble-03.png)

### 3. Os quatro indicadores (KPI)

| Bloco | Valor | Índice | Leitura |
| --- | --- | --- | --- |
| **Solicitações** | número de solicitações recebidas no período | "Últimas 24 horas · N navegações" | o volume de uso real, navegações descontadas à parte |
| **Bloqueadas** | número de eventos bloqueados | "N% das solicitações" ou "Conforme as regras aplicadas" se zero solicitação | assume uma tonalidade de perigo assim que o valor é > 0 |
| **Dispositivos ativos** | ativos / total | "N inativos, pendentes ou revogados" | a razão de cobertura: um dispositivo inativo é uma janela de medição fechada |
| **Provedores observados** | número de provedores distintos | "No período" | a extensão do perímetro efetivamente solicitado |

A porcentagem de bloqueio é calculada na mesma janela de 24 h; a contagem dos inativos é a diferença entre o parque total e os dispositivos ativos.

![Milvago - 3. Os quatro indicadores (KPI)](/img/docs/en/monitoring-vue-ensemble-04.png)

### 4. "Ritmo de uso" (coluna esquerda)

Um histograma horário na janela de observação: cada barra carrega o volume da hora, empilhamento **observado** (cinza) e **bloqueado** (vermelho). Uma dica por barra detalha "hora · eventos / bloqueados". Duas leituras nela se fazem:

- a **forma** (picos, vales, faixas mortas) conta quando a organização solicita a IA;
- a parte vermelha, em proporção, conta se a política freia ou deixa passar.

O pé do cartão lembra a janela exata e propõe o botão para **Conversas** para passar do "quanto" ao "quê". A zero eventos, o cartão exibe o estado vazio "Nenhum evento recebido" e diz quando os eventos aparecerão.

![Milvago - 4. Ritmo de uso (coluna esquerda)](/img/docs/en/monitoring-vue-ensemble-05.png)

### 5. "Provedores observados" (coluna direita)

Uma lista classificada: uma escala por provedor, onde a parte **observada** (solicitações não bloqueadas) e a parte **bloqueada** leem-se lado a lado, com a contagem à direita. É a distribuição real dos usos no período.

- Se você dispõe do papel de análise, o pé do cartão lembra o escopo ("Pessoas → ferramentas → serviços → modelos") e abre a **Cartografia**, que detalha cada fluxo dispositivo por dispositivo.
- Se a lista está vazia, a tela o assume: "Esta lista reflete apenas os eventos efetivamente recebidos." — a ausência de provedor não é uma falha de medição, é uma ausência de tráfego.

![Milvago - 5. Provedores observados (coluna direita)](/img/docs/en/monitoring-vue-ensemble-06.png)

## Quem vê o quê

- A tela exige as permissões `overview.read` e `events.read`; ela é ocultada da navegação sem `overview.read`, e sem `events.read` ela dá lugar a Relatórios ou a um acesso restrito.
- A faixa de aprovação exige além disso a gestão dos dispositivos.
- Na Community, o perímetro observado limita-se ao ChatGPT e ao Claude; na Enterprise, estende-se aos nove provedores cobertos e às aplicações de IA locais — a página funciona de forma idêntica, apenas o dado que a alimenta muda.
- O botão **Atualizar** recarrega os indicadores e a lista de dispositivos; a página não se atualiza sozinha.
