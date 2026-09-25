---
sidebar_position: 4
title: Confidentialité
---

# Confidentialité

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Confidentialité**. Vous devez disposer de `settings.manage` pour modifier les réglages ; avec le seul droit d’effacement d’identité, seul le renouvellement des alias est accessible.

1. Modifiez les réglages concernés.
2. Saisissez un motif d’au moins 8 caractères.
3. Cliquez sur **Enregistrer** et validez la vérification MFA si elle est demandée.
4. De retour dans la console, vérifiez que les nouvelles valeurs sont affichées ; elles sont appliquées sans ressaisir les champs.

L'écran Confidentialité répond à la question « **jusqu'où la plateforme identifie-t-elle les personnes** ». Il règle la pseudonymisation par défaut, l'agrégation des rapports, la conservation des liens d'identité et les partages vers l'éditeur. L'accès exige la permission `settings.manage` (« Gérer les paramètres ») ; un compte qui ne porte que le droit d'effacer une identité voit ici la seule rotation d'alias.

Toute modification exige un **motif écrit** d'au moins 8 caractères — « Ce motif est conservé dans le journal d'audit. » — et une **authentification multifacteur récente** : si elle manque, le serveur refuse et la console redirige vers la vérification, puis applique la modification au retour sans la faire ressaisir.

![Milvago - Confidentialité](/img/docs/fr/administration-confidentialite-01.png)

## Les réglages

- **Pseudonymisation par défaut** — affiche par défaut un alias dans les vues individuelles. Une levée d’identité autorisée reste possible.
- **Rapports agrégés uniquement** — active le mode rapports agrégés et désactive l’accès individuel aux usages.
- **Seuil d’agrégation** — de 1 à 100 : les groupes de rapport sous le seuil de personnes distinctes sont masqués.
- **Conservation des liens d’identité (jours)** — de 7 à 365 jours pour l’association personne-événements ; au-delà, une levée d’identité devient impossible.
- **Justification de conservation prolongée** — justifie la conservation des événements réglée dans Paramètres au-delà de 180 jours. Elle est requise au-delà de cette durée et ne la modifie pas.
- **Attribut OIDC de l’équipe** — le nom exact de l’attribut OIDC d’équipe, pas un nom d’équipe ; il sert à répartir les rapports.

:::enterprise

**Imposer aux organisations filles** — une organisation mère peut imposer à sa descendance uniquement la pseudonymisation, le mode agrégé, le seuil et la durée des liens d’identité. Les partages et la rotation des alias restent propres à chaque organisation. Les champs imposés sont verrouillés chez les filles.

:::

![Milvago - Les réglages](/img/docs/fr/administration-confidentialite-02.png)

## Renouveler les alias

Un alias permet de relier les événements d’une même personne sans montrer son nom. La rotation change les alias de **l’organisation actuellement sélectionnée**, par exemple après la diffusion d’un export pseudonymisé. Elle ne se propage pas aux organisations filles et ne supprime pas les événements.

La **rotation des alias** recalcule les pseudonymes de toutes les personnes et révoque les levées d'identité actives. Elle exige le droit d'effacement d'identité, un motif écrit, et porte son propre avertissement : « Recalculer les alias et révoquer les levées actives. La rotation ne garantit pas l'anonymat ; les données déjà exportées et les corrélations restent possibles. » La confirmation lit « Alias recalculés : N. Levées actives révoquées. »

## La levée d'identité, ailleurs dans la console

La rotation n'est qu'un côté de l'équilibre : une identité se **lève** depuis le détail d'une conversation (15 minutes, motif obligatoire, lecture auditée) et se **recompose** seule à l'échéance des liens d'identité. Voir [Conversations](../monitoring/conversations.md).

## Les partages éditeur

Tout compte disposant de `settings.manage` voit le panneau **Partages éditeur**. Il permet de choisir séparément :

- **Importer automatiquement le catalogue éditeur** — importe le catalogue signé si une connexion est configurée. Ce choix n’apparaît que pour l’organisation racine et vaut pour toute l’instance. Il n’envoie pas de télémétrie à lui seul.
- **Partager la santé des détecteurs** — consentement propre à l’organisation, qui partage leur état agrégé par fournisseur et révision, sans texte des conversations.
- **Partager les effectifs du parc** — consentement propre à l’organisation, qui partage seulement les effectifs de postes inscrits et actifs sur 30 jours, sans noms de postes.

Les aperçus et les états sont réservés au propriétaire de l’instance.

Voir [Connexion au service éditeur](../avance/service-editeur.md) pour la configuration serveur.
