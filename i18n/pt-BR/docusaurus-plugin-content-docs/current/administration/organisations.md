---
sidebar_position: 5
title: Organizações
tags: [Enterprise]
---

# Organizações

## Acessar a tela

Clique em **Administração** > **Organizações**. Esta página é exclusiva do Enterprise; criar, renomear ou excluir exige `organizations.manage`.

1. Clique em **Nova organização**.
2. Complete os campos.
3. Confirme a criação.

:::enterprise

Esta página concerne apenas à edição Enterprise. Na Community, a organização é única e esta entrada de navegação não existe.

:::

A tela Organizações responde à pergunta "**quais organizações eu vejo, e quais eu governo**". As organizações são as raízes de isolamento da plataforma: dispositivos, políticas, conversas, membros e inventário só existem dentro de uma organização, e o isolamento é assegurado pelo **PostgreSQL Row-Level Security** no nível das linhas, não por uma filtragem aplicativa.

## O seletor de organização

A barra lateral porta, acima da navegação, o seletor de organização: a organização atual como botão, e um painel lateral "Escolher uma organização" que desenha a árvore — "As organizações filhas são agrupadas sob a organização principal." Cada entrada porta o nome dela e a sua função na organização; a organização atual é marcada com um visto. As organizações acessíveis cuja principal não é acessível são listadas na raiz do painel.

![Milvago - O seletor de organização](/img/docs/en/administration-organisations-01.png)

## A lista de organizações

A tela lista as "Organizações acessíveis": nome (badge "Raiz" para a raiz, "Atual" para a da sessão), identificador, principal, e ações. Uma organização sem acesso lê "Nenhuma organização acessível".

Com a permissão `organizations.manage` ("Gerenciar as organizações"), a tela ganha a seleção por caixa de seleção e as ações:

- **Nova organização** — um nome, uma **organização principal** (entre aquelas onde você é proprietário), e uma caixa "Exigir autenticação de duplo fator de todos os membros", não modificável após a criação. O aviso de criação porta a regra de acesso: "Os membros de uma organização principal podem acessar os dados das organizações filhas de acordo com suas permissões." Criar uma organização torna você seu proprietário: portanto, é necessário ter, na organização principal, todas as permissões da função Proprietário; uma função personalizada ou uma chave de API que só tenha "Gerenciar as organizações" é recusada. As organizações se aninham em até vinte níveis, incluindo a raiz.
- **Renomear** — qualquer organização acessível.
- **Excluir** — sozinha, ou "Excluir a seleção" para um lote. O servidor recusa a exclusão da organização atual, da raiz, e de uma organização que ainda tem filhas ("Exclua primeiro as organizações filhas (ou selecione-as em conjunto)."). Uma exclusão em lote ordena os alvos das mais profundas às menos profundas, para esvaziar cada principal das filhas selecionadas dela antes de removê-la. A confirmação nomeia o irreversível: "Isto exclui permanentemente as organizações a seguir e todos os seus dados (membros, funções, dispositivos, eventos). As contas de usuário não são excluídas." Excluir exige um segundo fator verificado há instantes; o console redireciona para a verificação e reaplica a exclusão ao retornar. Enquanto a organização ainda tiver texto de solicitações e respostas retido, excluí-la também exige o direito de purgar conteúdos (`content.purge`, reservado ao proprietário por padrão); caso contrário, o servidor recusa com "Esta organização ainda tem texto de prompt retido: excluí-la exige o direito de purgar conteúdos."

Agir sobre outra organização a partir desta lista — renomeá-la, excluí-la, ou girar a chave de implantação dela — exige que o seu login carregue autenticação multifator sempre que essa organização a exigir dos membros dela: a mesma regra que para mudar para ela. Criar uma organização grava uma entrada de auditoria no log da organização principal **e** outra no log próprio da nova organização; a exclusão é registrada apenas no log da principal; uma renomeação é registrada no log da organização renomeada.

![Milvago - A lista de organizações](/img/docs/en/administration-organisations-02.png)

## A página de uma organização

Cada linha abre a página própria da organização: "A identidade da organização e os meios de implantação que lhe pertencem."

- **Detalhes** — identificador, organização principal ("Nenhuma — organização raiz" para a raiz, link para a principal caso contrário) e a sua função nela.
- **Chave de implantação** — com `installers.manage`, o painel da chave própria desta organização. Ele existe para que um administrador de uma principal possa girar ou revogar a chave de uma filha **sem mudar para o contexto dela**. Veja [Implantação](deploiement.md).

![Milvago - A página de uma organização](/img/docs/en/administration-organisations-03.png)
