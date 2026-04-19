# Bottom Nav Flottante — Documentation Technique

## Objectif

Navigation bottom bar mobile-first qui :
- Flotte au-dessus du contenu (coexiste avec la barre Safari)
- Se collapse en pill minimaliste au scroll vers le bas
- Se ré-expand au scroll vers le haut ou au tap
- Indique la page active même en état collapsed (dots)
- Gère correctement la safe area iOS (iPhone X+)

---

## 1. Le problème de coexistence avec Safari

Sur iOS, Safari a sa propre barre de navigation en bas de l'écran.
Si ta nav est `position: fixed; bottom: 0`, elle se superpose à la barre Safari ou crée un double bandeau.

**La solution** : ne pas coller ta nav au bord.
Tu la fais flotter avec un `bottom` calculé :

```css
.bottom-nav {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 12px);
  left: 50%;
  transform: translateX(-50%);
}
```

- `env(safe-area-inset-bottom)` : variable CSS native qui vaut la hauteur de la zone "safe" iOS (environ 34px sur iPhone avec notch, 0px sur Android). Elle prend automatiquement en compte le chrome du navigateur.
- `+ 12px` : le gap visuel entre la barre Safari et ta nav.

Résultat : ta nav flotte à 12px au-dessus de la zone que Safari occupe. Elles ne se touchent jamais.

**Important** : pour que `env(safe-area-inset-bottom)` fonctionne, ta balise meta viewport doit avoir `viewport-fit=cover` :

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

Sans ça, la valeur est toujours 0.

---

## 2. La forme pill et le liquid glass

Ta nav n'est pas une barre pleine largeur. C'est une pill centrée :

```css
.bottom-nav {
  border-radius: 999px;           /* pill parfaite */
  width: calc(100% - 48px);      /* 24px de marge de chaque côté */
  max-width: 420px;               /* cap desktop */
}
```

Le liquid glass est composé de 4 couches CSS :

```css
.bottom-nav {
  /* 1. Fond semi-transparent */
  background: rgba(30, 31, 26, 0.62);

  /* 2. Blur + saturation (le verre dépoli) */
  backdrop-filter: blur(20px) saturate(160%) brightness(0.9);
  -webkit-backdrop-filter: blur(20px) saturate(160%) brightness(0.9);

  /* 3. Bordure subtile */
  border: 1px solid rgba(255, 255, 255, 0.13);

  /* 4. Shadows : externe pour la profondeur, interne pour le rim highlight */
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.28),       /* ombre portée */
    0 2px 8px rgba(0, 0, 0, 0.18),          /* ombre proche */
    inset 0 1px 0 rgba(255, 255, 255, 0.2), /* rim highlight haut */
    inset 0 -1px 0 rgba(255, 255, 255, 0.06); /* reflet bas discret */
}

/* Ligne lumineuse en haut (simuler la réfraction du verre) */
.bottom-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.38) 40%,
    rgba(255, 255, 255, 0.38) 60%,
    transparent
  );
  pointer-events: none;
}
```

Le `::before` simule la lumière qui frappe le bord supérieur du verre. C'est ce détail qui fait la différence entre une glassmorphism plate et un liquid glass convaincant.

---

## 3. Les deux états : expanded / collapsed

Définis les variables de hauteur en CSS :

```css
:root {
  --nav-pill-h: 56px;     /* hauteur normale */
  --nav-collapsed: 36px;  /* hauteur collapsed */
}
```

La transition entre les deux états se fait uniquement par classes CSS :

```css
.bottom-nav {
  height: var(--nav-pill-h);
  overflow: hidden; /* crucial : cache les items quand height réduit */
  transition:
    height 0.36s cubic-bezier(0.32, 0.72, 0, 1),
    width 0.36s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.28s;
}

.bottom-nav.collapsed {
  height: var(--nav-collapsed);
  width: 80px;     /* rétréci horizontalement aussi */
  opacity: 0.7;
}
```

Le cubic-bezier `(0.32, 0.72, 0, 1)` est la courbe d'accélération d'iOS (spring rapide avec légère décélération finale). Tu peux aussi utiliser `cubic-bezier(0.25, 0.46, 0.45, 0.94)` pour quelque chose de plus doux.

**Ce qui est visible dans chaque état** :

```css
/* Items de nav : visibles en expanded, cachés en collapsed */
.nav-items {
  transition: opacity 0.22s;
}
.bottom-nav.collapsed .nav-items {
  opacity: 0;
  pointer-events: none; /* désactive les clics aussi */
}

/* Dots : cachés en expanded, visibles en collapsed */
.nav-dots {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.22s;
  pointer-events: none;
}
.bottom-nav.collapsed .nav-dots {
  opacity: 1;
}
```

Les dots sont des cercles simples. Le dot actif est plus grand et coloré :

```html
<div class="nav-dots">
  <div class="nav-dot active-dot" id="dot-home"></div>
  <div class="nav-dot" id="dot-catalogue"></div>
  <div class="nav-dot" id="dot-cart"></div>
  <div class="nav-dot" id="dot-contact"></div>
</div>
```

```css
.nav-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}
.nav-dot.active-dot {
  background: var(--ta-couleur-accent);
  width: 6px;
  height: 6px;
}
```

---

## 4. La logique de scroll (JS)

C'est la partie centrale. La logique est intentionnellement simple :

```javascript
let lastScrollY = 0;
let isCollapsed = false;
const NAV = document.getElementById('bottom-nav');

function handleScroll() {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;

  if (delta > 8 && !isCollapsed && currentY > 60) {
    // Scroll vers le bas (delta positif) → collapse
    // Seuil de 8px pour éviter les micro-mouvements
    // currentY > 60 pour ne pas collapse tout de suite en haut de page
    isCollapsed = true;
    NAV.classList.add('collapsed');

  } else if (delta < -6 && isCollapsed) {
    // Scroll vers le haut (delta négatif) → expand
    isCollapsed = false;
    NAV.classList.remove('collapsed');
  }

  // Auto-expand si l'utilisateur est tout en haut
  if (currentY < 20 && isCollapsed) {
    isCollapsed = false;
    NAV.classList.remove('collapsed');
  }

  lastScrollY = currentY;
}

window.addEventListener('scroll', handleScroll, { passive: true });
```

**Pourquoi `passive: true`** : indique au navigateur que tu ne vas pas appeler `preventDefault()`. Le navigateur peut alors optimiser le scroll sans attendre la fin de ton callback. Sur mobile, ça fait une différence réelle en fluidité.

**Pourquoi les seuils de 8 et -6** : évite les faux déclenchements liés au scroll inertiel d'iOS (le "rubber banding"). Ajuste selon tes préférences.

---

## 5. Tap pour expand

Quand la nav est collapsed, l'utilisateur peut taper dessus pour la rouvrir sans avoir à scroller :

```javascript
NAV.addEventListener('click', () => {
  if (isCollapsed) {
    isCollapsed = false;
    NAV.classList.remove('collapsed');
  }
});
```

Ce listener s'exécute avant la propagation vers les boutons de navigation. Si la nav est collapsed, le tap expand sans déclencher de navigation. Si elle est expanded, le tap normal atteint le bon bouton.

---

## 6. Reset au changement de page

Quand l'utilisateur navigue vers une nouvelle page, reset l'état :

```javascript
function navigate(page) {
  // ... changer la page active ...

  window.scrollTo(0, 0);
  lastScrollY = 0;

  // Toujours expand la nav à la navigation
  isCollapsed = false;
  NAV.classList.remove('collapsed');
}
```

Et mettre à jour le dot actif dans les collapsed-dots :

```javascript
function navigate(page) {
  // Reset tous les dots
  document.querySelectorAll('.nav-dot').forEach(d => {
    d.classList.remove('active-dot');
    d.style.width = '4px';
    d.style.height = '4px';
    d.style.background = 'rgba(255,255,255,0.4)';
  });

  // Activer le bon dot
  const dot = document.getElementById('dot-' + page);
  if (dot) {
    dot.classList.add('active-dot');
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.background = 'var(--accent)';
  }
}
```

---

## 7. Padding de page

Tes pages doivent avoir un padding-bottom suffisant pour que le contenu ne soit jamais caché derrière la nav flottante :

```css
:root {
  --nav-pill-h: 56px;
  --nav-gap: 12px;
  --safe-b: env(safe-area-inset-bottom, 0px);
}

.page {
  padding-bottom: calc(var(--nav-pill-h) + var(--nav-gap) + var(--safe-b) + 24px);
}
```

La valeur `+ 24px` est du breathing room supplémentaire pour que le dernier élément de la page ne soit pas juste collé derrière la nav.

---

## 8. Template minimal réutilisable

Voici le squelette complet à copier-coller dans une nouvelle app :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>App</title>
  <style>
    :root {
      --nav-pill-h: 56px;
      --nav-collapsed: 36px;
      --nav-gap: 12px;
      --safe-b: env(safe-area-inset-bottom, 0px);
      --accent: #7A9E77;        /* ta couleur d'accent */
      --nav-bg: rgba(20,20,20,0.65);
      --nav-border: rgba(255,255,255,0.12);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    .page {
      display: none;
      min-height: 100dvh;
      padding-bottom: calc(var(--nav-pill-h) + var(--nav-gap) + var(--safe-b) + 24px);
    }
    .page.active { display: block; }

    /* ── NAV ── */
    .bottom-nav {
      position: fixed;
      bottom: calc(var(--safe-b) + var(--nav-gap));
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;

      border-radius: 999px;
      width: calc(100% - 48px);
      max-width: 420px;
      height: var(--nav-pill-h);
      overflow: hidden;

      background: var(--nav-bg);
      backdrop-filter: blur(20px) saturate(160%) brightness(0.9);
      -webkit-backdrop-filter: blur(20px) saturate(160%) brightness(0.9);
      border: 1px solid var(--nav-border);
      box-shadow:
        0 12px 40px rgba(0,0,0,0.28),
        0 2px 8px rgba(0,0,0,0.18),
        inset 0 1px 0 rgba(255,255,255,0.18),
        inset 0 -1px 0 rgba(255,255,255,0.05);

      transition:
        height .36s cubic-bezier(0.32,0.72,0,1),
        width .36s cubic-bezier(0.32,0.72,0,1),
        opacity .28s;
    }

    .bottom-nav::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.35) 60%, transparent);
      pointer-events: none;
    }

    .bottom-nav.collapsed {
      height: var(--nav-collapsed);
      width: 80px;
      opacity: 0.72;
    }

    /* Items */
    .nav-items {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 100%;
      padding: 0 8px;
      transition: opacity .22s;
    }
    .bottom-nav.collapsed .nav-items {
      opacity: 0;
      pointer-events: none;
    }

    /* Dots */
    .nav-dots {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      opacity: 0; transition: opacity .22s; pointer-events: none;
    }
    .bottom-nav.collapsed .nav-dots { opacity: 1; }

    .nav-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: rgba(255,255,255,0.4);
      transition: all .2s;
    }
    .nav-dot.active { background: var(--accent); width: 6px; height: 6px; }

    /* Boutons */
    .nav-btn {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      background: none; border: none; cursor: pointer;
      padding: 6px 14px;
      color: rgba(255,255,255,0.38);
      font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
      transition: color .18s, transform .12s;
      font-family: inherit;
    }
    .nav-btn.active { color: var(--accent); }
    .nav-btn:active { transform: scale(0.88); }
    .nav-btn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.5; }
  </style>
</head>
<body>

  <!-- Pages -->
  <div id="page-home" class="page active">
    <!-- contenu -->
  </div>
  <div id="page-deux" class="page">
    <!-- contenu -->
  </div>

  <!-- Nav -->
  <nav class="bottom-nav" id="bottom-nav">
    <div class="nav-dots">
      <div class="nav-dot active" id="dot-home"></div>
      <div class="nav-dot" id="dot-deux"></div>
    </div>
    <div class="nav-items">
      <button class="nav-btn active" id="nav-home" onclick="navigate('home')">
        <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
        Accueil
      </button>
      <button class="nav-btn" id="nav-deux" onclick="navigate('deux')">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>
        Section
      </button>
    </div>
  </nav>

  <script>
    const PAGES = ['home', 'deux']; // liste de tes pages
    let lastScrollY = 0;
    let isCollapsed = false;
    const NAV = document.getElementById('bottom-nav');

    /* Scroll */
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;

      if (delta > 8 && !isCollapsed && y > 60) {
        isCollapsed = true;
        NAV.classList.add('collapsed');
      } else if (delta < -6 && isCollapsed) {
        isCollapsed = false;
        NAV.classList.remove('collapsed');
      }
      if (y < 20 && isCollapsed) {
        isCollapsed = false;
        NAV.classList.remove('collapsed');
      }
      lastScrollY = y;
    }, { passive: true });

    /* Tap pour expand */
    NAV.addEventListener('click', () => {
      if (isCollapsed) { isCollapsed = false; NAV.classList.remove('collapsed'); }
    });

    /* Navigation */
    function navigate(page) {
      PAGES.forEach(p => {
        document.getElementById('page-' + p)?.classList.remove('active');
        document.getElementById('nav-' + p)?.classList.remove('active');
        const dot = document.getElementById('dot-' + p);
        if (dot) { dot.classList.remove('active'); }
      });

      document.getElementById('page-' + page)?.classList.add('active');
      document.getElementById('nav-' + page)?.classList.add('active');
      document.getElementById('dot-' + page)?.classList.add('active');

      window.scrollTo(0, 0);
      lastScrollY = 0;
      isCollapsed = false;
      NAV.classList.remove('collapsed');
    }
  </script>
</body>
</html>
```

---

## 9. Checklist d'intégration dans une app existante

- [ ] Ajouter `viewport-fit=cover` dans la meta viewport
- [ ] Définir les variables CSS `:root` (nav-pill-h, nav-collapsed, nav-gap, safe-b, accent)
- [ ] Remplacer la nav existante par la structure `.bottom-nav > .nav-dots + .nav-items`
- [ ] Ajouter `padding-bottom` calculé sur chaque `.page`
- [ ] Copier le bloc JS (scroll listener + navigate function)
- [ ] Adapter `PAGES` à la liste de tes pages
- [ ] Ajuster `--accent` à la couleur de l'app
- [ ] Ajuster `--nav-bg` si le fond de l'app est clair (utiliser rgba blanc plutôt que noir)

---

## 10. Variante fond clair (app sport, journal, etc.)

Si ton app a un fond clair, inverse les couleurs du glass :

```css
.bottom-nav {
  background: rgba(255, 255, 255, 0.55);   /* glass blanc */
  backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.04);
}

.nav-btn { color: rgba(0, 0, 0, 0.35); }
.nav-btn.active { color: var(--accent); }
.nav-dot { background: rgba(0, 0, 0, 0.25); }
```
