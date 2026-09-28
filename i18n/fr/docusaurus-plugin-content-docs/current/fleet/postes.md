---
sidebar_position: 1
title: Postes
---

# Postes

L'écran **Postes** recense les appareils enrôlés auprès du serveur et répond à la question : quels postes remontent de l'information, et lesquels ont encore le droit de le faire. Il se trouve dans la section **Parc** de la navigation, avec [Groupes de postes](groupes.md).

La ligne d'information sous le titre fixe le périmètre de l'agent, selon l'édition :

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Parc**, puis sur **Postes**. Il faut `devices.read` et une organisation qui n’est pas en consultation agrégée seule.

1. Avec `installers.manage`, cliquez sur **Télécharger l’agent**, choisissez **Windows ZIP** ou **Linux RPM**, puis installez le paquet sur le poste. Revenez dans **Parc > Postes**, cliquez sur **Actualiser** et approuvez le poste s’il est en attente : il devient actif, ou reste en attente selon la règle d’enrôlement.
2. Cliquez sur le nom d’un poste pour ouvrir sa fiche, puis sur **Informations**, **Politique du poste** ou, en Enterprise avec `events.read`, **Outils locaux**. Pour changer de groupe, cliquez sur l’étiquette de groupe (ou **Aucun groupe**) puis sur le groupe cible; la nouvelle révision est appliquée à la prochaine synchronisation.
3. Avec `devices.manage`, cliquez sur **Approuver**, **Révoquer** ou **Supprimer**, puis confirmez. Pour supprimer plusieurs postes, cochez-les dans la liste puis cliquez sur **Supprimer (N)** et confirmez; les éventuels échecs sont indiqués poste par poste.

- **Community** : « L'agent Community couvre les usages navigateur. Aucun inventaire d'applications installées n'est inclus. Un poste en attente ou révoqué ne peut pas envoyer d'événements. »
- **Enterprise** : « L'agent Enterprise couvre le navigateur et l'inventaire ciblé des outils. Un poste en attente ou révoqué ne peut pas envoyer d'événements. »

![Milvago - Postes](/img/docs/fr/fleet-postes-01.png)

## Qui voit quoi

| Action | Condition |
| --- | --- |
| Voir la liste et les fiches | droit `devices.read`, et pas une consultation agrégée seule |
| Télécharger l'agent | droit `installers.manage` |
| Approuver, révoquer, supprimer | droit `devices.manage` |
| Changer le groupe d'un poste | droit `devices.manage` |
| Régler la politique du poste | droit `policy.manage` |

## La liste des postes

La section s'intitule **Postes enregistrés**, avec la règle de lecture « Une identité révocable par poste » : chaque poste détient sa propre identité, que la console peut retirer individuellement. Un compteur affiche le nombre de postes correspondant aux filtres.

Le sélecteur **Par page** propose 10, 20, 50, 100 ou 200 postes. Les filtres s'appliquent à tout le parc avant la pagination, et les boutons numérotés donnent accès à la première, à la dernière et aux pages voisines.

La barre de filtres n'apparaît que s'il existe au moins un poste. Elle porte trois critères cumulatifs :

- **Nom du poste** — contient le texte saisi ;
- **Utilisateur** — contient le texte saisi, sur le compte OS signalé ;
- **Système** — liste déroulante des plateformes effectivement présentes dans le parc (« Tous les systèmes » par défaut).

![Milvago - La liste des postes](/img/docs/fr/fleet-postes-02.png)

Colonnes du tableau :

| Colonne | Contenu |
| --- | --- |
| **Poste** | nom de machine cliquable vers la fiche, ou « Nom de machine indisponible » ; les premiers caractères de l'identifiant apparaissent dessous |
| **Utilisateur** | compte OS connecté, ou « — » tant que rien n'a été signalé |
| **Groupe** | étiquette cliquable vers le groupe, ou « — » |
| **Plateforme** | système du poste, avec la version de l'agent en détail |
| **État** | badge **En attente**, **Actif** ou **Révoqué** |
| **Dernier contact** | horodatage du dernier signalement |
| **Actions** | « Approuver » (poste en attente) et « Révoquer » (poste non révoqué) pour qui a le droit ; « — » sinon |

Deux écrans vides distincts, qui ne disent pas la même chose :

- aucun poste du tout : « **Votre premier poste vous attend** » — « Téléchargez le ZIP Windows contenant le MSI, son script et le fichier de provisionnement, ou le RPM Linux. Le poste apparaît automatiquement après installation et connexion. » ;
- aucun poste correspondant aux filtres : « **Aucun poste ne correspond** » — « Modifiez les critères de recherche. »

## Télécharger l'agent

Le bouton « **Télécharger l'agent** » ouvre un dialogue de téléchargement seulement : il ne crée rien, l'organisation détient déjà une clé de déploiement. Trois garde-fous, dans l'ordre du code :

1. **URL publique confirmée** : sans elle, le dialogue affiche un encadré d'avertissement — « Définissez et confirmez l'URL HTTPS publique dans Administration → Paramètres avant de télécharger un installateur. Les agents se connecteront à cette URL. » — ou demande l'intervention d'un propriétaire quand l'URL n'est pas modifiable.
2. **Clé de déploiement active** : si la clé a été révoquée, l'encadré « Aucune clé de déploiement active » invite à la faire tourner dans Administration → Paramètres.
3. **Mode d'approbation annoncé avant le téléchargement** :
   - approbation manuelle — encadré ambre « Approbation manuelle active » : « Chaque poste installé apparaîtra en attente et ne transmettra rien avant votre approbation dans Postes. » Un poste en attente ne reçoit aucune politique : à partir de l'installation de l'agent, et jusqu'à l'approbation, **aucun accès aux plateformes IA** n'est permis sur ce poste — l'extension échoue en fermeture et scelle la surface IA couverte, au lieu de la laisser ouverte par défaut ;
   - approbation selon le réseau — « Un poste installé depuis un réseau autorisé transmet immédiatement ; les autres restent en attente d'approbation. »

Le dialogue propose **Windows ZIP** (un téléchargement réunissant le MSI, le script d’installation et le JSON de provisionnement de cette organisation) et **Linux RPM** (service systemd pour tout le poste). Si votre compte utilise un second facteur, le ZIP Windows n'est fourni que si ce facteur a été vérifié dans les 5 dernières minutes ; sinon, la console le redemande, puis le téléchargement reprend automatiquement. Un compte sans second facteur télécharge directement, et une clé API ne peut jamais télécharger le ZIP. Le RPM Linux ne demande pas de nouvelle vérification et porte encore la clé de déploiement. Après installation, le poste s’inscrit une seule fois et conserve son état dans un cache chiffré. La version téléchargée est indiquée sous la tuile.

Le MSI inclus dans chaque ZIP Windows est identique pour toutes les organisations ; le JSON de provisionnement est propre à cette organisation. Protégez le ZIP et le JSON. La rotation de la clé invalide les anciens fichiers de provisionnement Windows et les RPM Linux, sans toucher aux postes déjà inscrits.

![Milvago - Télécharger l'agent](/img/docs/fr/fleet-postes-03.png)

## La fiche d'un poste

Ouvrir un poste dans la liste affiche sa fiche. La ligne d'information sous le titre résume le contenu : « Identité révocable du poste, dérogations et observations locales. »

Les actions de la fiche dépendent de l'état : « Approuver » sur un poste en attente, « Révoquer » sur tout poste non révoqué, « Supprimer » dans tous les cas pour qui a le droit. Des onglets s'ajoutent quand leurs conditions sont réunies :

- **Informations** — toujours présent ;
- **Politique du poste** — droit `policy.manage`, dans les deux éditions ;
- **Outils locaux** — Enterprise, avec un accès d'analyste.

![Milvago - La fiche d'un poste](/img/docs/fr/fleet-postes-04.png)

### Informations

| Champ | Contenu |
| --- | --- |
| **Identifiant** | identifiant unique du poste, en police à chasse fixe |
| **Plateforme** | système signalé par l'agent |
| **Agent** | version de l'agent installée |
| **Mise à jour** | badge « À mettre à jour », « En attente », « Appliqué » ou « Indisponible », avec la date du dernier signalement quand elle existe |
| **Utilisateur connecté** | compte OS au moment du signalement, ou « Non signalé » |
| **Domaine déclaré** | domaine de machine déclaré à l'inscription et son type (Active Directory, Entra ID, realm Linux), ou absent si le poste n'en a déclaré aucun — cas des agents antérieurs à la version 0.5.45 |
| **Groupe** | étiquette d'affectation, détaillée ci-dessous |
| **Collecteurs natifs** | Enterprise uniquement : état de chaque collecteur d'inventaire, version, dernier succès, arborescences ignorées et modifications de configuration gérée détectées |
| **Extensions navigateur** | présence vivante de l'extension par navigateur, détaillée ci-dessous |
| **État** | En attente / Actif / Révoqué |
| **Dernier contact** | horodatage |

#### Le groupe d'un poste

La ligne Groupe se lit en deux temps. Fermée, elle montre l'affectation courante — l'étiquette du groupe, cliquable vers sa fiche, ou « Aucun groupe » — suivie du lien « Ouvrir le groupe ». Un clic sur l'étiquette transforme la ligne en liste de choix : une étiquette par groupe de l'organisation, plus « Aucun groupe » pour détacher le poste. Cliquer le groupe déjà porté referme la ligne sans rien enregistrer.

#### Les extensions navigateur

Un navigateur est présenté **actif** seulement si son extension a parlé à l'agent récemment ; tout contact plus ancien est daté (« Silencieuse depuis » avec la date) plutôt que présenté comme présent. La règle sépare deux situations que la colonne Utilisateur ne peut pas distinguer : une extension désactivée par l'utilisateur, et un poste qui ne sert simplement pas d'outils d'IA. À défaut de tout signalement, la ligne lit « Aucune extension signalée ».

### Politique du poste

L'onglet porte la **dérogation du poste** à la politique de l'organisation — ou à celle de son groupe. L'éditeur est le même que celui de [Shadow AI](../administration/shadow-ai.md), restreint aux sections qu'un poste peut écraser : **Enrôlement & collecte**, **Services**, **Protections**, **Masquage local**, et en Enterprise **Sensibilité des usages**. Les sections laissées en héritage suivent le groupe s'il existe, sinon l'organisation — la case « Hériter » nomme l'écran dont la section est héritée.

L'en-tête de section affiche la portée (« Dérogation du poste ») et la révision courante. Chaque enregistrement produit une nouvelle révision, distribuée aux postes à leur prochaine synchronisation ; l'application effective s'observe dans Monitoring.

:::enterprise

La section **Sensibilité des usages** n'existe dans l'éditeur que si l'édition sert cette capacité : sans elle, la section n'est pas affichée du tout, plutôt qu'une grille inutilisable.

:::

![Milvago - Politique du poste](/img/docs/fr/fleet-postes-06.png)

### Outils locaux

:::enterprise

Cet onglet n'existe qu'en Enterprise, pour un accès d'analyste. Il liste les applications locales observées sur ce poste par le module d'inventaire : outil, type d'observation (processus, exécutable, installation, extension, port), première et dernière observation.

Deux règles de lecture, assumées par l'écran lui-même :

- les observations « ne prouvent pas l'utilisation d'un outil » ;
- « une présence locale détectée est distincte d'un événement navigateur ou d'un prompt émis » — une application installée n'est pas un usage.

À défaut d'observation, l'écran l'énonce : « Aucun outil local signalé », et les observations du module d'inventaire apparaîtront ici.

:::

## Approuver, révoquer, supprimer

Trois actions différentes, à ne pas confondre :

- **Approuver** : donner accès. Réservée au poste en attente ; le poste passe à l'état actif et commence à transmettre.
- **Révoquer** : couper l'accès en conservant l'historique. La confirmation l'énonce : le poste « perdra son accès à l'envoi d'événements et aux nouvelles politiques. Un nouvel enrôlement sera nécessaire pour rétablir son accès. »
- **Supprimer** : aller plus loin que la révocation, définitivement. La confirmation porte le texte complet : « La suppression retire l'identité du poste : il perd immédiatement le droit d'envoyer, comme s'il était révoqué, et son agent abandonne sa file locale. Elle est définitive et va plus loin qu'une révocation : le poste disparaît de la console avec ses événements, sa dérogation de politique et ses observations locales. La révocation, elle, coupe l'envoi en conservant l'historique. » Supprimer un poste exige un second facteur vérifié à l'instant et n'est jamais accessible à une clé API, car la suppression efface tout son historique — événements et texte des requêtes et réponses conservé compris. Tant que le poste porte encore du texte conservé, sa suppression exige aussi le droit de purger les contenus (`content.purge`, réservé au propriétaire par défaut) ; sinon le serveur refuse avec « Ce poste porte encore du texte de prompt conservé : le supprimer exige le droit de purger les contenus. »

![Milvago - Approuver, révoquer, supprimer](/img/docs/fr/fleet-postes-08.png)

La suppression fonctionne aussi en masse : cocher plusieurs postes dans la liste affiche le bouton « Supprimer (N) », et la confirmation liste les noms (dix affichés, puis « et N autres »). Chaque poste est supprimé par une requête propre : un échec est signalé poste par poste (« Suppression impossible pour : … ») au lieu d'interrompre toute la sélection, et les succès sont comptés à part.
