---
sidebar_position: 4
title: Mécanismes de sécurité
---

# Mécanismes de sécurité

Les garde-fous de Milvago se répartissent en quatre couches : **l'intégrité des politiques**, **le durcissement local**, **l'isolation côté serveur** et **le contrôle des accès**. Aucune couche ne repose sur la confiance dans une autre.

![Milvago - Mécanismes de sécurité](/img/docs/fr/introduction-securite-01.png)

## Politiques signées et éphémères

Tout ce qui pilote un poste est **signé côté serveur et vérifié côté agent** :

- le **catalogue de détection** (moteur + données) porte une révision monotone et des données signées ; un catalogue plus ancien, avec moins d'entrées, n'est pas interchangeable dans sa fenêtre de validité ;
- la **politique** appliquée par l'extension exige une révision et une expiration (au plus 15 minutes) : une politique hors expiration est rejetée, pas adaptée ;
- le **manifeste de mise à jour** est signé ; une montée de version refuse le rejeu d'une version déjà installée et toute rétrogradation signée ne rouvre pas de downgrade — un applicateur SYSTEM local vérifie la santé du service courant avant d'annoncer « installé », et un reçu protégé pour prouver un retour arrière.

## Le durcissement local (poste)

- **Échec en fermeture partout** : sans politique valable, l'extension scelle la surface IA couverte ; le relais refuse un canal IPC squatte par un processus utilisateur (vérification sur le **propriétaire de l'objet**, pas sur un identifiant de processus falsifiable).
- **Canal IPC durci** : descripteur restreint, anti-squat (`FIRST_PIPE_INSTANCE`, propriétaire SYSTEM), anti-usurpation (impersonation du client pour lire son jeton, champs d'autorité remplacés par le service), plafond de connexions **par appelant** — un processus local ne peut pas priver tout le poste de décision.
- **Le service ne divulgue pas sa politique** : la projection `/v3/policy` retire mots-clés, exceptions, expressions de masquage personnalisées et message de blocage du canal visible par tout utilisateur local.
- **Le collecteur ne fait confiance à rien de l'agent** : état et ancre séparés, canal réservé aux services, et lecture de fichiers validée **sur le descripteur ouvert**, pas sur le chemin — une jonction substituée donne une erreur, pas une lecture.
- **Mises à jour privilégiées sans primitive de rétrogradation** : le service applicateur ignore les arguments de l'appelant, relit le `binPath` posé en SYSTEM, et refuse toute installation dont la portée dépasse sa portée.

## Isolation et contrôles côté serveur

- **Row-Level Security** : en Enterprise, chaque organisation n'accède qu'à ses lignes au niveau de la base — pas un filtrage applicatif ; l'isolation est prouvée par la suite de tests.
- **RBAC par permissions vivantes** : les routes exigent des permissions vérifiées à chaque appel ; l'édition déclarée par le client n'accorde rien.
- **Verrous de confidentialité** : noms de machines, lecture de conversation, découverte des domaines candidats — chaque route exige session valide, **MFA fraîche** et **motif écrit** ; le changement de confidentialité porte son motif et sa révision.
- **Journal d'audit non purgable** : rétention de 730 jours appliquée par un déclencheur en base — aucun chemin de code, ni un rôle compromis, ne peut raccourcir la trace des actions.
- **Clés API hachées** (SHA-256, 256 bits de `crypto/rand`) et à autorité bornée (`keyOnly` pour le serveur MCP, lecture seule) ; expirations et révocations vérifiées à chaque appel.
- **Contenu scellé** : tout texte conservé et tout secret durable passent par un chiffrement **AES-256-GCM** dont l'enveloppe porte sa propre version, liée au chiffré — une enveloppe réétiquetée ne peut pas ouvrir les octets avec une autre clé ; deux racines de clés distinctes séparent la rotation bon marché (sessions) du re-scellement (contenu).
- **Ingestion défensive** : documents JSON stricts (champs inconnus refusés), bornes de taille, sanitisation de l'utilisateur OS (jamais le compte de service), validation Origin/CSRF côté console, limites de débit par poste et par route.

## La posture

![Milvago - La posture](/img/docs/fr/introduction-securite-02.png)

Trois principes traversent tous ces mécanismes :

1. **Défaillances fermées.** Agent injoignable, service arrêté, canal suspect : la surface IA est bloquée, jamais ouverte en attendant mieux. Seule exception documentée : un canal qui refuse *tout* serveur non identifiable casserait l'enrôlement légitime — le cas est borné et documenté, jamais étendu.
2. **La présence n'est pas l'usage.** Aucun mécanisme ne transforme une détection en accusation : l'attribution d'une personne exige une association OIDC vérifiée ; tout le reste est dit « informatif ».
3. **Le défaut de privilège est une décision, pas un oubli.** Chaque composant privilégié détient son canal, son ancre et son magasin ; l'agent ne reçoit jamais un pouvoir qu'il n'a pas demandé.
