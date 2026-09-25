---
sidebar_position: 1
title: Tópicos avançados
---

# Tópicos avançados

Esta seção reúne o que concerne os operadores e a integração, após a descoberta das telas correntes.

## Conteúdo

- [Catálogo de detecção](catalogue-editeur.md) — o editor por trás de `MILVAGO_DEBUG`, a publicação sob revisão, a saúde dos detectores.
- [Instância de demonstração](demo-instance.md) — `MILVAGO_DEMO_READONLY` e `MILVAGO_DEMO_MCP_KEY`, a pilha, as quatro camadas de somente leitura.
- [Conectar ao serviço do editor](service-editeur.md) — variáveis `MILVAGO_PUBLISHER_*` e opções disponíveis no console.
- [Configuração do agente](agent-configuration.md) — o arquivo `milvago.toml` sob Windows e Linux, parâmetro por parâmetro.
- [SSO (Google / Microsoft Entra ID)](sso.md) — intermediação de identidade do Keycloak, vinculação no primeiro login, restrição ao domínio ou ao tenant.

[IMAGEAMETTREICI 01]

:::note
Esses tópicos não têm todos o mesmo ponto de configuração: o servidor usa o ambiente, o agente usa seu arquivo TOML, enquanto o catálogo e as opções de compartilhamento são ajustados no console. Veja [Variáveis de ambiente](../installation/variables-environnement.md).
:::
