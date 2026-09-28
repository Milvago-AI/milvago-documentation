---
sidebar_position: 1
title: O que é o Milvago
---

# O que é o Milvago

O Milvago dá a uma organização uma visão exata dos usos de IA: quais serviços são solicitados, a partir de quais dispositivos, com que frequência, e o que a política autoriza ou bloqueia. É uma plataforma de **detecção e governança do "Shadow AI"**: o percurso desejado é compreender os usos, identificar os dispositivos, definir a política, verificar os efeitos.

O console, a página de login e a documentação compartilham uma paleta mais suave: fundos azul-ardósia no modo escuro, fundos cinza-azulado claro e cartões brancos no modo claro. O azul identifica as ações; o verde, o âmbar e o vermelho acompanham os rótulos de status.

![Milvago - O que é o Milvago](/img/docs/en/introduction-milvago-01.png)

## O que o produto conserva — e o que não conserva

Por padrão, apenas os **fatos** são conservados: um serviço foi alcançado, um prompt partiu, um bloqueio ocorreu. Somam-se a isso os **nomes dos arquivos** enviados a um serviço de IA, jamais seus bytes.

A **captura do texto dos prompts e das respostas** existe, mas está **desativada por padrão** e sujeita a uma autorização explícita na ferramenta. Quando ativada, a leitura de um conteúdo permanece sujeita a travas de privacidade (sessão válida, MFA recente, motivo escrito) e cada leitura é auditada. O produto declara essa faculdade com franqueza, no lugar onde a questão se coloca: uma formulação absoluta ("jamais coletado") contrariada por uma opção do produto seria uma falta, não uma simplificação.

## O que cada componente pode ver

A honestidade sobre os limites faz parte do produto, e cada tela o lembra: um evento de navegador não é um inventário de software; uma presença detectada não estabelece nem um uso nem um envio; uma ferramenta presente em um dispositivo não infere seu usuário. Um serviço visitado sem requisição observada é um **sinal** de que um detector pede uma atualização, não uma prova de uso.

## Os três gestos do produto

1. **Observar** — a extensão e o agente reportam eventos factuais: navegações, requisições, decisões, plataformas alcançadas.
2. **Compreender** — o console coloca esses fatos em perspectiva: visão geral, conversas, cartografia, relatórios agregados.
3. **Decidir** — a política Shadow AI observa, bloqueia ou mascara; o controle de modelos autoriza ou recusa um modelo; o Fleet distribui a política aos dispositivos.

## As edições

- **Community**: extensão limitada ao ChatGPT e ao Claude, agente Windows e Linux, console de organização única. O pacote construído nem sequer embarca os adaptadores dos outros provedores.
- **Enterprise**: multiorganizações isoladas por PostgreSQL, nove provedores cobertos, inventário nativo das aplicações de IA, grupos de dispositivos, controle de modelos, sensibilidade dos usos, servidor MCP, observabilidade OTLP.

Uma edição declarada pelo cliente jamais concede autorização: as guardas estão no servidor, nunca em um campo do cliente.

## O tom

Sóbrio, factual, preciso. Os estados vazios e os erros são visíveis e explicados, jamais maquiados; nenhum dado fictício é apresentado como real. A promessa: **ver com precisão, agir com confiança**.
