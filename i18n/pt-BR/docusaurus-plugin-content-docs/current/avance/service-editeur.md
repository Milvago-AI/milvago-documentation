---
sidebar_position: 6
title: Conectar o Milvago ao serviço do editor
---

# Conectar o Milvago ao serviço do editor

A conexão é configurada no **servidor Milvago**. Peça ao operador do serviço do editor o endereço do serviço, a credencial de conexão da sua instância e sua chave pública de verificação.

## Configurar o servidor

Forneça juntas estas três variáveis de ambiente ao contêiner do servidor Milvago:

- `MILVAGO_PUBLISHER_URL` — a origem HTTPS do serviço, sem caminho nem parâmetros de URL;
- `MILVAGO_PUBLISHER_CREDENTIAL` — a credencial de conexão emitida para sua instância, com pelo menos 32 caracteres;
- `MILVAGO_PUBLISHER_PUBLIC_KEY` — a chave pública Ed25519 emitida para este serviço, codificada em base64 (32 bytes depois de decodificada).

Sua implantação fornece esses valores, que o servidor considera durante a inicialização. Eles não são inseridos no console. Se a URL for fornecida sem os outros dois valores válidos, o servidor se recusa a iniciar. Não publique a credencial de conexão na documentação ou em um arquivo versionado.

O Milvago Community também exige estas três variáveis, mas nenhum ID de cliente separado é informado. O serviço do editor usa a credencial de conexão para selecionar o catálogo adequado; no Community, esse catálogo contém somente ChatGPT e Claude.

## Escolher recursos no console

1. Entre com `settings.manage` e MFA recente.
2. No menu lateral, abra **Administração → Privacidade**.
3. Em **Dados compartilhados com o editor**, selecione as opções adequadas: **Importar automaticamente o catálogo do editor**, **Compartilhar a saúde dos detectores** ou **Compartilhar as contagens do parque**.
4. Informe o motivo exigido e selecione **Salvar**. A importação automática do catálogo é oferecida apenas à organização raiz.
5. Se você for o proprietário da instância, consulte a visualização do serviço do editor exibida abaixo dessas opções.

A conexão do servidor por si só não ativa essas opções.

Consulte [Privacidade](../administration/confidentialite.md) para conhecer as permissões e configurações da tela.
