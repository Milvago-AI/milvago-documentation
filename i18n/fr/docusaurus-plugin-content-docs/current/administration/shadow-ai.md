---
sidebar_position: 3
title: Shadow AI
---

# Shadow AI

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Shadow AI**. Vous devez disposer de `policy.manage` (« Gérer la politique (Shadow AI) »).

Pour modifier une règle :

1. Sélectionnez sa section dans la navigation verticale.
2. Modifiez les champs concernés.
3. Cliquez sur **Enregistrer les modifications**. Le badge Brouillon disparaît et la confirmation indique que les installations recevront la nouvelle révision à leur prochaine synchronisation.

L'écran « Administration Shadow AI » porte la **politique appliquée aux usages d'IA** : ce qui est collecté, quels services sont observés, bloqués ou redirigés, ce qui est masqué au départ du poste, ce que Découverte a le droit de nommer. Il répond à la question « **quelles règles mes postes appliquent-ils** ». L'accès exige la permission `policy.manage` (« Gérer la politique (Shadow AI) »).

La ligne sous le titre fixe le cadre : « Collecte, protection et exploitation, dans une politique cohérente. » La politique est **signée et révisée** — chaque enregistrement produit une nouvelle révision, distribuée aux installations à leur prochaine synchronisation ; un poste n'applique jamais une révision plus ancienne que la sienne.

## Les sections

Une navigation verticale découpe l'écran, numérotée dans l'ordre de la politique :

1. **Enrôlement & collecte** — comment un poste obtient le droit de transmettre, et ce que la collecte conserve.
2. **Services** — les services couverts et leur comportement ; en Enterprise, le contrôle des modèles.
3. **Protections** — blocage des pièces jointes et mots protégés.
4. **Masquage local** — remplacement des données détectées avant tout envoi.
5. **Sensibilité des usages** — Enterprise uniquement ; la section n'existe pas dans le reste.
6. **Plateformes IA** — ce que Découverte signale, au niveau de l'organisation.
7. **Exploitation** — mises à jour signées et parc pilote, sous drapeau de diagnostic.

Chaque enregistrement lit « Configuration enregistrée. Les installations la recevront à leur prochaine synchronisation. » Tant que des champs changent, un badge « Brouillon » signale l'état non enregistré.

![Milvago - Les sections](/img/docs/fr/administration-shadow-ai-01.png)

## Enrôlement & collecte

### Approbation des postes

« Choisissez comment une nouvelle installation obtient le droit de transmettre. » Trois modes :

- **Approbation manuelle** — chaque poste installé apparaît en attente et ne transmet rien avant approbation dans Postes.
- **Approbation automatique** — le poste transmet dès son inscription.
- **Selon le réseau et le domaine** — une liste de règles, jusqu'à 50 (**Ajouter une règle** / **Supprimer la règle**). Chaque règle porte un **Réseau (CIDR)** obligatoire et un **Domaine de la machine (facultatif)**. Un poste est approuvé automatiquement quand son adresse de connexion, telle que le serveur la constate, se trouve dans le réseau d'une règle et, si la règle nomme un domaine, que la machine a déclaré ce domaine à l'inscription.

  Une requête reçue derrière un mandataire inverse, une Ingress ou une Gateway — reconnaissable à un en-tête `Forwarded`, `X-Forwarded-For` ou `X-Real-IP` — n'est jamais approuvée par le réseau : le poste attend une approbation manuelle dans Postes. Derrière un tel intermédiaire, utilisez plutôt l'approbation manuelle ou l'approbation automatique.

  Les domaines déclarés : domaine DNS Active Directory (Windows joint à un AD), identifiant de tenant Entra ID (Windows joint à Entra) et royaume Kerberos Linux (`realm join`, `default_realm` de `/etc/krb5.conf`). La comparaison est exacte et insensible à la casse, sans correspondance partielle ni de suffixe.

  Un domaine n'approuve jamais seul : une règle exige toujours un CIDR, car le domaine est déclaré par la machine elle-même et le serveur ne peut pas le vérifier — quelqu'un disposant de l'installateur de l'organisation sur une machine hors du parc pourrait déclarer n'importe quel domaine. Les règles écrites avant cette version (simple liste de réseaux) continuent de fonctionner comme des règles sans domaine. Les agents antérieurs à la version 0.5.45 ne déclarent aucun domaine : seules les règles sans domaine peuvent les approuver.

Cette section n'existe qu'au niveau de l'organisation : ni un groupe, ni un poste ne redéfinit l'enrôlement.

### Collecte navigateur

- **Activer la collecte** — les usages dans le navigateur. La désactivation arrête les nouvelles collectes.
- **Conserver le texte des requêtes et réponses** — « Désactivé par défaut. L'activation exige un second facteur vérifié à l'instant, jamais une clé d'API. La lecture nécessite une autorisation distincte. » La console redirige alors vers la vérification du second facteur et rejoue le changement au retour. La conservation des textes est bornée par « Conservation des textes (jours) », de 1 à 30. Désactiver le contenu arrête les nouvelles collectes et retire les textes en attente au prochain rafraîchissement de politique ; il ne supprime pas les métadonnées déjà reçues.
- **Conserver les noms des fichiers transmis** — « Les noms seuls, jamais le contenu. » Ils sont relevés là où un fichier entre réellement dans le composeur — sélection, dépôt, collage ; un fichier ajouté par un chemin que la page n'expose pas reste invisible.

La description de section porte la limite d'édition : « Community associe l'extension au pont Rust ouvert. Les conversations d'applications locales restent une capacité Enterprise. »

## Services

« Le catalogue et les domaines autorisés viennent du serveur. Un service activé n'implique pas une couverture exhaustive de son interface. » Chaque service couvert porte :

- une case d'activation ;
- ses domaines, affichés tels que le catalogue les déclare ;
- un **comportement** : Observer, Bloquer, Rediriger ;
- en redirection, une **destination de redirection** obligatoire.

:::enterprise

Le paquet Community ne construit que les adaptateurs ChatGPT et Claude : son catalogue d'usine et son exécution ne nomment jamais les autres services. Enterprise couvre neuf fournisseurs — ChatGPT, Claude, Le Chat, Copilot, Gemini, NotebookLM, DeepSeek, Perplexity, Grok.

### Contrôle des modèles

Quand l'édition qualifie le contrôle des modèles, la section Services gagne un bloc « Contrôle des modèles » : « Les restrictions de services sont prioritaires. Ces règles précisent les modèles autorisés ou refusés par plateforme. » Chaque plateforme, par canal (Navigateur ou Application locale), porte une règle — « Sans restriction », « Tout autoriser sauf la liste », « Tout interdire sauf la liste » — et, le cas échéant, une liste d'identifiants exacts de modèles : un identifiant par ligne, 100 maximum, non approchés. « Les modèles Unknown ou Auto non vérifiables sont bloqués tant qu'une restriction est active. »

Un tableau « État appliqué par poste » recense, par poste et plateforme, l'état (À mettre à jour, En attente, Appliqué, Indisponible), la révision attendue et la raison éventuelle : « Les règles enregistrées restent distinctes des révisions effectivement appliquées. » Le poste y apparaît sous son nom réel pour qui porte `devices.read` hors consultation agrégée seule ; les autres lecteurs voient l'alias du poste. En consultation agrégée seule, le tableau ne compte que les postes par plateforme, canal et état, sans désigner de poste. L'observation du nom du modèle ayant répondu reste ouverte aux deux éditions ; la décision d'autoriser ou refuser un modèle est Enterprise.

Le confinement au niveau système (WFP sous Windows, SELinux sous Linux) ne couvre que les exécutables enregistrés, à leur emplacement d'installation. Une copie de l'exécutable placée ailleurs n'est pas confinée.

:::

![Milvago - Contrôle des modèles](/img/docs/fr/administration-shadow-ai-03.png)

## Protections

### Pièces jointes

**Bloquer les envois de fichiers** scelle les routes de téléversement **mesurées** du catalogue (`kind:"file"`) — les URL qu'un envoi déclenche réellement sur le site, relevées sur place et publiées dans le catalogue signé, jamais devinées. Aucune heuristique sur la méthode, l'hôte ou la forme du corps : seules les routes de téléversement mesurées sont concernées, afin d’éviter d’intercepter un envoi légitime. « L'interception dépend du navigateur et des interfaces prises en charge. »

### Mots et expressions à protéger

« Les détections sont appliquées localement selon la politique signée. » Le bloc porte :

- **Expressions protégées** — une expression par ligne ; ne pas y placer d'identifiants d'accès.
- Trois paliers de correspondance, réglés séparément : **Correspondance exacte**, **Variantes Unicode**, **Correspondance approchée** (ce dernier peut être Désactivé).
- **Exceptions** — une par ligne ; elles réduisent le périmètre de détection.
- **Message présenté lors d'un blocage**.

![Milvago - Mots et expressions à protéger](/img/docs/fr/administration-shadow-ai-04.png)

## Masquage local

« Agit sur le texte capturé, sur le poste, avant tout envoi : chaque donnée détectée est remplacée par son étiquette, par exemple [email]. Indépendant de la sensibilité des usages (tableaux de bord) et de la conservation des textes. Les détections restent heuristiques et limitées aux formats pris en charge ; vérifiez les résultats avant d'élargir le déploiement. » Deux interrupteurs : **Activer le masquage**, et **Demander une relecture avant envoi**.

:::enterprise

Les **catégories intégrées** — E-mail, Téléphone, IBAN, Carte de paiement, Identifiant social (France), Numéro de sécurité sociale (États-Unis), Adresse IP — sont une capacité Enterprise. La garde réseau ne retient que ce qui porte un prompt : une route de prompt du catalogue, ou un corps ayant la forme d'un prompt — le composeur a déjà arrêté ou masqué le texte à la source. Les marqueurs portent le **libellé de la règle** et un numéro par valeur distincte dès qu'il y en a plusieurs : `[IP]`, ou `[IP1]` et `[IP2]`.

:::

### Règles de masquage personnalisées

Les deux éditions définissent des règles personnalisées : un **libellé**, une **expression régulière** bornée (sans références arrière ni assertions — le serveur refuse les motifs dangereux), **Active**, **Ignorer la casse**. Un libellé que sa propre expression reconnaît est signalé et bloqué à l'enregistrement : le libellé devient le marqueur inséré dans le texte masqué (`[LIBELLE]`, `[LIBELLE1]`…), et une expression qui le capturerait masquerait ses propres marqueurs à chaque passage, sans fin.

En Community, sans catégories intégrées, l'écran l'explicitement : « Cette édition ne fournit pas de motifs de détection intégrés : définissez vos propres expressions régulières dans « Règles de masquage personnalisées » ci-dessous. »

![Milvago - Règles de masquage personnalisées](/img/docs/fr/administration-shadow-ai-05.png)

:::enterprise

## Sensibilité des usages

La section n'existe en Enterprise que si l'édition qualifie la sensibilité — sans quoi elle n'est pas affichée du tout, jamais vide. « Détermine quelles catégories détectées rendent un événement « sensible » dans le journal, la cartographie et les exports. Ne modifie pas le texte capturé : le masquage se règle dans « Masquage local ». Les catégories sont des indices de sensibilité, pas une certification de conformité. »

Trois blocs :

- **Sensibilité des usages navigateur** et **Sensibilité des applications locales** — les catégories qui marquent un événement sensible : les données personnelles, plus Code source, Données médicales et Mots-clés.
- **Termes médicaux** — « Un texte contenant l'un de ces termes reçoit l'étiquette « Données médicales ». Recherche de sous-chaîne, insensible à la casse, sur le poste. » Un terme par ligne, 100 au maximum, 60 caractères chacun ; liste vide, aucune détection.

Les mots-clés viennent des expressions protégées de « Protections ».

:::

## Plateformes IA

Cette section se règle **au niveau de l'organisation** : Découverte se lit là, les plateformes qu'elle a le droit de nommer s'y choisissent. Elle porte deux réglages distincts :

- **Découvrir les domaines candidats** — « Une fois activée, la découverte inspecte localement les corps des requêtes en mémoire pour reconnaître leur structure, sans les conserver. » L'interrupteur écrit dans les réglages de confidentialité : il exige `settings.manage`, une MFA fraîche et un motif écrit d'au moins 8 caractères, conservé au journal d'audit. Désactivée par défaut, l'écran Découverte reste vide avec l'avis qui renvoie ici.
- **La liste des plateformes connues** — regroupées par catégorie (Assistants généralistes, Assistants de programmation, Agrégateurs multi-modèles…), avec recherche et compte « Plateformes : N · masquées de Découverte : N ». Décocher une plateforme la **masque de Découverte** : « Présence seule : ces plateformes sont signalées comme atteintes, rien n'est lu dans leurs pages. Masquer une plateforme continue d'enregistrer ses visites et la retire de Découverte ; l'afficher de nouveau restitue son historique. » Le masquage ne traverse pas le catalogue signé : c'est un choix de lecture, pas un changement de détection, et il ne produit pas de nouvelle révision de politique.

Une plateforme que l'édition capture déjà n'apparaît jamais dans la liste : le serveur n'envoie que ce que cette édition ne capture pas en entier, et une plateforme capturée ne peut pas atteindre Découverte.

![Milvago - Plateformes IA](/img/docs/fr/administration-shadow-ai-06.png)

## Exploitation

Sous drapeau de diagnostic de l'instance, la section « Mises à jour et parc pilote » règle les **mises à jour signées** : activation, part du parc pilote, identifiants des postes pilotes, versions suspendues. Sans chaîne de livraison signée annoncée, la case est inerte avec l'avis « Aucune chaîne de mise à jour signée n'est annoncée comme opérationnelle. » La désactivation porte son propre avertissement : « Les agents restent sur leur version installée, y compris en cas de correctif de sécurité. »

Un bloc « État constaté par le serveur » affiche l'état annoncé et les versions signées disponibles.

## Héritage et dérogations

La politique se lit en cascade : **organisation → groupe de postes → poste**. Au niveau organisation, chaque section peut être **imposée** aux descendants qui héritent ; un groupe ou un poste peut déroger section par section, la dérogation la plus proche du poste gagnant. Voir [Héritage de la configuration](../introduction/heritage-configuration.md), [Groupes de postes](../fleet/groupes.md) et [Postes](../fleet/postes.md).
