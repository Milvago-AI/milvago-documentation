---
sidebar_position: 2
title: Instalação Docker
---

# Instalação Docker

:::note[Coming soon]

Esta página está em preparação. O deployment Docker já existe no produto (as imagens de servidor, console e agente MSI alimentam o `compose` atual); esta página o documentará passo a passo.

:::

Conteúdo previsto:

- as imagens oficiais das duas edições (servidor, console, agente MSI + manifesto de atualização);
- o arquivo `compose` e as variáveis de ambiente (`SESSION_KEY`, `CONTENT_KEYS`, `POLICY_SIGNING_KEY`, `MILVAGO_INSTALLER_DIRECTORY`);
- PostgreSQL e as migrações de inicialização;
- a colocação em serviço e as verificações após substituição de imagem.

## Primeira inicialização

Assim que a pilha estiver em execução, abra o console: sem administrador existente, ele exibe o assistente de [primeira instalação](premiere-installation.md). Digite o valor de `MILVAGO_SETUP_TOKEN` gerado em `.env` e siga o assistente.
