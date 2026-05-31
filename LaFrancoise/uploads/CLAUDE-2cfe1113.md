# CLAUDE.md — Journal de projet Pâtisserie WebApp

## Design System
Before any UI/UX work, read and apply the skill at:
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

## Contexte général

Projet développé par Anass Oughar, développeur web solo basé à Bruxelles. L'objectif est de construire une application web e-commerce complète pour des pâtisseries artisanales, utilisable comme démo commerciale auprès de clients potentiels. L'approche commerciale : construire la démo en avance, sans client confirmé, pour décrocher des contrats. Chaque déploiement est livré au client avec les accès — hébergement, emails, paiement — tout est à son nom.

---

## Stack technique

- **Framework** : Next.js 15 avec App Router (pas Pages Router)
- **Langage** : TypeScript
- **ORM** : Prisma 7 avec driver adapter PostgreSQL (@prisma/adapter-pg)
- **Base de données** : PostgreSQL 16 via Docker
- **Authentification** : next-auth
- **Emails transactionnels** : Resend
- **Validation** : Zod
- **Styling** : Tailwind CSS
- **Hébergement** : Coolify sur VPS Hetzner (production)
- **Conteneurisation** : Docker Compose
- **Tests** : Jest + ts-jest

---

## Roadmap

### Terminé
- [x] Schéma SQL validé et documenté
- [x] Docker + PostgreSQL configuré
- [x] Projet Next.js initialisé
- [x] Prisma 7 configuré avec driver adapter
- [x] prisma db pull + prisma generate
- [x] src/lib/prisma.ts
- [x] src/lib/config.ts
- [x] src/lib/services/catalogue.service.ts
- [x] src/lib/services/commande.service.ts
- [x] src/lib/services/devis.service.ts
- [x] src/lib/services/limites.service.ts
- [x] src/lib/services/stock.service.ts
- [x] src/lib/services/mail.service.ts
- [x] Jest configuré + 43 tests unitaires passent

### À faire
- [ ] src/validators/commande.validator.ts
- [ ] src/validators/devis.validator.ts
- [ ] Routes API publiques (catalogue, commande, devis)
- [ ] Routes API admin (commandes, devis, catalogue, config, stock)
- [ ] Authentification next-auth
- [ ] Frontend client (accueil, catalogue, panier)
- [ ] Frontend admin (dashboard, commandes, devis, catalogue, config)
- [ ] Déploiement Coolify + Dockerfile

---

# [2025-05-17] Services — Documentation détaillée

## src/lib/prisma.ts

**Rôle** : Crée et exporte une instance unique du client Prisma (singleton). Point d'entrée vers la base de données pour tous les services.

**Problème résolu** : En développement, Next.js recharge le code à chaque modification (hot reload). Sans précaution, chaque rechargement créerait une nouvelle connexion PostgreSQL. PostgreSQL a une limite de connexions simultanées — au bout de quelques dizaines de rechargements, tout plantait.

**Solution — le singleton global** :
On stocke l'instance Prisma sur `globalThis`, un objet Node.js qui persiste entre les rechargements. Au prochain rechargement, l'instance existe déjà — on la réutilise.

**Spécificité Prisma 7** : Prisma 7 a supprimé son moteur Rust interne. Il faut obligatoirement passer un driver adapter au constructeur. Pour PostgreSQL, c'est `@prisma/adapter-pg`. Sans ça, `new PrismaClient()` échoue avec "Expected 1 arguments, but got 0".

---

## src/lib/config.ts

**Rôle** : Centralise la lecture des variables de configuration stockées dans la table Config. Expose des fonctions typées qui s'occupent de la conversion de type (toutes les valeurs en base sont des strings TEXT).

**Pourquoi une table Config et pas des variables d'environnement** : Les variables d'environnement nécessitent un redéploiement pour être modifiées. La table Config est modifiable depuis le dashboard admin en temps réel.

**Fonction centrale getAllConfig()** : Charge toutes les lignes en une seule requête et retourne un objet clé/valeur. Chaque fonction spécifique appelle getAllConfig() et extrait + convertit la valeur dont elle a besoin.

**Fonctions exposées** : getSeuilDevis() → number, getModeCommande() → string, getDelaiRetrait() → number, getLimiteParCommande() → number, getModeProduction() → string, getDevisExpireDays() → number, getAcompteMode() → string, getAcompteValeur() → number, getModePaiement() → string, getModeRetrait() → string, getFraisLivraison() → number, getZoneLivraison() → string, getNotifAdminEmail() → string, getNotifClientStatut() → boolean, getNotifAdminCommande() → boolean, getNotifAdminDevis() → boolean, getBoutiqueNom() → string, getBoutiqueAdresse() → string, getBoutiqueTel() → string, getBoutiqueHoraires() → string, setConfig() pour modification admin, getAllConfigPublic() pour le dashboard.

---

## src/lib/services/catalogue.service.ts

**getProduitActifs()** : Retourne les produits visibles par les clients. Trois conditions : isActif=true, dateDebutActif null ou passé, dateFinActif null ou futur. La gestion saisonnière est automatique.

**getProduitById(id)** : Retourne un produit unique avec ses photos.

**getTousProduits()** : Version admin sans filtre isActif, avec limites journalières et hebdomadaires actives.

**creerProduit(data)** : Crée un produit. prixOptions traité avec undefined pour ne pas toucher au champ si non fourni.

**modifierProduit(id, data)** : Prisma distingue undefined (ne pas toucher) et null (mettre à NULL). Pour les champs JSON nullable, il faut passer Prisma.JsonNull au lieu de null directement — sinon TypeScript génère une erreur de type.

**toggleActif(id)** : Lit l'état actuel puis l'inverse. Si le produit n'existe pas, lève une erreur explicite.

**ajouterPhoto / supprimerPhoto** : Les photos sont dans une table séparée pour permettre plusieurs photos par produit.

---

## src/lib/services/limites.service.ts

**Rôle** : Vérifie avant chaque commande que les limites de production ne sont pas dépassées.

**Principe fondamental** : Les totaux ne sont jamais stockés en base. À chaque vérification, on fait un SUM des quantités déjà commandées. Évite les incohérences en cas de requêtes simultanées.

**verifierLimiteJour(idCatalogue, quantiteDemandee, dateRetrait)** :
1. Cherche une limite active pour ce produit à cette date
2. Si pas de limite → ok: true (illimité)
3. Récupère les ids des commandes à cette date de retrait (requête séparée)
4. Agrège les quantités commandées pour ce produit dans ces commandes (SUM)
5. Compare total + quantité demandée avec la limite

**Erreur initiale et correction** : La première version utilisait .then() imbriqué dans le where de aggregate — une promesse dans un objet de filtre Prisma. Prisma ne peut pas résoudre une promesse à l'intérieur d'un where. Correction : deux requêtes séparées avec deux await distincts.

**verifierLimiteSemaine** : Même logique sur une semaine entière. Calcule lundi et dimanche de la semaine, agrège toutes les commandes dont le retrait tombe dans cette plage.

**verifierLimites** : Appelle les deux vérifications dans l'ordre. Retourne le premier blocage trouvé.

**setLimiteJour / setLimiteSemaine** : Utilisent upsert — créent si n'existe pas, mettent à jour si existe.

---

## src/lib/services/stock.service.ts

**Rôle** : Gère le stock physique pour les produits make_to_stock. Invisible pour make_to_order.

**verifierStock** : Retourne immédiatement ok:true si le produit est make_to_order. Sinon compare stockDisponible avec quantiteDemandee.

**decrementerStock** : Utilise Math.max(0, stock - quantite) pour éviter un stock négatif.

**reapprovisionner** : Ajoute au stock existant. setStock définit une valeur absolue pour corrections manuelles.

**getStocks** : Retourne uniquement les produits make_to_stock pour la page stock du dashboard.

---

## src/lib/services/commande.service.ts

**Rôle** : Orchestre la création de commandes directes en 9 étapes séquentielles.

**creerCommande(data)** :
1. Vérifier délai minimum de retrait (date >= aujourd'hui + delai_retrait_jours)
2. Vérifier limite de pièces par commande
3. Récupérer les produits et vérifier qu'ils sont actifs
4. Vérifier les limites de production (verifierLimites) pour chaque item
5. Vérifier le stock (verifierStock) pour les items make_to_stock
6. Calculer le prix avec options (prix de base + surcoût options choisies)
7. Créer la commande et ses items en transaction (prisma.$transaction — tout ou rien)
8. Décrémenter le stock pour les items make_to_stock
9. Envoyer les emails de confirmation

**Règle critique** : Cette fonction ne doit être appelée qu'après confirmation du paiement Stripe. La commande n'est jamais créée avant paiement validé.

**supprimerCommande** : Supprime d'abord les items (contrainte FK), puis la commande.

---

## src/lib/services/devis.service.ts

**Rôle** : Gère le workflow complet des devis avec machine à états.

**creerDevis(data)** : Calcule le prix, l'acompte selon acompte_mode (pourcentage / montant_fixe / desactive), et expireAt (maintenant + devis_expire_days). Tout en transaction.

**Calcul expireAt en backend et pas trigger** : Les triggers sont justifiés quand plusieurs services différents écrivent dans la même base. Pour une architecture single-service Next.js, la logique applicative est plus simple à déboguer.

**validerDevis / refuserDevis** : Changent le statut et envoient l'email approprié. L'admin peut ajouter une note.

**marquerAcomptePaye(id, montant)** : Enregistre le montant reçu dans dejaPaye. Le solde est calculé à la volée : prixTotal - dejaPaye.

**marquerDevisPret** : Passe à statut pret et notifie le client.

**modifierPrixDevis** : Recalcule l'acompte automatiquement selon la config en vigueur.

**modifierDateRetrait** : Réservé à l'admin — le client ne peut pas modifier après soumission.

**expireDevisObsoletes** : Passe en statut expire tous les devis en_attente ou valide dont expireAt est dépassé. À appeler périodiquement.

---

## src/lib/services/mail.service.ts

**Rôle** : Centralise tous les envois d'email via Resend. Une fonction par type d'email transactionnel.

**Typage propre** : Types Prisma combinés définis explicitement (CommandeAvecItems, DevisAvecItems) plutôt que any.

**Gestion du type Decimal de Prisma** : Prisma stocke les champs DECIMAL avec son propre type Decimal. La fonction formatPrix accepte ce type via une surcharge : si c'est un objet, appelle .toNumber(), sinon Number().

**Emails** : sendConfirmationCommande (client), sendNouvelleCommandeAdmin (admin), sendNouveauDevisClient (client), sendNouveauDevisAdmin (admin), sendDevisValide (client), sendDevisRefuse (client), sendDevisPret (client).

---

# [2025-05-18] Jest — Installation et tests unitaires

## Pourquoi des tests unitaires

Un test unitaire vérifie qu'une fonction fait exactement ce qu'elle est censée faire, en isolation totale — sans base de données réelle, sans réseau, sans effets de bord. Sans tests, chaque modification nécessite de tester manuellement toutes les fonctionnalités. Avec 6 services et des dizaines de fonctions, c'est ingérable.

## Installation

```bash
npm install --save-dev jest @types/jest ts-jest ts-node
```

- **jest** : le framework de test
- **@types/jest** : types TypeScript pour describe, it, expect, etc.
- **ts-jest** : transformateur qui permet à Jest de lire TypeScript directement
- **ts-node** : nécessaire pour que Jest lise jest.config.ts (lui-même en TypeScript)

**Erreur rencontrée** : ts-node manquant. Jest ne pouvait pas parser jest.config.ts.

**Erreur rencontrée** : setupFilesAfterFramework écrit au lieu de setupFilesAfterEnv. TypeScript signalait que la propriété n'existait pas dans le type Config.

## Le principe du mock

Tester une fonction qui parle à une base de données pose un problème : les tests deviendraient dépendants de l'état de la base. Si la base est vide ou modifiée, les tests échouent pour des raisons extérieures au code.

La solution : mocker Prisma. On remplace le vrai client par un faux qui ne parle à aucune base. On contrôle exactement ce que retourne chaque fonction via mockResolvedValue().

## src/__tests__/setup.ts

Exécuté avant chaque suite de tests. Crée les mocks globaux pour Prisma et Resend.

jest.mock() intercepte tous les imports de ../lib/prisma et retourne l'objet mock. Chaque méthode est un jest.fn() — fonction vide qu'on programme dans chaque test.

jest.clearAllMocks() dans beforeEach remet tous les mocks à zéro avant chaque test — évite la contamination entre tests.

**Problème rencontré** : clearAllMocks() effaçait le .mockResolvedValue([]) configuré pour commandeDirect.findMany. Dans les tests de limites.service, findMany retournait undefined. Quand le code appelait .map() sur undefined, ça plantait avec "Cannot read properties of undefined (reading 'map')". Solution : ajouter un beforeEach local dans limites.service.test.ts qui remet le mock à [] avant chaque test, et ajouter explicitement le mock findMany avec les bons ids dans chaque test qui en a besoin.

## src/__tests__/__mocks__/prisma-client.ts

**Pourquoi ce fichier** : Le vrai client Prisma généré utilise import.meta.url — syntaxe ESM. Jest fonctionne en CommonJS et ne comprend pas import.meta. Quand catalogue.service.ts importait { Prisma } depuis le client généré, Jest plantait avec "SyntaxError: Cannot use 'import.meta' outside a module".

Le moduleNameMapper dans jest.config.ts redirige cet import vers ce fichier mock.

**Erreur rencontrée** : Le constructeur de la classe Decimal retournait directement value (un number). TypeScript interdit qu'un constructeur retourne une valeur primitive — le type de retour doit être assignable à l'instance de la classe. Solution : stocker dans this.value et exposer via toNumber().

## Itérations de corrections sur limites.service.test.ts

**Itération 1** : Erreur ".then() undefined". Le code original utilisait .then() imbriqué dans le where de aggregate. Jest ne pouvait pas mocker ça correctement. Correction dans le code source : deux requêtes séparées avec deux await distincts.

**Itération 2** : Erreur "Cannot read properties of undefined (reading 'map')". Même après correction du service, commandeIds était undefined dans certains tests car clearAllMocks() effaçait le mock de findMany. Correction : beforeEach local + mock explicite avec les bons ids dans chaque test.

## Résultat final

```
Test Suites: 4 passed, 4 total
Tests:       43 passed, 43 total
Time:        0.217s
```

- 8 tests catalogue.service
- 10 tests stock.service
- 11 tests config
- 14 tests limites.service

---

## Problèmes rencontrés et solutions

- Prisma 7 import depuis @prisma/client → importer depuis app/generated/prisma/client
- Prisma 7 new PrismaClient() sans argument → passer { adapter } avec @prisma/adapter-pg
- DATABASE_URL ignorée → espace dans le .env autour du =
- Docker empty compose file → retirer le service app sans Dockerfile en développement
- Sous-module Git → rm -rf patisserie/.git puis git rm --cached
- Jest setupFilesAfterFramework → setupFilesAfterEnv
- Jest import.meta → moduleNameMapper vers mock
- Jest clearAllMocks efface les mocks → beforeEach local
- Decimal Prisma non assignable → formatPrix accepte { toNumber: () => number }
- Constructeur retournant primitif → stocker dans this.value

---

## Variables d'environnement (.env)

```
DATABASE_URL="postgresql://patisserie:[MOT_DE_PASSE]@localhost:5120/patisserie"
RESEND_API_KEY=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
DOMAINE_EMAIL="tondomaine.be"
REPLY_TO_EMAIL="contact@tondomaine.be"
```

## Modèle commercial

- Création : 1500€ – 2500€ one-shot
- Maintenance : 70€ – 100€/mois
- Services tiers configurés par le développeur, passés au client. Dépassement du tier gratuit géré par le client.

---

# [2025-05-19] Validators Zod et Routes API

---

## Pourquoi les validators Zod

Les validators sont la première ligne de défense du backend. Quand un client envoie des données vers une route API, on ne peut pas faire confiance à ce qu'il envoie. Sans validator, une donnée mal formée peut aller jusqu'en base de données et provoquer une erreur PostgreSQL — un message technique incompréhensible pour le client. Avec Zod, l'erreur est interceptée au plus tôt avec un message précis et le service n'est jamais appelé si les données sont invalides.

Zod apporte trois choses en une : la validation, le typage TypeScript automatique via `z.infer<typeof Schema>`, et des messages d'erreur précis indiquant exactement quel champ pose problème.

---

## src/validators/commande.validator.ts

### `ItemCommandeSchema`

Schéma interne non exporté qui valide un item du panier. Chaque item doit avoir :
- `idCatalogue` : entier positif — l'identifiant du produit dans la base
- `quantite` : entier entre 1 et 500 — on interdit 0 et on limite à 500 pour éviter les abus
- `options` : objet clé/valeur optionnel pour les variantes (ex: `{ "taille": "10 personnes" }`)

### `CreateCommandeSchema`

Valide le body d'une requête `POST /api/commande`. Champs :
- `nom` : string obligatoire, max 255 caractères
- `mail` : email valide via `z.string().email()`
- `dateRetrait` : date convertie automatiquement depuis string ISO via `z.coerce.date()`. Validée pour ne pas être dans le passé — le délai minimum réel est vérifié dans le service car il dépend de la config en base
- `noteClient` : string optionnelle, max 2000 caractères
- `paiementChoisi` : optionnel, accepte uniquement `"en_ligne"` ou `"sur_place"`. Pertinent uniquement si `mode_paiement = "au_choix_client"` dans Config
- `items` : tableau d'au moins 1 item et au maximum 50

### `PanierSchema`

Schéma léger pour valider le contenu du panier avant soumission. Utilisé par le frontend pour vérifier dynamiquement si le panier dépasse le seuil devis sans soumettre de formulaire.

---

## src/validators/devis.validator.ts

### `ItemDevisSchema`

Identique à `ItemCommandeSchema` — même structure, même contraintes. Séparé intentionnellement pour permettre des évolutions indépendantes.

### `CreateDevisSchema`

Valide le body d'une requête `POST /api/devis`. Champs supplémentaires par rapport à la commande :
- `numeroTel` : obligatoire pour les devis car le contact direct est souvent nécessaire pour affiner la commande. Validé avec une regex qui accepte les formats internationaux (`+32 478 12 34 56`, `02/123.45.67`, etc.)
- `dateSouhaitee` : date idéale exprimée par le client, doit être dans le futur
- `dateRetrait` : doit être dans le futur ET supérieure ou égale à `dateSouhaitee` — validé via `.refine()` global sur le schéma entier
- `typeEvenement` : optionnel (mariage, anniversaire, baptême...)

**`.refine()`** — méthode Zod pour les validations conditionnelles qui dépendent de plusieurs champs à la fois. Un seul champ ne suffit pas pour vérifier que `dateRetrait >= dateSouhaitee`. Le `.refine()` reçoit l'objet complet et retourne `false` pour déclencher l'erreur.

---

## src/validators/catalogue.validator.ts

### `PrixOptionsSchema`

Schéma interne pour les variantes produit. Format attendu :
```json
{ "taille": { "6 personnes": 0, "10 personnes": 15.00 } }
```
C'est un objet imbriqué — catégorie → option → surcoût en euros. Le surcoût peut être 0 (option sans supplément).

### `CreateCatalogueSchema`

Valide la création d'un produit. Points notables :
- `prix` : doit être positif et ne pas avoir plus de 2 décimales — `.multipleOf(0.01)` rejette `1.505`
- `modeVente` : `"make_to_order"` ou `"make_to_stock"` uniquement
- `stockDisponible` : entier >= 0, pertinent uniquement si `modeVente = "make_to_stock"`
- `dateDebutActif` / `dateFinActif` : dates optionnelles pour les produits saisonniers. Le `.refine()` vérifie que si les deux sont renseignées, `dateDebutActif < dateFinActif`

### `UpdateCatalogueSchema`

Version modification — tous les champs sont optionnels. On ne modifie que ce qu'on envoie. Les champs `dateDebutActif`, `dateFinActif` et `prixOptions` sont `nullable().optional()` — on peut les supprimer en envoyant `null`.

La différence entre `optional()` et `nullable()` : `optional()` = le champ peut être absent du body. `nullable()` = le champ peut être présent mais valoir `null`. Les deux ensemble couvrent tous les cas.

### `AddPhotoSchema`

Valide l'URL d'une photo via `z.string().url()` — Zod vérifie que c'est une URL valide.

---

## src/validators/admin.validator.ts

### `PatchCommandeSchema`

Valide les actions admin sur une commande directe. Seule action disponible : `"marquer_prete"`. Structure simple avec `z.enum(["marquer_prete"])`.

### `PatchDevisSchema`

Le validator le plus complexe — utilise `z.discriminatedUnion("action", [...])`. C'est une union discriminée : selon la valeur du champ `action`, Zod sait exactement quels autres champs sont requis.

Avantage majeur : dans les routes API, quand on fait un `switch` sur `data.action`, TypeScript sait dans chaque `case` exactement quels champs existent. Dans `case "acompte_paye"`, TypeScript sait que `data.montant` existe. Dans `case "valider"`, il sait que `data.montant` n'existe pas. Zéro vérification manuelle nécessaire.

Actions supportées :
- `"valider"` : note admin optionnelle
- `"refuser"` : note admin optionnelle
- `"acompte_paye"` : montant obligatoire et positif
- `"marquer_pret"` : aucun champ supplémentaire
- `"modifier_prix"` : nouveauPrix obligatoire et positif
- `"modifier_date_retrait"` : dateRetrait obligatoire, convertie via `z.coerce.date()`

### `PatchConfigSchema`

Valide la modification d'une variable Config. `nameVariable` obligatoire non vide, `valeur` peut être une string vide (pour vider le nom de la boutique par exemple).

### `PatchStockSchema`

Autre `discriminatedUnion` sur `action` :
- `"reapprovisionner"` : quantite entier strictement positif (0 interdit — pas de sens d'approvisionner 0)
- `"set_stock"` : quantite entier >= 0 (0 autorisé — vider le stock manuellement)

Cette distinction est intentionnelle : réapprovisionner 0 est une erreur, mais mettre le stock à 0 est une action valide.

### `SetLimiteSchema`

Valide la création d'une limite de production. `type` : `"jour"` ou `"semaine"`. `valeur` : entier strictement positif. `date` : date de début de la limite.

---

## Routes API — Architecture générale

Toutes les routes suivent le même pattern :

```
1. Recevoir la requête
2. Valider avec Zod → erreur 400 si invalide
3. Appeler le service → erreur 422 si règle métier non respectée
4. Retourner la réponse JSON
5. Attraper les erreurs inattendues → erreur 500
```

Les routes ne contiennent aucune logique métier. Elles sont le pont entre le frontend et les services.

### Status codes utilisés

| Code | Signification |
|---|---|
| 200 | Succès lecture/modification |
| 201 | Succès création |
| 400 | Données invalides (Zod) |
| 403 | Action non autorisée par la config |
| 404 | Ressource introuvable |
| 422 | Règle métier non respectée (service) |
| 500 | Erreur inattendue serveur |

---

## Routes API publiques

### `GET /api/catalogue` — `app/api/catalogue/route.ts`

Route la plus simple du projet. Appelle `getProduitActifs()` et retourne le tableau JSON. Aucun paramètre, aucune validation nécessaire. Accessible sans authentification. Retourne les produits actifs avec leurs photos, filtres saisonniers appliqués automatiquement.

### `POST /api/commande` — `app/api/commande/route.ts`

Route critique — crée une commande directe. Logique de la route :

1. Valide le body avec `CreateCommandeSchema`
2. Lit `mode_commande` depuis Config via `getModeCommande()`
3. Si `mode_commande = "devis_only"` → retourne 403 avec message explicite
4. Si `mode_commande = "seuil"` → calcule le total de pièces et compare avec `getSeuilDevis()`. Si dépassé → retourne 422 avec `{ redirect: "devis" }` pour que le frontend redirige vers le formulaire devis
5. Si tout est ok → appelle `creerCommande()` du service
6. Retourne la commande créée en 201

Le `redirect: "devis"` dans la réponse 422 est une convention entre le frontend et le backend — le frontend lit ce champ et redirige automatiquement.

### `POST /api/devis` — `app/api/devis/route.ts`

Similaire à la route commande mais plus simple — pas de vérification de seuil ici. Le seuil est géré côté commande pour rediriger, pas côté devis. Vérifie uniquement que `mode_commande !== "direct_only"`. Retourne le devis créé en 201.

---

## Routes API admin

### `GET /api/admin/catalogue` — `app/api/admin/catalogue/route.ts`

Retourne tous les produits sans filtre `isActif`, avec photos et limites actives. L'admin voit tout y compris les produits désactivés.

### `POST /api/admin/catalogue` — même fichier

Crée un nouveau produit. Valide avec `CreateCatalogueSchema`, appelle `creerProduit()`. Retourne 201.

### `PATCH /api/admin/catalogue/[id]` — `app/api/admin/catalogue/[id]/route.ts`

Route dynamique — le `[id]` dans l'URL est capturé via `params`. En Next.js 15, `params` est une Promise — il faut `await params` pour récupérer l'id.

Gère plusieurs actions selon le champ `action` dans le body :
- `"toggle_actif"` → appelle `toggleActif()`
- `"ajouter_photo"` → valide avec `AddPhotoSchema`, appelle `ajouterPhoto()`
- `"supprimer_photo"` → valide `photoId`, appelle `supprimerPhoto()`
- Pas d'`action` → valide avec `UpdateCatalogueSchema`, appelle `modifierProduit()`

### `GET /api/admin/commandes` — `app/api/admin/commandes/route.ts`

Retourne toutes les commandes avec leurs items pour le dashboard. Triées par date de commande décroissante.

### `GET /api/admin/commandes/[id]` — `app/api/admin/commandes/[id]/route.ts`

Retourne une commande spécifique avec ses items et les infos produit. Retourne 404 si introuvable.

### `PATCH /api/admin/commandes/[id]` — même fichier

Valide avec `PatchCommandeSchema`. Seule action : `"marquer_prete"`. TODO noté dans le code pour ajouter l'envoi d'email "commande prête" — la fonction n'existe pas encore dans `commande.service.ts`.

### `DELETE /api/admin/commandes/[id]` — même fichier

Supprime une commande et ses items. Le service s'occupe de supprimer d'abord les items pour respecter les contraintes de clé étrangère.

### `GET /api/admin/devis` — `app/api/admin/devis/route.ts`

Supporte un query param optionnel `?statut=en_attente`. Si présent, valide que le statut est dans la liste des statuts valides et appelle `getDevisByStatut()`. Sinon appelle `getDevis()` pour tout retourner. Exemple d'usage : `GET /api/admin/devis?statut=en_attente` pour voir uniquement les devis en attente de traitement.

### `GET /api/admin/devis/[id]` — `app/api/admin/devis/[id]/route.ts`

Retourne un devis spécifique avec ses items et les infos produit.

### `PATCH /api/admin/devis/[id]` — même fichier

La route admin la plus riche. Valide avec `PatchDevisSchema` (discriminatedUnion), puis dispatche vers la bonne fonction du service via un `switch` sur `data.action`. Grâce au discriminatedUnion, TypeScript garantit dans chaque case que les bons champs sont disponibles — pas de vérification manuelle nécessaire.

### `GET /api/admin/config` — `app/api/admin/config/route.ts`

Retourne toutes les variables Config pour affichage dans le dashboard admin.

### `PATCH /api/admin/config` — même fichier

Valide avec `PatchConfigSchema`, appelle `setConfig()`. Permet de modifier n'importe quelle variable Config depuis le dashboard sans redéploiement.

### `GET /api/admin/stock` — `app/api/admin/stock/route.ts`

Retourne uniquement les produits en mode `make_to_stock` avec leur stock actuel.

### `PATCH /api/admin/stock` — même fichier

Valide `idCatalogue` dans le body, puis dispatche selon `action` :
- `"reapprovisionner"` → ajoute la quantité au stock
- `"set_stock"` → définit le stock à une valeur absolue

---

## Problèmes rencontrés et solutions — validators et routes

### Zod 4 — `errorMap` n'existe plus

Dans Zod 3, on personnalisait les messages d'erreur avec `errorMap: () => ({ message: "..." })`. En Zod 4, cette propriété s'appelle simplement `error`. Correction : remplacer `errorMap` par `error` partout dans les schémas `.enum()`.

### Zod 4 — `.errors` renommé en `.issues`

La propriété `ZodError.errors` qui retournait le tableau d'erreurs s'appelle maintenant `ZodError.issues`. Correction dans toutes les routes : `error.errors` → `error.issues`.

### Next.js 15 — `params` est une Promise

Dans Next.js 14, les params des routes dynamiques étaient synchrones. En Next.js 15, ils sont devenus des Promises. Il faut écrire `const { id } = await params` au lieu de `const { id } = params`. Sans ce `await`, l'id est undefined.

### `tsconfig.json` — alias `@/*` pointait vers la racine

`create-next-app` avait configuré `"@/*": ["./*"]` — l'alias pointait vers la racine du projet. Les services étant dans `src/`, l'import `@/lib/services/...` cherchait dans `patisserie/lib/` qui n'existe pas. Correction : `"@/*": ["./src/*"]`.

### Import `StatutTypeDevis` — mauvais chemin

Depuis `app/api/admin/devis/route.ts`, le chemin vers le client Prisma généré est `../../../generated/prisma/client` — trois niveaux à remonter (`devis/` → `admin/` → `api/`), puis descendre dans `generated/`. Un mauvais conseil avait été donné initialement avec quatre niveaux — corrigé.

### `require()` interdit par ESLint

La règle `no-require-imports` interdit `require()` dans les fichiers TypeScript. Un test utilisait `const { getCommandes } = require(...)` à l'intérieur d'un `it()`. Correction : utiliser `await import()` dynamique ou ajouter la fonction aux imports statiques en haut du fichier.

### Chemins d'import dans les tests de routes

Depuis `src/__tests__/routes.test.ts`, les routes se trouvent dans `app/api/` à la racine du projet. Le chemin correct est `../../app/api/...` — deux niveaux à remonter (`__tests__/` → `src/`) puis descendre dans `app/`. La version initiale utilisait `../app/api/...` — un niveau de moins, ce qui cherchait dans `src/app/` qui n'existe pas.

---

## Roadmap mise à jour

### Terminé
- [x] Schéma SQL validé et documenté
- [x] Docker + PostgreSQL configuré
- [x] Projet Next.js initialisé
- [x] Prisma 7 configuré avec driver adapter
- [x] prisma db pull + prisma generate
- [x] src/lib/prisma.ts
- [x] src/lib/config.ts
- [x] src/lib/services/catalogue.service.ts
- [x] src/lib/services/commande.service.ts
- [x] src/lib/services/devis.service.ts
- [x] src/lib/services/limites.service.ts
- [x] src/lib/services/stock.service.ts
- [x] src/lib/services/mail.service.ts
- [x] Jest configuré + 43 tests services passent
- [x] src/validators/commande.validator.ts
- [x] src/validators/devis.validator.ts
- [x] src/validators/catalogue.validator.ts
- [x] src/validators/admin.validator.ts
- [x] Routes API publiques (catalogue, commande, devis)
- [x] Routes API admin (commandes, devis, catalogue, config, stock)
- [x] Tests validators (40 tests)
- [x] Tests routes API

### À faire
- [ ] Middleware next-auth — protection des routes /admin
- [ ] Frontend client (accueil, catalogue, panier)
- [ ] Frontend admin (dashboard, commandes, devis, catalogue, config, stock)
- [ ] Déploiement Coolify + Dockerfile
