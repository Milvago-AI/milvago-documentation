---
sidebar_position: 4
title: Instance de démonstration
---

# Instance de démonstration

Une instance de démonstration publie le produit sur Internet : n'importe qui peut le visiter avec un identifiant simple, sans rien pouvoir modifier, avec des données qui bougent toutes les cinq minutes. Elle s'appuie sur deux variables d'environnement et une pile Docker dédiée.

![Milvago - Instance de démonstration](/img/docs/fr/avance-demo-instance-01.png)

## Mettre en service la démonstration

1. Depuis l’hôte d’exploitation Docker, préparez les deux variables de démonstration dans les secrets de déploiement.
2. Démarrez la pile `compose.demo.yaml` dédiée, sans exposer d’autre service que son proxy.
3. Ouvrez l’URL publique et connectez-vous avec le compte de démonstration.
4. Vérifiez qu’une action de modification est refusée et que les données synthétiques sont visibles avant de communiquer l’URL.

## Les deux variables

| Variable | Effet |
| --- | --- |
| `MILVAGO_DEMO_READONLY` | refuse **toute** mutation console sur l'instance, quel que soit le rôle de l'appelant, **avant le routage** — une route ajoutée plus tard est couverte sans y penser. Deuxième garde, plus grossière, par-dessus le rôle : deux routes console sont enregistrées sans permission (`PUT /api/profile`, `POST /auth/logout`), donc un rôle en lecture seule ne couvre pas tout |
| `MILVAGO_DEMO_MCP_KEY` | clé MCP de démonstration affichée sur la page de profil — **et nulle part ailleurs**, et seulement si l'instance est en lecture seule : une instance qui accepte des écritures peut se fabriquer ses propres clés, et une instance client ne doit jamais afficher un credential qu'elle n'a pas créé |

L'**ingestion des postes** (`/v1`, `/v2`, `/v3`) reste volontairement hors périmètre du drapeau : c'est par là que les données arrivent, et elle exige un credential d'appareil qu'aucun visiteur ne détient.

## La pile

`compose.demo.yaml` est une pile autonome, distincte du compose principal : aucun port publié sauf ceux du **proxy**, pas d'instance Community, et tout ce qui n'est pas le proxy est coupé d'Internet. Quatre couches font respecter la lecture seule :

1. **L'arête** : seuls `GET`/`HEAD` passent, plus la déconnexion ; les chemins d'ingestion, `/mcp`, `/metrics` et `/ext` répondent 404 publiquement.
2. **Le serveur** : `MILVAGO_DEMO_READONLY`.
3. **Le rôle** : un rôle `demo` en lecture (`overview.read`, `events.read`, `devices.read`, `members.read`, `content.read`, `reports.aggregate`), aucune permission de gestion — la console masque donc toutes les actions.
4. **L'identité** : changement de mot de passe et inscription désactivés — sinon un visiteur change le mot de passe partagé et verrouille les suivants.

![Milvago - La pile](/img/docs/fr/avance-demo-instance-02.png)

## Aucun agent téléchargeable

Une démonstration montre le produit ; elle **ne distribue pas un agent** capable d'enrôler une vraie machine. Les routes d'installateur et de clé de déploiement exigent une permission que le rôle ne porte pas, et l'arête refuse explicitement les chemins d'extensions et d'installateurs en 404 — une règle qui ne dépend ni du rôle, ni du contenu de l'image. Conséquence assumée : les pages de réglages Shadow AI et Découverte ne sont pas visibles ; les **données** le sont.

## Les données de démonstration

Le générateur provisionne ce qu'un credential d'appareil ne peut pas atteindre, puis parle le **protocole agent réel** : rien n'est écrit dans les tables d'événements derrière le dos du serveur — scellement, classification, attribution et rétention passent par le code qu'exerce la flotte d'un client.

- Historique de 30 jours posté une fois, puis une **vague toutes les cinq minutes** : la rétention borne la base, rien n'est effacé en bloc.
- Contenu entièrement inventé (plages de documentation, domaines d'exemple), donc présenté en clair : le visiteur voit l'étendue de ce que le produit peut retenir.
- Une flotte synthétique par défaut de 25 postes, un quart natifs (les deux canaux de collecte côte à cête), sans aucun nom de personne.
- Douze thèmes tournent en une heure — pic de téléversements bloqués, secrets détectés, plateforme non couverte, modèle refusé… — donc un visiteur qui reste voit la **forme** changer, pas seulement les compteurs monter.

![Milvago - Les données de démonstration](/img/docs/fr/avance-demo-instance-03.png)
