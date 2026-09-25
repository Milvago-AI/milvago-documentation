---
sidebar_position: 6
title: Journal d'audit
---

# Journal d'audit

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Journal d’audit**. Vous devez disposer de `audit.read`.

1. Cliquez sur **Actualiser**.
2. Vérifiez que le tableau se recharge ; s’il n’existe aucune entrée visible dans votre périmètre, l’écran affiche « Aucune action journalisée ».

Le journal d'audit répond à la question « **qui a fait quoi** » sur la plateforme. Il trace les actions d'administration : changement de rôle, retrait d'accès, modification de politique, suppression d'un poste, rotation d'une clé, modification de la confidentialité — cette dernière avec le motif écrit qui l'a autorisée.

L'accès exige la permission `audit.read` — dans les rôles intégrés, seul le Propriétaire la porte ; sans elle, l'écran affiche « Accès réservé au propriétaire ».

## Le tableau

Chaque ligne porte quatre colonnes : **Date**, **Auteur**, **Action** (code pointé, tel que `directory.update` ou `role.change`), **Cible** (identifiant technique, en police monospace). À vide, l'écran lit « Aucune action journalisée » ; le bouton « Actualiser » recharge la liste.

![Milvago - Le tableau](/img/docs/fr/administration-audit-01.png)

## En ajout seul, par construction

La ligne sous le titre le dit : « Journal serveur en ajout seul. » Ce n'est pas une politique d'interface, c'est un déclencheur en base : toute modification ou suppression d'une ligne d'audit est refusée par PostgreSQL lui-même, donc inéludable même par un rôle runtime compromis. Un administrateur ne peut pas raccourcir la trace de ses propres actions.

La **rétention** suit le même principe : le plancher de 730 jours est gravé dans le déclencheur, pas dans un réglage. Les purges automatiques ne touchent que des lignes plus vieilles que ce plancher — la rétention n'est pas configurable, et c'est le but.
