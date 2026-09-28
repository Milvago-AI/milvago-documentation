---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

Como permitir que os membros entrem com sua conta do Google Workspace ou do Microsoft Entra ID?

O login único é configurado inteiramente a partir do console do Milvago, em **Administração** > **Configurações** > **SSO**. Ninguém precisa abrir o serviço de identidade por trás do Milvago: a administração dele não é acessível pela rede, e o console grava o provedor por você.

## Acessar a tela

1. Na barra lateral, abra **Administração** e clique em **Configurações**.
2. Na navegação vertical, clique em **SSO**.

A seção exibe um bloco por provedor — **Google Workspace** e **Microsoft Entra ID** — cada um com sua **URI de redirecionamento**, seus campos e um botão **Salvar**.

![Configuração de SSO para Google Workspace e Microsoft Entra ID](/img/docs/pt-BR/avance-sso-01.png)

## Quem pode configurá-lo

- A seção **SSO** aparece com a permissão `directory.manage` ("Gerenciar o diretório LDAP e o SSO") e uma licença fora do modo restrito: uma instância Community sem licença não exibe nem a seção, nem o login SSO.
- Salvar ou remover um provedor exige um segundo fator verificado há instantes, e nenhuma das duas ações está disponível para uma chave de API.
- O segredo do cliente nunca é exibido novamente depois de salvo: o campo permanece vazio, e deixá-lo vazio mantém o segredo armazenado.

:::enterprise

Um provedor é oferecido na página de login de todas as organizações da instância. Somente um proprietário da organização raiz pode configurá-lo; qualquer outra pessoa que abrir a seção lê "O login único se aplica a todas as organizações desta instância: somente um proprietário da organização raiz pode configurá-lo."

:::

## Princípio: convidar primeiro, vincular no primeiro login

**Uma pessoa deve ser convidada no Milvago antes do seu primeiro login SSO** (Administração > Membros). Sem um convite prévio, o login é recusado (`membership_required`). Uma conta SSO convidada não recebe nenhum e-mail de ativação: sua primeira ação é fazer login pelo provedor.

Nesse primeiro login, se já existir uma conta do Milvago com o mesmo e-mail — a conta convidada, ou qualquer outra, incluindo a do proprietário —, ela nunca é vinculada apenas pela coincidência de e-mail. A pessoa é solicitada a confirmar a vinculação, e então a provar que controla essa conta existente: fazendo login com suas credenciais atuais, ou confirmando um link enviado ao seu endereço de e-mail. Somente então a conta passa a ser uma identidade SSO; seu tipo muda para **SSO** em Membros, e a partir daí a pessoa sempre faz login através do provedor.

A vinculação só é possível dessa forma. Um usuário já conectado não pode anexar uma conta externa à sua própria conta a partir da página de segurança da conta: essa opção é desativada assim que um provedor é salvo.

A exigência de duplo fator da organização também se aplica aos logins SSO: o Milvago lê a MFA a partir da evidência atestada pelo provedor no login, nunca a partir do tipo de conta. Quando a organização exige MFA, ative-a do lado do provedor (verificação em duas etapas do Google Workspace, ou uma política de acesso condicional do Microsoft Entra que exija MFA). Na página de perfil do Milvago, as ações de senha, e-mail, perfil e segundo fator permanecem bloqueadas para uma conta SSO: elas são gerenciadas no provedor.

### Convites do domínio da organização

Quando um provedor é oferecido, um novo membro convidado com um endereço do seu domínio — o **Domínio do Google Workspace**, ou o **Domínio dos convites** da Microsoft — recebe um convite sem senha para criar. O link do e-mail confirma o endereço; a página "Sua conta está pronta" oferece então **Entrar**, e o primeiro login pelo botão do provedor vincula diretamente a conta do provedor, sem a prova descrita acima: o link do convite já provou a caixa de correio, e o provedor responde pelo mesmo endereço.

Isso vale uma única vez, para uma conta criada pelo convite que nunca entrou. A partir do primeiro login, e para qualquer outra conta, a prova volta a ser exigida. Um membro convidado com outro endereço recebe o convite habitual, com uma senha para escolher.

Para a Microsoft, o domínio dos convites é opcional e deve pertencer ao seu locatário: o Microsoft Entra não garante que o endereço de e-mail de um login foi verificado, então sem esse domínio os convites da Microsoft mantêm a prova. Um provedor salvo antes de esta opção existir precisa ser salvo mais uma vez para que ela se aplique.

## Google Workspace

Fontes oficiais: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849).

### 1. Criar o cliente OAuth no Google

1. No [Google Cloud Console](https://console.cloud.google.com/), abra **APIs & Services > OAuth consent screen** e preencha a tela de consentimento.
2. Abra **APIs & Services > Credentials** e depois **Create Credentials > OAuth client ID**.
3. Selecione o tipo de aplicativo **Web application**.
4. Em **Authorized redirect URIs**, cole a **URI de redirecionamento** exibida no bloco **Google Workspace** do Milvago.
5. Crie o cliente: o Google exibe o **Client ID** e o **Client secret**.

### 2. Salvá-lo no Milvago

1. No bloco **Google Workspace**, informe o **ID do cliente OAuth** e o **Segredo do cliente**.
2. Informe o **Domínio do Google Workspace** da empresa, por exemplo `example.com`. É obrigatório: somente contas deste domínio podem entrar. Os membros convidados com um endereço deste domínio entram diretamente com o Google, sem criar senha.
3. Deixe **Oferecer este provedor na página de login** marcado.
4. Clique em **Salvar** e verifique o segundo fator se solicitado. "Provedor salvo." confirma; um botão **Google** agora aparece na página de login.

## Microsoft Entra ID

Fontes oficiais: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), [Microsoft Learn — Provide optional claims](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).

### 1. Registrar o aplicativo no Microsoft

1. No [Microsoft Entra admin center](https://entra.microsoft.com), abra **Entra ID > App registrations > New registration**.
2. Dê um nome ao aplicativo.
3. Em **Supported account types**, escolha a opção de tenant único (contas apenas do seu diretório organizacional).
4. Em **Redirect URI**, escolha **Web** e cole a **URI de redirecionamento** exibida no bloco **Microsoft Entra ID** do Milvago, e clique em **Register**.
5. Na página **Overview**, anote o **Application (client) ID** e o **Directory (tenant) ID**.
6. Abra **Certificates & secrets > Client secrets > New client secret**, escolha uma expiração — anote-a, o segredo precisará ser renovado antes dela — e clique em **Add**. O **Value** do segredo só é exibido uma vez: guarde-o imediatamente.
7. Abra **Token configuration > Add optional claim**, escolha o tipo de token **ID**, marque **email** e clique em **Add**, para que cada login carregue o endereço de e-mail da pessoa.

### 2. Salvá-lo no Milvago

1. No bloco **Microsoft Entra ID**, informe o **ID do aplicativo (cliente)** e o **Segredo do cliente**.
2. Informe o **ID do diretório (locatário)**, um valor no formato `00000000-0000-0000-0000-000000000000`. Somente contas deste locatário podem entrar; valores compartilhados como `common` ou `organizations` são recusados, pois aceitariam outros locatários.
3. Opcional: informe o **Domínio dos convites (opcional)**, por exemplo `example.com`: os membros convidados com um endereço deste domínio entram diretamente com a Microsoft. Informe apenas um domínio que pertença ao seu locatário, ou deixe vazio.
4. Deixe **Oferecer este provedor na página de login** marcado.
5. Clique em **Salvar** e verifique o segundo fator se solicitado. "Provedor salvo." confirma; um botão **Microsoft** agora aparece na página de login.

O Milvago deriva cada endereço da Microsoft a partir do ID do locatário e verifica se cada login foi realmente emitido por esse locatário.


## Alterar, suspender ou remover um provedor

- **Renovar o segredo**: informe o novo valor em **Segredo do cliente**, e clique em **Salvar**. Alterar o ID do cliente sempre exige o segredo dele.
- **Suspender**: desmarque **Oferecer este provedor na página de login**, e clique em **Salvar**. A configuração é mantida.
- **Remover**: clique em **Remover o provedor**, leia o aviso "As contas que entram por este provedor não poderão mais usá-lo para entrar.", e clique em **Confirmar a remoção**. "Provedor removido." confirma.
- **Provedor criado fora do console**: se o provedor de identidade já contém um provedor com o mesmo nome que não foi configurado aqui (outro tipo, um fluxo pós-login ou mapeadores), **Salvar** é recusado em vez de assumi-lo. Clique em **Remover o provedor** e salve novamente.

Todo salvamento e remoção fica registrado no [log de auditoria](../administration/audit.md) (`sso.update`, `sso.remove`).

## Verificar

1. Convide uma conta do domínio ou tenant da empresa (Administração > Membros), sem que ela ainda tenha feito login.
2. Faça login com essa conta pelo botão do provedor: o login deve ter sucesso, e seu tipo de membro muda para **SSO** em Membros.
3. Tente um login com uma conta Google ou Microsoft **fora** do domínio ou tenant: deve ser recusado.

Essas verificações validam a configuração do provedor; elas não substituem um teste das políticas de MFA do provedor, que continuam sob responsabilidade dele.
