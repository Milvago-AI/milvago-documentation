---
sidebar_position: 9
title: Implantação
---

# Implantação

## Acessar as configurações de implantação

Não há uma entrada **Implantação**. Clique em **Administração** > **Configurações** > **Chave de implantação**; no Enterprise também use **Administração** > **Organizações** > a organização > **Chave de implantação**. Você precisa de `installers.manage`.

1. Clique em **Gerar uma chave**, **Girar** ou **Revogar**, conforme o estado exibido.
2. Leia o aviso que descreve o efeito sobre os instaladores já distribuídos.
3. Confirme a ação.
4. Verifique o estado e a data da última rotação no painel; os dispositivos já inscritos não mudam.

Esta página descreve como os **dispositivos** são inscritos: a chave de implantação que autoriza a inscrição, os instaladores que a carregam, e o que chega a um dispositivo após a instalação dele. Para a instalação da própria plataforma (servidor, banco, imagens), veja [Instalação dos componentes](../installation/composants.md).

## A chave de implantação

A chave de implantação autoriza o registro de um dispositivo. No Windows, ela é entregue em um arquivo de provisionamento separado; o MSI não contém segredo da organização. O RPM atual do Linux ainda inclui a chave. Cada dispositivo recebe suas próprias credenciais após o registro. O painel em [Configurações](parametres.md), e na página de cada [organização](organisations.md) no Enterprise, mostra o estado, a criação, a última rotação e o número de instalações.

- **Gerar uma chave** ou **Girar**: baixe depois um novo ZIP do Windows. Os arquivos anteriores e os RPMs Linux deixam de registrar dispositivos. Os já registrados não mudam.
- **Revogar**: nenhum novo dispositivo pode ser registrado até a geração de uma nova chave. Os já registrados não mudam.

![Milvago - A chave de implantação](/img/docs/fr/administration-deploiement-01.png)

## Baixar o agente

Confirme a **URL HTTPS pública** em [Configurações](parametres.md) e clique em **Windows ZIP**. Um único arquivo contém o MSI imutável, o script PowerShell correspondente, o JSON de provisionamento desta organização e um `README.md` com o comando de instalação. O download exige `installers.manage`. Se sua conta usar um segundo fator, uma nova verificação poderá ser solicitada; o ZIP será baixado automaticamente após o retorno. O ZIP e o JSON contêm um token de implantação: proteja-os até excluí-los ou girar ou revogar a chave.

Extraia `milvago-windows-package.zip` em uma pasta protegida. Nessa pasta, execute o script como administrador:

```powershell
powershell.exe -NoProfile -File .\milvago-windows-install.ps1 -MsiPath .\milvago-windows-installer.msi -ProvisionPath .\milvago-provision.json
```

Os três caminhos no comando apontam para arquivos do ZIP. Mantenha-os juntos após a extração. Os dois parâmetros do script são obrigatórios; sem eles, o PowerShell solicita `MsiPath` e `ProvisionPath`. O `README.md` incluído repete as etapas de instalação.

O script verifica o hash do MSI, confere a assinatura Authenticode do editor quando um certificado de assinatura está configurado, armazena o MSI e o JSON com acesso exclusivo de SYSTEM e administradores, executa o Windows Installer e remove os arquivos temporários. Abrir apenas o MSI não registra um dispositivo novo porque ele não contém a chave da organização. Os pacotes locais gerados antes da disponibilidade do certificado não têm assinatura Authenticode; use-os somente em um ambiente de teste controlado.

O Linux ainda baixa um RPM específico da organização. A aprovação manual ou por rede continua valendo após a instalação. A extensão do navegador também deve ser distribuída.

## Após a instalação

Um dispositivo inscrito solicita a aprovação dele segundo o modo escolhido, e então recebe a política Shadow AI e as revisões seguintes dela. As atualizações do agente passam por instaladores assinados; a tela de um dispositivo expõe o estado de atualização dele, e a seção "Operações" de [Shadow AI](shadow-ai.md) regula o parque piloto e as versões pausadas quando aberta ao diagnóstico.

:::enterprise

Na Enterprise multiorganizações, cada organização porta a **própria** chave de implantação dela. O administrador de uma organização principal a gira ou a revoga a partir da página da filha, sem mudar para o contexto dela — é o primeiro bloco desta página.

As imagens Docker Enterprise incluem o MSI imutável, seu script de implantação correspondente à versão e um manifesto de atualização assinado. O servidor entrega os mesmos bytes MSI a todas as organizações.

:::
