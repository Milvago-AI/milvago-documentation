---
sidebar_position: 2
title: Instalação com Docker
---

# Instalação com Docker

## Antes de começar

Para acesso compartilhado, prepare um host Linux com acesso como `root` ou por `sudo`. Instale o `curl`, sincronize o relógio do host e prepare externamente a este instalador um DNS e um proxy reverso HTTPS que encaminhem para a porta `4020` do endereço IP privado do host Milvago. O script não cria registros DNS nem certificados.

### Operação em produção

O perfil instalado executa o Keycloak com `start`, em modo de produção, atrás do proxy reverso HTTPS que você fornece. Mantenha esse proxy na frente da porta `4020`, preserve o cabeçalho `Host` e envie `X-Forwarded-Proto: https`.

O Mailpit fica desativado no perfil instalado. Ele está disponível somente pelo perfil `development-mail`, para uso deliberado de desenvolvimento; não é um serviço de e-mail de produção. Configure um servidor SMTP real durante a configuração ou mais tarde em **Administração > Configurações** e envie uma mensagem de teste antes de depender de convites de membros ou de e-mails de redefinição de senha. Sem SMTP, essas mensagens não ficam disponíveis.

Em cada execução, o instalador interrompe um serviço Mailpit de desenvolvimento que já esteja em execução sem excluir suas mensagens capturadas. Ele remove somente a configuração SMTP de fábrica (`mail:1025` com `no-reply@milvago.test`) e preserva as configurações SMTP definidas por um operador.

Os contêineres gateway e development-mail são executados como `65532:65532`, com todos os recursos do Linux removidos; gateway adiciona somente o recurso necessário para associar sua porta. Use uma conta dedicada de instalação, autorizada a usar `sudo`, mas que não pertença ao grupo `docker`. Mantenha o proprietário de cada volume específico do serviço que possui o volume. Esta instalação não promete Docker rootless. O Docker `userns-remap` ainda não está ativado nem qualificado: teste a sondagem de disponibilidade na rede do host e a propriedade dos volumes antes de ativá-lo.

## Instalar a versão publicada mais recente

Execute o comando a seguir:

```bash
curl -fsSL https://get.milvago.ai | bash
```

Não é necessário login no GitHub, token do GitHub ou credencial de registro. O instalador publicado mais recente fixa uma versão e um resumo exatos da imagem. Ele também verifica a assinatura cosign da imagem, os hashes SHA-256 e as assinaturas Ed25519 dos agentes.

O instalador solicita `Milvago public URL [http://localhost:4020]:`. Para acesso compartilhado, informe a URL pública que as pessoas usarão para abrir o Milvago, por exemplo `https://milvago.example.com`. Ela deve usar `http` ou `https` e não pode incluir caminho, consulta nem fragmento. Um valor inválido interrompe a instalação. Esse modo público vincula o gateway à rede do host na porta `4020`; mantenha o proxy reverso HTTPS à frente dele.

Deixe a pergunta vazia para uma instalação local. Ela usa `http://localhost:4020` e vincula a porta `4020` somente a `127.0.0.1`. Um valor explícito `http://localhost:4020` ou `http://127.0.0.1:4020` seleciona o mesmo modo local. O modo local não abre portas adicionais no host; a aplicação e o serviço de identidade permanecem internos.

Abra uma instalação local em um navegador no próprio servidor. De outro computador, crie primeiro um túnel SSH e depois abra `http://localhost:4020` localmente:

```bash
ssh -L 4020:127.0.0.1:4020 usuario@servidor
```

Para ignorar essa pergunta, informe a URL no comando. O `sudo` ainda poderá ser solicitado se for necessário instalar pacotes:

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL=https://milvago.example.com bash
```

O instalador pode instalar automaticamente pré-requisitos por meio de `apt-get`, `dnf` ou `yum`, e componentes do Docker nas distribuições compatíveis. Ele não garante compatibilidade com todas as distribuições ou versões do Linux. A pergunta sobre a URL é lida do terminal, mesmo na execução por pipe. Sem terminal de controle e sem URL fornecida, ele seleciona o modo local.

Para uma instalação local não interativa, defina a variável vazia:

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL='' bash
```

O modo localhost padrão está disponível a partir da versão `1.0.2` do instalador.

Em uma execução posterior, o instalador preserva a URL configurada. Ele para se uma URL fornecida, inclusive uma mudança entre modo local e público, entrar em conflito com ela; altere-a em **Administração > Configurações**.

Ao terminar, abra a URL informada. Recupere `MILVAGO_SETUP_TOKEN` no arquivo `.env` cujo caminho é exibido pelo instalador; o padrão é `$HOME/milvago-community/.env`. Insira esse token no assistente do navegador, conclua a configuração inicial do administrador e consulte [Componentes](./composants.md). Mantenha o arquivo `.env` privado: ele contém os segredos da instância.

## Instalar uma versão fixada

Em um servidor Linux, baixe anonimamente os ativos imutáveis da versão `v1.0.2`, verifique-os e execute o instalador:

```bash
mkdir -p milvago-install && cd milvago-install
release_url=https://github.com/Milvago-AI/milvago-server/releases/download/v1.0.2
curl -fLO "$release_url/install-private.sh"
curl -fLO "$release_url/SHA256SUMS"
curl -fLO "$release_url/release.json"
sha256sum --check SHA256SUMS
bash install-private.sh
```

Execute o instalador somente se ambas as verificações de checksum indicarem `OK`. O nome `install-private.sh` é histórico; não exige credenciais do GitHub.
