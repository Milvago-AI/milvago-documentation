---
sidebar_position: 4
title: Implantação Kubernetes
---

# Implantação Kubernetes

Os manifestos fornecidos separam a API, a manutenção e, no Enterprise, as exportações. Adapte-os ao seu ambiente; eles ainda não constituem um chart Helm.

## Preparar a plataforma

Preveja um namespace dedicado, uma imagem identificada pelo digest, serviços PostgreSQL e Keycloak acessíveis e uma entrada HTTPS por Ingress ou Gateway API. Provisione separadamente o armazenamento persistente e os backups das bases. Para uma operação tolerante a falhas, o PostgreSQL deve ter replicação adequada ao seu objetivo de disponibilidade, backups físicos com [arquivamento contínuo do WAL e recuperação para um ponto no tempo](https://www.postgresql.org/docs/current/continuous-archiving.html) exercitada regularmente. Uma fila de mensagens não substitui essas proteções depois que um evento foi confirmado.

Crie os secrets Kubernetes fora dos manifestos versionados. A conta de migração possui os privilégios necessários no esquema; as contas de execução não são proprietárias nem possuem `BYPASSRLS`. Restrinja cada secret ao papel que o utiliza e planeje sua rotação.

O cluster deve aplicar as NetworkPolicy (Calico, Cilium ou o equivalente do seu provedor); sem isso, as políticas são aceitas mas não têm efeito. O `networkpolicy.yaml` só permite em saída dos pods do Milvago o DNS, o PostgreSQL (5432), o Keycloak (8080 ou 8443) e, para a API e as exportações, o OpenTelemetry Collector (4318 ou 443): um pod comprometido não consegue abrir conexão para a Internet nem exfiltrar dados. Adapte os seletores aos rótulos dos seus deployments de PostgreSQL, Keycloak e Collector, ou substitua-os pelo endereço de um serviço situado fora do cluster. Faça o `OIDC_INTERNAL_URL` apontar para o Service interno do Keycloak: uma URL pública passa pelo balanceador de carga, que essas regras recusam. Se você importar o catálogo assinado a partir do serviço editor, ative a regra comentada informando seu endereço.

O HPA da API exige Metrics Server. O HPA de exportações Enterprise exige também Prometheus e um adaptador que publique a métrica externa de exportação. `servicemonitor.yaml` usa a CRD do Prometheus Operator; se utilizar outra coleta, configure um scrape equivalente com o token de observabilidade. Mantenha `/metrics` na rede privada, fora do Ingress público.

Se um OpenTelemetry Collector retransmitir exportações para Loki, Grafana Cloud ou um SIEM, monte sua fila persistente em um volume criptografado que sobreviva à substituição do pod. O volume e sua replicação pertencem à implantação do Collector, não aos pods do Milvago. Uma fila cheia deve recusar novas entradas para que o Milvago mantenha os eventos no PostgreSQL e tente novamente.

## Papéis e ordem de inicialização

| Arquivo em `deploy/kubernetes/` | Função |
| --- | --- |
| `networkpolicy.yaml` | Restrição dos fluxos de saída dos pods do Milvago: apenas DNS, PostgreSQL, Keycloak e Collector |
| `migrate.yaml` | Job de migração do esquema e inicialização |
| `milvago.yaml` | API com HPA, uma réplica de manutenção em regime estável e Services internos |
| `exports.yaml` | Enterprise: exportações e seu HPA independente |
| `servicemonitor.yaml` | Coleta Prometheus autenticada, se o Prometheus Operator estiver instalado |
| `prometheus-adapter.example.yaml` | Fragmento para integrar à configuração do adaptador, não um recurso para aplicar diretamente |

1. Adapte o namespace, os digests das imagens, os secrets por papel e as conexões PostgreSQL. Instale os componentes de métricas necessários para o HPA escolhido.
2. Adapte e aplique o `networkpolicy.yaml` antes do primeiro pod do Milvago.
3. Aplique `migrate.yaml` e aguarde a conclusão bem-sucedida do Job `milvago-migrate`. Uma falha deve interromper a implantação; a readiness não substitui essa etapa.
4. Aplique `milvago.yaml` para os papéis `api` e `maintenance`. No Enterprise, aplique também `exports.yaml`.
5. Configure a coleta autenticada e, para exportações, a regra do adaptador. Verifique os pods Ready e as métricas HPA antes de depender deles para ajustar a capacidade.
6. A cada versão, recrie o Job concluído com o novo digest e aguarde seu sucesso antes de atualizar os workloads. Com GitOps, represente essa dependência pelos mecanismos de ordenação da sua ferramenta.

O papel implícito `all` mantém o funcionamento combinado do Compose ou de uma instalação com um único processo. As réplicas Kubernetes usam papéis dedicados: pods API não executam migrações nem inicialização persistente; pods de exportação não servem o console.

## Entender o escalonamento

A API e as exportações Enterprise escalam de forma independente entre 1 e 4 pods nos manifestos fornecidos. A API acompanha a utilização de CPU em relação à sua solicitação de recursos; as exportações acompanham o trabalho executável observado no PostgreSQL. O Job de migração e a manutenção não têm HPA.

O aumento de capacidade leva tempo para medir o sinal, criar pods e torná-los disponíveis. Um pico curto pode terminar antes que pods adicionais sejam úteis. A redução é deliberadamente gradual. Metas, tempos, orçamento de conexões e orientações de ajuste estão em [Dimensionar PostgreSQL e o autoscaling](../avance/dimensionnement-postgresql-hpa.md).

Adicionar pods não substitui a capacidade do PostgreSQL nem aumenta as cotas compartilhadas de admissão. Verifique os recursos da base e a soma dos pools antes de aumentar os limites de réplicas.

## Operar a implantação

Mantenha as sondas `/healthz` e `/readyz`, a sonda de inicialização e o período de graça de encerramento de 120 segundos. A readiness verifica o acesso ao PostgreSQL. Os manifestos montam um volume temporário `emptyDir` de 128 MiB em `/tmp` para operações que precisam escrever com a raiz somente leitura.

Verifique o estado com `kubectl -n <namespace> get hpa,pods` e `kubectl -n <namespace> describe hpa milvago-api`; no Enterprise, examine também `milvago-exports`. Uma métrica desconhecida exige verificar a coleta e seu adaptador; ela não demonstra ausência de carga.

Monitore separadamente os recursos dos nós, os pods e as métricas da aplicação. Adicione alertas sobre a indisponibilidade do PostgreSQL, o atraso no arquivamento WAL, falhas de backups e de restaurações de teste, bem como sobre o tamanho, a capacidade e as falhas de enqueue do Collector. Emita um aviso antes de a fila atingir 70% da capacidade e um alerta imediato para qualquer recusa de enqueue. Uma ferramenta GitOps observa o estado Kubernetes; ela não substitui as sondas nem a verificação de ingestão e entrega aos destinos. Consulte [Observabilidade](../administration/observabilite.md) para exportações Enterprise.
