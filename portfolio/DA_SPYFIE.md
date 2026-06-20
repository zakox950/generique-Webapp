# Spyfie — Direction Artistique & Fiche Fonctionnelle (Portfolio)

Document de cadrage. Destiné à vivre dans le projet sous `/portfolio/DA_SPYFIE.md`.
Sert de source unique avant écriture du moindre composant.

---

## 1. Cadre

- **Sujet**: portfolio d'agence de dev web (Spyfie), pas un catalogue de templates.
- **Audience**: petites entreprises locales à Bruxelles (commerce, artisan, service). Non-techniques pour la plupart. Décident en quelques secondes si "ce dev a l'air sérieux".
- **Job unique de la page**: prouver, par la forme autant que par le contenu, que celui qui a construit ce portfolio peut construire leur site. Le portfolio est lui-même la première démo.
- **Conséquence**: zéro effet décoratif gratuit. Chaque effet doit démontrer une compétence (capture automatisée, responsive réel, animation maîtrisée, perf).

### Verrou de nommage
Graphie de marque définitive: **Spyfie**. Wordmark, domaine, méta et route admin s'alignent sur cette graphie.

---

## 2. Concept directeur

Le nom Spyfie porte un champ sémantique: signal, reconnaissance, interception, scan, télémétrie. La fonctionnalité centrale du portfolio est exactement ça: on entre une URL, le système **capture** la cible et l'affiche.

**Spine conceptuel**: chaque projet n'est pas une "carte de site" mais une **cible interceptée**. L'interface n'est pas un carrousel décoré, c'est une **console de reconnaissance** qui lit des captures.

Ce spine n'est pas cosmétique, il dicte des décisions concrètes:
- Le verre (glassmorphism) = surface d'instrument, une console posée par-dessus la capture, pas un effet "à la mode".
- Le glow = un signal vivant, source lumineuse unique, pas un néon partout.
- Le mono = télémétrie réelle (URL, viewport, horodatage de capture, statut), pas de la déco typographique.
- La capture (screenshot d'une URL saisie) devient le geste signature de la marque, cohérent avec l'outil de scan de ports déjà construit.

Cela évite le défaut "verre translucide sur fond noir + accent acide" qui apparaît sur n'importe quel portfolio. Ici le verre et le glow ont une justification interne.

---

## 3. Direction Artistique

### 3.1 Palette (4 à 6 valeurs nommées)

```
--void          #07090F   fond global, presque noir bleuté (le "vide" avant signal)
--slate-deep    #0E1320   base des panneaux / surfaces console
--glass         rgba(150,180,220,0.06)  teinte froide des surfaces verre
--signal        #4DE2FF   accent unique vivant (cyan signal) — source de glow
--interference  #9A6CFF   secondaire violet, profondeur / spectre, usage rare
--trace         #6B7689   gris-ardoise des labels, données, télémétrie
--text          #F2F5FA   texte primaire
```

Règle de discipline: **un seul accent porteur de glow** = `--signal`. `--interference` ne sert que de second plan (halos profonds, dégradés de fond), jamais en bouton ni en texte courant. Tout le reste est neutre froid. Le glow se mérite: il signale ce qui est vivant (capture en cours, élément actif), pas chaque bordure.

### 3.2 Typographie (3 rôles)

- **Display** — `Space Grotesk` (alt: `Geist`, `Clash Display`). Géométrique, légèrement singulier, lecture "tech" sans tomber dans le futuriste daté. Usage avec retenue: titres de section, nom de cible.
- **Body** — `Inter` (alt: `Geist Sans`). Neutre, lisible, pour les rares paragraphes et descriptions de projet.
- **Mono / télémétrie** — `JetBrains Mono` (alt: `Geist Mono`). Porte toute la donnée: URL, viewport `1440x900` / `390x844`, `captured_at`, statut `LIVE / CACHED / CAPTURING`. C'est le rôle qui ancre l'identité "console".

Échelle de type intentionnelle: contraste fort display/mono, corps de texte volontairement petit et dense pour renforcer le registre instrument. Le mono est en majuscules + interlettrage léger sur les labels d'état uniquement.

### 3.3 Surfaces & matière

- Fond `--void` avec un ou deux **halos profonds** (orbs) en `--interference` très diffus, lents, en arrière-plan — atmosphère, jamais au premier plan.
- Panneaux console en `--glass`: flou d'arrière-plan (backdrop-blur), bordure 1px à très faible opacité, léger bruit/grain pour éviter le plastique. Liquid glass = réfraction subtile sur les bords, pas un effet plein écran.
- Le glow `--signal` n'apparaît que sur: capture active, ligne de scan, élément focus/actif.

### 3.4 Mouvement

Budget animation serré, orchestré, pas dispersé.
- **Scan-line de révélation**: quand une capture s'affiche, une ligne `--signal` balaie la carte de haut en bas une fois (lecture de la cible). Une fois, pas en boucle.
- **Transition de deck**: au scroll/swipe vertical, la carte du dessus glisse et se replie, la suivante remonte. Inertie courte, courbe nette.
- **Micro-interactions hover** (desktop): la carte au-dessus réagit faiblement (parallaxe légère, glow de bord), rien de plus.
- `prefers-reduced-motion`: scan-line et orbs coupés, transitions réduites à un fondu/translation minimal. Non négociable.

### 3.5 Élément signature

**La pile de cibles (capture-deck)**: cartes empilées comme des dossiers interceptés, chacune montrant la capture d'un site, surmontée d'une bande de télémétrie mono. On défile pour passer d'une cible à l'autre; un titre de cible apparaît en bas au fil du défilement. Bouton "tout déplier" → bascule en **grille de toutes les captures** (vue d'ensemble, registre des interceptions). C'est l'unique chose dont on doit se souvenir de ce portfolio.

---

## 4. Fiche fonctionnelle (ce qu'on attend du site)

### 4.1 Accès admin
- Route admin non listée (ex. `/admin` ou slug secret) protégée par mot de passe.
- Connexion réussie → mode admin: ajout, recapture, réordonnancement, suppression de cibles.
- Visiteur public: lecture seule, jamais d'UI admin visible.

### 4.2 Ajout dynamique d'une cible
- En admin: bouton `+`.
- Saisie d'une **URL**.
- Le serveur **capture automatiquement** des screenshots de l'URL (pas de capture manuelle, pas d'upload).
- La capture de la page d'accueil sert de **preview** de la cible.
- La cible apparaît dans le deck une fois capturée.

### 4.3 Captures desktop ET mobile
- Pour chaque cible, capture en **deux viewports**: desktop (env. 1440x900) et mobile (env. 390x844).
- Le visiteur **desktop** voit les previews desktop. Le visiteur **mobile** voit les previews mobile. L'affichage s'adapte à l'appareil du visiteur, pas à l'appareil du site capturé.

### 4.4 Présentation en deck de cartes
- Cartes des previews empilées les unes sur les autres (pas un catalogue/grille par défaut).
- Défilement vers le bas → change de cible (carte suivante).
- Au fil du scroll, **titres de cible apparaissant en bas**.
- Bouton **"tout déplier"** → vue d'ensemble de toutes les cartes (grille des captures).

### 4.5 Responsive
- Deux rendus distincts web / mobile, pas un simple reflow.
- Le choix desktop-shot / mobile-shot suit le viewport du visiteur (voir 4.3).

---

## 5. Architecture technique (proposition)

Alignée sur la stack déjà en place (Next.js 15 / TypeScript / Prisma / PostgreSQL, VPS Hetzner + Coolify).

### 5.1 Moteur de capture
- **Playwright (Chromium headless)** côté serveur, auto-hébergé sur le VPS. Deux passes: viewport desktop, viewport mobile (device descriptor type iPhone).
- Capture **asynchrone**: l'ajout d'une URL crée une cible en statut `CAPTURING`, un job lance Playwright (5-15s), puis statut `CACHED` + chemins des images. L'UI ne bloque pas pendant la capture; elle montre l'état.
- Bouton **recapture** par cible (les sites évoluent), et option de refresh planifié à décider.
- Fallback éventuel si Playwright lourd sur le VPS: API tierce (Microlink / ScreenshotOne / urlbox). À garder en plan B, l'auto-hébergement reste cohérent avec le positionnement "dev".

### 5.2 Stockage
- Images de capture: volume local Coolify ou stockage objet S3-compatible (à trancher). Référencer le chemin en base, jamais l'image en base.

### 5.3 Modèle de données (esquisse Prisma)
```
Target {
  id           String   @id
  title        String
  url          String
  slug         String   @unique
  desktopShot  String?          // chemin/URL image desktop
  mobileShot   String?          // chemin/URL image mobile
  status       CaptureStatus    // PENDING | CAPTURING | CACHED | FAILED
  capturedAt   DateTime?
  order        Int              // ordre dans le deck
  tags         String[]         // stack / type de projet (optionnel)
  description  String?          // optionnel, copie courte
  createdAt    DateTime @default(now())
}
```

### 5.4 Auth admin
- Pour un portfolio mono-admin: gate par mot de passe (env) + cookie de session signé suffisant. NextAuth seulement si besoin futur de plusieurs comptes. Ne pas sur-construire.

---

## 6. Décisions (verrouillées avant build)

- Graphie de marque: **Spyfie**.
- Capture **statique uniquement** (screenshot), pas d'iframe live. Le "LIVE" reste un label, pas un embed. Justification: l'iframe casse sur `X-Frame-Options`/CSP de nombreux sites et dégrade la perf.
- Preview du deck = capture **above-the-fold** (rectangle fixe, ratio uniforme). Full-page accessible au clic pour montrer le site entier.
- Stockage images: **volume local Coolify**. Mono-admin, faible volume, pas de multi-instance; S3 n'apporterait que config et coût.
- Déclenchement capture: **à l'ajout + bouton recapture manuelle**, pas de refresh planifié. Évite qu'une bonne capture soit écrasée par une cible momentanément down ou mal redesignée.

Directive de build (pas une question): copie d'interface en registre "console" (ex. erreur capture = `CAPTURE FAILED — cible injoignable, réessayer`), rédigée en même temps que l'UI.

---

## 7. Arborescence `/portfolio` proposée

```
portfolio/
  DA_SPYFIE.md              ce document
  DESIGN_SYSTEM.md         tokens implémentés (couleur, type, surfaces, motion)
  app/                     Next.js 15 (App Router)
    (public)/              deck public lecture seule
    admin/                 gate + ajout/recapture/réordonnancement
    api/
      capture/             endpoint de capture (Playwright)
  lib/
    capture/               wrapper Playwright (desktop + mobile)
  prisma/
    schema.prisma          modèle Target + enum CaptureStatus
```

---

## 8. Garde-fous DA (à relire avant chaque écran)

- Un seul glow porteur (`--signal`), sur le vivant uniquement.
- Le mono porte de la vraie donnée, jamais de la déco.
- Le verre est une console, pas un filtre plein écran.
- Animation orchestrée et coupée sous `prefers-reduced-motion`.
- Mobile réel (deux rendus), focus clavier visible, perf de chargement traitée comme une démo.
- Retirer un effet à la fin: si un écran a trois effets, en enlever un.
