---
sidebar_position: 4
title: Mecanismos de segurança
---

# Mecanismos de segurança

As salvaguardas do Milvago distribuem-se em quatro camadas: **a integridade das políticas**, **o endurecimento local**, **o isolamento no lado do servidor** e **o controle de acessos**. Nenhuma camada depende da confiança em outra.

[IMAGEAMETTREICI 01]

## Políticas assinadas e efêmeras

Tudo o que controla um dispositivo é **assinado no lado do servidor e verificado no lado do agente**:

- o **catálogo de detecção** (motor + dados) porta uma revisão monotônica e dados assinados; um catálogo mais antigo, com menos entradas, não é intercambiável dentro de sua janela de validade;
- a **política** aplicada pela extensão exige uma revisão e uma expiração (no máximo 15 minutos): uma política fora da expiração é rejeitada, não adaptada;
- o **manifesto de atualização** é assinado; uma subida de versão recusa o replay de uma versão já instalada e qualquer retrogradação assinada não reabre downgrade — um aplicador SYSTEM local verifica a saúde do serviço corrente antes de anunciar "instalado", e um recibo protegido prova um retorno atrás.

## O endurecimento local (dispositivo)

- **Falha em modo fechado em toda parte**: sem política válida, a extensão lacra a superfície de IA coberta; o relé recusa um canal IPC ocupado por um processo de usuário (verificação sobre o **proprietário do objeto**, não sobre um identificador de processo falsificável).
- **Canal IPC endurecido**: descritor restrito, anti-ocupação (`FIRST_PIPE_INSTANCE`, proprietário SYSTEM), anti-usurpação (impersonação do cliente para ler seu token, campos de autoridade substituídos pelo serviço), teto de conexões **por chamador** — um processo local não pode privar todo o dispositivo de decisão.
- **O serviço não divulga sua política**: a projeção `policy_v3` retira palavras-chave, exceções, expressões de mascaramento personalizadas e mensagem de bloqueio do canal visível por qualquer usuário local.
- **O coletor não confia em nada do agente**: estado e âncora separados, canal reservado aos serviços, e leitura de arquivos validada **sobre o descritor aberto**, não sobre o caminho — uma junção substituída dá um erro, não uma leitura.
- **Atualizações privilegiadas sem primitiva de retrogradação**: o serviço aplicador ignora os argumentos do chamador, relê o `binPath` posto em SYSTEM, e recusa qualquer instalação cujo alcance ultrapasse seu alcance.

## Isolamento e controles no lado do servidor

- **Row-Level Security**: na Enterprise, cada organização acessa apenas suas linhas no nível do banco — não uma filtragem aplicativa; o isolamento é provado pela suíte de testes.
- **RBAC por permissões vivas**: as rotas exigem permissões verificadas a cada chamada; a edição declarada pelo cliente não concede nada.
- **Travas de privacidade**: nomes de máquinas, leitura de conversa, descoberta dos domínios candidatos — cada rota exige sessão válida, **MFA recente** e **motivo escrito**; a mudança de privacidade porta seu motivo e sua revisão.
- **Registro de auditoria não purgável**: retenção de 730 dias aplicada por um gatilho no banco — nenhum caminho de código, nem um papel comprometido, pode encurtar o rastro das ações.
- **Chaves de API com hash** (SHA-256, 256 bits de `crypto/rand`) e de autoridade delimitada (`keyOnly` para o servidor MCP, somente leitura); expirações e revogações verificadas a cada chamada.
- **Conteúdo lacrado**: todo texto conservado e todo segredo durável passam por uma criptografia **AES-256-GCM** cujo envelope porta sua própria versão, ligada ao criptograma — um envelope reetiquetado não pode abrir os bytes com outra chave; duas raízes de chaves distintas separam a rotação barata (sessões) do re-lacramento (conteúdo).
- **Ingestão defensiva**: documentos JSON estritos (campos desconhecidos recusados), limites de tamanho, sanitização do usuário do SO (jamais a conta de serviço), validação Origin/CSRF no lado do console, limites de taxa por dispositivo e por rota.

## A postura

[IMAGEAMETTREICI 02]

Três princípios atravessam todos esses mecanismos:

1. **Falhas fechadas.** Agente inacessível, serviço parado, canal suspeito: a superfície de IA é bloqueada, jamais aberta à espera de algo melhor. Única exceção documentada: um canal que recusa *todo* servidor não identificável quebraria o registro legítimo — o caso é delimitado e documentado, jamais estendido.
2. **A presença não é o uso.** Nenhum mecanismo transforma uma detecção em acusação: a atribuição de uma pessoa exige uma associação OIDC verificada; todo o resto é dito "informativo".
3. **A falta de privilégio é uma decisão, não um esquecimento.** Cada componente privilegiado detém seu canal, sua âncora e seu armazenamento; o agente nunca recebe um poder que não pediu.
