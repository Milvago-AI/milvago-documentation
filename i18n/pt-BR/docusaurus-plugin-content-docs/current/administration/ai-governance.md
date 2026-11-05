---
sidebar_position: 8
title: Autorizações de IA e NIST
---

# Autorizações de IA e NIST

Abra **Administração > Shadow AI > Governança de IA** para decidir quais programas observados são permitidos em cada dispositivo. Community e Enterprise oferecem regras por organização, grupo ou dispositivo. Enterprise também herda regras de organizações superiores.

O Milvago usa NIST AI RMF como referência. Inventário, decisões e datas de revisão apoiam sua governança; não representam certificação nem avaliam todos os riscos de IA. **Cobertura NIST e limites** distingue suporte parcial, avaliação manual e assuntos não avaliados, como a equidade ou precisão de modelos.

## Declarar um uso de negócio ou sistema de IA

Na mesma tela, abra **Usos e sistemas de IA declarados**. Com `policy.manage`, escolha **Declarar um uso** ou abra uma linha existente. O painel à direita permite informar nome, responsável, objetivo de negócio e escopo: organização, grupo ou dispositivo.

Você pode vincular identificadores das aplicações do inventário e declarar fornecedores e modelos, com até 16 valores por lista. Selecione categorias de dados, descreva possíveis impactos e medidas de proteção, e defina uma data de revisão. Descreva categorias sem copiar dados reais nem conversas. O nível de risco é uma avaliação manual da organização; **Não avaliado** indica uma avaliação pendente.

Escolha o ciclo de vida declarado: planejado, em revisão, em serviço ou retirado. Declarar um sistema em serviço é um registro de negócio. Isso não comprova que o software foi observado ou autorizado. Revisões atrasadas são sinalizadas. Pesquise por nome, responsável, objetivo ou aplicação relacionada.

Escolha **Salvar registro** com justificativa e MFA recente. O registro possui sua própria revisão: atualizá-lo preserva as regras de autorização dos softwares e suas exceções atuais. Se outro administrador salvou antes, recarregue o registro antes de aplicar suas alterações. Remover uma declaração exige confirmação e mantém as observações e regras. Cada organização aceita até 128 declarações dentro de 256 KiB.

## Publicar uma regra

Com `policy.manage`, adicione uma regra, informe o identificador do programa no inventário e escolha **Presença** ou **Execução**. Uma regra de execução exige execução observada; o nome de um pacote ou imagem não basta.

Escolha organização, grupo ou dispositivo; nos dois últimos casos, use a lista de seleção. Escolha **Permitir** ou **Proibir**, informe responsável, objetivo, condições e data de revisão. Você pode definir um fim de validade. Informe um motivo e publique com MFA recente. Salvar fontes de coleta não publica estas autorizações.

Normalmente, prevalece a regra mais específica: dispositivo, grupo e organização. Por exemplo, proíba `antigravity` para a organização e permita-o para engenharia. Os outros dispositivos continuam sujeitos à proibição. Uma restrição **obrigatória** impede sua flexibilização por uma permissão mais específica. Uma organização filha não pode flexibilizar uma proibição obrigatória superior.

No modo Observação, as regras avaliam evidências sem bloquear programas nem comunicações. Ative explicitamente o bloqueio de executáveis no Enterprise conforme descrito abaixo. **Sem regra aplicável** nunca significa permissão automática. Evidências insuficientes continuam indeterminadas e revisões vencidas são sinalizadas mesmo quando a regra permite a ação.

Os resultados correspondem ao horário de avaliação exibido. Localizações e autorizações são atualizadas a cada 30 segundos enquanto estão visíveis e ao retornar à visualização. Apenas uma exceção ativa é aceita por dispositivo, regra e revisão; revogue-a antes de substituí-la.

## Bloqueio de executáveis no Enterprise

A observação continua sendo o modo padrão, inclusive para regras existentes. Com servidor e agente Enterprise compatíveis, escolha **Execução**, **Proibir** e **Bloquear os próximos inícios**. Publique com justificativa e MFA recente. A decisão é prospectiva: não exige uma execução anterior do programa. Os processos abertos não são encerrados.

Esse modo abrange Claude Desktop, Claude Code, Codex e Antigravity App, CLI e IDE por meio de um catálogo de identidades qualificadas. Exige uma regra permanente, sem vencimento nem exceções temporárias. Remova regras temporárias sobrepostas antes de ativá-lo. A data de revisão é um lembrete e não expira a restrição. Permissões permanentes mais específicas mantêm a prioridade habitual, salvo uma proibição obrigatória.

O dispositivo precisa de um catálogo instalado pelo administrador para suas versões exatas de aplicativos e seu sistema operacional. O Windows usa AppLocker com o serviço Identidade do Aplicativo ativo. O Linux usa fapolicyd e uma integração aprovada pelo administrador com sua política existente. Catálogo ausente, versão não qualificada ou mecanismo indisponível resulta em estado indisponível; selecionar Bloquear não basta. Políticas GPO, MDM ou de controle de aplicativos existentes exigem integração do administrador. O Milvago não incorpora permissões gerais a elas automaticamente.

Abra a autorização do aplicativo no dispositivo para consultar **Bloqueio de executáveis** e suas versões qualificadas. **Aplicado às identidades qualificadas** confirma o mecanismo do sistema informado para essas identidades. Os estados **Pendente**, **Parcial**, **Indisponível**, **Integração do administrador necessária**, **Conflito de políticas** e uma confirmação desatualizada não comprovam uma proteção completa atual. O dispositivo informa o estado, sem atestação remota.

As proibições assinadas já aplicadas continuam durante uma falha do servidor e após reiniciar o agente. Restabeleça a conexão e publique uma permissão permanente ou o modo Observação para retirar uma proibição do Milvago. Para recuperação offline ou desinstalação, o administrador deve restaurar a política do sistema gerenciada antes de excluir seu estado protegido. Um conflito com política externa exige integração manual; não exclua o cache para contorná-lo.

A cobertura abrange hashes de executáveis qualificados ou identidades exatas de pacotes no sistema gerenciado diretamente. Hashes qualificados cobrem cópias idênticas e renomeadas de executáveis. Identidades de pacotes cobrem o pacote exato; cópias desempacotadas exigem hashes qualificados separadamente. No Linux, o acesso ao binário proibido também é negado para impedir sua abertura por um carregador ELF explícito. Binários modificados ou novos não qualificados, interpretadores compartilhados Node/Python/Electron e convidados sem agente próprio ficam fora. Nenhum driver de kernel do Milvago é instalado. Bloqueio de execução, filtragem de comunicações e DLP são independentes: proibir um início não comprova inspeção antes do envio, e o ajuste de comunicação **Bloquear** não comprova que Claude Desktop, Claude Code ou Codex não possam iniciar.

O catálogo Windows fornecido cobre Claude Code 2.1.303, Codex 0.166.0 e Antigravity App 2.24.0, CLI 1.4.0 e IDE 2.5.5. Também inclui Claude Desktop 4.16336.0.0 para sua inicialização MSIX principal e seu executável principal desempacotado. O catálogo Linux fornecido cobre Claude Code 2.1.303, Codex 0.166.0 e Antigravity CLI 1.4.0. A importação do catálogo é uma operação separada do administrador; ativar uma regra não o instala.

Para o Claude Desktop 4.16336.0.0, a integração local do Windows também desativa a disponibilidade do pacote qualificado pelo gerenciamento de pacotes do Windows. Isso impede futuras inicializações do serviço Cowork sem alterar suas permissões nem sua configuração de inicialização. Instâncias ativas são preservadas. O bloqueio completo do serviço aguarda o encerramento natural dos clientes do pacote e permanece Parcial durante a espera. Encerre o Claude Desktop para concluí-lo; o AppLocker continua recusando novas inicializações principais. O Milvago registra a disponibilidade original antes de alterá-la e a restaura quando a restrição é removida, sem iniciar a aplicação nem o serviço. Um pacote que já estava desativado permanece desativado. Um serviço ausente, modificado ou não qualificado impede o status Aplicado. Em dispositivos gerenciados, integre o requisito de disponibilidade do pacote exportado e as negações AppLocker aos controles existentes. Verificar apenas a inicialização principal não comprova o bloqueio do serviço.

A cobertura por hash se aplica a executáveis Windows desempacotados e arquivos ELF Linux, incluindo cópias idênticas ou renomeadas. Inicializações Windows empacotadas exigem uma identidade de pacote qualificada separadamente; o reempacotamento fica fora da cobertura apenas por hash.

No Linux, um recurso de inicialização qualificado identifica um arquivo obrigatório do aplicativo em vez de seu mecanismo Electron compartilhado. O Linux recusa o acesso a esse arquivo exato, incluindo cópias idênticas ou renomeadas, para impedir a inicialização do aplicativo. O mecanismo compartilhado permanece disponível. Arquivos de inicialização modificados, extraídos ou reempacotados exigem qualificação separada e ficam fora desta cobertura. O estado do dispositivo distingue recursos de inicialização de hashes de executáveis.

O catálogo Linux fornecido também cobre Claude Desktop 4.16336.0, Antigravity App 2.23.1 e Antigravity IDE 2.5.5 por meio de seus recursos de inicialização qualificados. Seus mecanismos Electron são compartilhados com outros programas: não adicione os hashes desses mecanismos como identidades de aplicativo.

No Linux, a cobertura também depende dos sistemas de arquivos monitorados pelo fapolicyd. A execução anônima ou somente em memória e a injeção em processos não são cobertas.

No Linux, o administrador deve ativar `allow_filesystem_mark = 1` na configuração do fapolicyd e reiniciar esse serviço após revisar a política existente para cargas com montagens vinculadas. Esse modo também monitora acessos por namespaces de montagem isolados nos sistemas de arquivos monitorados. O Milvago não altera essa configuração. Ele verifica a recusa efetiva com uma sonda inerte em uma montagem vinculada privada; se a configuração ou as permissões do sistema impedirem essa verificação, o dispositivo não poderá declarar a restrição como aplicada.

## Examinar um dispositivo e aprovar uma exceção

Em **Monitoring > Inventário de IA**, abra um programa e **Localizações**. Cada linha reúne todas as observações de um dispositivo e distingue presença e execução. Selecione um dispositivo para abrir suas evidências e autorização atual. A opção de ver evidências de todos os dispositivos remove o filtro. Relações de VMs e contêineres permanecem em **Ambientes**.

Uma exceção corresponde a um dispositivo e uma regra atual que aceite exceções. Exige `ai.governance.approve`, permissões de leitura, justificativa, término em até três meses e MFA recente. O proprietário tem essa permissão de aprovação por padrão; ela pode ser atribuída explicitamente a um perfil personalizado. Publicar uma nova política invalida exceções anteriores. Elas expiram ou podem ser revogadas com um motivo. Uma organização filha não pode aprovar exceção à restrição superior.

A **Revisão do inventário** é uma anotação global e não substitui regras efetivas por dispositivo. O histórico preserva revisões publicadas e decisões de exceção justificadas. A avaliação atual usa as regras vigentes e não reescreve observações anteriores.

## Importar e automatizar

Você pode validar YAML ou JSON e usá-lo como rascunho antes de publicar. Validar não salva nem ativa regras. Os documentos contêm dados e não executam scripts. São aceitas até 256 regras por organização, dentro do limite de tamanho.

Use a API de descoberta e o MCP Enterprise para leituras automatizadas. O MCP Enterprise não publica regras nem aprova exceções. O [NIST AI RMF oficial](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) descreve a estrutura organizacional completa.
