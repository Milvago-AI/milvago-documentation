---
sidebar_position: 6
title: Organizações pai e filha
tags: [Enterprise]
---

# Organizações pai e filha

:::enterprise

Esta página concerne apenas a edição Enterprise, que permite várias organizações isoladas em uma mesma instância. Na Community, existe apenas uma organização única.

:::

O Milvago Enterprise hospeda várias organizações em uma mesma instância: uma **organização raiz**, e sob ela uma árvore de organizações filhas — a raiz não tem pai, qualquer outra organização tem uma. Cada organização guarda seus próprios dispositivos, eventos, políticas e membros; a árvore organiza o acesso e a herança.

[IMAGEAMETTREICI 01]

## Percurso de criação

1. Entre no Milvago Enterprise com `organizations.manage` na organização pai.
2. No menu lateral, abra **Administração → Organizações**.
3. Selecione **Nova organização**.
4. Informe o nome, escolha a organização pai e, se necessário, exija autenticação multifator para todos os seus membros.
5. Crie a organização e verifique que ela aparece sob a organização pai na árvore.

## Criar uma organização filha

A tela **Organizações** lista as organizações acessíveis, a raiz à cabeça, e agrupa as filhas sob sua pai. O diálogo "Nova organização" pede:

- o **nome** (obrigatório);
- a **organização pai**, escolhida entre as organizações em que o criador é proprietário — à falta disso, a raiz;
- a opção "**Exigir autenticação multifator de todos os membros**".

O criador torna-se **proprietário** da nova organização. O vínculo de filiação é fixado na criação e não se modifica mais; uma organização se move recriando-a, não reparentando-a.

A criação é autorizada pelo direito `organizations.manage` portado pela **organização pai** visada, não pela organização corrente da sessão. A filha fica operacional imediatamente: seus papéis integrados são postos, e sua **chave de implantação** é emitida desde a existência — ela pode registrar dispositivos sem outra configuração.

## O acesso desce pela árvore

Uma filiação concede o acesso a toda a subárvore:

- ser membro (qualquer que seja o papel) de uma organização dá acesso a **todas as suas organizações filhas**, a todos os níveis;
- o papel aplicado em uma organização é o da **filiação de ascendência mais próxima** — uma filiação direta prevalece sobre uma herdada;
- inversamente, uma filha nunca acessa sua pai: o acesso apenas desce.

O console lista as organizações acessíveis com o papel efetivo em cada uma, e a mudança de organização se faz sem nova conexão. Um administrador da pai pode assim intervir em uma filha segundo suas permissões efetivas — por exemplo, fazer girar a chave de implantação de uma filha a partir de sua ficha, sem aí alternar.

:::note
Uma chave de API é **fixada à organização onde foi criada**: qualquer que seja a filiação de seu criador, ela jamais age fora dessa organização, inclusive nas rotas que nomeiam outra organização na URL.
:::

[IMAGEAMETTREICI 02]

## O isolamento dos dados

O isolamento baseia-se no **PostgreSQL Row-Level Security**: cada requisição porta o contexto de uma organização, e as linhas de outra organização são invisíveis — inclusive para uma conta que teria direitos em outro lugar. Os identificadores de uma organização passada em uma requisição a partir de outra respondem "não encontrado", sem diferença entre "inexistente" e "fora do alcance".

A supressão de uma organização leva seus dados por cascata — dispositivos, eventos, políticas, grupos —, mas não a conta dos usuários, que é compartilhada entre organizações.

## O que a pai impõe

Três configurações descem pela árvore, cada uma com sua regra própria.

### A política Shadow AI

Uma organização filha pode marcar seções como "**Herdar**" e recebê-las de sua pai, seção por seção — incluindo Registro e Exploração, que grupos e dispositivos não podem tocar. A procedência nomeia a organização de origem, e uma seção recoberta mais abaixo remonta a seu escritor real. Veja [Herança da configuração](heritage-configuration.md).

### A privacidade

:::note
O bloqueio parental impõe apenas configurações **protetoras**: pseudonimização por padrão, relatórios agregados unicamente, k-anonimato, duração de ligação de identidade. Uma organização pai nunca pode dar seu consentimento a uma coleta em nome de uma filha.
:::

Quando a pai ativa "**Exigir das organizações filhas**", a configuração bloqueada exibe-se tal como está nas filhas com a menção "A configuração está bloqueada." e sua origem — a organização pai; os campos correspondentes tornam-se inertes.

### Os exports de observabilidade

Uma organização pode "**Impor esta configuração às organizações filhas**" para seus destinos de exportação. A filha que sofre a imposição lê "Configuração imposta por", seguida do nome da organização pai — ela não pode nem personalizá-la nem desativar a exportação, e sua personalização anterior permanece **conservada, mas inativa**, enquanto a restrição se aplica. À falta de imposição, a filha pode herdar voluntariamente ou guardar sua configuração própria; os segredos da pai nunca são copiados na filha.

[IMAGEAMETTREICI 03]

## As configurações reservadas à raiz

Duas configurações de instância só são modificáveis a partir da organização raiz, por um proprietário: a **URL pública do agente** (aquela que os instaladores portam) e o **idioma padrão** do console. Uma organização filha as lê, mas não as muda.

## Suprimir uma organização

Três travas, na ordem do código:

- a organização **corrente** da sessão não pode se suprimir ela mesma;
- a organização **raiz** não pode ser suprimida;
- uma **pai** não pode ser suprimida enquanto tiver filhas — a tela convida a suprimi-las primeiro, ou a selecioná-las juntas: a supressão em massa parte **das folhas em direção à raiz**.

Veja também: [Herança da configuração](heritage-configuration.md), [Organizações](../administration/organisations.md).
