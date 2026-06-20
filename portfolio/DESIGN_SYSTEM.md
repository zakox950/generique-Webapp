# Spyfie — Design System (tokens implémentés)

Traduction opérationnelle de `DA_SPYFIE.md` en tokens concrets. Toute valeur ici
est la **source unique** reprise dans `src/app/globals.css`. Si une couleur, une
graisse ou une durée doit changer, elle change ici **et** dans `globals.css`.

---

## 1. Couleur

| Token CSS          | Valeur                       | Rôle |
|--------------------|------------------------------|------|
| `--void`           | `#07090F`                    | Fond global (presque noir bleuté). |
| `--slate-deep`     | `#0E1320`                    | Base des panneaux / surfaces console. |
| `--glass`          | `rgba(150,180,220,0.06)`     | Teinte froide des surfaces verre. |
| `--glass-border`   | `rgba(150,180,220,0.14)`     | Bordure 1px des panneaux. |
| `--signal`         | `#4DE2FF`                    | **Accent unique porteur de glow** (vivant). |
| `--interference`   | `#9A6CFF`                    | Second plan (halos profonds) — **jamais** bouton/texte. |
| `--trace`          | `#6B7689`                    | Labels, données, télémétrie. |
| `--text`           | `#F2F5FA`                    | Texte primaire. |

**Discipline du glow** : `--signal` n'est utilisé que sur trois choses vivantes —
(1) la capture active du deck, (2) la scan-line de révélation, (3) l'élément
focus/actif (focus clavier, bouton actif, statut `CAPTURING`). Aucune bordure
décorative en `--signal`. `--interference` reste cantonné aux orbs de fond.

Statuts (couleur du label mono) :
- `PENDING` / `CAPTURING` → `--signal` (vivant, en cours).
- `CACHED` / `LIVE` → `--trace` (donnée stable, neutre).
- `FAILED` → `#FF6B6B` (rouge, seul écart chaud autorisé, réservé à l'erreur).

---

## 2. Typographie (3 rôles)

| Rôle      | Police (next/font)     | Variable CSS        | Usage |
|-----------|------------------------|---------------------|-------|
| Display   | Space Grotesk          | `--font-display`    | Titres de section, nom de cible. Retenue. |
| Body      | Inter                  | `--font-body`       | Paragraphes, descriptions (rares). |
| Mono      | JetBrains Mono         | `--font-mono`       | **Toute la donnée** : URL, viewport, captured_at, statut. |

Règles :
- Le mono est en **MAJUSCULES + interlettrage léger** (`letter-spacing: 0.08em`)
  **uniquement** sur les labels d'état (`CACHED`, `CAPTURING`…).
- Corps de texte volontairement petit et dense (registre instrument).
- Contraste fort display ↔ mono ; le body reste discret.

Échelle indicative :
```
--text-xs:   0.72rem   (télémétrie secondaire)
--text-sm:   0.82rem   (mono / données)
--text-base: 0.95rem   (body)
--text-lg:   1.4rem    (nom de cible)
--text-xl:   2.2rem    (titre de section)
--text-2xl:  3.2rem    (wordmark / hero)
```

---

## 3. Surfaces & matière

- **Fond** : `--void` plein. 1 à 2 orbs `--interference` très diffus
  (`filter: blur(120px)`, opacité ≤ 0.12), lents, en `z-index` bas. Atmosphère.
- **Panneau console (verre)** :
  - `background: --glass`
  - `backdrop-filter: blur(16px) saturate(1.2)`
  - `border: 1px solid --glass-border`
  - `border-radius: 14px`
  - léger grain via pseudo-élément (overlay bruit faible opacité) pour éviter le
    plastique.
- Le verre est **localisé** (bande télémétrie, panneaux admin), jamais un calque
  plein écran posé sur tout.

---

## 4. Mouvement (budget serré)

| Animation        | Déclencheur                  | Durée / courbe                 | Boucle |
|------------------|------------------------------|--------------------------------|--------|
| Scan-line        | Révélation d'une capture     | ~900ms, `cubic-bezier(.2,.7,.3,1)` | **une fois** |
| Transition deck  | Scroll/swipe/clavier         | ~420ms, `cubic-bezier(.32,1,.32,1)` | non |
| Hover carte      | Pointer desktop              | ~180ms, ease-out               | non |
| Orbs de fond     | Ambient                      | 30–45s, linéaire               | oui (lent) |

Tokens :
```
--ease-deck:  cubic-bezier(.32, 1, .32, 1)
--ease-scan:  cubic-bezier(.2, .7, .3, 1)
--dur-deck:   420ms
--dur-scan:   900ms
--dur-hover:  180ms
```

**`prefers-reduced-motion: reduce`** (non négociable) :
- scan-line **coupée** (la capture apparaît en fondu simple),
- orbs **figés** (pas d'animation),
- transitions de deck réduites à un fondu/translation minimal,
- aucun wheel-jacking : le scroll natif reprend la main.

---

## 5. Accessibilité

- **Focus clavier visible** partout : `outline: 2px solid --signal; outline-offset: 2px`.
- Deck navigable au clavier (↑/↓ change de cible, Entrée ouvre le full-page).
- Contraste texte `--text` sur `--void` largement AA.
- Les images de capture ont un `alt` = nom de cible + viewport.

---

## 6. Copie d'interface — registre « console »

Toute la copie est rédigée comme une console de reconnaissance, en même temps que l'UI :
- Ajout en cours : `INTERCEPTION EN COURS…`
- Statut : `CACHED` · `CAPTURING` · `PENDING` · `FAILED`
- Erreur capture : `CAPTURE FAILED — cible injoignable, réessayer`
- Vide : `AUCUNE CIBLE INTERCEPTÉE`
- Bouton déplier : `TOUT DÉPLIER` / `REPLIER`
- Télémétrie : `viewport 1440×900` · `captured_at 2026-06-20 17:52` · `target https://…`

---

## 7. Garde-fou final

Avant de figer un écran : **s'il a trois effets, en retirer un.** Le verre, le
glow et la scan-line ne coexistent que là où chacun porte une information. Partout
ailleurs, on retombe sur du neutre froid.
