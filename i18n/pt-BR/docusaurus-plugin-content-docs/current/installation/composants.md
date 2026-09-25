---
sidebar_position: 1
title: Componentes
---

# Instalação dos componentes

## Percurso de instalação

1. Implante o servidor Milvago e abra o console com uma conta de administrador.
2. Em **Administração → Configurações**, defina e confirme a URL HTTPS pública que os agentes usarão.
3. Abra **Parque → Dispositivos** e selecione **Baixar o agente** para obter o pacote da sua edição.
4. Instale esse pacote no dispositivo e distribua a extensão específica do navegador pela política empresarial.
5. Volte a **Parque → Dispositivos**: aprove o dispositivo se ele estiver pendente e verifique o último contato e as extensões do navegador.

## Extensão de navegador

A extensão é distribuída em duas variantes de edição. Na Community, apenas os adaptadores ChatGPT e Claude são embarcados: nenhum catálogo nem script de conteúdo dos outros provedores está presente no pacote.

[IMAGEAMETTREICI 01]

- **Chrome / Edge / Brave / Vivaldi**: pacote CRX, implantado no Windows por política de empresa (`ExtensionInstallForcelist`). O Vivaldi não tem um caminho automatizado dedicado no Linux.
- **Arc (Windows)**: pacote CRX compatível e política empresarial Arc. A instalação por MSI e o controle de conteúdo ainda precisam de qualificação separada.
- **Firefox**: XPI assinado, exigido mesmo sob política de empresa; Firefox 140.0 ou posterior é obrigatório em todos os sistemas operacionais. Sem pacote assinado esperado, o serviço de atualizações da extensão responde 503.

O Chromium independente não é compatível. Consulte [Arquitetura técnica](../introduction/architecture.md) para a matriz de integração por sistema operacional, os modos de implantação Linux e o escopo das qualificações.

A extensão é controlada por um **catálogo de detecção assinado** (motor + dados) que descreve as rotas medidas dos sites cobertos: rotas de prompt, rotas de upload. Ela não aplica nenhuma heurística fora dessas rotas.

Nas duas edições, as **plataformas conhecidas** relatam a presença em uma plataforma alcançada, nunca seu conteúdo, sem reativar a captura fora dos provedores qualificados.

:::enterprise

O catálogo de fábrica da Enterprise cobre **nove provedores**. O controle de modelos e a sensibilidade dos usos também são reservados à Enterprise.

:::

## Agente Windows

O agente é distribuído na forma de um **MSI assinado**:

1. Recuperar o MSI servido pelo servidor (embarcado na imagem Docker, manifesto de atualização assinado).
2. Instalar no dispositivo; o serviço executa-se sob conta local e retransmite as políticas à extensão por canais loopback.

As atualizações são distribuídas pela imagem Docker contendo o MSI e seu manifesto: reconstruir e colocar novamente em serviço a imagem, e depois verificar a impressão digital do MSI efetivamente servido, a assinatura e a versão anunciada. A aplicação nos dispositivos depende da política de atualização configurada.

[IMAGEAMETTREICI 02]

## Console

O console é fornecido com o backend (AGPL-3.0):

```bash
docker compose up -d
```

Por padrão na Community: uma organização, sem controle de modelos, sem motivos de mascaramento integrados nem sensibilidade dos usos. A observação do nome do modelo que respondeu está aberta nas duas edições (inventário); a decisão de controle permanece limitada aos provedores cobertos. O gerenciamento de funções e membros, o diretório LDAP e o login SSO dependem, na Community, de uma **licença**: enquanto nenhuma for aceita, a instância permanece em modo restrito — 5 dispositivos, uma única conta de administrador, nenhuma dessas três funções. Veja [Configurações > Licença](../administration/parametres.md#licença).

:::enterprise

Na Enterprise, o console gere várias organizações isoladas (PostgreSQL RLS), os grupos de dispositivos, as chaves de implantação e o servidor MCP. Veja a seção Administração. Uma licença Enterprise válida e própria da instância é sempre exigida, sem modo restrito: veja [Configurações > Licença](../administration/parametres.md#licença).

:::

[IMAGEAMETTREICI 03]
