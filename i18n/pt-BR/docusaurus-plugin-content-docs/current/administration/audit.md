---
sidebar_position: 6
title: Registro de auditoria
---

# Registro de auditoria

## Acessar a tela

Na barra lateral, clique em **Administração** > **Registro de auditoria**. Você precisa de `audit.read`.

1. Clique em **Atualizar**.
2. Verifique se a tabela recarrega ou informa que não há entradas visíveis.

O registro de auditoria responde à pergunta "**quem fez o quê**" na plataforma. Ele rastreia as ações de administração: mudança de função, remoção de acesso, modificação de política, exclusão de um dispositivo, rotação de uma chave, modificação da privacidade — esta última com o motivo escrito que a autorizou, mostrado na coluna **Motivo**.

O acesso exige a permissão `audit.read` — entre as funções integradas, apenas o Proprietário a possui; sem ela, a tela mostra "É necessário acesso de proprietário".

## A tabela

Cada linha porta cinco colunas: **Data**, **Autor**, **Ação** (código pontuado, tal como `directory.update` ou `member.role`), **Alvo** (identificador técnico, em fonte monoespaçada) e **Motivo** — o motivo escrito que autorizou uma modificação de privacidade ou uma revelação de identidade, vazio para qualquer outra ação. Vazia, a tela lê "Nenhuma ação registrada"; o botão "Atualizar" recarrega a lista.

![Milvago - A tabela](/img/docs/en/administration-audit-01.png)

## Somente anexação, por construção

A linha sob o título o diz: "Registro do servidor somente-anexação." Não é uma política de interface, é um gatilho no banco: toda modificação ou exclusão de uma linha de auditoria é recusada pelo próprio PostgreSQL, portanto ineludível mesmo por uma função runtime comprometida. Um administrador não pode encurtar o rastro das próprias ações dele.

A **retenção** segue o mesmo princípio: o piso de 730 dias está gravado no gatilho, não em um ajuste. As purgas automáticas só tocam linhas mais velhas que esse piso — a retenção não é configurável, e esse é o objetivo.
