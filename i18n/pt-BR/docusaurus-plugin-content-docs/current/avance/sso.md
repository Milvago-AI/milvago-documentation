---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

Como conectar o Milvago ao login único (SSO) da organização, com Google ou Microsoft Entra ID como provedor de identidade?

O SSO do Milvago é **intermediação de identidade do Keycloak** (*identity brokering*): o provedor externo é configurado no console de administração do Keycloak do realm `milvago`, nunca no console do Milvago. Esta página pressupõe um deployment `compose` local ou de demonstração, com a conta de inicialização `bootstrap-admin` (senha `IDENTITY_ADMIN_PASSWORD` do `.env`) para fazer login no Keycloak.

:::warning Suposição de confiança
A vinculação automática (`idp-auto-link`) não se limita a contas convidadas que nunca fizeram login: qualquer identidade de um provedor federado que apresente o mesmo e-mail se vincula a **qualquer** conta local do Keycloak com esse e-mail — incluindo uma conta já ativa, incluindo a conta de administrador ou proprietário. É por isso que a restrição de domínio ou de tenant, e o **Trust Email** ativado somente depois de definida essa restrição, são vitais: sem elas, um provedor sem restrição permitiria que um terceiro se apropriasse da conta proprietária apenas apresentando seu e-mail. Federe apenas provedores cujo e-mail seja confiável.
:::

## Princípio: vinculação no primeiro login

O Milvago define seu próprio fluxo de primeiro login via um provedor externo, `milvago-v1-first-broker-login`: se nenhuma conta Keycloak compartilha o mesmo e-mail, ele cria uma; se já existe uma conta local do Keycloak com esse e-mail — uma conta do Milvago **convidada** (Administração > Membros) é o uso previsto, mas a vinculação se aplica a **qualquer** conta local com esse e-mail, seja qual for seu estado — ele a vincula automaticamente ao provedor externo. Após essa vinculação, a pessoa sempre faz login através do provedor externo; o tipo de conta exibido em Membros muda para **SSO**.

Consequência direta: **uma pessoa deve ser convidada no Milvago antes do seu primeiro login SSO**. Sem um convite prévio, o login é recusado (`membership_required`), e uma conta SSO convidada não recebe nenhum e-mail de ativação — sua primeira ação é fazer login através do provedor.

As identidades SSO ficam isentas da exigência de duplo fator do Milvago: seu MFA é responsabilidade do provedor (ative-o no Google Workspace ou nas políticas de acesso condicional do Microsoft Entra). Na página de perfil do Milvago, as ações de autoatendimento — alterar senha, e-mail, perfil ou inscrever MFA — permanecem bloqueadas para uma conta SSO: elas são gerenciadas no provedor.

## Preparar o Keycloak

No console de administração do Keycloak (realm `milvago`), abra **Identity providers** no menu à esquerda e, em seguida, **Add provider**. Escolha Google ou OpenID Connect v1.0 conforme o provedor (detalhes abaixo). Cada provedor adicionado exibe uma **Redirect URI** neste formato:

```
https://<host-keycloak>/realms/milvago/broker/<alias>/endpoint
```

Esse é o valor a ser colado na configuração do provedor externo (Google Cloud Console ou Microsoft Entra admin center) — nunca o contrário.

## Google

Fontes oficiais consultadas: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849), documentação do provedor Google do Keycloak.

### 1. Criar as credenciais OAuth no Google

1. No [Google Cloud Console](https://console.cloud.google.com/), abra **APIs & Services > OAuth consent screen** e preencha a tela de consentimento.
2. Abra **APIs & Services > Credentials** e depois **Create Credentials > OAuth client ID**.
3. Selecione o tipo de aplicativo **Web application**.
4. Em **Authorized redirect URIs**, cole a **Redirect URI** exibida pelo Keycloak para esse provedor.
5. Crie o cliente: o Google exibe o **Client ID** e o **Client secret** (o segredo só é mostrado uma vez).

### 2. Adicionar o provedor no Keycloak

Em **Identity providers > Add provider**, escolha **Google** e preencha:

- o **Client ID** e o **Client Secret** obtidos na etapa anterior;
- **Hosted Domain** — o domínio do Google Workspace da empresa. É esse campo que **restringe o acesso aos membros da organização**; sem ele, qualquer conta do Google pode se apresentar ao broker.
- **Trust Email** — ative apenas depois de preencher o domínio: sem a restrição de domínio, confiar no e-mail do Google permitiria que qualquer conta do Google reivindicasse uma conta do Milvago convidada com o mesmo endereço.

## Microsoft Entra ID

Fontes oficiais consultadas: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), documentação do provedor OpenID Connect v1.0 do Keycloak.

### 1. Registrar o aplicativo no Microsoft Entra

1. No [Microsoft Entra admin center](https://entra.microsoft.com), abra **Entra ID > App registrations > New registration**.
2. Dê um nome ao aplicativo.
3. Em **Supported account types**, escolha **Single tenant only — &lt;seu tenant&gt;** — essa opção limita o registro ao tenant da empresa; as demais opções (multitenant, contas pessoais) o abrem para tenants ou contas fora da empresa.
4. Selecione **Register** e anote o **Application (client) ID** exibido na página **Overview**.
5. Abra **Authentication > Add a platform > Web** e cole a **Redirect URI** exibida pelo Keycloak.
6. Abra **Certificates & secrets > Client secrets > New client secret**, adicione uma descrição, escolha uma duração de expiração (no máximo 24 meses — prefira uma duração mais curta e anote o vencimento para renová-lo) e depois **Add**. O **Value** do segredo só é exibido uma vez: guarde-o imediatamente.

### 2. Adicionar o provedor no Keycloak — preferir OpenID Connect v1.0 com o endpoint de descoberta específico do tenant

O provedor social **Microsoft** embutido no Keycloak não oferece nenhum campo que restrinja o login a um tenant específico do Entra: seria preciso depender apenas da restrição definida no lado do Entra (conta de tenant único). Para não depender de uma única trava, prefira um provedor genérico **OpenID Connect v1.0**, com o endpoint de descoberta específico do tenant:

```
https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration
```

**Nunca** `common` ou `organizations` no lugar de `<tenant-id>`: esses aliases são destinados a aplicativos multitenant, seu emissor não é específico do seu tenant, e o Keycloak não consegue então verificar que o token realmente vem do seu tenant — use sempre a URL de descoberta específica do tenant.

Em **Identity providers > Add provider > OpenID Connect v1.0**, importe a configuração a partir dessa URL de descoberta (o Keycloak preenche então Authorization URL, Token URL e os demais endpoints) e informe o **Client ID** e o **Client Secret** obtidos na etapa anterior.

## Verificar

1. Convide uma conta do domínio ou tenant da empresa (Administração > Membros), sem que ela ainda tenha feito login.
2. Faça login com essa conta pelo provedor SSO: o login deve ter sucesso, e seu tipo de membro muda para **SSO** em Membros.
3. Tente um login com uma conta Google ou Microsoft **fora** do domínio ou tenant restrito: o provedor (Google) ou o Keycloak (Microsoft, através do endpoint de descoberta específico do tenant) deve recusá-lo.

Essas verificações validam a configuração do provedor; elas não substituem um teste completo das políticas de MFA do provedor, que continuam sob responsabilidade dele.
