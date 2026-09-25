---
sidebar_position: 2
title: Configuração do agente
---

# Configuração do agente (Windows / Linux)

O agente configura-se por um arquivo **TOML**, `milvago.toml`, escrito pelo instalador e editado pelo administrador. Ele é **regulado em alguns segundos, sem reiniciar o serviço**: o arquivo é relido no máximo uma vez a cada 5 segundos.

[IMAGEAMETTREICI 01]

## Alterar a configuração

1. Abra com uma conta administradora o caminho da sua edição e sistema operacional na tabela abaixo.
2. Edite o arquivo `milvago.toml` nesse caminho, sem alterar suas permissões de acesso.
3. Salve o arquivo; não reinicie o serviço.
4. Aguarde no máximo cinco segundos e verifique `agent.log` no diretório vizinho `logs` para confirmar a aplicação ou ler o erro.

## Onde se encontra o arquivo

No Windows, o arquivo vive no diretório `config`, **ao lado do armazenamento criptografado, jamais dentro**. No Linux, ele agora vive diretamente sob `/etc`, separado do armazenamento criptografado e dos logs, que permanecem sob `/var/lib`:

| | Windows | Linux (instalação empacotada) |
| --- | --- | --- |
| Community | `%ProgramData%\Milvago\Browser\config\milvago.toml` | `/etc/milvago-browser/milvago.toml` |
| Enterprise | `%ProgramData%\Milvago\Commercial\config\milvago.toml` | `/etc/milvago-commercial/milvago.toml` |

As regras de acesso fazem parte do mecanismo. No Windows, o diretório `config` pertence aos **Administradores e SYSTEM**, e a conta de serviço tem apenas a **leitura** — suas pastas ProgramData agora nomeiam o SID próprio do serviço (`NT SERVICE\Milvago Agent Logger Community` / `NT SERVICE\Milvago Agent Logger`), em vez da conta NetworkService como um todo, compartilhada com outros serviços. No Linux, o arquivo pertence ao **root** (modo `0640`, grupo `milvago-agent` em leitura). O agente pode escrever seu próprio estado criptografado; ele não deve poder escolher as autoridades de certificação em que confia, nem abrir sua escuta para a rede. É o arquivo que absorve essa fronteira.

Uma reinstalação com `install-browser.sh`, ou uma atualização do pacote RPM, move uma vez o arquivo existente do local anterior (`/var/lib/milvago-browser/config/milvago.toml` ou `/var/lib/milvago-commercial/config/milvago.toml`) para o novo — somente se for um arquivo regular, jamais por meio de um link simbólico. Depois dessa movimentação, o local anterior deixa de ser lido.

## O arquivo tal como o instalador o cria

```toml
# Milvago agent configuration. Edited by administrators; the service can only read it.
# Applies within a few seconds, no restart needed.

[queue]
# Main offline event queue only, not total agent memory or disk usage.
# max_events: 1..100000; max_size_mb: 1..128 MiB.
max_events = 10000
max_size_mb = 8

[logging]
# off | error | warn | info | debug. The log is agent.log in the logs directory
# beside this one. It never contains prompt text, response text, file names,
# tokens, credentials or policy content.
level = "info"
# max_file_mb: 1..100 MiB; retained_files: 0..20 archives plus the current file.
max_file_mb = 10
retained_files = 5

[tls]
# HTTPS verification is always on. This only adds one certificate authority to
# the agent's own HTTP client: the server name and the certificate validity are
# still checked, and neither the Windows certificate store nor the browser is
# affected. A declared authority that cannot be read is an error that blocks the
# call; it never falls back to an unverified connection.
allow_private_ca = false
ca_file = ""
# Also trust the root store of the operating system (for instance a TLS-inspection
# authority your organization deploys by policy). Off unless you decide it.
system_store = false

[network]
# One explicit HTTP(S) proxy, "http://host:port", without credentials. Empty means
# direct connections; environment proxy variables are never used.
proxy = ""
bind_address = "127.0.0.1"
allowed_peers = []
```

O arquivo gerado pelo instalador provém do próprio agente: o que o operador encontra no disco e o que o agente aplica são a mesma coisa, não dois textos mantidos à mão.

## `[queue]` — fila de eventos off-line

| Parâmetro | Padrão | Limite | O que faz |
| --- | --- | --- | --- |
| `max_events` | `10000` | 1 a 100000 | número máximo de eventos na fila off-line principal |
| `max_size_mb` | `8` | 1 a 128 MiB | tamanho serializado máximo dessa fila |

Essa fila principal reúne eventos legados e de Shadow AI. Ela não limita toda a memória nem todo o armazenamento do agente e é distinta do cache de contingência SYSTEM do navegador, que mantém seus próprios limites de 1000 eventos ou lotes de saúde e 8 MiB.

Quando um dos limites é atingido, o agente recusa o novo evento e não o confirma. Reduzir um limite não remove os eventos já na fila: a entrega continua até que a fila volte a ficar abaixo do novo limite.

Para elevar a fila a 20000 eventos e 16 MiB, e manter logs de 20 MiB com 10 arquivos, una estes valores às seções existentes; não duplique nem `[queue]` nem `[logging]`:

```toml
[queue]
max_events = 20000
max_size_mb = 16

[logging]
# Mantenha seu nível atual se ele for diferente.
level = "info"
max_file_mb = 20
retained_files = 10
```

Uma instalação atualizada conserva o arquivo existente. Depois da atualização, adicione manualmente a seção `[queue]` ao arquivo `milvago.toml` se ela não existir; uma seção `[queue]` ausente ou um de seus campos ausente usa o padrão. As alterações entram em vigor sem reiniciar, quando o arquivo é relido no máximo a cada 5 segundos.

## `[logging]` — verbosidade e retenção

| Parâmetro | Padrão | Fronteira | O que faz |
| --- | --- | --- | --- |
| `level` | `"info"` | `off`, `error`, `warn`, `info`, `debug` | verbosidade do registro `agent.log` no diretório `logs` vizinho. O registro **nunca contém** texto de prompt, de resposta, nome de arquivo, token, credencial nem conteúdo de política |
| `max_file_mb` | `10` | 1 a 100 MiB | tamanho máximo de um arquivo de registro antes da rotação |
| `retained_files` | `5` | 0 a 20 arquivos | número de arquivos arquivados conservados, além do arquivo atual `agent.log` |

Os valores impossíveis (nível desconhecido, tamanho fora das fronteiras, retenção > 20) não são nem corrigidos nem ignorados: o arquivo inteiro volta aos padrões documentados, com a razão escrita no registro.

## `[tls]` — autoridade de certificação privada

| Parâmetro | Padrão | O que faz |
| --- | --- | --- |
| `allow_private_ca` | `false` | adiciona **uma** autoridade de certificação privada ao cliente HTTP do agente, para um servidor Milvago servido atrás de uma PKI interna |
| `ca_file` | `""` | caminho do arquivo PEM **relativo ao diretório que contém `milvago.toml`** (por exemplo `"certs/ca.pem"`), exigido se `allow_private_ca = true` |
| `system_store` | `false` | também confia nas autoridades do armazenamento de certificados raiz do sistema operacional, além das autoridades públicas |

**`allow_private_ca` nunca desativa a verificação.** O nome do servidor e a validade do certificado permanecem verificados, o armazenamento de certificados do Windows não é tocado, a confiança do navegador também não. Uma autoridade declarada mas ilegível é um **erro que bloqueia a chamada** — jamais uma queda silenciosa para uma conexão não verificada. Um arquivo presente no disco mas não solicitado (`allow_private_ca = false`) é ignorado.

`system_store` amplia a confiança de outra forma: ativado, o agente também confia em cada autoridade que os administradores da máquina instalaram no armazenamento do sistema — por exemplo uma autoridade de inspeção TLS implantada por política de grupo — além das autoridades públicas. Permanece **desativado por padrão**: ampliar a confiança para o que um administrador da máquina instalou cabe somente a ele decidir. A verificação em si nunca é desativada, seja qual for esse ajuste.

## `[network]` — proxy de saída e escuta local

| Parâmetro | Padrão | O que faz |
| --- | --- | --- |
| `proxy` | `""` | um único endereço de proxy HTTP(S) explícito, escrito `http://host:porta` (ou `https://`), sem credenciais, caminho ou consulta |
| `bind_address` | `"127.0.0.1"` | a interface em que os próprios ouvintes do agente aceitam conexões: o servidor de extensão local (que serve os pacotes assinados da extensão de navegador aos navegadores desta máquina) e, no Enterprise, o receptor de telemetria nativa (OTLP) do coletor |
| `allowed_peers` | `[]` | faixas CIDR (IPv4 ou IPv6, no máximo 50) dos pares remotos aceitos quando `bind_address = "0.0.0.0"` |

Vazio, o agente se conecta diretamente: as variáveis de ambiente de proxy (`HTTPS_PROXY` e as demais) **nunca** são usadas — a conta de serviço do Windows não as recebe de qualquer forma. Um valor de `proxy` inválido (um esquema diferente de `http`/`https`, credenciais na URL, host ausente, caminho ou consulta após a porta) **bloqueia as chamadas de rede** em vez de recair para uma conexão direta; o motivo é escrito em `agent.log`. Como o restante do arquivo, esse ajuste se aplica em alguns segundos, sem reinício.

Apenas dois valores de `bind_address` são aceitos: `127.0.0.1` (somente esta máquina, recomendado) ou `0.0.0.0` (todas as interfaces). Qualquer outro valor, ou uma lista `allowed_peers` inválida, mantém os ouvintes locais e o motivo é escrito em `agent.log`. Alterar `bind_address` exige reiniciar o serviço do agente.

O loopback é sempre aceito; com uma lista `allowed_peers` vazia, nenhum par remoto é aceito mesmo com `0.0.0.0` aberto, e `"0.0.0.0/0"` aceita qualquer máquina IPv4 que consiga alcançar esta.

:::warning

Abrir a escuta expõe essas portas à rede: uma regra de firewall deve ser aberta pelo administrador (Windows Defender Firewall / nftables), e raramente é necessário — por exemplo para contêineres ou WSL na mesma máquina, com `["172.16.0.0/12"]`.

:::

Limite importante: o receptor OTLP atribui cada lote de telemetria à conta do sistema operacional proprietária da conexão local; um remetente remoto não tem processo local, portanto continua recusado mesmo com seu endereço permitido. Abrir a escuta, portanto, só muda quem pode alcançar o servidor de extensão.

O filtro de modelos (Enterprise) nunca segue esse ajuste: seu confinamento exige que ele permaneça local.

## O que o arquivo recusa, e por quê

Cada regra de validação fecha uma via de desvio:

- **Caminho relativo apenas**: um caminho absoluto, um `..`, um link simbólico ou uma junção permitiriam a quem escreve o valor fazer o agente ler um arquivo que ele não deveria ler. O arquivo é além disso **regular** (não um link), limitado a 256 KiB (uma autoridade são alguns blocos PEM), e o caminho resolvido deve permanecer **dentro do diretório que contém `milvago.toml`** — uma junção colocada mais acima na árvore é recusada.
- **Campos desconhecidos recusados** (`deny_unknown_fields`): um erro de digitação em um nome de parâmetro não se torna um valor ignorado.
- **Somente leitura, nunca escrita**: um arquivo ausente ou danificado resolve para os padrões documentados, jamais para uma tentativa de escrita que a conta de serviço não tem o direito de fazer. Uma configuração quebrada pode portanto **abaixar a verbosidade, jamais afrouxar o TLS**.
- **O TLS de uma instalação antiga não é reinterpretado**: a verbosidade de uma instalação anterior (`state\milvago.conf`, chave `log_level`) sobrevive à atualização, mas esse arquivo jamais portou uma seção TLS e nunca pode se tornar um ajuste de confiança.

[IMAGEAMETTREICI 02]

## Auto-atualização sob uma ferramenta de implantação (Windows)

Quando uma ferramenta de implantação (Intune, SCCM/ConfigMgr, instalação de software por GPO) já possui as versões do agente, a auto-atualização do próprio agente se desliga para não entrar em conflito com ela — do contrário, essa ferramenta reinstalaria o pacote antigo depois de cada atualização automática. Qualquer um dos dois valores de registro a seguir basta para desligá-la; ambos ficam sob `HKLM`, editáveis somente por um administrador:

| Local | Valor | Origem |
| --- | --- | --- |
| `HKLM\SOFTWARE\Policies\Milvago` | `DisableSelfUpdate` (DWORD) = `1` | política GPO / Intune |
| `HKLM\SOFTWARE\Milvago\community` (Community) ou `HKLM\SOFTWARE\Milvago\commercial` (Enterprise) | `SelfUpdate` (DWORD) = `0` | instalador |

O aplicador de atualização privilegiado também se recusa a agir enquanto um dos dois valores estiver ativo. O agente registra uma única linha em `agent.log` no momento em que a auto-atualização se desliga.

Esse aplicador é o serviço do Windows **Milvago Update Applier** (**Milvago Update Applier Community** na Community). Ele inicia com o equipamento e permanece ativo o tempo todo, mesmo sem atualização em andamento: assim reserva, desde a inicialização, os canais locais pelos quais o agente e o navegador o acessam. Não o desative; ele não faz nada enquanto o agente não pedir que aplique uma versão assinada.

É então a ferramenta de implantação que passa a possuir as versões: detecte o produto pelo seu **UpgradeCode** ou pelo arquivo `installation.json`, nunca pelo **ProductCode**, que muda a cada nova versão.

## Auto-atualização (Linux, instalação por arquivo)

Para uma instalação feita com o arquivo compactado e `install-browser.sh` — não o RPM —, a auto-atualização do agente é aplicada por um **aplicador de atualização com privilégios de root** (`<serviço>-updater.service`), iniciado por `<serviço>-updater.path` assim que o agente registra um pedido de atualização. Esse aplicador confia apenas em `/etc/<nome>/release.json` — escrito pelo instalador a partir do arquivo de provisionamento (chave pública de atualização e origem do servidor). O próprio agente permanece sem privilégios: não pode substituir seu próprio binário nem alterar essa âncora.

Uma instalação feita com uma versão de `install-browser.sh` anterior a esta mudança não se atualiza sozinha: reinstale uma vez com o novo script para criar essas unidades systemd. As instalações feitas pelo pacote **RPM** continuam sendo atualizadas pelo gerenciador de pacotes, sem alteração.

## Deriva das políticas do navegador (Windows)

A cada 60 segundos, o agente verifica se as políticas de máquina ainda forçam a instalação de sua extensão:

| Família | Registro |
| --- | --- |
| Chromium (Chrome, Edge, Brave, Chromium, Vivaldi, Arc) | `HKLM\SOFTWARE\Policies\<fornecedor>\ExtensionInstallForcelist` |
| Firefox | `HKLM\SOFTWARE\Policies\Mozilla\Firefox`, valor `ExtensionSettings` |

Se uma política de grupo da organização que gerencia essas listas as substituir, as entradas escritas na instalação desaparecem e os navegadores desinstalam a extensão. O agente registra um único erro nomeando os navegadores afetados a cada mudança desse conjunto, nunca a cada verificação; ele nunca reescreve a política por conta própria.

**Correção**: adicione as entradas da Milvago à própria política de grupo da organização que gerencia essas listas. O identificador da extensão e a URL de atualização escritos pelo instalador podem ser lidos nessas mesmas chaves de registro em uma máquina já instalada.

## Imagens clonadas (VDI, sysprep, clone de máquina virtual) — Windows e Linux

O agente vincula sua identidade à máquina: no Windows, o `MachineGuid` e o SID da conta de máquina; no Linux, `/etc/machine-id`.

Quando uma cópia de um disco já instalado inicia em outra máquina, essa cópia arquiva a identidade que carregava e se registra novamente como um novo dispositivo, com seu próprio nome de máquina, usando a chave de implantação da organização mantida em seu estado criptografado (sujeita à regra habitual de aprovação de inscrição). A máquina original mantém sua identidade.

Se nenhuma chave de implantação utilizável estiver disponível — por exemplo, um dispositivo inscrito antes desta versão e nunca reparado com o pacote da organização, ou uma chave substituída desde então (rotação) — a cópia **abandona sua identidade** e permanece não registrada até que o pacote da organização seja reinstalado nela: duas máquinas nunca compartilham uma identidade.

Quais ferramentas de clonagem realmente alteram esses identificadores ainda está em medição; o caminho suportado é selar a imagem como a plataforma documenta: `sysprep /generalize` no Windows, esvaziando `/etc/machine-id` no Linux.

## Em resumo

| | Windows | Linux |
| --- | --- | --- |
| Serviço | `Milvago Agent Logger Community` / `… Enterprise`, conta NetworkService, SID próprio do serviço nas pastas ProgramData | `systemd` de sistema, usuário `milvago-agent` |
| Estado criptografado | `config` e `logs` são **irmãos** do diretório `state` | `logs` continua **filho** do diretório de estado (`/var/lib`); `config` fica agora separado, sob `/etc` |
| Arquivo | `config\milvago.toml`, Administradores + SYSTEM em escrita, serviço em leitura | `milvago.toml`, root em escrita, grupo `milvago-agent` em leitura (modo `0640`) |

Um `sync` pontual em linha de comando honra `[tls]` exatamente como o serviço: a mesma configuração se aplica a cada caminho que fala ao servidor.
