---
sidebar_position: 5
title: Discovery
---

# Discovery

## Acessar esta tela

Na barra lateral, clique em **Monitoramento > Descoberta**; requer `policy.manage`.

1. Para ativar domínios candidatos, vá para **Administração > Shadow AI > Plataformas de IA**, ative **Descobrir domínios candidatos**, informe um motivo de pelo menos oito caracteres e salve após a MFA recente. Também requer `settings.manage`; apenas observações futuras podem aparecer.
2. Use **Promover** quando o catálogo publicado oferecer a ação, ou **Ignorar** / **Reconsiderar**; a lista recarrega.
3. No Enterprise, clique em um serviço ou domínio para pesquisar e abrir dispositivos. Community não mostra esse diálogo nem contas do SO; uma demonstração somente leitura não mostra ações.

A Discovery responde à pergunta que um CISO coloca desde o primeiro dia: **quais IA as minhas pessoas usam, e que eu não estou olhando?** A tela lista o que a frota alcançou **além do que o catálogo cobre**: as plataformas de IA conhecidas visitadas, e os domínios candidatos observados pelos detectores.

Ela exige a gestão da política (`policy.manage`) — é uma tela de decisão, não uma consulta passiva.

[IMAGEAMETTREICI 01]

## Plataformas conhecidas

O primeiro cartão porta as **plataformas de IA conhecidas** que os dispositivos alcançaram. O aviso de cabeçalho fixa a fronteira, em letras claras: **apenas presença** — o host foi alcançado; nenhum prompt, nenhuma resposta, nenhum endereço nem conversa é coletado nessas plataformas.

| Coluna | Conteúdo |
| --- | --- |
| **Serviço** | a plataforma (botão "alcançada pelos dispositivos" na Enterprise) |
| **Visitas** | o número de visitas registradas |
| **Dispositivos** | o número de dispositivos distintos |
| **Contas do SO** | apenas Enterprise: as contas do SO conectadas no momento das visitas |
| **Último sinal** | a data mais recente |

[IMAGEAMETTREICI 02]

As duas tabelas são delimitadas no lado do servidor (500 domínios candidatos no máximo, plataformas do catálogo assinado): a paginação é uma ajuda de leitura, não um meio de ir buscar menos. Uma lista reduzida sob a página exibida volta à última página em vez de apresentar uma tabela vazia.

## Domínios candidatos

O segundo cartão lista os **domínios de IA** que os dispositivos sinalizam e que o catálogo não cobre, com seu número de observações e duas ações por linha:

- **Marcar o candidato publicado como promovido** — oferecida apenas para um domínio que o catálogo publicado porta realmente; o servidor permanece a autoridade e responde 409 se a publicação falta.
- **Ignorar / Reconsiderar** — retirar um domínio do sinal, ou repô-lo.

[IMAGEAMETTREICI 03]

Em uma instância em somente leitura, as ações não aparecem, em vez de prometer botões recusados.

A **zero candidato, a tela é um estado normal, não uma falha**: a descoberta dos domínios candidatos está desativada por padrão, e a tela o diz com o link que a reativa — "Ative-a no Shadow AI, Plataformas de IA, para que os dispositivos sinalizem os domínios de IA que alcançam e que este catálogo não cobre." O interruptor atravessa a rota de privacidade, com seu motivo escrito e sua MFA recente.

[IMAGEAMETTREICI 04]

## Quem alcançou este domínio?

Cada linha abre um diálogo "**Dispositivos que alcançaram este domínio nos últimos N dias**", com uma busca (nome da máquina ou identificador do dispositivo, o que um leitor vindo de uma ficha de dispositivo porta), o número de observações por dispositivo e a última data. Os levantamentos do detector são purgados além da janela: uma visita mais antiga não é mais contada aqui.

Um único diálogo responde à mesma pergunta a partir das duas tabelas, porque um leitor perguntando "quem foi lá" não se importa em saber qual tabela porta a resposta.

[IMAGEAMETTREICI 05]

:::enterprise

O diálogo "alcançada pelos dispositivos" e a coluna Contas do SO só existem na Enterprise: na Community, as linhas permanecem em texto simples em vez de portar um controle que responderia 404. O catálogo porta também a regra de higiene da descoberta: os domínios dos provedores cobertos — após redução à edição servida — nunca aparecem na Discovery, e uma plataforma mascarada pela organização sai dela, mantendo suas visitas registradas.

:::

[IMAGEAMETTREICI 06]
