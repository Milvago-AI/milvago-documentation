---
sidebar_position: 2
title: Funções
---

# Funções

## Acessar a tela

Clique em **Administração** > **Funções**. Você precisa de `roles.manage` para ver a tela — entre as funções integradas, apenas o Proprietário possui essa permissão. Criar, editar ou excluir uma função, e listar quem a ocupa, vão além: o servidor exige a própria função Proprietário.

1. Clique em **Nova função**.
2. Informe o nome e selecione as permissões a conceder.
3. Clique em **Salvar**.
4. Verifique se a função aparece na lista com as permissões escolhidas.

A tela Funções responde à pergunta "**quem tem direito a fazer o quê**". Ela define as funções da organização e, para cada uma, o conjunto de permissões que concede. O acesso exige a permissão `roles.manage` — entre as funções integradas, apenas o Proprietário a possui; sem ela, a tela mostra "É necessário acesso de proprietário". Gerenciar funções é reservado à função Proprietário pelo nome, não apenas por uma permissão: o servidor verifica que a função de quem chama é `owner`, de modo que `roles.manage` não é mais oferecida ao criar uma função personalizada — concedê-la não teria nenhum efeito.

## O princípio: permissões, não rótulos

As autorizações são portadas por **permissões** verificadas pelo servidor a cada chamada, nunca pelo nome de uma função. Uma função não é senão um conjunto nomeado de permissões: dar a ela um nome lisonjeiro não lhe concede nenhum direito adicional, e uma edição declarada pelo cliente jamais concede autorização.

As permissões do catálogo, e seu rótulo no console:

| Permissão | Rótulo |
| --- | --- |
| `overview.read` | Visão geral |
| `events.read` | Eventos e cartografia |
| `devices.read` | Ver os dispositivos |
| `devices.manage` | Gerenciar os dispositivos |
| `members.read` | Ver os membros |
| `members.manage` | Gerenciar os membros |
| `roles.manage` | Gerenciar as funções |
| `settings.manage` | Gerenciar as configurações |
| `policy.manage` | Gerenciar a política (Shadow AI) |
| `installers.manage` | Gerenciar os instaladores |
| `content.read` | Ler os conteúdos |
| `content.purge` | Expurgar os conteúdos retidos |
| `audit.read` | Registro de auditoria |
| `organizations.manage` | Gerenciar as organizações |
| `directory.manage` | Gerenciar o diretório LDAP e o SSO |
| `reports.aggregate` | Ler os relatórios agregados |
| `identity.reveal` | Revelar identidades |
| `identity.erase` | Apagar identidades e renovar os aliases |
| `observability.manage` | Gerenciar a observabilidade (somente Enterprise) |

![Milvago - O princípio: permissões, não rótulos](/img/docs/en/administration-roles-01.png)

## Funções integradas e funções personalizadas

Quatro funções integradas existem em toda organização, portadas com a menção "integrada" e em somente leitura:

- **Proprietário** (`owner`): todas as permissões do catálogo.
- **Administrador** (`admin`): as permissões de operação — visão geral, eventos, dispositivos (ver e gerenciar), membros (ver e gerenciar), configurações, política, instaladores, conteúdos (leitura) e relatórios agregados — sem `roles.manage`, `observability.manage`, `content.purge`, `audit.read`, `organizations.manage`, `directory.manage`, `identity.reveal` nem `identity.erase`.
- **Leitor** (`viewer`): visão geral, eventos e dispositivos em leitura, e relatórios agregados.
- **Reporter** (`reporter`): apenas visão geral e relatórios agregados, a função integrada mais restrita. Diferente das três primeiras, `reporter` ainda não tem um nome de exibição próprio: as listas de seleção de função a mostram pelo nome bruto "reporter".

O botão "Nova função" cria uma função personalizada: um nome, e as permissões marcadas uma a uma. Na criação como na edição, nada vem pré-marcado — uma função começa sem autorização e se alarga deliberadamente. Um nome já usado é sinalizado antes de salvar.

As funções integradas não se modificam; as funções personalizadas portam "Editar" e "Excluir", esta última desativada na sua própria função ("Você não pode excluir a função que ocupa atualmente.").

![Milvago - Funções integradas e funções personalizadas](/img/docs/en/administration-roles-02.png)

## Excluir uma função ainda atribuída

Uma exclusão recusada porque membros ainda ocupam a função abre um diálogo dedicado: "A função "…" não pode ser excluída enquanto estiver atribuída. Reatribua ou remova os membros abaixo e tente a exclusão novamente." Ela lista os ocupantes e oferece duas saídas, sem sair da página: **Reatribuir** cada membro a outra função, ou **Remover o acesso**. Enquanto houver membros ocupando a função, o botão "Excluir a função" permanece bloqueado ("Alguns membros ainda ocupam esta função."); sem nenhum ocupante, ele se abre.

Um membro sem direito de gestão de membros vê a lista de ocupantes, mas não as ações deles, com o aviso que o remete a um gestor de membros.

:::enterprise

Na Enterprise, a lista de membros de uma função e as reatribuições abrangem apenas a organização atual; a função em si permanece própria de cada organização. As permissões `organizations.manage` (árvore de organizações) e `directory.manage` (diretório LDAP) só servem em multiorganizações.

:::
