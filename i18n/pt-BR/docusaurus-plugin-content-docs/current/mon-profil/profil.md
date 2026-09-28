---
sidebar_position: 1
title: Configurar meu perfil
---

# Configurar meu perfil

## Acessar a tela

Clique no bloco de usuário no canto inferior esquerdo e depois em **Meu perfil**; no celular, abra primeiro o menu.

1. Preencha os campos de identidade editáveis.
2. Escolha o **Idioma do console**.
3. Clique em **Salvar meu perfil**.
4. Verifique a confirmação de salvamento; as alterações se aplicam à conta e à sessão atual.

A página **Meu perfil** permite que cada pessoa conectada ao Milvago Community ou ao Milvago Enterprise consulte sua identidade e escolha o idioma do console.

Na barra lateral, clique no seu bloco de usuário, no canto inferior esquerdo. No celular, abra primeiro o menu e clique no mesmo bloco.

![Milvago - Acessar a tela](/img/docs/en/mon-profil-profil-01.png)

## Identidade

O bloco **Identidade** mostra o nome, o sobrenome, o endereço de e-mail e o tipo de conta: Local, SSO ou LDAP. O endereço de e-mail é exibido somente para leitura.

Uma conta local pode alterar nome e sobrenome e salvar o perfil. Para uma conta SSO ou LDAP, esses campos vêm do provedor de identidade e não podem ser alterados no Milvago.

A lista **Idioma do console** está disponível para todos os tipos de conta: Français, English, Español e Português (Brasil). Com **Padrão**, o console segue primeiro uma escolha explícita já salva neste navegador e depois o idioma preferido do navegador; se nenhum dos quatro idiomas for solicitado, ele será exibido em inglês. Clique em **Salvar meu perfil** para aplicar a escolha à conta e à sessão atual.

![Milvago - Identidade](/img/docs/en/mon-profil-profil-02.png)

## Segurança e acesso

O bloco **Segurança e acesso** mostra o estado do segundo fator: **status desconhecido** quando não é possível obtê-lo, **configurado** ou **não configurado**.

As ações disponíveis dependem do tipo de conta:

- **Local**: alterar o endereço de e-mail, alterar a senha e gerenciar o segundo fator.
- **LDAP**: gerenciar o segundo fator, que pode ser configurado localmente.
- **SSO**: o nome, o endereço de e-mail, a senha e o segundo fator são gerenciados pelo provedor de identidade.

Quando o segundo fator está **não configurado**, o botão **Configurar meu segundo fator** abre diretamente sua inscrição no provedor de identidade na guia atual. Ao concluir a inscrição, você retorna automaticamente a **Meu perfil**. Quando ele está **configurado** ou seu status é **desconhecido**, o botão **Gerenciar meus segundos fatores** abre a área segura do provedor de identidade em uma nova guia, onde você pode consultar seus autenticadores, adicioná-los ou removê-los.

**Meu perfil** permanece aberto na guia: volte a ele depois de gerenciar os autenticadores no provedor de identidade, e seu status será atualizado. As ações para alterar o endereço de e-mail e a senha também retornam automaticamente a **Meu perfil**.

Se você usar **Esqueceu a senha?** na página de login, o link enviado por e-mail permite definir uma nova senha. O aplicativo autenticador já configurado para a conta é mantido e continuará obrigatório no próximo login.

Em uma instância de demonstração somente para leitura, esses botões ficam ocultos e um aviso informa isso.

![Milvago - Segurança e acesso](/img/docs/en/mon-profil-profil-03.png)

Gerencie suas chaves pessoais em [Chaves API e servidor MCP](cles-api.md).
