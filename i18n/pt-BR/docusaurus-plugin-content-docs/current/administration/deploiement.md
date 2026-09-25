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

"Uma chave aleatória exclusiva desta organização, embutida em cada instalador baixado. Ela nunca é exibida: serve apenas para a inscrição de um dispositivo, que em seguida recebe credenciais próprias." O painel, em [Configurações](parametres.md) — e na Enterprise, na página de cada [organização](organisations.md) — mostra o que existe, jamais o segredo: estado, criação, última rotação, contador de instalações.

Três ações, cada uma com a confirmação dela:

- **Gerar uma chave** / **Girar** — "Será necessário um novo instalador: todos os MSI e RPM já distribuídos param imediatamente de instalar novos dispositivos. Os dispositivos já inscritos não mudam."
- **Revogar** — "Nenhuma instalação será possível nesta organização até que uma nova chave seja gerada. Os dispositivos já inscritos não mudam."

No estado sem chave, a tela o enuncia: "Nenhuma chave ativa. Nenhum instalador pode inscrever um dispositivo nesta organização até que uma chave seja gerada."

[IMAGEAMETTREICI 01]

## Baixar o agente

O download dos instaladores — MSI do Windows, RPM do Linux, ambos serviços para toda a máquina — é bloqueado enquanto a **URL HTTPS pública** não estiver confirmada em [Configurações](parametres.md): "Defina e confirme a URL HTTPS pública em Administração → Configurações antes de baixar um instalador. Os agentes se conectarão a essa URL."

O diálogo lembra três coisas:

- "O pacote carrega a chave de implantação desta organização. Após a instalação, o dispositivo se inscreve uma vez e mantém seu estado em um cache criptografado. Seu administrador também deve distribuir a extensão do navegador."
- Segundo o **modo de aprovação** escolhido na política Shadow AI: sob aprovação manual, "Cada dispositivo instalado aparecerá como pendente e não reportará nada até que você o aprove em Dispositivos."; em aprovação pela rede, "Um dispositivo instalado a partir de uma rede autorizada reporta imediatamente; os demais ficam pendentes de aprovação."
- "O mesmo pacote atende toda a organização. A chave de implantação é gerenciada em Administração → Configurações: girá-la invalida imediatamente os instaladores já distribuídos."

A versão do instalador baixado é confirmada após o download. Se a chave foi revogada entretanto, o download falha com o aviso que remete à rotação: "A chave desta organização foi revogada. Faça a rotação em Administração → Configurações para retomar as implantações."

[IMAGEAMETTREICI 02]

## Após a instalação

Um dispositivo inscrito solicita a aprovação dele segundo o modo escolhido, e então recebe a política Shadow AI e as revisões seguintes dela. As atualizações do agente passam por instaladores assinados; a tela de um dispositivo expõe o estado de atualização dele, e a seção "Operações" de [Shadow AI](shadow-ai.md) regula o parque piloto e as versões pausadas quando aberta ao diagnóstico.

:::enterprise

Na Enterprise multiorganizações, cada organização porta a **própria** chave de implantação dela. O administrador de uma organização principal a gira ou a revoga a partir da página da filha, sem mudar para o contexto dela — é o primeiro bloco desta página.

As imagens Docker Enterprise embarcam o MSI assinado e o manifesto de atualização dele; o servidor serve o MSI congelado do diretório de instaladores dele, jamais um pacote reconstruído localmente. A ordem das compilações, as chaves e a verificação da impressão digital servida pertencem aos procedimentos de fabricação do agente Windows.

:::
