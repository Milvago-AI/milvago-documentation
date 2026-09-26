---
sidebar_position: 7
title: Configurações
---

# Configurações

## Acessar a tela

Clique em **Administração** > **Configurações**. As seções dependem das permissões.

1. Abra **Diretório LDAP** na navegação vertical.
2. Preencha os parâmetros de conexão e atributos.
3. Clique em **Testar a conexão** e corrija qualquer etapa indicada como falha.
4. Após um teste bem-sucedido, clique em **Salvar o diretório**.
5. Verifique se o status confirma a conexão salva.

A tela Configurações responde à pergunta "**como esta organização e esta instância são ajustadas**". A linha dela sob o título o anuncia: "Configurações da organização e da instância." Uma navegação vertical divide as seções, e **cada seção só aparece com a permissão que a governa**: o que você não pode ajustar não é exibido.

[IMAGEAMETTREICI 01]

## Organização

Sempre presente. Quatro campos, salvos juntos:

- **Nome da organização** — modificável pelo proprietário da organização.
- **URL HTTPS pública do agente** — "URL anunciada aos agentes e à extensão do navegador (inscrição, instaladores, update.xml). Alterá-la após a implantação não afeta os dispositivos já inscritos: eles mantêm a URL e precisam ser reinscritos para mudar." Apenas o proprietário da organização raiz pode alterá-la; para os demais, o campo porta o aviso "Apenas o proprietário da organização raiz pode alterar esta URL." A confirmação dela condiciona o download dos instaladores.
- **Idioma padrão da instância** — "Aplica-se à página de login alcançada sem idioma. Os usuários sem preferência pessoal seguem o próprio navegador e depois o inglês." Apenas o proprietário raiz o altera.
- **Retenção de eventos (dias)** — de 1 a 3650; "O servidor valida e aplica o período de retenção." Encurtar essa duração exige um segundo fator verificado há instantes e nunca está disponível para uma chave de API: a próxima purga horária apaga imediatamente o histórico que ficar mais antigo que a nova duração, incluindo os textos retidos. Alongá-la permanece inalterado.

Um banner "Concluir a configuração" aparece enquanto a URL pública não estiver confirmada em uma instância instalada em modo automático (`BOOTSTRAP_EMAIL`) — o assistente de [primeira instalação](../installation/premiere-installation.md) define esses valores diretamente e nunca deixa esse banner para trás. Ele abre um assistente em duas etapas: idioma padrão da instância, depois nome da organização e URL HTTPS pública. O mesmo banner o lembra de outro modo: "Os agentes e a extensão do navegador se conectarão a esta URL. Confirme-a em Administração antes de implantar."

## Licença

Sempre presente para quem puder abrir Configurações: não é uma permissão que a governa, e sim o papel de proprietário da instância que autoriza a alterá-la. Sua descrição na tela: "Status da licença desta instância."

Na Community, o painel também informa: “A licença gratuita remove apenas os limites da Community. Ela não desbloqueia a Enterprise, que exige a edição Enterprise e uma licença separada.”

- **Status** — selo Nenhuma, Válida, Período de carência ou Expirada.
- **Tipo** — Enterprise, Community, ou "—" se a instância nunca recebeu uma licença.
- **Dispositivos máximos** — um número, ou "Ilimitado" se a licença não define nenhum (valor 0).
- **Expira** — visível somente quando a licença tem uma data de expiração (as licenças Enterprise; a licença gratuita Community é perpétua e não exibe nenhuma).
- **Período de carência até** — visível somente durante o período de carência que segue uma expiração Enterprise.
- **Identificador da instância** — com o botão **Copiar o identificador**, para repassar à Milvago AI e obter uma licença.

Abaixo dessas informações, o proprietário da instância vê um campo para colar o texto de uma nova licença e o botão **Salvar a licença** — "Licença salva." confirma o salvamento. Para qualquer outro leitor, a tela porta o aviso "Somente o proprietário da instância pode alterar a licença."

Na **Community**, o proprietário da instância também vê, abaixo desse campo, uma área **Solicitar uma licença gratuita**: um endereço de e-mail (pré-preenchido com o seu) e o botão **Enviar a solicitação**; "Solicitação enviada. Verifique a caixa de entrada de {`endereço`} e cole abaixo a licença recebida." confirma o envio. A solicitação vai para a Milvago AI, que responde por e-mail com o texto a colar aqui. Essa licença gratuita é perpétua e remove todos os limites do modo restrito descritos a seguir.

[IMAGEAMETTREICI 02]

### Modo restrito (Community sem licença)

Enquanto nenhuma licença for aceita, uma instância Community funciona em **modo restrito**: no máximo 5 dispositivos (os revogados não contam), a única conta de administrador criada na instalação, nenhum gerenciamento de funções nem de membros — a entrada **Funções** desaparece da navegação de Administração —, nenhum diretório LDAP — a seção **Diretório LDAP** logo abaixo desaparece desta própria página — e nenhum login SSO. Um banner de aviso "Sem licença" aparece então em cada página do console, com um link para abrir as configurações. Inscrever um dispositivo além da cota falha com "Esta instância atingiu seu limite de dispositivos para a licença atual."

### Enterprise: expiração e bloqueio

Na **Enterprise**, a instância nunca funciona sem uma licença válida própria: uma licença Community é recusada ali com "Esta é uma licença Community; esta instância é Enterprise." A licença sempre tem uma data de expiração e um número máximo de dispositivos (0 = ilimitado). Após a expiração, a instância entra em um **período de carência de 10 dias**: um banner "Licença expirando" permanece exibido, o console continua funcionando normalmente. Passado esse prazo, todo o console é substituído pela única tela de licença — "Licença necessária" — "Esta instância não tem uma licença válida. Um proprietário deve informar uma abaixo para continuar." — e os agentes são recusados até que uma nova licença válida seja informada.

### Licença vinculada à instância

Uma licença está vinculada ao identificador desta instância (exibido acima): reinstalar o Milvago em um novo banco de dados muda esse identificador e invalida a licença anterior; é preciso então obter uma nova.

## Diretório LDAP

Presente com a permissão `directory.manage` ("Gerenciar o diretório LDAP") e uma licença fora do modo restrito: em uma instância Community sem licença, esta seção não aparece. Um diretório LDAP próprio da organização, materializado no provedor de identidade: tipo de diretório (Active Directory, e as convenções pré-preenchidas para os demais, editáveis), URL de conexão `ldap://` ou `ldaps://`, DN de conexão, DN de usuários, atributos, filtro, escopo, tempos-limite, paginação. A tela impõe um transporte verificado — LDAPS ou StartTLS — antes de qualquer transmissão de credenciais: "LDAP requires LDAPS or StartTLS", a validação recusa caso contrário.

O botão **Testar a conexão** reproduz as duas etapas ("A conexão e a autenticação funcionaram." ou a etapa em falha); **Salvar o diretório** ativa a conexão LDAP; **Remover o diretório** adverte: "Os usuários deste diretório não poderão mais fazer login." Testar, salvar e remover o diretório exigem cada um um segundo fator verificado há instantes; nenhuma dessas três ações está disponível para uma chave de API.

As contas de diretório são então importadas em [Membros](membres.md).

:::enterprise

Criar, testar, alterar ou excluir um diretório é reservado a um proprietário da organização raiz, para a organização raiz ou, após alternar para ela, para uma organização filha — o login de toda organização consulta cada diretório do provedor de identidade compartilhado. Em uma organização filha, as demais pessoas veem em vez disso o aviso "Somente um proprietário da organização raiz pode configurar um diretório, porque o login de todas as organizações o consulta." ou, quando já há um configurado, "O diretório desta organização é configurado por um proprietário da organização raiz, porque o login de todas as organizações o consulta. Seus usuários são importados em Membros."

:::

## Chave de implantação

Presente com a permissão `installers.manage` ("Gerenciar os instaladores"). Veja [Implantação](deploiement.md), que a descreve em detalhe.

## Registro automático de conectores

:::enterprise

Seção reservada à Enterprise, e ao **proprietário da organização raiz**: a decisão é escrita no provedor de identidade da instância, não no banco do Milvago — o que a tela mostra é o que é realmente aplicado.

Ela regula a maneira como um conector MCP obtém credenciais próprias: "Um conector pede ao provedor de identidade um cliente próprio, para que ninguém precise colar um identificador. Fechado até você abrir, e abrir sempre nomeia os hosts para os quais um login pode voltar."

- **Deixar um conector se registrar sozinho** — fechado por padrão.
- **Hosts autorizados a receber um login** — "Um host por linha, sem esquema, porta ou caminho — claude.ai, ou *.exemplo.com. Um registro é recusado se algum endereço pedido não estiver nesses hosts, de modo que um código nunca pode ser entregue em outro lugar." Um host coringa mantém ao menos dois rótulos depois de `*.` — `*.exemplo.com` é aceito, `*.com` é recusado. Um estado "O registro está aberto a todos os hosts" posto à mão no provedor de identidade é sinalizado como tal, e não pode ser produzido por esta tela.
- **Teto de clientes registrados** — "Um registro que ultrapassasse esse número é recusado. Isso limita a bagunça, não o risco."

O que não se negocia: "Uma pessoa sempre vê uma tela de consentimento antes de um modelo alcançar qualquer coisa, um cliente registrado fica limitado aos direitos declarados dele, e nunca lê mais do que os direitos de quem faz login." Todo cliente público do provedor de identidade deve usar PKCE, conectores registrados incluídos, e o Milvago limita, na inicialização, a duração das conexões longas dos conectores — sete dias sem uso, trinta dias no máximo — sem nunca alongar uma duração já mais curta. Veja [Chaves de API e servidor MCP](../mon-profil/cles-api.md).

:::
