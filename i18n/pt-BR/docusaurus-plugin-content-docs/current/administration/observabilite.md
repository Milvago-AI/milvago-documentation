---
sidebar_position: 8
title: Observabilidade
tags: [Enterprise]
---

# Observabilidade

## Acessar a tela

Clique em **Administração** > **Observabilidade**. Esta página Enterprise exige `observability.manage`.

1. Ative um destino e informe URL e **Authorization** se necessário.
2. Escolha os fluxos e salve a configuração.
3. Teste a configuração salva.

Administração → Observabilidade configura, por organização, o envio de métricas e registros às suas ferramentas de análise.

:::enterprise
Esta página se aplica apenas ao Milvago Enterprise.
:::

![Milvago - Acessar a tela](/img/docs/en/administration-observabilite-01.png)

## Exportação OTLP e painel do Grafana

**Baixar o painel** fornece um arquivo para importar no Grafana; as fontes de dados ainda precisam ser configuradas lá.

**Exportação OTLP para o Grafana** configura a URL base de um coletor compatível com OTLP/HTTP JSON. Milvago envia os dados a esse coletor, que os encaminha aos serviços usados pelo Grafana.

### Registros no Loki, métricas no painel

Para explorar os registros no Grafana, configure o coletor que recebe os dados do Milvago para encaminhar o fluxo de registros ao [endpoint OTLP nativo do Loki](https://grafana.com/docs/loki/latest/send-data/otel/otel-collector-getting-started/). Depois, adicione a [fonte de dados Loki integrada ao Grafana](https://grafana.com/docs/grafana/latest/datasources/loki/). O Milvago não oferece uma exportação Loki separada nem um plugin do Grafana.

O **painel para download** usa uma fonte de dados **Prometheus**. Configure separadamente a saída de métricas do coletor para um sistema compatível com Prometheus e selecione essa fonte ao importar o painel. Conectar apenas o Loki não alimenta seus gráficos.

## Destino SIEM personalizado

O segundo cartão, intitulado **Destino personalizado (SIEM)**, é um destino OTLP personalizado. Ele não implementa uma API específica de fornecedor de SIEM nem syslog. É necessário um receptor OTLP/HTTP JSON compatível, como um coletor configurado para transformar e encaminhar os dados ao SIEM escolhido. O protocolo final, as credenciais e o esquema dependem dessa configuração externa.

Se o seu SIEM exigir Syslog sobre TLS ou uma API específica, configure essa conversão e a autenticação correspondente no coletor. O campo **Authorization** do Milvago autentica apenas o envio ao receptor OTLP informado.

Quando ativado, esse destino também recebe **auditorias sensíveis de privacidade** por uma fila dedicada, mesmo com o fluxo **Registro de auditoria** desmarcado. O estado da fila aparece no fim da página.

## Protocolo e autenticação

Milvago envia requisições HTTP POST com `Content-Type: application/json` à URL base seguida de `/v1/metrics` ou `/v1/logs`. O protocolo é **OTLP/HTTP JSON**, não OTLP/gRPC nem OTLP/HTTP Protobuf binário. Se o receptor exigir o cabeçalho `Authorization`, informe o valor completo como `Bearer …` ou `Basic …`. O segredo é lacrado no servidor e nunca é devolvido pela API. Alterar a URL do receptor apaga o segredo salvo.

Para uma **conexão direta ao endpoint de ingestão OTLP do Grafana Cloud**, o Grafana exige `Basic` com o ID da instância **OTLP** como usuário e um token de política de acesso como senha, codificados em Base64. Um token Bearer da API de gerenciamento do Grafana atende a outra API. [O Grafana Cloud informa](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/otlp/otlp-format-considerations/) que a ingestão JSON é mais adequada a testes ou baixo tráfego; para produção, configure um coletor que aceite o JSON do Milvago e exporte ao Grafana Cloud com formato e autenticação apropriados.

As URLs de exportação usam HTTPS, salvo host HTTP autorizado expressamente pelo operador; destinos de rede proibidos são verificados ao salvar e ao conectar. **Testar a configuração salva** envia somente dados sintéticos dos fluxos selecionados. A aceitação pelo receptor não comprova a chegada ao Grafana ou ao SIEM.

![Milvago - Protocolo e autenticação](/img/docs/en/administration-observabilite-02.png)

## Recuperação após uma falha do destino

O Milvago mantém no PostgreSQL os eventos que o receptor OTLP não aceitou. Após um erro temporário ou uma interrupção, ele tenta automaticamente o mesmo trabalho novamente; uma interrupção em torno da confirmação pode, portanto, produzir uma duplicata no destino.

Se a URL configurada apontar para um OpenTelemetry Collector que depois retransmite os dados, ative uma [fila persistente](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/exporterhelper/README.md#persistent-queue) para seus exportadores e coloque-a em um volume criptografado que sobreviva à reinicialização. Uma resposta positiva do Collector transfere a guarda para o Collector; ela ainda não prova que o backend final aceitou os dados. O Collector deve recusar a entrada quando sua fila estiver cheia para que o Milvago mantenha os eventos e tente novamente a partir do PostgreSQL.

Monitore o tamanho e a capacidade da fila, as falhas de enqueue, as falhas de envio e o espaço livre do volume. Defina sua capacidade a partir da vazão real e da duração de falha que deseja absorver, e alerte antes de 70%. Configure também nos sistemas externos a retenção, as exclusões, os backups e os controles de acesso aplicáveis após essa transferência de guarda.

## Dados e status da entrega

- **Métricas**: indicadores de atividade de 24 horas, estado do parque e inventário local; descrevem o estado atual e são enviados periodicamente.
- **Eventos Shadow AI**: metadados de uso selecionados pelo filtro do destino, a partir da ativação. O filtro não afeta métricas nem auditorias.
- **Registro de auditoria**: ações administrativas e identificadores técnicos. Auditorias sensíveis de privacidade também usam a fila dedicada do SIEM.

A exportação OTLP não lê prompts, respostas, conteúdo de conversas, URLs, nomes de dispositivos nem endereços de e-mail. Os identificadores técnicos também precisam de proteção no destino. `GET /api/shadow/metrics` é uma API de consulta separada, protegida por sessão e permissão; não é a URL de ingestão OTLP.

**Status da entrega** mostra tentativas, aceitações, erros, registros rejeitados e a próxima tentativa. Uma resposta OTLP parcial conta as rejeições e não reenvia o lote; os lotes seguintes continuam. Com exportações dedicadas, os registros pendentes são enviados automaticamente em lotes limitados por número de eventos e tamanho, sem esperar que fiquem completos; os lotes restantes continuam sem espera intencional após um sucesso. As métricas seguem uma cadência independente. Erros temporários, incluindo `429` e `503`, são repetidos automaticamente, respeitando `Retry-After` quando o destino o fornece. Um erro permanente, incluindo credenciais inválidas, exige correção da configuração.

## Exportações e escalonamento Kubernetes

Quando as exportações Enterprise são executadas em pods dedicados, processam os lotes continuamente para reduzir o atraso sob alta carga. O PostgreSQL coordena as entregas: aumentar o número de pods não permite duas entregas da mesma partição ao mesmo tempo.

A métrica `milvago_export_runnable_partitions` é a contagem global de partições executáveis. Ela serve ao HPA do Deployment de exportações e não contém identificador de organização nem dados de conversa. Ela fica ausente quando sua observação completa tem mais de 45 segundos; ausência não é contagem zero. O operador deve verificar o caminho do Prometheus e o adaptador de métricas antes de interpretar o estado do HPA.

Para dimensionar a cadeia de métricas e as réplicas, consulte [Dimensionar PostgreSQL e o autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Organizações filhas

Uma filha herda por padrão os dois destinos e seus filtros. Pode personalizar toda a configuração sem copiar os segredos da mãe ou desativar ambas as exportações. **Impor esta configuração às organizações filhas** aplica a configuração do ancestral às descendentes; configurações locais salvas ficam inativas até a remoção da trava. Cada organização exporta apenas seus próprios dados, identificados por `organization.id`. Para um destino herdado, a filha vê o host do endereço de exportação, nunca o caminho nem os parâmetros, que podem conter um segredo do ancestral.

O acesso aos dados no coletor, Loki, Prometheus e Grafana deve ser isolado pelos controles desses sistemas. Um filtro de painel por `organization.id` não é um controle de acesso.

![Milvago - Organizações filhas](/img/docs/en/administration-observabilite-03.png)
