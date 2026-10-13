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

## Segurança e acesso

O bloco **Segurança e acesso** lista, uma linha por item, seu endereço de e-mail, sua senha e seu segundo fator. Cada botão **Alterar**, **Adicionar um dispositivo** ou **Remover** abre uma página segura de login do Milvago na mesma guia e depois volta a **Meu perfil**, onde uma mensagem confirma a alteração.

As ações disponíveis dependem do tipo de conta:

- **Local**: alterar o endereço de e-mail, alterar a senha e gerenciar o segundo fator.
- **LDAP**: gerenciar o segundo fator, que pode ser configurado localmente.
- **SSO**: o nome, o endereço de e-mail, a senha e o segundo fator são gerenciados pelo provedor de identidade.

A linha **Segundo fator** lista seus dispositivos, cada um com seu nome e a data em que foi adicionado:

- Sem nenhum dispositivo, **Configurar meu segundo fator** orienta você a escanear um QR code com um aplicativo autenticador (Microsoft Authenticator, Google Authenticator, FreeOTP…) e depois a informar o código exibido.
- **Adicionar um dispositivo** configura outro aplicativo, por exemplo em um segundo celular; no login, você escolhe qual dispositivo exibe o código.
- **Remover** pede antes uma confirmação e depois um código de um dos seus dispositivos. Se você fez login há mais de alguns minutos, sua senha também é solicitada novamente. Sem nenhum dispositivo restante, seu login pede apenas a senha, a menos que sua organização exija um segundo fator: nesse caso, você configura um novo dispositivo no próximo login.

Quando o segundo fator não pode ser verificado, a linha informa isso e não oferece nenhuma ação.

Se você usar **Esqueceu a senha?** na página de login, o link enviado por e-mail permite definir uma nova senha. Um dispositivo já configurado para a conta é mantido e continuará obrigatório no próximo login.

Em uma instância de demonstração somente para leitura, esses botões ficam ocultos e um aviso informa isso.

![Milvago - Segurança e acesso](/img/docs/en/mon-profil-profil-03.png)

Gerencie suas chaves pessoais em [Chaves API e servidor MCP](cles-api.md).
