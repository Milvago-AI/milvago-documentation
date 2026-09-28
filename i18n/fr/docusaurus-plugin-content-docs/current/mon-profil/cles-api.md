---
sidebar_position: 2
title: Clés API et serveur MCP
---

# Clés API et serveur MCP

## Accéder à l’écran

Dans la barre latérale, cliquez sur votre bloc utilisateur en bas à gauche, puis sur **Mon profil**. La carte **Clés API** apparaît après la carte **Sécurité et accès** ; elle n’est pas contenue dans cette dernière. Elle utilise vos droits courants et est disponible dans les deux éditions.

Pour créer une clé :

1. Cliquez sur **Nouvelle clé API**.
2. Saisissez le nom, choisissez la durée et les permissions, puis activez éventuellement la lecture du contenu si elle est proposée.
3. Créez la clé, copiez immédiatement sa valeur secrète affichée une seule fois et vérifiez son apparition dans le tableau.

Les clés API se trouvent sur la page **Mon profil**, sous le bloc « Sécurité et accès ». Elles répondent à la question « **comment un script ou un outil externe appelle-t-il l'API** » : « Pour qu'un script ou un outil externe appelle l'API avec vos droits, sans partager votre mot de passe. »

## Créer une clé

Le bouton « Nouvelle clé API » ouvre le dialogue de création, plafonné à 5 clés actives par compte (« Limite de 5 clés actives atteinte : révoquez-en une pour continuer. »). Quatre réglages :

- **Nom de la clé** — une phrase humaine, par exemple « Export SIEM ».
- **Durée de validité** — 30, 90 ou 365 jours ; au-delà, la clé expire et l'écran la marque « Expirée ».
- **Permissions** — la liste des droits que **vous** portez, rien de précoché, et rien que le serveur ne vous accorderait : « Limitées à vos propres droits, et recalculées à chaque appel : la clé perd un droit dès que vous le perdez. »
- **Autoriser la lecture du contenu des prompts** — une case à part, qui ne se présente que si votre instance la propose : « À n'activer que si l'outil en a besoin : sans cette case, la clé ne voit que les métadonnées. »

![Milvago - Créer une clé](/img/docs/fr/mon-profil-cles-api-01.png)

Deux avertissements se présentent au moment où la décision se prend, pas après :

- Cocher `installers.manage` (« Gérer les installeurs ») lit « Cette permission dépasse la durée de vie de la clé » : « Une clé qui peut télécharger l'installateur peut lire la clé de déploiement de l'organisation, qui n'expire pas. La capacité d'enrôler des postes survivra donc à l'expiration de cette clé : pour la retirer, faites tourner la clé de déploiement dans Paramètres. »
- En Enterprise, activer la lecture du contenu lit « Le texte des prompts pourra sortir vers un LLM externe » : « Cette clé ouvre aussi le serveur MCP. Un modèle branché avec elle pourra lire le texte que vos utilisateurs ont soumis, et ce texte sera transmis au fournisseur de ce modèle. Sans cette case, le même outil ne voit que les métadonnées. »

La clé secrète s'affiche **une seule fois**, dans un dialogue qui survit au rechargement de la liste : « Copiez cette clé maintenant : elle ne sera plus jamais affichée, à personne. » Si vous la perdez, révoquez la clé et créez-en une autre.

## Le tableau des clés

Colonnes : **Nom** (avec le badge ambre « Contenu » si la clé lit les contenus), **Permissions** (jusqu'à deux en toutes lettres, au-delà un badge « N permissions » avec le détail au survol), **Créée le**, **Expiration** (« Expire dans N jours », « Expire demain », ou « Expirée »), **Dernière utilisation** (« Jamais utilisée » sinon). **Révoquer** demande confirmation et prend effet immédiatement : « Tout outil utilisant « … » cessera immédiatement de s'authentifier. C'est définitif. »

![Milvago - Le tableau des clés](/img/docs/fr/mon-profil-cles-api-02.png)

:::enterprise

## Serveur MCP

Sous le tableau des clés, la carte « Serveur MCP » n'apparaît qu'en Enterprise : « Pour brancher un modèle de langage sur Milvago. Il lit le même périmètre que la console — avec les droits de la personne qui se connecte, ou ceux d'une des clés ci-dessus. » Elle donne les trois éléments de configuration :

- **Point d'entrée** — `<URL de votre console>/mcp`, à déclarer comme serveur MCP distant en HTTP ; « Le point d'entrée n'accepte que POST. »
- **Se connecter avec votre compte** — l'identifiant client public `milvago-mcp-client`, pour un client qui en réclame un ; « La plupart des clients n'ont besoin que de l'adresse ci-dessus : ils ouvrent une page de connexion, vous demandent votre accord, et le modèle lit ensuite avec vos propres droits, dans votre propre organisation. » L'échange est protégé par PKCE.
- **En-tête d'authentification** — `Authorization: Bearer <clé API>` : « Obligatoire sur toutes les méthodes, découverte comprise : sans credential, le serveur ne répond rien. Un cookie de session est refusé, jamais accepté à la place. »

Deux révisions du protocole sont servies — celle du produit et la révision publiée — et l'avis le dit pour qu'un client qui ouvre par « initialize » sache laquelle il reçoit.

Une connexion par votre compte n'est pas permanente : un connecteur resté inutilisé sept jours, et tout connecteur au bout de trente jours, vous redemande de vous connecter. Le serveur refuse aussi un jeton émis pour la console elle-même, et un connecteur qui s'inscrit seul doit demander nommément l'accès `milvago:mcp` au moment de la connexion — ce que font les connecteurs courants. Il en va de même pour toute autre application déclarée sur le fournisseur d'identité : au démarrage, Milvago retire l'accès `milvago:mcp` des accès accordés par défaut à ces applications, y compris celles créées avant cette règle.

### Lecture seule, et données non fiables

« Aucun outil ne modifie une politique, un poste, un membre ni un réglage. En revanche les réponses contiennent des données écrites par vos utilisateurs — noms de postes, libellés, et le texte des prompts si la clé y a accès : elles partent vers le fournisseur du modèle. » Le serveur MCP n'est pas un contournement : il traverse le même RBAC et la même isolation par organisation, et une clé MCP ne peut jamais écrire. Une clé API ou un jeton de connecteur MCP ne liste jamais que les membres de sa propre organisation, jamais ceux d'une organisation fille, même quand votre propre rôle porte sur un sous-arbre plus large en Enterprise.

### L'inscription automatique des connecteurs

Quand un connecteur doit obtenir ses propres identifiants plutôt qu'une clé personnelle, l'inscription se règle dans [Paramètres](../administration/parametres.md), chez le fournisseur d'identité, avec ses hôtes autorisés et son plafond de clients.

« Dans une organisation qui exige l'authentification multifacteur, un connecteur inscrit de lui-même n'est accepté que si son jeton atteste un second facteur par sa liste de méthodes d'authentification (`amr`) ; son niveau déclaré (`acr`) n'est cru que pour le connecteur fourni par Milvago. Un jeton valable plus d'une heure est refusé, de même qu'un client qui s'est donné des mappeurs, un compte de service, ou un flux autre que le code d'autorisation avec consentement. »

:::
