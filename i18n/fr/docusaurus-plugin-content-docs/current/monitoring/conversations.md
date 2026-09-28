---
sidebar_position: 2
title: Conversations
---

# Conversations

Le journal des conversations regroupe les échanges Shadow AI observés sur les postes de l'organisation : qui a parlé à quel service, depuis quel poste, avec quel résultat (observé, bloqué, masqué). Il répond à la question « **quoi** » que la vue d'ensemble laisse ouverte après le « combien ».

La ligne d'information sous le titre définit le grain de la lecture : une conversation regroupe les enregistrements d'un même échange sur un même poste ; un enregistrement sans identifiant de conversation reste isolé.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Conversations**. Il faut `events.read` et une organisation qui n’est pas en consultation agrégée seule.

1. Choisissez **24 h**, **7 j**, **30 j** ou **Personnalisé**; renseignez les champs voulus puis cliquez sur **Appliquer**. Le tableau revient à la première page et ne montre que le périmètre choisi.
2. Cliquez sur une ligne pour ouvrir le fil, puis sur **Charger les messages précédents** si nécessaire. Cliquez sur **Réinitialiser** pour revenir aux dernières 24 h.
3. Pour réutiliser le périmètre, cliquez sur **Enregistrer cette vue**, nommez-la, choisissez éventuellement **Partager avec l’organisation**, puis enregistrez. Les propriétaires et administrateurs peuvent remplacer ou supprimer une vue partagée.
4. Choisissez JSON ou CSV puis **Exporter**; le fichier reprend exactement les filtres. **Rapport de synthèse** ouvre le rapport du même périmètre dans un nouvel onglet. L’option d’identité révélée n’apparaît qu’avec `identity.reveal`.

![Milvago - Conversations](/img/docs/fr/monitoring-conversations-01.png)

## La barre de filtres

Elle est affichée d'emblée, sans bouton « Affiner les filtres ». Elle porte :

- la **période**, en segments directs (24 h, 7 j, 30 j) ou personnalisée (du / au, les deux bornes étant obligatoires et ordonnées) ;
- les **identifiants** : personne (acteur) et poste ;
- les **dimensions d'usage** : navigateur ou application, service, modèle, et une recherche plein texte ;
- l'**action** (observée, bloquée, redirigée) et la **nature** (prompt, réponse, navigation) ;
- la présence d'une **pièce jointe**.

![Milvago - La barre de filtres](/img/docs/fr/monitoring-conversations-02.png)

Les **vues enregistrées** complètent la barre : une vue porte un nom, peut être **partagée avec l'organisation** (alors gérable par les Propriétaires et Admins), et l'appliquer réinitialise la pagination. Changer un filtre ramène toujours à la page 1.

## Le tableau

Chaque ligne est une conversation, et la ligne entière l'ouvre — avec un vrai bouton dans la première cellule pour la navigation clavier. Colonnes :

| Colonne | Contenu |
| --- | --- |
| **Outil / service** | le fournisseur (bouton d'ouverture) et l'outil précis (navigateur ou application locale) |
| **Modèle** | le modèle utilisé, et son effort de raisonnement le cas échéant ; « Non déterminé » quand rien n'a pu être observé |
| **Poste** | nom de machine, ou « Nom de machine indisponible » ; un identifiant de poste tronqué à 8 caractères est toujours affiché, le survol révèle l'identifiant complet |
| **Personne** | voir la règle d'attribution ci-dessous |
| **Dernière activité** | avec l'heure de début de l'échange |
| **Messages** | prompts + réponses échangés |
| **Fichiers joints** | badge ambre « Avec fichier » — un document parti avec la conversation |
| **Action** | badge rouge « N bloqués », badge ambre « N redirigés », sinon statut observé |
| **Sensibilité** | Enterprise uniquement (voir plus bas) |

![Milvago - Le tableau](/img/docs/fr/monitoring-conversations-03.png)

### La règle d'attribution des personnes

La colonne Personne applique la même règle dans la liste, dans le fil et dans le détail, et la formule est honnête sur ce qu'elle sait :

1. Une **association OIDC vérifiée** nomme la personne, avec la mention « Personne vérifiée ».
2. À défaut, le **compte OS** derrière le navigateur ou l'outil est affiché *à titre informatif* — et dit comme tel. Pour un outil natif, c'est le profil collecté par l'application.
3. À défaut, si le serveur sait qu'une personne existe sans dire qui (pseudonymat), la cellule lit « Pseudonymisé » ; sans aucune piste, « Non attribué ». Le mot « Non attribué » ne désigne pas un compte masqué : il désigne l'absence totale de piste.

Un outil présent sur un poste ne permet jamais d'inférer son utilisateur.

## Le fil d'une conversation

Ouvrir une conversation déplie un dialogue plein écran : résumé de l'échange (personne, outil, modèle, début, dernière activité, nombre de messages) en tête, puis les messages rendus du plus ancien au plus récent, comme l'échange a eu lieu.

![Milvago - Le fil d'une conversation](/img/docs/fr/monitoring-conversations-04.png)

- Le fil se **charge par pages** : « Charger les messages précédents » remonte dans le temps. Chaque page est une requête indépendante — si un droit de révélation d'identité expire, les pages suivantes ne portent plus la donnée révélée, au lieu d'un tampon qui la garderait au-delà de son échéance.
- Le texte des messages est un texte **brut**, sélectionnable et copiable, jamais réécrit ni interprété. Un clic sur la bulle ouvre son détail, sauf si un texte est en cours de sélection (sinon surligner pour relire ouvrirait un dialogue au relâchement) ; la bulle s'ouvre aussi avec Entrée ou Espace lorsqu'elle a le focus ; sa petite icône de détail reste accessible au clavier.

### Ce que montre une bulle

- **PROMPT CACHÉ / RÉPONSE CACHÉE**, avec la cause nommée : « lecture non autorisée » (droit manquant), « texte non conservé » (la collecte du texte est désactivée ou le contenu purgé), « identité non levée ».
- Les **fichiers joints** sont listés avec une icône par type — lue dans l'extension du nom, la seule information disponible : aucun octet de fichier n'est jamais lu.
- Un envoi **accompagné d'un fichier** produit deux enregistrements (le fichier part chez le fournisseur dès l'attachement) ; à l'affichage, la pièce jointe rejoint la bulle de son message — un pliage d'affichage seulement, chaque enregistrement gardant son horodatage et son détail.
- Une bulle **bloquée** porte le motif du refus, nommé et pas brut : « Modèle interdit par la politique », « Modèle non identifiable », « Contrôle local indisponible ».
- Les **navigations** apparaissent comme des lignes de repère dans le fil, cliquables vers leur détail.

![Milvago - Ce que montre une bulle](/img/docs/fr/monitoring-conversations-05.png)

### Le détail d'un enregistrement

Le détail ne concerne qu'un sens — un envoi **ou** une réponse — et son titre le nomme. Il réunit : horodatage, personne, poste, source (navigateur ou application locale), service et modèle, action, motif de refus le cas échéant, plateforme, nombre de caractères, catégories détectées, fichiers joints, révision de politique appliquée, URL, identifiants de conversation et de corrélation.

Le texte conservé, s'il existe, s'affiche avec l'avis **« Cette lecture de contenu a été auditée. »** : toute consultation d'un texte stocké est tracée. Sans droit de lecture explicite, l'écran montre un encadré qui le dit au lieu d'un cadre vide.

<img className="mv-doc-image--compact" src="/img/docs/fr/monitoring-conversations-06.png" alt="Milvago - Le détail d'un enregistrement" />

## Exports et pagination

- Les **exports** contiennent les métadonnées correspondant exactement aux filtres courants ; les textes éventuels exigent un droit de lecture explicite, et chaque consultation est auditée. La mention figure sous le tableau, pas dans une notice enfouie.
- La **pagination** est numérotée (première et dernière page toujours atteignables, ellipsis sur les sauts) avec un sélecteur de taille de page en haut à droite et le compte total des résultats. À zéro résultat, l'écran propose d'élargir la période ou de retirer un filtre.

![Milvago - Exports et pagination](/img/docs/fr/monitoring-conversations-07.png)

:::enterprise

Le filtre et la colonne de **sensibilité des usages** sont réservés à Enterprise : Community ne les affiche jamais, sur le journal comme sur la carte. En Enterprise, un événement sensible porte un badge ambre, et les contenus masqués portent les libellés des règles de masquage qui les ont détectés.

:::
