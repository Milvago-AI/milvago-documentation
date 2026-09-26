---
sidebar_position: 7
title: Paramètres
---

# Paramètres

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Paramètres**. L’entrée est visible dans la console ; les sections et actions disponibles dépendent ensuite de vos permissions et, pour certains réglages, de votre rôle de propriétaire de l’organisation racine.

1. Ouvrez **Annuaire LDAP** dans la navigation verticale.
2. Renseignez les paramètres de connexion et d’attributs.
3. Cliquez sur **Tester la connexion** et corrigez toute étape signalée en échec.
4. Après un test réussi, cliquez sur **Enregistrer l’annuaire**.
5. Vérifiez que le statut confirme l’enregistrement de la connexion.

L'écran Paramètres répond à la question « **comment cette organisation et cette instance sont réglées** ». Sa ligne sous le titre l'annonce : « Paramètres de l'organisation et de l'instance. » Une navigation verticale découpe les sections, et **chaque section n'apparaît qu'avec la permission qui la gouverne** : ce que vous ne pouvez pas régler ne s'affiche pas.

![Milvago - Paramètres](/img/docs/fr/administration-parametres-01.png)

## Organisation

Toujours présente. Quatre champs, enregistrés ensemble :

- **Nom de l'organisation** — modifiable par le propriétaire de l'organisation.
- **URL HTTPS publique (agent)** — « URL annoncée aux agents et à l'extension navigateur (enrôlement, installeurs, update.xml). La modifier après un déploiement n'affecte pas les postes déjà enrôlés : ils conservent leur URL et doivent être ré-enrôlés pour en changer. » Seul le propriétaire de l'organisation racine peut la modifier ; pour les autres, le champ porte l'avis « Seul le propriétaire de l'organisation racine peut modifier cette URL. » Sa confirmation conditionne le téléchargement des installateurs.
- **Langue par défaut de l'instance** — « S'applique à la page de connexion atteinte sans langue. Les utilisateurs sans préférence personnelle suivent leur navigateur, puis l'anglais. » Le propriétaire racine seul la modifie.
- **Conservation des événements (jours)** — de 1 à 3650 ; « La durée est validée et appliquée par le serveur. » Raccourcir cette durée exige un second facteur vérifié à l'instant et n'est jamais accessible à une clé API : la purge horaire suivante supprime aussitôt l'historique devenu plus ancien que la nouvelle durée, textes conservés compris. L'allonger reste inchangé.

Un bandeau « Terminer l'installation » apparaît tant que l'URL publique n'est pas confirmée sur une instance installée en mode automatique (`BOOTSTRAP_EMAIL`) — l'assistant de [première installation](../installation/premiere-installation.md) règle directement ces valeurs et ne laisse jamais ce bandeau derrière lui. Il ouvre un assistant en deux étapes : langue par défaut de l'instance, puis nom de l'organisation et URL HTTPS publique. Le même bandeau le rappelle autrement : « Les agents et l'extension navigateur se connecteront à cette URL. Vérifiez-la dans Administration avant tout déploiement. »

## Licence

Toujours présente pour quiconque peut ouvrir Paramètres : ce n'est pas une permission qui la gouverne, mais le rôle de propriétaire de l'instance qui autorise à la modifier. Sa description à l'écran : « État de la licence de cette instance. »

En Community, le panneau précise aussi : « La licence gratuite lève uniquement les limites de Community. Elle ne débloque pas Enterprise, qui nécessite l’édition Enterprise et une licence distincte. »

- **Statut** — badge Aucune, Valide, Période de grâce ou Expirée.
- **Type** — Enterprise, Community, ou « — » si l'instance n'a jamais reçu de licence.
- **Postes maximum** — un nombre, ou « Illimité » si la licence n'en fixe aucun (valeur 0).
- **Expire** — visible seulement quand la licence porte une date d'expiration (les licences Enterprise ; la licence gratuite Community est perpétuelle et n'en affiche pas).
- **Période de grâce jusqu'au** — visible seulement pendant la période de grâce qui suit une expiration Enterprise.
- **Identifiant d'instance** — avec le bouton **Copier l'identifiant**, à transmettre à Milvago AI pour obtenir une licence.

Le propriétaire de l'instance voit, sous ces informations, un champ pour coller le texte d'une nouvelle licence et le bouton **Enregistrer la licence** — « Licence enregistrée. » confirme l'enregistrement. Pour tout autre lecteur, l'écran porte l'avis « Seul le propriétaire de l'instance peut modifier la licence. »

En **Community**, le propriétaire de l'instance voit aussi, sous ce champ, une zone **Demander une licence gratuite** : une adresse e-mail (préremplie avec la sienne) et le bouton **Envoyer la demande** ; « Demande envoyée. Consultez la boîte de réception de {`adresse`} et collez ci-dessous la licence reçue. » confirme l'envoi. La demande part vers Milvago AI, qui répond par e-mail avec le texte à coller ici. Cette licence gratuite est perpétuelle et lève toutes les limites du mode restreint décrites ci-dessous.

[IMAGEAMETTREICI 02]

### Mode restreint (Community sans licence)

Tant qu'aucune licence n'est acceptée, une instance Community fonctionne en **mode restreint** : 5 postes au maximum (les postes révoqués ne comptent pas), le seul compte administrateur créé à l'installation, aucune gestion des rôles ni des membres — l'entrée **Rôles** disparaît de la navigation d'Administration —, aucun annuaire LDAP — la section **Annuaire LDAP** ci-dessous disparaît elle-même de cette page — et aucune connexion SSO. Un bandeau d'avertissement « Aucune licence » apparaît alors sur chaque page de la console, avec un lien pour ouvrir les paramètres. Inscrire un poste au-delà de la limite échoue avec « Cette instance a atteint sa limite de postes pour sa licence actuelle. »

### Enterprise : expiration et blocage

En **Enterprise**, l'instance ne fonctionne jamais sans une licence valide qui lui est propre : une licence Community y est refusée avec « Il s'agit d'une licence Community ; cette instance est Enterprise. » La licence porte toujours une date d'expiration et un nombre maximum de postes (0 = illimité). Après l'expiration, l'instance entre dans une **période de grâce de 10 jours** : un bandeau « Licence bientôt expirée » reste affiché, la console continue de fonctionner normalement. Passé ce délai, la console entière est remplacée par le seul écran de licence — « Licence requise » — « Cette instance n'a pas de licence valide. Un propriétaire doit en saisir une ci-dessous pour continuer. » — et les agents sont refusés jusqu'à la saisie d'une nouvelle licence valide.

### Licence liée à l'instance

Une licence est liée à l'identifiant de cette instance (affiché ci-dessus) : réinstaller Milvago sur une nouvelle base de données change cet identifiant et rend l'ancienne licence invalide ; il faut alors en obtenir une nouvelle.

## Annuaire LDAP

Présente avec la permission `directory.manage` (« Gérer l'annuaire LDAP ») et une licence hors mode restreint : dans une instance Community sans licence, cette section ne s'affiche pas. Un annuaire LDAP propre à l'organisation, matérialisé chez le fournisseur d'identité : type d'annuaire (Active Directory, et les conventions pré-remplies pour les autres, modifiables), URL de connexion `ldap://` ou `ldaps://`, DN de connexion, DN des utilisateurs, attributs, filtre, portée, délais, pagination. L'écran impose un transport vérifié — LDAPS ou StartTLS — avant toute transmission d'identifiants : « LDAP requires LDAPS or StartTLS », la validation le refuse sinon.

Le bouton **Tester la connexion** rejoue les deux étapes (« Connexion et authentification réussies. » ou l'étape en échec) ; **Enregistrer l'annuaire** active la connexion LDAP ; **Supprimer l'annuaire** prévient : « Les utilisateurs de cet annuaire ne pourront plus se connecter. » Tester, enregistrer et supprimer l'annuaire exigent chacun un second facteur vérifié à l'instant ; aucune de ces trois actions n'est accessible à une clé API.

Les comptes d'annuaire s'importent ensuite dans [Membres](membres.md).

:::enterprise

Créer, tester, modifier ou supprimer un annuaire est réservé à un propriétaire de l'organisation racine, pour l'organisation racine ou, après bascule vers elle, pour une organisation fille — la connexion de toute organisation consulte chaque annuaire du fournisseur d'identité partagé. Dans une organisation fille, les autres personnes voient à la place l'avis « Seul un propriétaire de l'organisation racine peut configurer un annuaire, car la connexion de toutes les organisations le consulte. » ou, quand un annuaire y est déjà configuré, « L'annuaire de cette organisation est configuré par un propriétaire de l'organisation racine, car la connexion de toutes les organisations le consulte. Ses utilisateurs s'importent dans Membres. »

:::

## Clé de déploiement

Présente avec la permission `installers.manage` (« Gérer les installeurs »). Voir [Déploiement](deploiement.md), qui la décrit en détail.

## Inscription automatique des connecteurs

:::enterprise

Section réservée à Enterprise, et au **propriétaire de l'organisation racine** : la décision s'écrit sur le fournisseur d'identité de l'instance, pas dans la base de Milvago — ce que l'écran affiche est ce qui est réellement appliqué.

Elle règle la façon dont un connecteur MCP obtient ses propres identifiants : « Un connecteur demande au fournisseur d'identité un client à lui, pour que personne n'ait à coller un identifiant. Fermé tant que vous ne l'ouvrez pas, et l'ouvrir nomme toujours les hôtes vers lesquels une connexion peut revenir. »

- **Laisser un connecteur s'inscrire lui-même** — fermé par défaut.
- **Hôtes autorisés à recevoir une connexion** — « Un hôte par ligne, sans schéma, port ni chemin — claude.ai, ou *.exemple.com. Une inscription est refusée si l'une des adresses demandées n'est pas sur ces hôtes : un code ne peut donc jamais être livré ailleurs. » Un hôte générique conserve au moins deux étiquettes après `*.` — `*.exemple.com` est accepté, `*.com` est refusé. Un état « ouvert à tous les hôtes » posé à la main chez le fournisseur d'identité est signalé comme tel, et ne peut pas être produit par cet écran.
- **Plafond de clients inscrits** — « Une inscription qui dépasserait ce nombre est refusée. Cela borne l'encombrement, pas le risque. »

Ce qui ne se négocie pas : « Une personne voit toujours un écran de consentement avant qu'un modèle n'atteigne quoi que ce soit, un client inscrit est limité à ses droits déclarés, et il ne lit jamais plus que les droits de celui qui se connecte. » Tout client public du fournisseur d'identité doit utiliser PKCE, connecteurs inscrits compris, et Milvago borne au démarrage la durée des connexions longues des connecteurs — sept jours sans usage, trente jours au plus — sans jamais allonger une durée déjà plus courte. Voir [Clés API et serveur MCP](../mon-profil/cles-api.md).

:::
