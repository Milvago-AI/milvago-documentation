---
sidebar_position: 1
title: Membros
---

# Membros

## Acessar a tela

Clique em **Administração** > **Membros**. Você precisa de `members.read`; para convidar, importar ou alterar um membro, também precisa de `members.manage`.

1. Clique em **Convidar membro**.
2. Informe e-mail, função e idioma.
3. Envie o convite.

A tela Membros responde à pergunta "**quem pode entrar** nesta organização, e com qual função". Ela lista os membros acessíveis a partir da sua organização — incluindo, na Enterprise, os das organizações filhas do seu subárvore — e carrega as ações de afiliação: convite, mudança de função, mudança de idioma, remoção do acesso.

O acesso exige a permissão `members.read`; sem ela, a entrada de navegação não existe e a tela mostra "Acesso restrito".

![Milvago - Acessar a tela](/img/docs/en/administration-membres-01.png)

## A tabela de membros

Cada linha é um membro, com suas colunas:

O seletor **Por página** oferece 10, 20, 50, 100 ou 200 membros. O contador abrange todos os membros visíveis, e os controles numerados dão acesso à primeira página, à última e às páginas vizinhas.

| Coluna | Conteúdo |
| --- | --- |
| **Membro** | nome exibido, ou "—" quando não tem |
| **Endereço de e-mail** | o endereço da conta |
| **Função** | badge da função atual (`owner`, `admin`, `viewer`, `reporter` ou uma função personalizada) |
| **Tipo** | procedência da identidade: "Local", "SSO" ou "LDAP" |
| **Idioma** | idioma do console do membro, ou "Padrão" |
| **Organização** | nome da organização de afiliação, ou "—" |
| **Ações** | veja abaixo |

Vazia, a tela lê "Nenhum membro visível": isso descreve o que seus direitos permitem ver, não uma organização sem usuários.

## As ações por membro

As três ações só aparecem se você possuir `members.manage` (`members.manage`: "Gerenciar os membros"), se o membro pertencer à organização atual, se não for a sua própria conta e — para um proprietário — se você mesmo for proprietário da organização. Caso contrário, a célula mostra um cadeado com, ao passar o mouse, o motivo exato: "Este é você: não pode alterar o seu próprio acesso.", "Proprietário: apenas um proprietário pode alterar este membro.", ou "Mude para esta organização para gerenciar este membro." Essas mesmas ações também exigem que suas próprias permissões cubram cada uma das permissões da função atual do membro — a mesma regra para conceder uma função; uma chave de API é vinculada da mesma forma por suas próprias permissões.

- **Alterar a função**: a nova função se aplica após um novo login, e as sessões atuais do membro são invalidadas. A lista de funções propostas omite "Proprietário" se você não for proprietário.
- **Alterar o idioma**: o idioma se aplica à próxima abertura do console por este membro; "Padrão" segue o idioma do navegador dele, ou o inglês quando não é servido. As sessões dele permanecem abertas.
- **Remover o acesso**: o membro perde o acesso a esta organização e suas sessões são invalidadas; a identidade dele no provedor de login é preservada. Na sua própria conta, um aviso precede a confirmação.

O último proprietário de uma organização não pode ser rebaixado nem removido: seja por **Alterar a função** ou por **Remover o acesso**, o servidor recusa com "Atribua outro proprietário antes de remover ou rebaixar o último proprietário." Atribua primeiro um segundo proprietário.

:::enterprise

Uma pessoa que alcança esta organização por meio da organização pai (acesso herdado) só pode ser convidada, importada, reatribuída ou removida aqui por alguém que gerencia os membros da organização pai; caso contrário, o servidor recusa com "O acesso desta pessoa vem da organização pai: gerencie-o por lá."

Na Enterprise, uma conta que já pertence a outra organização — uma organização que a sua não contém e que não contém a sua, como uma organização irmã — não pode ser convidada nem importada aqui: o servidor recusa com "Esta conta pertence a outra organização. Convide-a a partir de uma organização que contenha ambas." Para essa pessoa, o idioma do console só pode ser alterado por ela mesma, a partir do próprio perfil.

:::

![Milvago - As ações por membro](/img/docs/en/administration-membres-03.png)

## Convidar um membro

O botão "Convidar um membro" abre um diálogo com três campos: endereço de e-mail, função (mesma regra de omissão da função Proprietário) e idioma do console. O convite é enviado pelo provedor de identidade; a menção do rodapé o diz e lembra suas condições:

- As identidades e os convites são gerenciados pelo Keycloak. Enviar um convite exige uma configuração SMTP funcional.
- Contas SSO e LDAP convidadas por e-mail não recebem nenhum; o acesso é ativado no primeiro login.

Uma nova conta local recebe "Seu convite para o Milvago", no idioma do console escolhido para ela. O link **Ativar minha conta** confirma o endereço e depois pede uma senha. A última página, "Sua conta está pronta", oferece **Entrar**, que abre diretamente o login do console. O link é válido por um dia. Quando o SSO é oferecido e o endereço pertence ao domínio da organização, o convite não tem senha para criar: depois do link, a pessoa entra com o Google ou a Microsoft (veja [SSO](../avance/sso.md)).

## Importar do diretório

Quando um diretório LDAP está configurado para a organização, um segundo botão aparece: "Importar do diretório". Ele abre uma busca no diretório, e a importação cria o membro com a função escolhida. A importação exige `members.manage` e um diretório alcançável por LDAPS ou StartTLS verificado; uma conta de diretório sem endereço de e-mail é recusada.

O diretório em si é configurado em [Configurações](parametres.md).
