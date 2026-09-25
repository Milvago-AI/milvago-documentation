---
sidebar_position: 4
title: Privacidade
---

# Privacidade

## Acessar a tela

Na barra lateral, clique em **Administração** > **Privacidade**. Você precisa de `settings.manage` para alterar configurações; apenas com o direito de apagar identidade, a rotação de aliases fica disponível.

1. Altere as configurações necessárias.
2. Informe um motivo de pelo menos 8 caracteres.
3. Clique em **Salvar** e conclua a verificação MFA se ela for solicitada.
4. Ao voltar ao console, verifique se os novos valores são exibidos; eles são aplicados sem preencher os campos novamente.

A tela Privacidade responde à pergunta "**até onde a plataforma identifica as pessoas**". Ela configura a pseudonimização por padrão, a agregação dos relatórios, a retenção dos vínculos de identidade e os compartilhamentos com o editor. O acesso exige a permissão `settings.manage` ("Gerenciar as configurações"); uma conta que só possui o direito de revelar uma identidade vê aqui apenas a rotação de aliases.

Toda alteração exige um **motivo escrito** de no mínimo 8 caracteres — "Este motivo fica registrado no log de auditoria." — e uma **autenticação de duplo fator recente**: na falta dela, o servidor recusa e o console redireciona para a verificação, e então aplica a alteração ao voltar, sem exigir que ela seja redigitada.

[IMAGEAMETTREICI 01]

## Os ajustes

- **Pseudonimização por padrão** — exibe por padrão um alias nas visualizações individuais. Uma revelação de identidade autorizada ainda pode ocorrer.
- **Somente relatórios agregados** — ativa o modo de relatórios agregados e desativa o acesso individual aos usos.
- **Limite de agregação** — de 1 a 100: grupos de relatório abaixo do limite de pessoas distintas são ocultos.
- **Retenção dos vínculos de identidade (dias)** — de 7 a 365 dias para a associação entre pessoa e eventos; depois disso, revelar a identidade é impossível.
- **Justificativa de retenção prolongada** — justifica a retenção de eventos configurada em Configurações acima de 180 dias. É exigida acima dessa duração e não a altera.
- **Atributo OIDC da equipe** — o nome exato do atributo OIDC da equipe, não um nome de equipe; ele distribui os relatórios.

:::enterprise

**Aplicar às organizações filhas** — uma organização principal pode impor às suas descendentes apenas a pseudonimização, o modo agregado, o limite e a retenção dos vínculos de identidade. Os compartilhamentos e a rotação de aliases permanecem próprios de cada organização. Os campos impostos ficam bloqueados nas organizações filhas.

:::

[IMAGEAMETTREICI 02]

## Renovar os aliases

Um alias relaciona os eventos da mesma pessoa sem mostrar seu nome. A rotação altera os aliases da **organização selecionada**, por exemplo após o compartilhamento de uma exportação pseudonimizada. Ela não se propaga às organizações filhas nem exclui os eventos.

A **rotação de aliases** recalcula os pseudônimos de todas as pessoas e revoga as revelações de identidade ativas. Ela exige o direito de apagamento de identidade, um motivo escrito, e porta o próprio aviso dela: "Recalcular os aliases e revogar as revelações ativas. A rotação não garante o anonimato; os dados já exportados e as correlações continuam possíveis." A confirmação lê "Aliases recalculados: N. Revelações ativas revogadas."

## O levantamento de identidade, em outras partes do console

A rotação é apenas um lado do equilíbrio: uma identidade é **revelada** a partir do detalhe de uma conversa (15 minutos, motivo obrigatório, leitura auditada) e se **recompõe** sozinha no vencimento dos vínculos de identidade. Veja [Conversas](../monitoring/conversations.md).

## Dados compartilhados com o editor

Qualquer conta com `settings.manage` vê o painel **Dados compartilhados com o editor**. Ele permite escolher separadamente:

- **Importar automaticamente o catálogo do editor** — importa o catálogo assinado se houver uma conexão configurada. Essa opção aparece somente para a organização raiz e vale para toda a instância. Ela não envia telemetria por si só.
- **Compartilhar a saúde dos detectores** — consentimento próprio da organização que compartilha o estado agregado dos detectores por fornecedor e revisão, sem texto das conversas.
- **Compartilhar as contagens do parque** — consentimento próprio da organização que compartilha apenas as contagens de dispositivos inscritos e ativos em 30 dias, sem nomes de dispositivos.

As prévias e os estados são reservados ao proprietário da instância.

Consulte [Conectar ao serviço do editor](../avance/service-editeur.md) para configurar o servidor.
