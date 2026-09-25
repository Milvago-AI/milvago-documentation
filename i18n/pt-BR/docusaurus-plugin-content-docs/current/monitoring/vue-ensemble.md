---
sidebar_position: 1
title: Visão geral
---

# Visão geral

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Visão geral**. Requer `overview.read` e `events.read`, exceto para consulta somente agregada ou um perfil sem `events.read` com `reports.aggregate`, que mostra Relatórios.

1. Use **Ver dispositivos** para abrir **Parque > Dispositivos** e aprovar um dispositivo pendente com `members.manage`.
2. Use **Abrir conversas** ou **Ver cartografia** para investigar; os atalhos não aplicam filtros.
3. Clique em **Atualizar** para recarregar os indicadores.

A visão geral é a primeira tela do console, a que se exibe na conexão (`#overview`). Ela responde a uma única pergunta, em uma janela de 24 horas: **o que está acontecendo, neste momento, nos usos de IA da organização?**

Ela não substitui nem o detalhe (Conversas), nem a geografia dos fluxos (Cartografia), nem a gestão (Fleet, Administração). Seu papel é permitir a decisão do dia: há uma anomalia a aprofundar, um dispositivo a aprovar, uma política a ajustar?

[IMAGEAMETTREICI 01]

## O princípio de leitura

Duas regras guiam toda a tela, e toda a plataforma:

1. **Os números são fatos observados.** A página não projeta, não estima e nem extrapola nada. O que um navegador não pode captar não é adivinhado — e a linha de informação sob o título o lembra em letras claras: um evento de navegador não é um inventário de software. Ver "12 provedores" não significa "12 softwares instalados".
2. **Duas famílias de eventos, contadas separadamente.** Uma **navegação** (um dispositivo visita um site de IA) não é uma **requisição** (um prompt partiu). O bloco "Requisições" carrega o número de requisições e nomeia as navegações à parte, em seu índice.

Os números são formatados segundo o idioma do console (separadores, espaços) e permanecem tabulares.

## O percurso da página

A tela lê-se na ordem do código, do mais urgente ao mais analítico. Cada bloco só aparece se sua condição for verdadeira.

### 1. A faixa "A fazer"

Se dispositivos esperam a aprovação **e** você tem o direito de aprová-los, uma faixa de alerta exibe-se na cabeça: "N dispositivos esperam sua aprovação", com um botão para Dispositivos. Enquanto um dispositivo está em espera, nada dele sobe: é o único bloqueio que vale uma faixa permanente.

[IMAGEAMETTREICI 02]

### 2. O cartão de partida

Se **nenhum dispositivo** está registrado, a página mostra os três passos do primeiro percurso, com um link de atalho para cada tela:

1. **Baixar o agente** — o pacote (MSI ou RPM) é servido pelo servidor.
2. **Aprovar o primeiro dispositivo** — um dispositivo aparece em espera após sua instalação, segundo a política de aprovação da organização.
3. **Configurar os serviços** — no Shadow AI, escolher os serviços de IA observados, bloqueados ou redirecionados.

Este cartão desaparece assim que a frota existe. No lugar da página vazia, a tela mostra então os indicadores abaixo, eventualmente a zero — um zero é exibido, não mascarado.

[IMAGEAMETTREICI 03]

### 3. Os quatro indicadores (KPI)

| Bloco | Valor | Índice | Leitura |
| --- | --- | --- | --- |
| **Requisições** | número de requisições recebidas no período | "Últimas 24 h · N navegações" | o volume de uso real, navegações descontadas à parte |
| **Bloqueadas** | número de eventos bloqueados | "N % das requisições" ou "Segundo as regras aplicadas" se zero requisição | assume uma tonalidade de perigo assim que o valor é > 0 |
| **Dispositivos ativos** | ativos / total | "N inativos, em espera ou revogados" | a razão de cobertura: um dispositivo inativo é uma janela de medição fechada |
| **Provedores observados** | número de provedores distintos | "No período" | a extensão do perímetro efetivamente solicitado |

A porcentagem de bloqueio é calculada na mesma janela de 24 h; a contagem dos inativos é a diferença entre o parque total e os dispositivos ativos.

[IMAGEAMETTREICI 04]

### 4. "Ritmo de utilização" (coluna esquerda)

Um histograma horário na janela de observação: cada barra carrega o volume da hora, empilhamento **observado** (cinza) e **bloqueado** (vermelho). Uma dica por barra detalha "hora · eventos / bloqueados". Duas leituras nela se fazem:

- a **forma** (picos, vales, faixas mortas) conta quando a organização solicita a IA;
- a parte vermelha, em proporção, conta se a política freia ou deixa passar.

O pé do cartão lembra a janela exata e propõe o botão para **Conversas** para passar do "quanto" ao "quê". A zero eventos, o cartão exibe o estado vazio "Nenhum evento recebido" e diz quando os eventos aparecerão.

[IMAGEAMETTREICI 05]

### 5. "Provedores observados" (coluna direita)

Uma lista classificada: uma escala por provedor, onde a parte **observada** (requisições não bloqueadas) e a parte **bloqueada** leem-se lado a lado, com a contagem à direita. É a distribuição real dos usos no período.

- Se você dispõe do papel de análise, o pé do cartão lembra o escopo ("pessoas, ferramentas, serviços, modelos") e abre a **Cartografia**, que detalha cada fluxo dispositivo por dispositivo.
- Se a lista está vazia, a tela o assume: "Esta lista reflete apenas os eventos realmente observados" — a ausência de provedor não é uma falha de medição, é uma ausência de tráfego.

[IMAGEAMETTREICI 06]

## Quem vê o quê

- A tela exige as permissões `overview.read` e `events.read`; ela é ocultada da navegação sem `overview.read`, e sem `events.read` ela dá lugar a Relatórios ou a um acesso restrito.
- A faixa de aprovação exige além disso a gestão dos dispositivos.
- Na Community, o perímetro observado limita-se ao ChatGPT e ao Claude; na Enterprise, estende-se aos nove provedores cobertos e às aplicações de IA locais — a página funciona de forma idêntica, apenas o dado que a alimenta muda.
- O botão **Atualizar** recarrega os indicadores e a lista de dispositivos; a página não se atualiza sozinha.
