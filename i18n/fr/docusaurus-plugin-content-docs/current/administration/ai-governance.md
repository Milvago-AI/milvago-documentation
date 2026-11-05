---
sidebar_position: 8
title: Autorisations IA et NIST
---

# Autorisations IA et NIST

Ouvrez **Administration > Shadow AI > Gouvernance IA** pour décider quels logiciels observés sont permis sur quels postes. Community et Enterprise proposent des règles par organisation, groupe de postes ou poste. Enterprise hérite aussi des règles des organisations parentes.

Milvago s’appuie sur NIST AI RMF comme référentiel de gouvernance. L’inventaire, les décisions d’autorisation et les dates de revue soutiennent votre démarche. Ils ne constituent ni une certification ni une évaluation de tous les risques IA. **Couverture NIST et limites** distingue la prise en charge partielle, l’évaluation manuelle et les sujets non évalués par la découverte, comme l’équité ou la précision des modèles.

## Déclarer un usage métier ou un système IA

Dans la même vue, ouvrez **Usages et systèmes IA déclarés**. Avec `policy.manage`, choisissez **Déclarer un usage** ou ouvrez une ligne existante. Le panneau à droite permet d’indiquer son nom, son responsable, son objectif métier et sa portée : organisation, groupe ou poste.

Vous pouvez relier les identifiants des applications de l’inventaire et déclarer les fournisseurs et modèles, jusqu’à 16 valeurs par liste. Sélectionnez les catégories de données, décrivez les impacts possibles et les mesures de protection, puis fixez une date de réexamen. Décrivez des catégories plutôt que de copier des données réelles ou des conversations. Le niveau de risque est une évaluation manuelle de votre organisation ; **Non évalué** signale une évaluation restant à faire.

Choisissez le cycle de vie déclaré : prévu, en cours de revue, en service ou retiré. Une déclaration en service est une information métier. Elle ne prouve pas que le logiciel a été observé ou autorisé. Les revues en retard sont signalées. La recherche porte sur le nom, le responsable, l’objectif et les applications associées.

Choisissez **Enregistrer le registre** avec un motif et un MFA récent. Le registre possède sa propre révision : sa modification préserve les règles d’autorisation des logiciels et leurs exceptions actuelles. Si un autre administrateur a enregistré entre-temps, rechargez le registre avant d’appliquer vos changements. Retirer une déclaration demande confirmation et conserve les observations et les règles d’autorisation. Chaque organisation dispose de 128 déclarations au maximum, dans une limite de 256 Kio.

## Publier une règle

Avec `policy.manage`, ajoutez une règle et saisissez l’identifiant du logiciel affiché dans l’inventaire. Choisissez **Présence** ou **Exécution**. Une règle d’exécution nécessite une exécution observée ; un nom de paquet ou une image de conteneur ne suffit pas.

Choisissez l’organisation, un groupe ou un poste. Pour un groupe ou un poste, utilisez la liste de sélection. Choisissez **Autoriser** ou **Interdire**, indiquez le responsable, l’objectif et les conditions, puis une date de réexamen. Une fin de validité facultative met automatiquement fin à la règle. Saisissez un motif et publiez avec un second facteur récent. Enregistrer les sources de collecte ne publie pas ces autorisations.

La règle la plus précise prévaut normalement : poste, groupe, puis organisation. Vous pouvez ainsi interdire `antigravity` dans l’organisation et l’autoriser dans le groupe d’ingénierie. Les autres postes restent soumis à l’interdiction. Une interdiction **obligatoire** empêche une autorisation plus précise de l’assouplir. Une restriction obligatoire d’une organisation parente ne peut pas être assouplie par son enfant.

En mode Observation, les règles évaluent les preuves sans bloquer les programmes ni les communications. Activez explicitement le blocage des exécutables dans Enterprise comme indiqué ci-dessous. L’absence de règle signifie **Sans règle applicable**, jamais une autorisation automatique. Une preuve insuffisante reste une incertitude. Une revue dépassée est signalée même si la règle autorise l’action.

Les résultats correspondent à l’heure d’évaluation affichée. Les emplacements et l’autorisation du poste sont actualisés toutes les 30 secondes pendant leur consultation, ainsi qu’à votre retour dans la vue. Une seule exception active est acceptée par poste, règle et révision ; révoquez-la avant de la remplacer.

## Blocage des exécutables dans Enterprise

L’observation reste le mode par défaut, y compris pour les règles existantes. Avec un serveur et un agent Enterprise compatibles, choisissez **Exécution**, **Interdire**, puis **Bloquer les prochains lancements**. Publiez avec un motif et un second facteur récent. La décision est prospective : le programme n’a pas besoin d’avoir déjà été exécuté. Les processus ouverts ne sont pas arrêtés.

Ce mode cible Claude Desktop, Claude Code, Codex et Antigravity App, CLI et IDE au moyen d’un catalogue d’identités qualifiées. Il exige une règle permanente, sans fin de validité ni exception temporaire. Retirez les règles temporaires qui recouvrent la cible avant de l’activer. La date de réexamen est un rappel et ne fait pas expirer la restriction. Les autorisations permanentes plus précises conservent la priorité habituelle, sauf interdiction obligatoire.

Le poste doit disposer d’un catalogue installé par l’administrateur pour ses versions exactes d’applications et son système. Windows utilise AppLocker avec le service Identité de l’application actif. Linux utilise fapolicyd et une intégration approuvée par l’administrateur avec sa politique existante. Un catalogue absent, une version non qualifiée ou un mécanisme indisponible produit un statut indisponible ; sélectionner le mode Blocage ne suffit pas. Les politiques GPO, MDM ou de contrôle d’applications existantes exigent une intégration administrateur. Milvago n’y fusionne pas automatiquement d’autorisations générales.

Ouvrez l’autorisation de l’application sur le poste pour consulter **Blocage des exécutables** et ses versions qualifiées. **Appliqué aux identités qualifiées** confirme le mécanisme système déclaré pour ces identités. Les états **En attente**, **Partiel**, **Indisponible**, **Intégration administrateur requise**, **Conflit de politiques** et une confirmation périmée ne prouvent pas une protection complète actuelle. Le statut est déclaré par le poste, sans attestation distante.

Les interdictions signées déjà appliquées restent en place pendant une panne serveur et après un redémarrage de l’agent. Rétablissez la connexion et publiez une autorisation permanente ou le mode Observation pour retirer une interdiction Milvago. Pour une récupération hors ligne ou une désinstallation, l’administrateur doit restaurer la politique système gérée avant de supprimer son état protégé. Un conflit avec une politique externe exige une intégration manuelle ; ne supprimez pas le cache pour le contourner.

La couverture concerne les empreintes d’exécutables qualifiés ou les identités exactes de paquets sur le système directement géré. Les empreintes qualifiées couvrent les copies identiques et renommées des exécutables. Les identités de paquets couvrent le paquet exact ; les copies dépaquetées exigent des empreintes qualifiées séparément. Sous Linux, l’accès au binaire interdit est aussi refusé pour empêcher son ouverture par un chargeur ELF explicite. Les binaires modifiés ou nouveaux non qualifiés, les interpréteurs partagés Node/Python/Electron et les invités sans agent propre sont hors périmètre. Aucun pilote noyau Milvago n’est installé. Blocage d’exécution, filtrage des communications et DLP sont indépendants : interdire un lancement ne prouve pas l’inspection avant envoi, et le réglage de communication **Bloquer** d’un service natif ne prouve pas que Claude Desktop, Claude Code ou Codex ne peut plus démarrer.

Le catalogue Windows fourni couvre Claude Code 2.1.303, Codex 0.166.0 et Antigravity App 2.24.0, CLI 1.4.0 et IDE 2.5.5. Il inclut aussi Claude Desktop 4.16336.0.0 pour son lancement MSIX principal et son exécutable principal dépaqueté. Le catalogue Linux fourni couvre Claude Code 2.1.303, Codex 0.166.0 et Antigravity CLI 1.4.0. L’import du catalogue est une opération distincte réservée à l’administrateur ; activer une règle ne l’installe pas.

Pour Claude Desktop 4.16336.0.0, l’intégration Windows locale désactive aussi la disponibilité du paquet qualifié par le mécanisme Windows de gestion des paquets. Cela empêche les futurs démarrages du service Cowork sans modifier ses permissions ni son réglage de démarrage. Les instances actives sont préservées. Le blocage complet du service attend la fermeture naturelle des clients du paquet et reste Partiel pendant cette attente. Quittez Claude Desktop pour le compléter ; AppLocker continue de refuser les nouveaux lancements principaux. Milvago enregistre l’état de disponibilité initial avant de le modifier et le restaure au retrait de la restriction, sans lancer l’application ni le service. Un paquet déjà désactivé reste désactivé. Un service absent, modifié ou non qualifié empêche le statut Appliqué. Sur les postes gérés, intégrez à vos contrôles existants l’exigence de disponibilité du paquet exportée et les interdictions AppLocker. La seule vérification du lancement principal ne prouve pas le blocage du service.

La couverture par empreinte concerne les exécutables Windows dépaquetés et les fichiers ELF Linux, y compris leurs copies identiques ou renommées. Les lancements Windows sous forme de paquet exigent une identité de paquet qualifiée séparément ; le réempaquetage est hors de la couverture par empreinte seule.

Sous Linux, une ressource de démarrage qualifiée identifie un fichier indispensable à l’application plutôt que son moteur Electron partagé. Linux refuse l’accès à ce fichier exact, y compris ses copies identiques ou renommées, pour empêcher le démarrage de l’application. Le moteur partagé reste utilisable. Les fichiers de démarrage modifiés, extraits ou réempaquetés nécessitent une qualification distincte et sont hors de cette couverture. L’état du poste distingue les ressources de démarrage des empreintes d’exécutables.

Le catalogue Linux fourni couvre aussi Claude Desktop 4.16336.0, Antigravity App 2.23.1 et Antigravity IDE 2.5.5 au moyen de leurs ressources de démarrage qualifiées. Leurs moteurs Electron sont partagés avec d’autres logiciels : n’ajoutez pas les empreintes de ces moteurs comme identités d’application.

Sous Linux, la couverture dépend aussi des systèmes de fichiers surveillés par fapolicyd. L’exécution anonyme ou uniquement en mémoire et l’injection dans un processus ne sont pas couvertes.

Sous Linux, l’administrateur doit activer `allow_filesystem_mark = 1` dans la configuration de fapolicyd et redémarrer ce démon après avoir vérifié la politique existante pour les charges utilisant des montages liés. Ce mode surveille aussi les accès depuis des espaces de montage isolés sur les systèmes de fichiers surveillés. Milvago ne modifie pas cette configuration. Il vérifie le refus effectif avec une sonde inerte dans un montage lié privé ; si la configuration ou les droits système ne permettent pas cette vérification, le poste ne peut pas déclarer la restriction appliquée.

## Examiner un poste et approuver une exception

Dans **Monitoring > Inventaire IA**, ouvrez un logiciel puis **Emplacements**. Chaque ligne regroupe toutes les observations d’un poste et distingue les évaluations de présence et d’exécution. Sélectionnez le poste pour ouvrir ses preuves et son autorisation actuelle. **Voir les preuves de tous les postes** retire ce filtre. Les relations entre VM et conteneurs restent dans **Environnements**.

Une exception concerne un poste et une règle actuelle qui accepte explicitement les exceptions. L’approbation exige `ai.governance.approve`, les droits de lecture nécessaires, une justification, une échéance dans les trois mois et un second facteur récent. Ce droit d’approbation appartient par défaut au propriétaire ; il peut être attribué explicitement à un rôle personnalisé. Publier une nouvelle politique invalide les anciennes exceptions. Une exception expire automatiquement ou se révoque avec un motif. Une organisation enfant ne peut pas approuver d’exception à la restriction d’un parent.

La **Revue de l’inventaire** existante reste une annotation globale. Ses valeurs Autorisé ou Non autorisé ne remplacent pas les règles effectives du poste. L’**Historique des décisions d’autorisation** conserve les révisions publiées et les décisions d’exception justifiées. L’évaluation actuelle utilise les règles en vigueur et ne réécrit pas les observations passées.

## Importer et automatiser

Vous pouvez valider un document YAML ou JSON, puis l’utiliser comme brouillon avant publication. La validation n’enregistre et n’active rien. Les règles sont des données et n’exécutent pas de scripts. Chaque organisation dispose d’un maximum de 256 règles, dans la limite de taille du document.

Utilisez l’API de découverte et le MCP Enterprise pour les lectures automatisées. Le MCP Enterprise ne publie pas de règle et n’approuve pas d’exception. Le [référentiel NIST AI RMF officiel](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) décrit la démarche organisationnelle complète.
