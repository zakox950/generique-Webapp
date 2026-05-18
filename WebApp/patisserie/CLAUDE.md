# CLAUDE.md — Journal de projet Pâtisserie WebApp

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

## Problèmes rencontrés et solutions

| Problème | Cause | Solution |
|---|---|---|
| `import { PrismaClient } from "@prisma/client"` échoue | Depuis Prisma 6.6+, le client n'est plus généré dans `node_modules`. Il est généré dans le projet à l'emplacement défini dans `schema.prisma` | Importer depuis `../../app/generated/prisma/client` |
| `new PrismaClient()` échoue avec "Expected 1 arguments, but got 0" | Prisma 7 a supprimé son moteur Rust interne. Un driver adapter est maintenant obligatoire pour se connecter à la base | Passer `{ adapter }` au constructeur avec `@prisma/adapter-pg` |
| `DATABASE_URL` ignorée par Prisma, connexion impossible | Espace autour du `=` dans le fichier `.env` (`DATABASE_URL= "..."` au lieu de `DATABASE_URL="..."`). Les fichiers `.env` ne tolèrent aucun espace autour du signe égal | Supprimer l'espace : `DATABASE_URL="postgresql://..."` |
| `docker compose up -d` retourne "empty compose file" | Le service `app` dans le `docker-compose.yml` référençait un `Dockerfile` inexistant. Docker ne pouvait pas builder l'image | Retirer le service `app` du `docker-compose.yml` en développement. Le Dockerfile sera ajouté au moment du déploiement |
| Le dossier `patisserie` s'affiche comme sous-module Git sur GitHub | Le dossier contenait son propre `.git` interne. GitHub interprète un dossier avec un `.git` comme un sous-module et ne peut pas afficher son contenu | `rm -rf patisserie/.git` puis `git rm --cached WebApp/patisserie` et re-commit |
| `setupFilesAfterFramework` n'existe pas dans le type `Config` de Jest | Faute de frappe dans le nom de la propriété de configuration Jest | Corriger en `setupFilesAfterEnv` |
| `SyntaxError: Cannot use 'import.meta' outside a module` dans les tests | Le client Prisma généré utilise la syntaxe ESM (`import.meta.url`). Jest fonctionne en CommonJS par défaut et ne comprend pas cette syntaxe | Ajouter une entrée dans `moduleNameMapper` de `jest.config.ts` pour rediriger l'import vers un fichier mock local |
| `Cannot read properties of undefined (reading 'map')` dans les tests de limites | `jest.clearAllMocks()` dans `setup.ts` efface le `.mockResolvedValue([])` configuré pour `commandeDirect.findMany`. La fonction retournait `undefined` au lieu d'un tableau vide, et `.map()` sur `undefined` plantait | Ajouter un `beforeEach` local dans `limites.service.test.ts` qui remet le mock à `[]` avant chaque test |
| `Argument of type Decimal is not assignable to parameter of type string / number` | Prisma stocke les champs `DECIMAL` avec son propre type `Decimal`, pas le `number` natif JavaScript. La fonction `formatPrix` n'acceptait que `number / string` | Modifier `formatPrix` pour accepter aussi `{ toNumber: () => number }` et appeler `.toNumber()` si c'est un objet |
| `Return type of constructor signature must be assignable to the instance type of the class` | Le constructeur du mock `Decimal` retournait directement une valeur primitive (`number`). TypeScript interdit qu'un constructeur retourne une valeur primitive — le retour doit être une instance de la classe | Stocker la valeur dans `this.value` et l'exposer via une méthode `toNumber()` |

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
