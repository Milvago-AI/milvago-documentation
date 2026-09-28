---
sidebar_position: 3
title: Catálogo de detecção
---

# Catálogo de detecção

O catálogo é o **motor e os dados** que dizem à extensão o que medir nos sites cobertos: rotas de prompt e de upload, corpos, seletores DOM do compositor, plataformas conhecidas. Ele é assinado, versionado, e sua cobertura depende da edição servida: dois provedores na Community, nove na Enterprise.

Para abrir a tela de edição, selecione **Administração → Catálogo de detecção**. Ela se reserva a duas condições cumulativas:

- a variável `MILVAGO_DEBUG` está posta na instância (veja [Variáveis de ambiente](../installation/variables-environnement.md));
- você porta `policy.manage` e o console de administração não está ocultado.

`MILVAGO_DEBUG` é mais que um interruptor de visibilidade no console: o servidor a verifica primeiro em cada importação manual e em cada requisição de publicação, antes mesmo da checagem de propriedade, e recusa a requisição de imediato — a mesma recusa genérica que quem não é proprietário já recebe, de modo que sondar uma instância nunca revela se o sinalizador está ativo. A publicação em si exige ainda o Proprietário da organização raiz e uma MFA recente. A importação automática do editor segue outra rota e permanece aberta seja qual for esse sinalizador: ela precisa poder corrigir os detectores em uma instância em funcionamento.

![Milvago - Catálogo de detecção](/img/docs/en/avance-catalogue-editeur-01.png)

## Importar e publicar

1. Ative `MILVAGO_DEBUG` na implantação do servidor e reinicie ou reimplante-o.
2. Entre com `policy.manage`; a publicação também exige a função Proprietário da organização raiz e MFA recente.
3. Abra **Administração → Catálogo de detecção** e importe o catálogo medido.
4. Verifique as entradas e a revisão antes de selecionar **Publicar**.
5. Após a publicação, consulte a saúde dos detectores e o aviso de cobertura nas telas de Monitoramento.

## Importar e publicar

- A **importação manual** passa pela rota do console, fechada sem `MILVAGO_DEBUG`: um catálogo medido (levantamento no site, jamais adivinhado) é carregado, validado e depois publicado.
- A publicação produz uma **revisão monotônica**: uma importação é recusada a menos que sua revisão seja estritamente maior que a revisão atual da instância, sejam quais forem as entradas que ela porte. Essa regra fecha o caso de um catálogo mais antigo ou inalterado, com menos entradas, reproduzido dentro de sua janela de validade.
- Um catálogo **publicado guarda seus bytes assinados**: a reedição não os reescreve.
- O servidor permanece a autoridade: promover ou publicar algo que ele não porta responde um erro explícito, não um sucesso silencioso.

## A saúde dos detectores

A tela exibe o veredito do servidor por provedor **e por revisão**: serviço, estado, revisão aplicada, dispositivos, requisições vistas pelo detector de rede e pelo detector DOM. Os estados leem-se em termos de catálogo — uma regra de rede que não corresponde mais, seletores renomeados pelo site:

| Estado | Leitura |
| --- | --- |
| **Sinais disponíveis coerentes** | regra e DOM coincidem |
| **Somente DOM: captura de rede indisponível** | as requisições não são mais vistas, o DOM sim |
| **Sem transporte de detecção** / **Transporte de detecção parcial** | os dispositivos não reportam mais a cobertura, total ou parcialmente |
| **Detecção DOM degradada** / **Cobertura a verificar** | o afastamento rede–DOM ultrapassa os limiares |
| **Dados insuficientes para publicar** | serviço não visitado na janela — **não medido, não em pane**; esse estado e "Sinais disponíveis coerentes" nunca disparam uma faixa |

![Milvago - A saúde dos detectores](/img/docs/en/avance-catalogue-editeur-02.png)

## A faixa de cobertura

Nas telas do Monitoring, um aviso exibe-se para os portadores de `policy.manage` quando a cobertura se degrada, nomeando os serviços concernidos: o pior estado primeiro. Seu papel é simples — **dizer que os números estão incompletos** — pois uma frota que não captura mais parece exatamente com uma frota que não usa mais a IA, e a página que mostra o número menor não o diz por si mesma. Em modo de depuração, a faixa porta o link para os detalhes.

:::note
O catálogo permanece a única fonte de rotas: a extensão nunca lacra, mascara nem bloqueia um site fora das rotas medidas que ele porta. Veja [Shadow AI](../administration/shadow-ai.md) para a política, [Discovery](../monitoring/discovery.md) para o que o catálogo ainda não cobre.
:::
