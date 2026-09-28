---
sidebar_position: 6
title: Dimensionar PostgreSQL e o autoscaling
---

# Dimensionar PostgreSQL e o autoscaling

O HPA adapta o número de pods à carga observada. PostgreSQL, os nós Kubernetes e os destinatários de exportação devem dispor da capacidade correspondente. Esta página explica os valores dos manifestos fornecidos e o método para adaptá-los ao seu tráfego; esses valores não constituem um mínimo de hardware nem uma garantia de vazão.

## Separar as funções

| Função | Réplicas nos manifestos | Sinal de escalonamento |
| --- | --- | --- |
| API | 1 no início, HPA de 1 a 4 | Utilização média de CPU |
| Exportações Enterprise | 1 no início, HPA independente de 1 a 4 | Partições de exportação executáveis observadas no PostgreSQL |
| Manutenção | 1 em regime estável | Sem HPA; tarefas periódicas e observação global das exportações |
| Migração | Job antes das cargas de trabalho | Aguardar sua conclusão bem-sucedida antes de iniciar a versão correspondente |

As funções dedicadas evitam executar migrações e manutenção em cada pod da API. O Compose mantém a função combinada `all`.

## Compreender os dois sinais de HPA

### API: CPU em relação à solicitação de recursos

O manifesto solicita `100m` de CPU por pod da API e define o alvo do HPA em **60% dessa solicitação**, ou seja, uma média alvo de `60m`. Essa porcentagem não se refere nem à CPU do nó nem ao limite de `500m`. Portanto, modificar a solicitação de CPU também modifica o nível de consumo que dispara o ajuste.

O Metrics Server deve fornecer a medição de CPU. Um limite de CPU pode causar throttling; uma espera do PostgreSQL ou da rede pode, ao contrário, prolongar as respostas sem alto consumo de CPU da API. O HPA de CPU não corrige todas as causas de latência.

### Exportações Enterprise: trabalho executável

:::enterprise
A função de exportação e seu HPA se aplicam ao Milvago Enterprise.
:::

A função de manutenção calcula `milvago_export_runnable_partitions` a partir do PostgreSQL e a expõe em `/metrics`. Ela conta as partições que podem trabalhar agora, principalmente os pares organização/destino; a auditoria de privacidade dispõe de uma partição dedicada. Uma entrega de métricas vencida também pode tornar uma partição executável. Esse sinal não conta os eventos nem vem da fila local de um worker.

O alvo externo `AverageValue: 4` visa **quatro partições por pod**. Várias partições podem ser processadas em paralelo; multiplicar os pods não acelera uma única partição, cujo bloqueio no PostgreSQL impede o processamento simultâneo. As partições desativadas ou aguardando retomada não representam trabalho imediatamente executável.

O sinal é global. O exemplo do adaptador toma o **máximo das observações recentes**, e não sua soma, para evitar contar várias vezes cópias do mesmo total. Uma observação ausente, incompleta ou vencida nunca se torna zero: somente a última leitura completa pode ser exposta, por no máximo **45 segundos**.

### Aumento, inicialização e retorno ao mínimo

Os dois HPAs autorizam um aumento de no máximo **dois pods por período de 30 segundos**, sem janela de estabilização durante o aumento. Na redução, a recomendação mais alta dos últimos **300 segundos** estabiliza a decisão; depois, a redução é limitada a **um pod por minuto**.

Esses ajustes enquadram o escalonamento, sem garantir um prazo exato. A coleta das métricas, o agendamento, o download da imagem e as sondas levam tempo. Um pico breve pode terminar antes de os novos pods serem úteis. Se seu objetivo exigir capacidade disponível desde o início, avalie o mínimo de réplicas com os recursos e conexões correspondentes. Consulte o [funcionamento do HPA do Kubernetes](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Instalar e monitorar as métricas

Para a API, instale o Metrics Server. Para as exportações, adicione Prometheus e um adaptador de métricas externas. O `ServiceMonitor` fornecido pressupõe o Prometheus Operator; uma coleta equivalente é possível sem essa CRD. Mantenha os labels `namespace` e `pod`, o token de observabilidade em um segredo e `/metrics` na rede privada.

`prometheus-adapter.example.yaml` é um fragmento para integrar à configuração do adaptador, não um recurso Kubernetes a aplicar diretamente. Seu filtro de atualização usa `milvago_export_snapshot_timestamp_seconds` para descartar observações de 45 segundos ou mais, mesmo se o Prometheus conservar uma amostra antiga. Verifique as métricas e as condições dos HPAs antes de confiar em seu ajuste de capacidade.

## Prever as conexões PostgreSQL

Os tamanhos de pool propostos nos segredos de implantação são de **10 conexões por API**, **4 por pod de exportação** e **4 para a manutenção**. Eles são configuráveis: calcule o orçamento a partir dos seus valores efetivos.

**Orçamento estável = réplicas da API × pool da API + réplicas de exportação × pool de exportação + réplicas de manutenção × pool de manutenção.**

Com os dois HPAs em seu máximo proposto, isso resulta em **4 × 10 + 4 × 4 + 1 × 4 = 60 conexões**. Trata-se de um teto acumulado dos pools da aplicação em regime estável, não de um valor suficiente para `max_connections`.

Adicione os pods extras das atualizações (`maxSurge`), os pods antigos ainda em término durante o período de graça de **120 segundos**, o Job de migração, a administração e a supervisão. A manutenção também pode ter dois pods durante uma transição. Se o Keycloak ou outros serviços compartilharem a mesma instância PostgreSQL, inclua suas conexões e as reservas dessa instância.

Aumentar os pools ou `max_connections` não cria CPU nem vazão de disco. Isso pode aumentar a concorrência e as esperas. Preveja uma margem de conexões e memória, depois verifique seu uso real; veja os [parâmetros de conexão do PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html).

## Preservar a capacidade e a durabilidade

As cotas de admissão da API são compartilhadas no PostgreSQL: adicionar pods não multiplica o orçamento autorizado. Os lotes de exportação são limitados pelo número de eventos e pelo tamanho JSON; um lote parte sem esperar que esteja cheio. Portanto, os pequenos volumes não esperam um limite de eventos.

O registro de entrega é validado após a confirmação remota. Uma interrupção entre essa confirmação e o commit pode provocar uma retransmissão: a idempotência do registro local não garante uma recepção de rede exatamente uma vez. Consulte [Observabilidade](../administration/observabilite.md) para as regras de entrega.

Dimensione a CPU, a memória e o armazenamento do PostgreSQL com o histórico retido, os índices, o WAL, as limpezas e os backups. Mantenha o autovacuum e as estatísticas atualizados; examine os planos das consultas custosas e as esperas antes de modificar os recursos. Veja a [manutenção do PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html).

Mantenha `fsync` e uma política `synchronous_commit` compatível com a durabilidade esperada. Desativá-los para melhorar uma medição altera as garantias de conservação; não é uma otimização equivalente. A [documentação do WAL](https://www.postgresql.org/docs/current/runtime-config-wal.html) detalha essas compensações. Os tamanhos e as retenções devem ser estimados a partir dos dados armazenados, segundo os [requisitos técnicos](../introduction/hardware-requirements.md).

### Distinguir as três falhas

- **PostgreSQL temporariamente indisponível**: a API responde `503`. O agente mantém os eventos em seu armazenamento criptografado e os reproduz com os mesmos identificadores. A autorização, a revogação e as cotas nunca passam a um modo permissivo.
- **Perda do armazenamento PostgreSQL**: eventos já confirmados dependem da replicação, dos backups físicos e do [arquivamento WAL com recuperação para um ponto no tempo](https://www.postgresql.org/docs/current/continuous-archiving.html). Prepare essa recuperação e meça de fato seu RPO e seu RTO.
- **Destino OTLP indisponível**: o Milvago mantém os eventos não confirmados pelo receptor e tenta novamente. Se um Collector aceitar e depois retransmitir os lotes, sua própria fila persistente passa a ser responsável pela guarda deles.

A retenção configurada e as exclusões voluntárias continuam prioritárias: uma indisponibilidade prolongada não deve prolongar implicitamente a conservação. A entrega após a recuperação pode ser repetida; os destinos devem aceitar uma semântica de pelo menos uma vez.

### Dimensionar as filas de recuperação

Primeiro, defina a duração de falha que deseja absorver. Para cada fila, estime `vazão máxima observada × tamanho alto de um evento × duração` e acrescente a margem necessária para lotes, índices, gravações temporárias e variações de tráfego. Verifique o resultado no volume real: uma capacidade expressa em lotes não garante duração alguma sem essas medições.

Monitore a fila local dos agentes, a idade da exportação Milvago pendente mais antiga e, para o Collector, `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, falhas de enqueue e falhas de envio. Alerte antes de 70% da capacidade. Uma fila que cresce continuamente indica um destino mais lento que a entrada; adicionar pods pode então aumentar a pressão sem resolver a causa.

Teste separadamente a recuperação do PostgreSQL, a recuperação de um Collector após reiniciar e uma restauração PITR em um banco de dados descartável. Reconcilie os identificadores confirmados, armazenados e entregues; a simples recuperação das sondas não prova a conservação dos eventos.

## Diagnosticar antes de ajustar

| Observação | Verificação útil |
| --- | --- |
| Respostas da API `429` | Identificar a cota atingida e respeitar a retomada indicada; aumentar o HPA não eleva as cotas. |
| Respostas da API `503` | Examinar o código de erro, os logs, a admissão, os pools e a disponibilidade do PostgreSQL. |
| Fila do Collector próxima da capacidade | Verificar a vazão do destino, o espaço persistente e as falhas de enqueue; não aumentar a fila às cegas. |
| Arquivamento WAL atrasado ou com falha | Restabelecer o arquivo e verificar a cadeia de recuperação antes de considerar os eventos confirmados como protegidos. |
| CPU da API limitada, pods prontos | Examinar o throttling e a capacidade dos nós antes de modificar requests, limits ou réplicas. |
| PostgreSQL saturado ou esperas de pool | Distinguir CPU, entradas/saídas, locks e planos SQL; mais pods podem agravar a contenção. |
| Backlog com PostgreSQL disponível | Verificar o número de partições executáveis e as respostas do destinatário; seus `429`, `503` ou prazos de retomada também limitam a vazão. |
| Métrica HPA desconhecida ou vencida | Controlar manutenção, scrape autenticado, labels, adaptador e atualização; não substituir a ausência por zero. |
| Pods adicionais Pending ou não Ready | Controlar os recursos do cluster, os eventos Kubernetes, a imagem e as sondas. |
| Réplicas ainda presentes após um pico | Observar a janela deslizante de 300 segundos e a redução progressiva antes de concluir que há um defeito. |

## Ajustar com uma carga representativa

1. Defina seus objetivos de tempo de resposta da API e de prazo de entrega completo, assim como o tráfego, os destinos e a retenção esperados.
2. Reproduza picos repetidos com um histórico representativo. Meça separadamente o fim da ingestão, o recebimento no destinatário e a validação do registro; verifique os eventos ausentes, as retomadas e os duplicados.
3. Registre as réplicas realmente Ready, CPU/throttling, memória, conexões, esperas do PostgreSQL, pools e tempo de rede. Verifique se os pods adicionados realizam trabalho.
4. Modifique uma única variável justificada por essas medições e compare com carga e histórico idênticos. Não esconda uma saturação simplesmente alongando os tempos de espera.
5. Controle o retorno natural ao mínimo, uma atualização com substituição de pods e a retomada após indisponibilidade antes de manter seus ajustes.
