---
sidebar_position: 5
title: Héritage de la configuration
---

# Héritage de la configuration

La configuration Shadow AI de Milvago se lit en trois étages : **organisation → groupe de postes → poste**. Chaque étage ne définit que ce qu'il veut changer ; une section absente est héritée de l'étage supérieur, et la dérogation la plus proche du poste gagne.

![Milvago - Héritage de la configuration](/img/docs/fr/introduction-heritage-configuration-01.png)

## Le principe : des sections, pas des blocs

La configuration n'est pas un bloc unique mais une **liste de sections** : enrôlement, collecte, services, protections, masquage local, sensibilité des usages, contrôle des modèles, exploitation. L'héritage se règle **section par section** :

- une section **définie** à un niveau s'applique à tout ce qui est en dessous ;
- une section **laissée en héritage** suit l'étage supérieur ;
- un étage inférieur peut réécrire une section précise sans copier les autres.

Un groupe qui ne veut changer que « Protections » définit donc uniquement cette section : services, masquage et le reste continuent de suivre l'organisation.

## Ce que chaque niveau peut définir

| Niveau | Sections possibles | Écran d'édition |
| --- | --- | --- |
| **Organisation** | toutes, y compris Enrôlement et Exploitation | Administration → Shadow AI |
| **Groupe de postes** | collecte, services, protections, masquage local, sensibilité des usages, contrôle des modèles | Parc → Groupes |
| **Poste** | les mêmes six sections que le groupe | fiche du poste → Politique du poste |

Deux sections restent par nature à l'organisation : **Enrôlement** (qui peut rejoindre, selon quel réseau) et **Exploitation** (mises à jour de l'agent). Un groupe ou un poste ne peut ni les écraser ni les affaiblir — ce sont des décisions de parc, pas d'usage.

Un poste n'appartient qu'à un seul groupe à la fois : pas de priorité à arbitrer entre plusieurs groupes. Le retirer d'un groupe le ramène à la politique de l'organisation.

## Qui voit la provenance

L'éditeur affiche la portée courante (« Politique de l'organisation », « Dérogation du groupe », « Dérogation du poste ») et, pour chaque section héritée, une case « **Hériter · nom de la section** » qui nomme l'écran dont la section vient — le groupe sur la fiche d'un poste, l'organisation sur la fiche d'un groupe. La provenance suit le **dernier écrivain** : une section héritée par l'organisation mère puis recouverte par le groupe est attribuée au groupe.

![Milvago - Qui voit la provenance](/img/docs/fr/introduction-heritage-configuration-02.png)

## Les révisions, dans l'ordre

Chaque enregistrement produit une **révision** plus récente, et la politique effective d'un poste additionne les révisions de ses étages. Un poste n'applique jamais une révision plus ancienne que celle qu'il détient : déplacer un poste d'un groupe vers un autre, puis revenir, ne fait que croître. Cette règle de **non-retour arrière** garantit qu'aucune manipulation d'affectation ne peut faire repartir un poste sur une politique dépassée — par exemple réimposer un blocage retiré.

Réaffecter à un poste le groupe qu'il porte déjà ne réécrit rien : la révision ne bouge pas et l'agent ne voit aucun changement.

## La chaîne complète en Enterprise

:::enterprise

En Enterprise, la chaîne compte un étage de plus **au-dessus** de l'organisation : l'**organisation mère**. Une organisation fille peut marquer des sections « Hériter » et les recevoir de sa mère — voir [Organisations mère et fille](organisations-mere-fille.md). La chaîne effective d'un poste devient : organisation mère → organisation → groupe → poste, toujours section par section, et la provenance nomme l'écran d'origine.

Deux règles complètent l'ensemble :

- la **sensibilité des usages** n'existe dans l'éditeur que si l'édition sert cette capacité — la section disparaît plutôt que de s'afficher inutilisable ;
- la profondeur de l'arbre d'organisations est bornée : une ascendance trop profonde est refusée plutôt que lue indéfiniment.

:::

## Qui peut écrire quoi

| Édition | Droit requis |
| --- | --- |
| Politique de l'organisation | `policy.manage` |
| Politique d'un groupe | `policy.manage` |
| Politique d'un poste | `policy.manage` |

Le droit seul ne suffit pas toujours : les réglages qui exposent du contenu — activer la collecte de texte, relâcher une protection de confidentialité — exigent une **authentification MFA fraîche**, quel que soit le niveau d'où la modification part.

Voir aussi : [Shadow AI](../administration/shadow-ai.md), [Groupes de postes](../fleet/groupes.md), [Postes](../fleet/postes.md).
