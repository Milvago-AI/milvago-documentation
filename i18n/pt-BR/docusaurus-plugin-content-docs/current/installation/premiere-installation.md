---
sidebar_position: 3
title: Primeira instalação
---

# Primeira instalação

Como uma instância do Milvago totalmente nova, sem nenhum administrador, é colocada em funcionamento? Esta página descreve o assistente que cria a primeira conta e configura sua segurança, a organização, o servidor de e-mail e os valores padrão de privacidade.

## Acessar a tela

Uma instância iniciada **sem** a variável `BOOTSTRAP_EMAIL` não tem administrador: em vez da tela de login, o console exibe diretamente o assistente **"Instalar esta instância do Milvago"**. Não há nada a clicar para abri-lo — ele substitui a página de entrada enquanto nenhuma conta existir.


## O que protege o assistente

O assistente permanece fechado enquanto o servidor não dispuser de duas coisas:

- **`MILVAGO_SETUP_TOKEN`** — um token de uso único com no mínimo 32 caracteres, fornecido por variável de ambiente ou por um Secret do Kubernetes. O servidor guarda apenas sua impressão SHA-256; ele não aparece em nenhum log.
- **Uma conta de serviço de administração da identidade** — `OIDC_ADMIN_CLIENT_ID` e `OIDC_ADMIN_CLIENT_SECRET`.

Para instalar com Docker, consulte [Instalação Docker](docker.md).

Sem um ou outro, o assistente exibe **"O assistente de instalação está fechado"** — "Forneça ao servidor o MILVAGO_SETUP_TOKEN e a conta de administração da identidade (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET) e recarregue esta página." Veja [Variáveis de ambiente](variables-environnement.md).

Nenhuma configuração é salva antes da última etapa. Uma licença informada é enviada ao servidor para validação na etapa 2 e verificada novamente na conclusão. A senha permanece na memória da página até o final; nenhum desses valores é gravado no armazenamento do navegador.

## As nove etapas

### 1. Token de instalação

Campo **Token de instalação** — "O valor de MILVAGO_SETUP_TOKEN fornecido ao servidor. Ele não aparece em nenhum log." Depois de validado, uma sessão de instalação é aberta.

![Assistente de instalação, etapa 1](/img/docs/pt-BR/installmilvago/step1_pr.png)

### 2. Licença

**Enterprise**: "A licença é fornecida pela Milvago AI. Compartilhe o identificador da instância abaixo ao solicitá-la e depois cole-a aqui para continuar." O assistente mostra o **identificador da instância** da futura instalação, com um botão para copiá-lo, e depois um campo para colar o texto da licença recebida. A licença é obrigatória para continuar.

**Community**: três opções, "Continuar sem licença" selecionada por padrão:

O assistente também informa: “A licença gratuita remove apenas os limites da Community. Ela não desbloqueia a Enterprise, que exige a edição Enterprise e uma licença separada.”

- **Tenho uma licença** — um campo para colar o texto da licença.
- **Solicitar uma licença gratuita** — um endereço de e-mail a digitar, depois **Enviar a solicitação**; "Solicitação enviada. Verifique a caixa de entrada de {`endereço`} e cole abaixo a licença recebida.", seguido do mesmo campo para colá-la.
- **Continuar sem licença** — o aviso "Sem licença": "Limitado a 5 dispositivos, uma única conta de administrador, sem gerenciamento de funções, sem diretório LDAP e sem SSO. Uma licença pode ser solicitada mais tarde em [Administração > Configurações > Licença](../administration/parametres.md#licença)."

Escolher "Tenho uma licença" sem colar texto, ou permanecer na Enterprise sem licença, bloqueia o avanço com "Informe uma licença para continuar." Se uma licença for informada, "Próximo" faz o servidor verificar a assinatura, a instância e a edição. Uma licença inválida mostra um erro nesta etapa e mantém o assistente nela. O servidor verifica a licença novamente antes de criar a conta. O Resumo lista essa escolha primeiro: "Licença informada" ou "Nenhuma".

![Assistente de instalação, etapa 2](/img/docs/pt-BR/installmilvago/step2_pr.png)

### 3. Idioma

**Idioma padrão da instância**: escolhê-lo muda imediatamente o idioma do assistente.

![Assistente de instalação, etapa 3](/img/docs/pt-BR/installmilvago/step3_pr.png)

### 4. Conta de administrador

"Esta conta se torna o proprietário da organização no primeiro login." Endereço de e-mail, nome, sobrenome, depois a senha digitada duas vezes — "No mínimo 12 caracteres, diferente do endereço de e-mail. O provedor de identidade pode exigir mais." A política de senhas do provedor de identidade tem a palavra final.

![Assistente de instalação, etapa 4](/img/docs/pt-BR/installmilvago/step4_pr.png)

### 5. Segurança

Duas opções:

- **Inscrever um aplicativo de autenticação no primeiro login** — marcada por padrão. "Após a configuração, esta conta deve usar o aplicativo autenticador em cada acesso."
- **Exigir autenticação de duplo fator de todos os membros** — "Os membros que fazem login com senha precisam de um segundo fator. As identidades de um provedor de identidade externo dependem do seu próprio."

Depois de configurar o aplicativo autenticador, o segundo fator é obrigatório nos próximos acessos dessa conta. Após a senha, o mesmo login solicita o código do aplicativo sem pedir a senha novamente. A segunda opção estende essa exigência a todos os membros.

![Assistente de instalação, etapa 5](/img/docs/pt-BR/installmilvago/step5_pr.png)

### 6. Organização e acesso

**Nome da organização**, depois **URL pública do Milvago** — o endereço usado pelo login do console, Keycloak, agentes e extensão do navegador. Ele é preenchido com o endereço da página atual. Informe o endereço HTTPS do proxy frontal se houver um; HTTP é aceito para testes em uma rede local confiável.

![Assistente de instalação, etapa 6](/img/docs/pt-BR/installmilvago/step6_pr.png)

### 7. Servidor de e-mail

Uma etapa opcional — "Usado para enviar os convites dos membros. Também pode ser configurado mais tarde no provedor de identidade." Ao marcar **Configurar um servidor de e-mail agora**: host, porta, segurança da conexão (STARTTLS, TLS ou nenhuma), endereço e nome do remetente, depois usuário e senha opcionais. O botão **Enviar um e-mail de teste** mostra o endereço do administrador informado na etapa 4 e envia uma mensagem real para ele com essas configurações. Se o servidor de e-mail responder `550 5.1.1`, verifique se o endereço existe e corrija-o na etapa 4. Credenciais nunca são aceitas em uma conexão remota não criptografada. Essas configurações se tornam o servidor SMTP do provedor de identidade, usado depois para os convites.

![Assistente de instalação, etapa 7](/img/docs/pt-BR/installmilvago/step7_pr.png)

### 8. Privacidade

As mesmas configurações de Administração > Privacidade, exceto **Atributo OIDC da equipe**, configurado depois que houver um provedor de identidade — "Valores padrão desta organização. Continuam editáveis em Privacidade."

![Assistente de instalação, etapa 8](/img/docs/pt-BR/installmilvago/step8_pr.png)

### 9. Resumo

"Revise suas escolhas. A conta de administrador é criada ao finalizar; em seguida, você fará login com ela." O botão final, **Criar o administrador e finalizar**, dispara a criação. Enquanto a conta é criada, o assistente exibe um indicador de progresso e desativa os controles até a abertura da página de login.


## O que acontece no final

A conta é criada no provedor de identidade com a senha escolhida, e-mail marcado como verificado; as configurações de organização, segurança, servidor de e-mail e privacidade são gravadas; o navegador é então redirecionado para o login. Se um segundo fator foi escolhido na etapa Segurança — inscrição do aplicativo de autenticação, ou autenticação multifator exigida para todos os membros —, senha e inscrição TOTP acontecem em um único login. A conta se torna proprietária da organização nesse primeiro login — não antes.

Um endereço de e-mail já existente no provedor de identidade é recusado: o assistente nunca assume uma conta existente.

## Sessão, limites e fechamento definitivo

A sessão de instalação dura 30 minutos; passado esse prazo, é preciso digitar o token novamente. Adivinhar o token é limitado por endereço. Assim que existe um administrador, **todas** as rotas do assistente respondem 404: o token se torna inútil, e recomenda-se removê-lo do ambiente ou do Secret.

## Modo automático (`BOOTSTRAP_EMAIL`)

Se `BOOTSTRAP_EMAIL` estiver definida na inicialização, o assistente nunca aparece: a conta com esse endereço, pré-criada no provedor de identidade, se torna proprietária da organização no primeiro login. Esse modo continua útil para demonstrações e testes automatizados. Veja [Variáveis de ambiente](variables-environnement.md).

Os dois modos existem tanto no Milvago Community quanto no Milvago Enterprise.
