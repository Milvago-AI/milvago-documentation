---
sidebar_position: 3
title: Primeira instalação
---

# Primeira instalação

Como uma instância do Milvago totalmente nova, sem nenhum administrador, é colocada em funcionamento? Esta página descreve o assistente que cria a primeira conta e configura sua segurança, a organização, o servidor de e-mail e os valores padrão de privacidade.

## Acessar a tela

Uma instância iniciada **sem** a variável `BOOTSTRAP_EMAIL` não tem administrador: em vez da tela de login, o console exibe diretamente o assistente **"Instalar esta instância do Milvago"**. Não há nada a clicar para abri-lo — ele substitui a página de entrada enquanto nenhuma conta existir.

[IMAGEAMETTREICI 01]

## O que protege o assistente

O assistente permanece fechado enquanto o servidor não dispuser de duas coisas:

- **`MILVAGO_SETUP_TOKEN`** — um token de uso único com no mínimo 32 caracteres, fornecido por variável de ambiente ou por um Secret do Kubernetes. O servidor guarda apenas sua impressão SHA-256; ele não aparece em nenhum log. O script Community `scripts/local-init.mjs` gera um automaticamente em `.env`.
- **Uma conta de serviço de administração da identidade** — `OIDC_ADMIN_CLIENT_ID` e `OIDC_ADMIN_CLIENT_SECRET`.

Sem um ou outro, o assistente exibe **"O assistente de instalação está fechado"** — "Forneça ao servidor o MILVAGO_SETUP_TOKEN e a conta de administração da identidade (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET) e recarregue esta página." Veja [Variáveis de ambiente](variables-environnement.md).

Nada é salvo antes da última etapa: a senha e a licença informada permanecem na memória da página até seu envio, uma única vez, na última etapa, e nunca são gravadas em um armazenamento do navegador.

## As nove etapas

### 1. Token de instalação

Campo **Token de instalação** — "O valor de MILVAGO_SETUP_TOKEN fornecido ao servidor. Ele não aparece em nenhum log." Depois de validado, uma sessão de instalação é aberta.

### 2. Licença

**Enterprise**: "A licença é fornecida pela Milvago AI. Compartilhe o identificador da instância abaixo ao solicitá-la e depois cole-a aqui para continuar." O assistente mostra o **identificador da instância** da futura instalação, com um botão para copiá-lo, e depois um campo para colar o texto da licença recebida. A licença é obrigatória para continuar.

**Community**: três opções, "Continuar sem licença" selecionada por padrão:

- **Tenho uma licença** — um campo para colar o texto da licença.
- **Solicitar uma licença gratuita** — um endereço de e-mail a digitar, depois **Enviar a solicitação**; "Solicitação enviada. Verifique a caixa de entrada de {`endereço`} e cole abaixo a licença recebida.", seguido do mesmo campo para colá-la.
- **Continuar sem licença** — o aviso "Sem licença": "Limitado a 5 dispositivos, uma única conta de administrador, sem gerenciamento de funções, sem diretório LDAP e sem SSO. Uma licença pode ser solicitada mais tarde em [Administração > Configurações > Licença](../administration/parametres.md#licença)."

Escolher "Tenho uma licença" sem colar texto, ou permanecer na Enterprise sem colar uma, bloqueia a passagem para a próxima etapa com "Informe uma licença para continuar." O texto colado só é verificado pelo servidor ao final do assistente, no momento de criar a conta: uma licença inválida, ou uma licença Community oferecida a uma instância Enterprise, falha então com o erro do servidor, exibido no Resumo — não nesta etapa. O Resumo lista essa escolha em primeiro lugar: "Licença informada" ou "Nenhuma".

[IMAGEAMETTREICI 02]

### 3. Idioma

**Idioma padrão da instância**: escolhê-lo muda imediatamente o idioma do assistente.

### 4. Conta de administrador

"Esta conta se torna o proprietário da organização no primeiro login." Endereço de e-mail, nome, sobrenome, depois a senha digitada duas vezes — "No mínimo 12 caracteres, diferente do endereço de e-mail. O provedor de identidade pode exigir mais." A política de senhas do provedor de identidade tem a palavra final.

[IMAGEAMETTREICI 03]

### 5. Segurança

Duas opções:

- **Inscrever um aplicativo de autenticação no primeiro login** — marcada por padrão. "Recomendado: esta conta tem todas as permissões."
- **Exigir autenticação de duplo fator de todos os membros** — "Os membros que fazem login com senha precisam de um segundo fator. As identidades de um provedor de identidade externo dependem do seu próprio."

### 6. Organização e acesso

**Nome da organização**, depois **URL HTTPS pública do agente** — "Endereço usado pelos agentes e pela extensão do navegador." — pré-preenchida com o endereço atual. Uma URL HTTP só é aceita em um loopback explícito.

### 7. Servidor de e-mail

Uma etapa opcional — "Usado para enviar os convites dos membros. Também pode ser configurado mais tarde no provedor de identidade." Ao marcar **Configurar um servidor de e-mail agora**: host, porta, segurança da conexão (STARTTLS, TLS ou nenhuma), endereço e nome do remetente, depois usuário e senha opcionais. O botão **Enviar um e-mail de teste** envia uma mensagem real para o endereço do administrador com essas configurações. Credenciais nunca são aceitas em uma conexão remota não criptografada. Essas configurações se tornam o servidor SMTP do provedor de identidade, usado depois para os convites.

### 8. Privacidade

As mesmas configurações de Administração > Privacidade, exceto **Atributo OIDC da equipe**, configurado depois que houver um provedor de identidade — "Valores padrão desta organização. Continuam editáveis em Privacidade."

### 9. Resumo

"Revise suas escolhas. A conta de administrador é criada ao finalizar; em seguida, você fará login com ela." O botão final, **Criar o administrador e finalizar**, dispara a criação.

[IMAGEAMETTREICI 04]

## O que acontece no final

A conta é criada no provedor de identidade com a senha escolhida, e-mail marcado como verificado; as configurações de organização, segurança, servidor de e-mail e privacidade são gravadas; o navegador é então redirecionado para o login. Se um segundo fator foi escolhido na etapa Segurança — inscrição do aplicativo de autenticação, ou autenticação multifator exigida para todos os membros —, senha e inscrição TOTP acontecem em um único login. A conta se torna proprietária da organização nesse primeiro login — não antes.

Um endereço de e-mail já existente no provedor de identidade é recusado: o assistente nunca assume uma conta existente.

## Sessão, limites e fechamento definitivo

A sessão de instalação dura 30 minutos; passado esse prazo, é preciso digitar o token novamente. Adivinhar o token é limitado por endereço. Assim que existe um administrador, **todas** as rotas do assistente respondem 404: o token se torna inútil, e recomenda-se removê-lo do ambiente ou do Secret.

## Modo automático (`BOOTSTRAP_EMAIL`)

Se `BOOTSTRAP_EMAIL` estiver definida na inicialização, o assistente nunca aparece: a conta com esse endereço, pré-criada no provedor de identidade, se torna proprietária da organização no primeiro login. Esse modo continua útil para demonstrações e testes automatizados. Veja [Variáveis de ambiente](variables-environnement.md).

Os dois modos existem tanto no Milvago Community quanto no Milvago Enterprise.
