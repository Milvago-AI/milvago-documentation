---
sidebar_position: 5
title: Herança da configuração
---

# Herança da configuração

A configuração Shadow AI do Milvago lê-se em três andares: **organização → grupo de dispositivos → dispositivo**. Cada andar define apenas o que quer mudar; uma seção ausente é herdada do andar superior, e a derrogação mais próxima do dispositivo prevalece.

[IMAGEAMETTREICI 01]

## O princípio: seções, não blocos

A configuração não é um bloco único, mas uma **lista de seções**: registro, coleta, serviços, proteções, mascaramento local, sensibilidade dos usos, controle de modelos, exploração. A herança regula-se **seção por seção**:

- uma seção **definida** em um nível aplica-se a tudo o que está abaixo;
- uma seção **deixada em herança** segue o andar superior;
- um andar inferior pode reescrever uma seção precisa sem copiar as outras.

Um grupo que quer mudar apenas "Proteções" define, portanto, unicamente essa seção: serviços, mascaramento e o resto continuam seguindo a organização.

## O que cada nível pode definir

| Nível | Seções possíveis | Tela de edição |
| --- | --- | --- |
| **Organização** | todas, incluindo Registro e Exploração | Administração → Shadow AI |
| **Grupo de dispositivos** | coleta, serviços, proteções, mascaramento local, sensibilidade dos usos, controle de modelos | Parque → Grupos de dispositivos |
| **Dispositivo** | as mesmas seis seções do grupo | ficha do dispositivo → Política do dispositivo |

Duas seções permanecem por natureza na organização: **Registro** (quem pode se juntar, segundo qual rede) e **Exploração** (atualizações do agente). Um grupo ou um dispositivo não pode nem sobrescrevê-las nem enfraquecê-las — são decisões de parque, não de uso.

Um dispositivo pertence a um único grupo por vez: não há prioridade a arbitrar entre vários grupos. Retirá-lo de um grupo o faz voltar à política da organização.

## Quem vê a procedência

O editor exibe o escopo corrente ("Política da organização", "Derrogação do grupo", "Derrogação do dispositivo") e, para cada seção herdada, uma caixa "**Herdar · nome da seção**" que nomeia a tela de onde a seção vem — o grupo na ficha de um dispositivo, a organização na ficha de um grupo. A procedência segue o **último escritor**: uma seção herdada pela organização pai e depois recoberta pelo grupo é atribuída ao grupo.

[IMAGEAMETTREICI 02]

## As revisões, na ordem

Cada gravação produz uma **revisão** mais recente, e a política efetiva de um dispositivo soma as revisões de seus andares. Um dispositivo nunca aplica uma revisão mais antiga do que a que detém: mover um dispositivo de um grupo para outro, e depois voltar, apenas faz crescer. Essa regra de **não-retrocesso** garante que nenhuma manipulação de afetação possa fazer um dispositivo voltar a uma política ultrapassada — por exemplo, reimpor um bloqueio retirado.

Reaffectar a um dispositivo o grupo que ele já porta não reescreve nada: a revisão não se move e o agente não vê nenhuma mudança.

## A cadeia completa na Enterprise

:::enterprise

Na Enterprise, a cadeia conta com um andar a mais **acima** da organização: a **organização pai**. Uma organização filha pode marcar seções como "Herdar" e recebê-las de sua pai — veja [Organizações pai e filha](organisations-mere-fille.md). A cadeia efetiva de um dispositivo torna-se: organização pai → organização → grupo → dispositivo, sempre seção por seção, e a procedência nomeia a tela de origem.

Duas regras completam o conjunto:

- a **sensibilidade dos usos** só existe no editor se a edição servir essa capacidade — a seção desaparece em vez de aparecer inutilizável;
- a profundidade da árvore de organizações é delimitada: uma ascendência profunda demais é recusada em vez de lida indefinidamente.

:::

## Quem pode escrever o quê

| Edição | Direito exigido |
| --- | --- |
| Política da organização | `policy.manage` |
| Política de um grupo | `policy.manage` |
| Política de um dispositivo | `policy.manage` |

O direito por si só nem sempre basta: as configurações que expõem conteúdo — ativar a coleta de texto, relaxar uma proteção de privacidade — exigem uma **autenticação MFA recente**, qualquer que seja o nível de onde a modificação parte.

Veja também: [Shadow AI](../administration/shadow-ai.md), [Grupos de dispositivos](../fleet/groupes.md), [Dispositivos](../fleet/postes.md).
