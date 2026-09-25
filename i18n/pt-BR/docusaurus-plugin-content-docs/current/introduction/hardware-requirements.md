---
sidebar_position: 2
title: Requisitos técnicos
---

# Requisitos técnicos

Esta página apresenta os componentes e recursos a prever para implantar o Milvago Community ou Enterprise. O dimensionamento depende do número de estações ativas, do volume de eventos, dos conteúdos retidos e de seu período de retenção.

## Plataforma do servidor

| Elemento | Pré-requisito de implantação |
| --- | --- |
| Host | Máquina física ou virtual Linux x86-64, com um mecanismo de contêineres Linux |
| Aplicação | Imagem do Milvago correspondente à sua edição; o servidor Go também serve o console web |
| Banco de dados | PostgreSQL, com armazenamento SSD persistente e backups em armazenamento separado |
| Identidade | Keycloak, com um banco dedicado, uma URL pública e um certificado TLS |
| Acesso | Nomes DNS e HTTPS para o Milvago e o provedor de identidade |
| Armazenamento temporário | Diretório gravável para preparar instaladores e atualizações |

Os arquivos de implantação fazem referência ao **PostgreSQL 18.3** e ao **Keycloak 26.7.4**. Verifique a compatibilidade das versões ao atualizar esses componentes. Para um host ARM64, verifique antes a disponibilidade de uma imagem compatível com essa arquitetura.

O Milvago não hospeda nenhum modelo de linguagem: **não é necessária GPU nem acelerador de IA**. O console é integrado ao servidor e não requer um serviço Node.js em produção. Os sistemas de destino das exportações Enterprise, como um coletor OTLP ou um SIEM, devem ser dimensionados separadamente.

## Dimensionar CPU e memória

Dimensione em conjunto **Milvago, PostgreSQL e Keycloak**, bem como o sistema host e o mecanismo de contêineres. Esses serviços podem compartilhar uma máquina ou ser hospedados separadamente.

| Componente | Fatores a considerar |
| --- | --- |
| Milvago | Vazão de eventos, sincronizações simultâneas das estações, consultas, relatórios e exportações ativadas |
| PostgreSQL | Volume retido, índices, pesquisas, gravações simultâneas, limpezas e backups |
| Keycloak | Logins simultâneos, renovações de sessão e integrações de identidade |

Defina a capacidade a partir de uma carga representativa da sua implantação e mantenha margem para picos de atividade, reinicializações e manutenção. Meça rajadas repetidas com um histórico representativo, cobrindo a ingestão e a entrega das exportações; acompanhe CPU, esperas do PostgreSQL e pools antes de modificar recursos ou réplicas. O número de estações sozinho não basta: a frequência de uso e a retenção de conteúdos influenciam diretamente as necessidades.

O [guia de dimensionamento do Keycloak](https://www.keycloak.org/high-availability/single-cluster/concepts-memory-and-cpu-sizing) completa essa avaliação para o serviço de identidade. Os recursos de compilação de imagens e agentes devem ser previstos separadamente dos recursos de operação.

## Armazenamento e retenção

Planeje armazenamento SSD persistente para o PostgreSQL. Seu volume deve cobrir os dados da aplicação, os índices, os logs de transação (WAL), os dados de identidade e o espaço necessário para manutenção.

Para estimar o volume de eventos, use a fórmula a seguir:

**Estações ativas × eventos por estação por dia × dias de retenção × tamanho médio de um evento armazenado no banco.** O tamanho de uma mensagem OTLP transmitida é distinto dessa fórmula; ele não representa nem o volume armazenado nem o crescimento do PostgreSQL.

Adicione os conteúdos retidos, inventários, auditorias e índices se ainda não estiverem incluídos nesse tamanho médio. Eventos e conteúdos podem ter períodos de retenção diferentes. Preveja também espaço para imagens, instaladores e logs operacionais.

Os backups devem dispor de armazenamento separado e de um procedimento de restauração verificado. Mantenha espaço livre para migrações e picos de gravação; uma limpeza de dados não reduz necessariamente de imediato o tamanho do volume PostgreSQL.

## Docker e Kubernetes

### Implantação por contêineres

Para uma instalação de produção, configure TLS, os nomes DNS, o Keycloak no modo de produção, o relay SMTP, os segredos e os volumes persistentes. O arquivo Compose fornecido usa o Keycloak em `start-dev` e um servidor de e-mail de teste: adapte esses serviços antes de colocá-los em produção.

### Implantação no Kubernetes

O manifesto `deploy/kubernetes/milvago.yaml` fornece a API, a manutenção e seus Services internos. PostgreSQL, Keycloak, o Ingress HTTPS, os segredos e os volumes persistentes devem ser provisionados separadamente. No Enterprise, `deploy/kubernetes/exports.yaml` fornece as exportações e seu HPA independente. O [chart Helm](../installation/helm.md) ainda não está disponível.

As cargas de trabalho têm os seguintes valores iniciais:

| Parâmetro | Valor do manifesto |
| --- | --- |
| API: réplicas iniciais / HPA | 1 / 1 a 4 |
| API: CPU solicitada / limite | 100 mCPU / 500 mCPU |
| API: memória solicitada / limite | 128 MiB / 384 MiB |
| Exportações Enterprise: HPA | 1 a 4, independente |
| Manutenção | 1 réplica estável |

Esses parâmetros se referem às cargas de trabalho do Milvago. Ajuste os recursos à sua carga; eles não constituem o dimensionamento completo da plataforma. Reserve também a capacidade necessária para os serviços Kubernetes, outras cargas de trabalho e reinicializações. Os [requests e limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) determinam o posicionamento e o enquadramento dos recursos dos contêineres.

Para preparar a implantação:

- Use [volumes persistentes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) e backups para os bancos de dados do Milvago e do Keycloak.
- Configure as URLs públicas, os certificados TLS e os segredos estáveis de criptografia e assinatura.
- O manifesto já fornece um volume temporário gravável `emptyDir` de 128 MiB em `/tmp`. Preserve esse limite ou ajuste-o conscientemente se personalizar a carga de trabalho.
- Mantenha as sondas de inicialização, disponibilidade e vida, e monitore reinicializações, memória e limitação de CPU.

As cotas são compartilhadas e controladas no PostgreSQL: o HPA da API pode operar de 1 a 4 réplicas, enquanto o HPA das exportações Enterprise é independente e a manutenção permanece em uma réplica estável. Adicionar réplicas não compensa um banco saturado e aumenta as conexões e o trabalho SQL. Consulte [Dimensionar PostgreSQL e o autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Estações equipadas com o agente

Os pacotes de instalação têm como alvo **Windows x64** e **Linux x86_64**. A matriz de navegadores e os modos de serviço Windows/Linux são detalhados em [Arquitetura técnica](architecture.md).

Preveja espaço para os binários, o estado local, os logs e a coexistência das versões antiga e nova durante uma atualização. As necessidades de memória da estação também incluem o navegador e sua extensão. No Enterprise, considere os serviços de coleta e filtragem ativados.

A fila off-line principal tem por padrão o limite de **10.000 eventos e 8 MiB serializados**. Ela reúne eventos legados e de Shadow AI; esse limite não se aplica a toda a memória nem a todo o armazenamento do agente. O cache de contingência SYSTEM do navegador continua distinto, com seus próprios limites de 1000 eventos ou lotes de saúde e 8 MiB. Os quatro limites `queue.max_events`, `queue.max_size_mb`, `logging.max_file_mb` e `logging.retained_files` podem ser ajustados em `milvago.toml`; os logs usam por padrão um arquivo atual e cinco arquivos arquivados, com rotação a 10 MiB. Veja a [configuração do agente](../avance/agent-configuration.md).

## Rede e preparação da operação

As estações devem poder acessar a URL HTTPS do Milvago. Os navegadores usados para o console também devem poder acessar o provedor de identidade. Planeje a resolução DNS e a sincronização de horário; mantenha o PostgreSQL em uma rede privada. As conexões e as portas são detalhadas em [Arquitetura técnica](architecture.md).

Dimensione a largura de banda para a transmissão de eventos, as exportações e os downloads de atualizações. Escalone as implantações em grandes frotas para limitar os picos de transferência.

Antes de colocar em produção, verifique os tempos de resposta, o crescimento do armazenamento, as operações de limpeza, a restauração dos backups e a recuperação após uma interrupção. Use esses resultados para ajustar os recursos e os limites de supervisão do seu ambiente.
