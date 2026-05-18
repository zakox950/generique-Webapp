@AGENTS.md
# CLAUDE.md — Journal de projet Pâtisserie WebApp

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

---

## Architecture du projet

```
patisserie/
├── app/
│   ├── generated/prisma/          ← client Prisma généré (gitignored)
│   ├── api/
│   │   ├── catalogue/route.ts     → GET public
│   │   ├── commande/route.ts      → POST public
│   │   ├── devis/route.ts         → POST public
│   │   └── admin/
│   │       ├── catalogue/route.ts
│   │       ├── commandes/route.ts
│   │       ├── commandes/[id]/route.ts
│   │       ├── devis/route.ts
│   │       ├── devis/[id]/route.ts
│   │       ├── config/route.ts
│   │       └── stock/route.ts
│   ├── (client)/                  ← pages publiques (layout client)
│   │   ├── layout.tsx
│   │   ├── page.tsx               → accueil
│   │   ├── catalogue/page.tsx
│   │   └── panier/page.tsx
│   └── admin/                     ← pages admin protégées
│       ├── layout.tsx             → sidebar partagée
│       ├── page.tsx               → dashboard
│       ├── commandes/page.tsx
│       ├── devis/page.tsx
│       ├── catalogue/page.tsx
│       ├── stock/page.tsx
│       └── config/page.tsx
├── prisma/
│   └── schema.prisma              ← généré via prisma db pull
├── src/
│   ├── lib/
│   │   ├── prisma.ts              ← client singleton Prisma 7
│   │   ├── config.ts              ← lecture table Config
│   │   └── services/
│   │       ├── catalogue.service.ts
│   │       ├── commande.service.ts
│   │       ├── devis.service.ts
│   │       ├── limites.service.ts
│   │       ├── stock.service.ts
│   │       └── mail.service.ts
│   ├── validators/
│   │   ├── commande.validator.ts
│   │   └── devis.validator.ts
│   └── types/
│       └── index.ts
├── .env                           ← gitignored
├── docker-compose.yml
├── patisserie.sql                 ← SQL d'initialisation
└── prisma.config.ts               ← config Prisma 7

```

---

## Flux MVC

Le projet suit une architecture MVC adaptée à Next.js :

- **View** → Frontend (pages Next.js dans app/(client)/ et app/admin/)
- **Controller** → Routes API (app/api/) + Validators Zod
- **Model** → Services (src/lib/services/)

Flux d'une requête :
```
Frontend (bouton) 
  → Route API (reçoit, valide avec Zod, délègue)
    → Service (logique métier, règles, écriture en base)
      → Réponse au frontend
```

Les routes API ne contiennent aucune logique métier. Elles reçoivent, valident, délèguent au service, retournent la réponse.

---

## Base de données

### Schéma — 11 tables

**Catalogue** — produits avec support make_to_order/make_to_stock, produits saisonniers (dateDebutActif/dateFinActif), variantes (prixOptions JSONB)

**Photo** — photos liées aux produits, table séparée pour permettre plusieurs photos par produit

**CommandeDirect** — commandes directes (sous le seuil devis). Créée UNIQUEMENT après confirmation paiement Stripe. Contient paiementChoisi (en_ligne/sur_place)

**Devis** — demandes de devis (au-dessus du seuil). Workflow avec statuts : en_attente → valide → acompte_paye → pret → (annule/expire). Contient acompte calculé à la création, expireAt calculé à la création

**CatalogueItem** — table de jonction CommandeDirect ↔ Catalogue. Stocke prixUnite au moment de la commande (protection contre modification de prix ultérieure) + options JSONB choisies

**CatalogueDevisItem** — même principe pour Devis ↔ Catalogue

**DayLimit** — limite de production journalière par produit. Le total est calculé via SUM à la volée, jamais stocké

**WeekLimit** — limite hebdomadaire par produit, même principe

**Admin** — comptes administrateurs pour next-auth

**Config** — variables de configuration globales activables depuis le dashboard admin

### Règles métier critiques

- Les totaux DayLimit/WeekLimit sont calculés via SUM à chaque requête, jamais stockés (décision délibérée pour éviter les incohérences)
- expireAt est calculé en backend au moment de l'insertion (pas de trigger)
- Une CommandeDirect n'est insérée en base qu'après confirmation Stripe
- Le prix est copié dans CatalogueItem/CatalogueDevisItem au moment de la commande

### Variables Config

| Variable | Défaut | Valeurs possibles |
|---|---|---|
| mode_production_global | make_to_order | make_to_order / make_to_stock / mixte |
| mode_commande | seuil | direct_only / devis_only / seuil |
| seuil_devis | 10 | entier |
| delai_retrait_jours | 2 | entier |
| limite_par_commande | 0 | entier (0 = illimité) |
| devis_expire_days | 14 | entier |
| acompte_mode | pourcentage | desactive / pourcentage / montant_fixe |
| acompte_valeur | 30 | décimal |
| mode_paiement | en_ligne | en_ligne / sur_place / acompte / au_choix_client |
| mode_retrait | boutique | boutique / livraison / les_deux |
| frais_livraison | 0.00 | décimal |
| zone_livraison | "" | texte libre |
| notif_admin_email | "" | email |
| notif_client_statut | true | true / false |
| notif_admin_commande | true | true / false |
| notif_admin_devis | true | true / false |
| boutique_nom | "" | texte libre |
| boutique_adresse | "" | texte libre |
| boutique_tel | "" | texte libre |
| boutique_horaires | "" | texte libre |

---

## Choix techniques et pourquoi

### Pourquoi Next.js 15 App Router et pas Pages Router
L'App Router permet les layouts partagés (sidebar admin en un seul fichier layout.tsx), les Server Components (accès direct à la base sans passer par une API intermédiaire), et les loading/error states automatiques. Le Pages Router nécessitait de répéter les layouts à chaque page.

### Pourquoi Prisma 7 et pas Prisma 5
Prisma 7 est plus rapide (réécriture TypeScript pur, sans moteur Rust), meilleur support ESM et environnements modernes. La contrainte : il faut obligatoirement un driver adapter (@prisma/adapter-pg pour PostgreSQL) et importer depuis app/generated/prisma/client et non depuis @prisma/client.

### Pourquoi Resend et pas Nodemailer
Resend ne nécessite pas de configuration serveur SMTP. API simple avec SDK TypeScript natif. Tier gratuit 3000 emails/mois suffisant pour une pâtisserie artisanale. Le client gère son propre compte Resend — si il dépasse le gratuit, il entre sa carte lui-même.

### Pourquoi Zod
Validation typée des données entrantes dans les routes API. Si les données ne correspondent pas au schéma attendu, erreur 400 automatique. Évite de faire les vérifications manuellement dans chaque route.

### Pourquoi Docker pour PostgreSQL
Pas besoin d'installer PostgreSQL sur la machine de développement. Le container est isolé, reproductible, et identique entre dev et prod. Les données persistent via un volume Docker.

### Pourquoi SUM et pas colonne stockée pour les limites
Pour DayLimit et WeekLimit, le total commandé est calculé via SELECT SUM(quantite) à chaque vérification. On ne stocke pas le total dans une colonne dédiée. Raison : une colonne stockée peut devenir incohérente si plusieurs services écrivent en même temps. Pour une architecture single-service, le SUM à la volée est plus fiable.

### Pourquoi pas de triggers pour expireAt
expireAt est calculé en backend au moment de l'insertion du devis. Les triggers sont justifiés quand plusieurs services différents écrivent dans la même base. Pour un projet single-service Next.js, la logique applicative est préférée — plus simple à déboguer, plus explicite.

### Pourquoi la table Config et pas des variables d'environnement
Les variables d'environnement nécessitent un redéploiement pour changer. La table Config est modifiable depuis le dashboard admin en temps réel, sans toucher au code ni redéployer.

### Pourquoi le mode_paiement dans Config et pas dans CommandeDirect
Le mode de paiement est une décision du commerçant, pas du client. Il s'applique à toutes les commandes. On stocke uniquement paiementChoisi dans CommandeDirect pour enregistrer ce que le client a effectivement choisi (pertinent uniquement si mode = au_choix_client).

---

## Configuration Docker

```yaml
services:
  db:
    image: postgres:16
    container_name: patisserie_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: patisserie
      POSTGRES_PASSWORD: [MOT_DE_PASSE]
      POSTGRES_DB: patisserie
    ports:
      - "5120:5432"     ← port 5120 sur la machine, 5432 dans le container
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

Le container app sera ajouté avec un Dockerfile au moment du déploiement sur Coolify. En développement, Next.js tourne avec npm run dev directement sur la machine.

---

## Configuration Prisma 7

```typescript
// prisma.config.ts
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL },
})
```

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "../../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
```

Le singleton global évite de créer plusieurs connexions PostgreSQL lors des rechargements à chaud en développement (hot reload Next.js).

---

## Commandes importantes

```bash
# Lancer PostgreSQL
docker compose up -d

# Initialiser la base depuis le SQL
docker exec -i patisserie_db psql -U patisserie -d patisserie < patisserie.sql

# Générer le schema.prisma depuis la base existante
npx prisma db pull

# Générer le client TypeScript
npx prisma generate

# Lancer le serveur de développement
npm run dev
```

---

## Variables d'environnement (.env)

```
DATABASE_URL="postgresql://patisserie:[MOT_DE_PASSE]@localhost:5120/patisserie"
RESEND_API_KEY=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

Attention : pas d'espace autour du = dans les fichiers .env. La variable n'est pas lue si il y a un espace.

---

## Problèmes rencontrés et solutions

### Prisma 7 — import depuis @prisma/client ne fonctionne plus
Depuis Prisma 6.6+, le client n'est plus généré dans node_modules. Il faut importer depuis le chemin de génération configuré dans schema.prisma. Dans ce projet : `../../app/generated/prisma/client` depuis src/lib/prisma.ts.

### Prisma 7 — new PrismaClient() sans argument échoue
Prisma 7 exige un driver adapter. Il faut passer `{ adapter }` au constructeur. Le driver pour PostgreSQL est `@prisma/adapter-pg`.

### DATABASE_URL ignorée par Prisma
Problème : espace dans le .env (`DATABASE_URL= "..."` au lieu de `DATABASE_URL="..."`). Les fichiers .env ne tolèrent aucun espace autour du signe égal.

### Docker — empty compose file
Docker cherchait le docker-compose.yml dans le mauvais dossier, ou le container app sans Dockerfile bloquait le démarrage. Solution : retirer le service app du docker-compose en développement.

### Dossier patisserie reconnu comme sous-module Git
Le dossier patisserie avait son propre .git interne. GitHub l'affichait comme sous-module et ne pouvait pas afficher son contenu. Solution : `rm -rf patisserie/.git` puis `git rm --cached` et re-commit.

### Docker Desktop ne s'ouvrait pas
Docker Desktop était corrompu. Solution : `sudo pkill -f Docker`, réinstallation depuis docker.com.

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

### En cours
- [ ] src/lib/services/catalogue.service.ts

### À faire
- [ ] src/lib/services/commande.service.ts
- [ ] src/lib/services/devis.service.ts
- [ ] src/lib/services/limites.service.ts
- [ ] src/lib/services/stock.service.ts
- [ ] src/lib/services/mail.service.ts
- [ ] src/validators/commande.validator.ts
- [ ] src/validators/devis.validator.ts
- [ ] Routes API publiques (catalogue, commande, devis)
- [ ] Routes API admin (commandes, devis, catalogue, config, stock)
- [ ] Authentification next-auth
- [ ] Frontend client (accueil, catalogue, panier)
- [ ] Frontend admin (dashboard, commandes, devis, catalogue, config)
- [ ] Déploiement Coolify + Dockerfile

---

## Modèle commercial

- **Création** : 1 500€ – 2 500€ one-shot
- **Maintenance** : 70€ – 100€/mois (hébergement + emails + mises à jour)
- Les services tiers (Resend, domaine, Coolify) sont configurés par le développeur et passés au client. Si le client dépasse le tier gratuit d'un service, il gère lui-même la facturation.


mtn met a jour ce fichier relis notre conversation et reexplique en detail tout les avancement que on a fait notament sur la logique derriere les service en detail je veut une documentation detailler sur chaque functiion ecrite son role et le choix de la logique , je veux que ensuite lorsque tu a fini d expliquer tout les ficheir tu fasse une explication de l installation de jest et que tu explique de maniere tout aussi detailler que pour service les test realiser et les iteration de corrections realiser , pourquoi ca plantais , et pourquoi ca fonctionne , sur cette partie hesite pas a etre eloquant et expliquer comme si tu parlais a des debutant en code , jusque a ce que tu arrive au moment ou on a 43/43 test reussi , et met la date avant de dociumenter on va tenir ce journal avec des dates
