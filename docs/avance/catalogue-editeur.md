---
sidebar_position: 3
title: Catalogue de détection
---

# Catalogue de détection

Le catalogue est le **moteur et les données** qui disent à l'extension quoi mesurer sur les sites couverts : routes de prompt et de téléversement, corps, sélecteurs DOM du composeur, plateformes connues. Il est signé, versionné, et sa couverture dépend de l'édition servie : deux fournisseurs en Community, neuf en Enterprise.

Pour ouvrir l’écran d’édition, sélectionnez **Administration → Catalogue de détection**. Il se réserve aux deux conditions cumulées :

- la variable `MILVAGO_DEBUG` est posée sur l'instance (voir [Variables d'environnement](../installation/variables-environnement.md)) ;
- vous portez `policy.manage` et la console d'administration n'est pas masquée.

C'est un réglage de **bruit**, pas une frontière de sécurité : la publication du catalogue exige de toute façon le Propriétaire de l'organisation racine et une MFA fraîche. Rien ne lit ce drapeau dans une requête ; seul l'environnement le définit.

![Milvago - Catalogue de détection](/img/docs/fr/avance-catalogue-editeur-01.png)

## Importer puis publier

1. Activez `MILVAGO_DEBUG` dans le déploiement du serveur et redémarrez ou redéployez-le.
2. Connectez-vous avec `policy.manage`; la publication exige aussi le rôle Propriétaire de l’organisation racine et une MFA fraîche.
3. Ouvrez **Administration → Catalogue de détection**, puis importez le catalogue mesuré.
4. Contrôlez les entrées et la révision avant de sélectionner **Publier**.
5. Après publication, consultez la santé des détecteurs et le bandeau de couverture dans les écrans de supervision.

## Importer et publier

- L'**import manuel** passe par la route console, fermée sans `MILVAGO_DEBUG` : un catalogue mesuré (relevé sur le site, jamais deviné) est chargé, validé, puis publié.
- La publication produit une **révision monotone** : un catalogue qui change d'entrées doit changer de révision, sinon il est refusé. Cette règle ferme le cas d'un catalogue plus ancien, avec moins d'entrées, interchangeable dans sa fenêtre de validité.
- Un catalogue **publié garde ses octets signés** : la réédition ne les réécrit pas.
- Le serveur reste l'autorité : promouvoir ou publier quelque chose qu'il ne porte pas répond une erreur explicite, pas un succès silencieux.

## La santé des détecteurs

L'écran affiche le verdict du serveur par fournisseur **et par révision** : service, état, révision appliquée, postes, requêtes vues par le détecteur réseau et par le détecteur DOM. Les états lisent en termes de catalogue — une règle réseau qui ne correspond plus, des sélecteurs renommés par le site :

| État | Lecture |
| --- | --- |
| Sain | règle et DOM coïncident |
| DOM seul | les requêtes ne sont plus vues, le DOM oui |
| Transport absent / partiel | les postes ne remontent plus la couverture |
| Dégradé / suspect | l'écart réseau–DOM dépasse les seuils |
| Données insuffisantes | service non visité sur la fenêtre — **non mesuré, pas en panne** ; cet état et « sain » ne déclenchent jamais de bannière |

![Milvago - La santé des détecteurs](/img/docs/fr/avance-catalogue-editeur-02.png)

## Le bandeau de couverture

Sur les écrans de Monitoring, une notice s'affiche pour les porteurs de `policy.manage` quand la couverture se dégrade, en nommant les services concernés : le pire état d'abord. Son rôle est simple — **dire que les chiffres sont incomplets** — car une flotte qui ne capture plus ressemble exactement à une flotte qui n'utilise plus l'IA, et la page qui montre le chiffre plus petit ne le dit pas d'elle-même. En mode débogage, le bandeau porte le lien vers les détails.

:::note
Le catalogue reste la seule source de routes : l'extension ne scelle, ne masque ni ne bloque jamais un site hors des routes mesurées qu'il porte. Voir [Shadow AI](../administration/shadow-ai.md) pour la politique, [Découverte](../monitoring/discovery.md) pour ce que le catalogue ne couvre pas encore.
:::
