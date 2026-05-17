# Documentation — Schéma Base de Données Pâtisserie

---

## Vue d'ensemble

Le schéma est composé de 11 tables qui couvrent trois domaines :
- **Catalogue** — les produits et leurs photos
- **Commandes** — les deux flux de commande (directe et devis)
- **Configuration** — les règles métier globales du site

Chaque table a un rôle précis et ne porte que les données qui lui appartiennent.

---

## 1. `Catalogue`

**Rôle** : Contient tous les produits que la pâtisserie propose à la vente. C'est la table centrale du site — toutes les commandes y font référence.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique auto-incrémenté. Sert de clé étrangère dans toutes les tables d'items. |
| `nom` | Nom du produit. `UNIQUE` interdit deux produits avec le même nom. |
| `prix` | Prix de base en euros. Ce prix est copié dans `CatalogueItem` au moment de la commande — si l'admin le modifie plus tard, les anciennes commandes gardent leur prix d'origine. |
| `ingredient` | Liste des ingrédients. Affiché sur la fiche produit côté client. Nullable — pas obligatoire. |
| `description` | Description libre du produit. Nullable. |
| `isActif` | Si `FALSE`, le produit est masqué du catalogue public mais reste en base. Permet de désactiver un produit sans le supprimer. |
| `modeVente` | Définit comment le produit est produit. `make_to_order` = fabriqué après réception de la commande. `make_to_stock` = stock physique préparé à l'avance. Utilisé uniquement si `mode_production_global = 'mixte'` dans Config. |
| `stockDisponible` | Quantité en stock physique. Utilisé uniquement si `modeVente = 'make_to_stock'`. Décrémenté à chaque commande, réapprovisionné manuellement par l'admin. |
| `dateDebutActif` | Date à partir de laquelle le produit devient visible. Pour les produits saisonniers. `NULL` = pas de contrainte de début. |
| `dateFinActif` | Date après laquelle le produit est masqué automatiquement. `NULL` = pas de contrainte de fin. |
| `prixOptions` | Variantes du produit avec leurs surcoûts. `NULL` = produit simple, prix fixe. Si renseigné par l'admin, le client peut choisir parmi les options. Exemple : `{"taille": {"6 personnes": 0, "10 personnes": 15.00}}` |

---

## 2. `Photo`

**Rôle** : Stocke les URLs des photos associées à chaque produit du catalogue. Séparée de `Catalogue` pour permettre plusieurs photos par produit sans modifier la structure principale.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `idCatalogue` | Clé étrangère vers `Catalogue`. Chaque photo appartient à un produit. |
| `photo_url` | URL de la photo stockée (sur un service externe ou le VPS). |

**Pourquoi une table séparée ?** Si on avait mis `photo_url` directement dans `Catalogue`, un produit ne pourrait avoir qu'une seule photo. Avec cette table, un produit peut avoir 0, 1 ou plusieurs photos sans changer le schéma.

---

## 3. `CommandeDirect`

**Rôle** : Enregistre les commandes passées directement par les clients, sans validation admin. Une commande directe est créée uniquement après confirmation du paiement.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. Sert de numéro de commande affiché au client. |
| `dateCommande` | Date et heure de création de la commande. Remplie automatiquement. |
| `dateRetrait` | Date choisie par le client pour venir chercher sa commande. Calculée selon `delai_retrait_jours` depuis Config. |
| `prixTotal` | Montant total de la commande. Calculé côté backend à partir des items — jamais saisi manuellement. |
| `nom` | Nom du client. |
| `mail` | Email du client. Utilisé pour les notifications de statut. |
| `noteClient` | Remarque libre laissée par le client (allergie, précision...). Nullable. |
| `paiementChoisi` | Ce que le client a effectivement choisi : `en_ligne` ou `sur_place`. Enregistré au moment de la commande selon la config `mode_paiement`. |

**Règle critique** : cette table ne reçoit une ligne qu'après confirmation du paiement Stripe. Jamais avant.

---

## 4. `statut_type_devis` (ENUM)

**Rôle** : Définit les statuts possibles d'un devis. Un ENUM PostgreSQL garantit qu'aucune valeur invalide ne peut être insérée.

| Valeur | Signification |
|---|---|
| `en_attente` | Devis reçu, l'admin n'a pas encore traité. |
| `valide` | Admin a accepté le devis, en attente du paiement de l'acompte. |
| `acompte_paye` | Client a payé l'acompte, production peut commencer. |
| `pret` | Commande prête, client peut venir récupérer. |
| `annule` | Devis annulé (par le client ou l'admin). |
| `expire` | Délai d'expiration dépassé sans action du client. |

---

## 5. `Devis`

**Rôle** : Enregistre les demandes de devis pour les commandes importantes (au-dessus du seuil de pièces configuré, ou selon le mode commande choisi). Contrairement à `CommandeDirect`, un devis passe par une validation admin avant d'être confirmé.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. Numéro de devis. |
| `statutEnum` | Statut courant du devis. Évolue au fil du workflow. |
| `dateCommande` | Date de soumission du devis par le client. |
| `dateRetrait` | Date de retrait souhaitée, modifiable par l'admin. |
| `dateSouhaitee` | Date idéale exprimée par le client lors de la demande. Peut différer de `dateRetrait` validée par l'admin. |
| `acompte` | Montant de l'acompte calculé à la création selon `acompte_mode` et `acompte_valeur` depuis Config. |
| `prixTotal` | Montant total estimé. Peut être modifié par l'admin avant validation. |
| `dejaPaye` | Montant déjà encaissé (acompte payé). Permet de calculer le solde restant. |
| `typeEvenement` | Type d'événement concerné (mariage, anniversaire, baptême...). Nullable. |
| `numeroTel` | Téléphone du client. Obligatoire pour les devis car le contact direct peut être nécessaire pour affiner la commande. |
| `expireAt` | Date limite avant expiration automatique. Calculée à la création : `dateCommande + devis_expire_days`. |
| `nom` | Nom du client. |
| `mail` | Email du client. |
| `noteClient` | Remarque libre du client sur sa commande. |
| `noteAdmin` | Note interne de l'admin, non visible par le client. |

---

## 6. `CatalogueItem`

**Rôle** : Table de jonction entre `CommandeDirect` et `Catalogue`. Chaque ligne représente un produit dans une commande directe, avec sa quantité et son prix au moment de la commande.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `idCommande` | Clé étrangère vers `CommandeDirect`. |
| `idCatalogue` | Clé étrangère vers `Catalogue`. |
| `quantite` | Nombre d'unités commandées pour ce produit. |
| `prixUnite` | Prix unitaire **au moment de la commande**. Copié depuis `Catalogue.prix` + surcoût options. Protège contre les modifications de prix ultérieures. |
| `options` | Options choisies par le client pour ce produit. `NULL` si produit simple. Exemple : `{"taille": "10 personnes", "parfum": "Framboise"}` |

**Pourquoi une table séparée ?** Une commande peut contenir plusieurs produits différents. Sans cette table, il faudrait une colonne par produit possible dans `CommandeDirect` — impossible à maintenir.

---

## 7. `CatalogueDevisItem`

**Rôle** : Même logique que `CatalogueItem` mais pour les devis. Table de jonction entre `Devis` et `Catalogue`.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `idDevis` | Clé étrangère vers `Devis`. |
| `idCatalogue` | Clé étrangère vers `Catalogue`. |
| `quantite` | Nombre d'unités demandées pour ce produit. |
| `prixUnite` | Prix unitaire au moment de la demande. L'admin peut modifier `prixTotal` sur le devis mais ce champ garde la trace du prix initial. |
| `options` | Options choisies par le client. Même logique que `CatalogueItem`. |

---

## 8. `DayLimit`

**Rôle** : Définit une limite de production journalière par produit. Permet à la pâtisserie de ne pas accepter plus de commandes qu'elle ne peut produire en une journée.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `dayStart` | Jour concerné par cette limite. |
| `idCatalogue` | Produit concerné. |
| `limitPerDay` | Nombre maximum de pièces acceptées pour ce produit ce jour-là. |
| `isActif` | Si `FALSE`, la limite est ignorée — production illimitée pour ce produit ce jour-là. |

**Comment c'est utilisé** : Au moment d'une commande, le backend fait un `SUM` des quantités déjà commandées pour ce produit sur le jour du retrait, et compare avec `limitPerDay`. Si le total dépasse la limite, la commande est refusée pour ce produit.

**Important** : le total n'est jamais stocké — il est recalculé à la volée à chaque commande pour éviter les incohérences.

---

## 9. `WeekLimit`

**Rôle** : Même logique que `DayLimit` mais sur une semaine. Les deux limites sont cumulatives — un produit peut avoir à la fois une limite journalière et une limite hebdomadaire.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `weekStart` | Premier jour de la semaine concernée. |
| `idCatalogue` | Produit concerné. |
| `limitPerWeek` | Nombre maximum de pièces acceptées pour ce produit cette semaine. |
| `isActif` | Si `FALSE`, la limite hebdomadaire est ignorée. |

---

## 10. `Admin`

**Rôle** : Stocke les comptes administrateurs du site. Utilisé par next-auth pour l'authentification du dashboard admin.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `email` | Email de connexion. `UNIQUE` interdit deux comptes avec le même email. |
| `passwordHash` | Mot de passe hashé (bcrypt). Jamais le mot de passe en clair. |
| `role` | Rôle de l'admin. `admin` par défaut. Prévu pour une gestion multi-rôles future. |
| `createdAt` | Date de création du compte. |

---

## 11. `Config`

**Rôle** : Stocke toutes les variables de configuration globale du site. Chaque ligne est un paramètre que l'admin peut modifier depuis son dashboard sans toucher au code.

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique. |
| `nameVariable` | Nom de la variable. Utilisé comme clé dans le code. |
| `valeur` | Valeur actuelle de la variable. Toujours une string — le backend la cast au bon type selon le contexte. |
| `description` | Explication de la variable et de ses valeurs possibles. Affiché dans le dashboard admin. |

### Variables de configuration

| Variable | Valeur par défaut | Valeurs possibles | Usage |
|---|---|---|---|
| `mode_production_global` | `make_to_order` | `make_to_order` / `make_to_stock` / `mixte` | Définit si les produits sont fabriqués à la commande, sur stock, ou les deux |
| `mode_commande` | `seuil` | `direct_only` / `devis_only` / `seuil` | Contrôle quand une commande devient un devis |
| `seuil_devis` | `10` | entier | Nombre de pièces total du panier déclenchant un devis |
| `delai_retrait_jours` | `2` | entier | Jours minimum entre la commande et le retrait |
| `limite_par_commande` | `0` | entier (0 = illimité) | Nombre max de pièces par commande |
| `devis_expire_days` | `14` | entier | Jours avant expiration automatique d'un devis sans action |
| `acompte_mode` | `pourcentage` | `desactive` / `pourcentage` / `montant_fixe` | Comment l'acompte est calculé |
| `acompte_valeur` | `30` | décimal | Valeur de l'acompte (% ou € selon le mode) |
| `mode_paiement` | `en_ligne` | `en_ligne` / `sur_place` / `acompte` / `au_choix_client` | Mode de paiement proposé au client |
| `mode_retrait` | `boutique` | `boutique` / `livraison` / `les_deux` | Modes de récupération disponibles |
| `frais_livraison` | `0.00` | décimal | Frais de livraison en euros |
| `zone_livraison` | `` | texte libre | Description de la zone de livraison couverte |
| `notif_admin_email` | `` | email | Adresse qui reçoit les notifications admin |
| `notif_client_statut` | `true` | `true` / `false` | Envoyer un email au client à chaque changement de statut |
| `notif_admin_commande` | `true` | `true` / `false` | Notifier l'admin à chaque nouvelle commande directe |
| `notif_admin_devis` | `true` | `true` / `false` | Notifier l'admin à chaque nouveau devis |
| `boutique_nom` | `` | texte libre | Nom affiché dans les emails et le header du site |
| `boutique_adresse` | `` | texte libre | Adresse affichée dans les emails de confirmation |
| `boutique_tel` | `` | texte libre | Téléphone affiché sur le site |
| `boutique_horaires` | `` | texte libre | Horaires d'ouverture affichés sur le site |

---

## Schéma des relations

```
Catalogue ──< Photo
Catalogue ──< DayLimit
Catalogue ──< WeekLimit
Catalogue ──< CatalogueItem >── CommandeDirect
Catalogue ──< CatalogueDevisItem >── Devis
```

- `──<` signifie "un vers plusieurs" (one-to-many)
- `>──<` signifie table de jonction (many-to-many)
