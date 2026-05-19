Voici la roadmap complète avec estimations réalistes à 3h/jour.

---

## Roadmap — Prochaines étapes

| Étape | Description | Estimation |
|---|---|---|
| **Validators Zod** | `commande.validator.ts` + `devis.validator.ts` — schémas de validation des données entrantes des routes API | 2h |
| **Routes API publiques** | `GET /api/catalogue`, `POST /api/commande`, `POST /api/devis` — les trois routes accessibles par les clients sans authentification | 3h |
| **Routes API admin — lecture** | `GET /api/admin/commandes`, `GET /api/admin/devis`, `GET /api/admin/catalogue`, `GET /api/admin/config`, `GET /api/admin/stock` | 3h |
| **Routes API admin — écriture** | `PATCH /api/admin/commandes/[id]`, `PATCH /api/admin/devis/[id]`, `POST /api/admin/catalogue`, `PATCH /api/admin/catalogue/[id]`, `PATCH /api/admin/config`, `PATCH /api/admin/stock/[id]` | 4h |
| **Authentification next-auth** | Configuration next-auth avec credentials (email + password), middleware de protection des routes `/admin` et `/api/admin`, session et cookies | 4h |
| **Tests routes API** | Tests des validators Zod + tests d'intégration des routes API principales | 3h |
| **Frontend client — catalogue** | Page catalogue, cards produits, fiche produit, gestion des options/variantes | 6h |
| **Frontend client — panier** | Panier (state local ou localStorage), calcul total, seuil devis dynamique | 5h |
| **Frontend client — formulaire commande** | Formulaire nom/email/date retrait/note, validation côté client, appel API | 4h |
| **Frontend client — formulaire devis** | Formulaire avec champs supplémentaires (téléphone, type événement, date souhaitée), appel API | 3h |
| **Frontend client — page accueil** | Hero section, mise en avant des produits, infos boutique depuis Config | 4h |
| **Frontend admin — layout + auth** | Sidebar, navigation, page de login, redirection si non connecté | 4h |
| **Frontend admin — dashboard** | Stats rapides (commandes du jour, devis en attente, stock bas), tableau de bord | 5h |
| **Frontend admin — commandes** | Liste commandes, détail commande, marquer comme prête | 4h |
| **Frontend admin — devis** | Liste devis par statut, détail devis, valider/refuser/modifier prix/marquer prêt | 6h |
| **Frontend admin — catalogue** | Liste produits, formulaire création/modification, upload photos, toggle actif, limites | 6h |
| **Frontend admin — stock** | Vue stock par produit, réapprovisionner, corriger stock | 3h |
| **Frontend admin — config** | Interface pour modifier toutes les variables Config, formulaire par section | 4h |
| **Dockerfile + déploiement Coolify** | Dockerfile multi-stage pour Next.js, docker-compose.yml production, configuration Coolify, variables d'environnement production | 5h |
| **Tests end-to-end + corrections** | Tester tout le flux client (commande + devis) et admin en conditions réelles, corriger les bugs | 5h |

---

## Récapitulatif

| Phase | Étapes | Total heures |
|---|---|---|
| Backend API | 1 → 6 | ~19h |
| Frontend client | 7 → 11 | ~22h |
| Frontend admin | 12 → 18 | ~32h |
| Déploiement + tests | 19 → 20 | ~10h |
| **Total** | | **~83h** |

---

## En jours à 3h/jour

```
83h ÷ 3h/jour = ~28 jours ouvrés
soit environ 6 semaines
```

Le frontend admin est la phase la plus longue — beaucoup de composants différents, beaucoup de cas à gérer (statuts, formulaires, tableaux). Le backend API est la phase la plus rapide car les services sont déjà écrits et testés — les routes ne font que brancher validators → services → réponse.
