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

![Milvago - Acessar esta tela](/img/docs/en/monitoring-discovery-01.png)

## Plataformas conhecidas acessadas

O primeiro cartão porta as **plataformas de IA conhecidas** que os dispositivos alcançaram. O aviso de cabeçalho fixa a fronteira, em letras claras: **apenas presença** — o host foi alcançado; nenhum prompt, nenhuma resposta, nenhum endereço nem conversa é coletado nessas plataformas.

| Coluna | Conteúdo |
| --- | --- |
| **Serviço** | a plataforma (botão na Enterprise, dica "Mostrar as máquinas que o alcançaram") |
| **Visitas** | o número de visitas registradas |
| **Dispositivos** | o número de dispositivos distintos |
| **Contas do sistema** | apenas Enterprise: as contas do sistema conectadas no momento das visitas |
| **Última conexão** | a data mais recente |

![Milvago - Plataformas conhecidas acessadas](/img/docs/en/monitoring-discovery-02.png)

As duas tabelas são delimitadas no lado do servidor (500 domínios candidatos no máximo, plataformas do catálogo assinado): a paginação é uma ajuda de leitura, não um meio de ir buscar menos. Uma lista reduzida sob a página exibida volta à última página em vez de apresentar uma tabela vazia.

## Domínios candidatos

O segundo cartão lista os **domínios de IA** que os dispositivos sinalizam e que o catálogo não cobre, com seu número de observações e duas ações por linha:

- **Marcar o candidato publicado como promovido** — oferecida apenas para um domínio que o catálogo publicado porta realmente; o servidor permanece a autoridade e responde 409 se a publicação falta.
- **Ignorar / Reconsiderar** — retirar um domínio do sinal, ou repô-lo.

![Milvago - Domínios candidatos](/img/docs/en/monitoring-discovery-03.png)

Em uma instância em somente leitura, as ações não aparecem, em vez de prometer botões recusados.

A **zero candidato, a tela é um estado normal, não uma falha**: a tela exibe "Nenhum domínio candidato observado", com um link que reativa a descoberta — "A descoberta de domínios candidatos vem desativada. Ative-a em Shadow AI, Plataformas de IA, para que os dispositivos informem os domínios de IA que acessam e que este catálogo não cobre." O interruptor atravessa a rota de privacidade, com seu motivo escrito e sua MFA recente.

## Quem alcançou este domínio?

Cada linha abre um diálogo intitulado com o nome da plataforma ou do domínio em si; um aviso dentro dele traz **"Máquinas que alcançaram este domínio nos últimos N dias. Os relatórios do detector são expurgados depois disso, então uma visita mais antiga não é mais contada aqui."**, com uma busca (nome da máquina ou identificador do dispositivo, o que um leitor vindo de uma ficha de dispositivo porta), o número de observações por dispositivo e a última data.

Um único diálogo responde à mesma pergunta a partir das duas tabelas, porque um leitor perguntando "quem foi lá" não se importa em saber qual tabela porta a resposta.

![Milvago - Quem alcançou este domínio?](/img/docs/en/monitoring-discovery-05.png)

:::enterprise

O diálogo das máquinas que alcançaram uma plataforma e a coluna Contas do sistema só existem na Enterprise: na Community, as linhas permanecem em texto simples em vez de portar um controle que responderia 404. O catálogo porta também a regra de higiene da descoberta: os domínios dos provedores cobertos — após redução à edição servida — nunca aparecem na Discovery, e uma plataforma mascarada pela organização sai dela, mantendo suas visitas registradas.

:::
