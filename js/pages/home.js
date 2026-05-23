'use strict';

function renderHome() {
  var vedettes = PRODUITS.slice(0, 4);

  return '' +
    '<section class="hero">' +
      '<div class="hero-content">' +
        '<div class="eyebrow">' +
          '<span class="eyebrow-line"></span>' +
          '<span class="label">Pâtisserie artisanale · Bruxelles</span>' +
        '</div>' +
        '<h1 class="hero-title">L\'art<br>de la <em>pâtisserie</em><br>française</h1>' +
        '<p class="hero-body">Chaque gâteau est une déclaration d\'intention. Beurre de qualité, fruits de saison, techniques classiques — rien n\'est laissé au hasard dans notre atelier bruxellois.</p>' +
        '<div class="hero-cta">' +
          '<button class="btn btn-primary btn-lg" onclick="navigate(\'catalogue\')">Découvrir le catalogue</button>' +
          '<button class="btn btn-outline btn-lg" onclick="navigate(\'contact\')">La boutique</button>' +
        '</div>' +
      '</div>' +
      '<div class="hero-visual" aria-hidden="true">' +
        '<div class="hero-visual-bg">' +
          '<div class="hero-mono-art">' +
            '<div class="hero-circle hero-circle-outer"></div>' +
            '<div class="hero-circle hero-circle-mid"></div>' +
            '<div class="hero-circle hero-circle-inner"></div>' +
            '<div class="hero-monogram">' +
              '<span class="hero-m">M</span>' +
              '<span class="hero-sig">Maison Oughar</span>' +
            '</div>' +
          '</div>' +
          '<div class="fruit-dot fruit-dot-1"></div>' +
          '<div class="fruit-dot fruit-dot-2"></div>' +
          '<div class="fruit-dot fruit-dot-3"></div>' +
          '<div class="fruit-dot fruit-dot-4"></div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="features-section">' +
      '<div class="container">' +
        '<div class="features-grid">' +
          [
            ['Fait le jour même', 'Chaque pâtisserie est préparée le matin de votre retrait. Aucun stock, aucun compromis sur la fraîcheur.', '<path d="M12 2v10l5 3"/><circle cx="12" cy="12" r="10"/>'],
            ['Ingrédients de saison', 'Figues, framboises, citrons, cerises — notre catalogue suit les saisons pour des fruits au sommet de leur maturité.', '<path d="M12 2a9 9 0 0 1 9 9c0 5-9 13-9 13S3 16 3 11a9 9 0 0 1 9-9z"/><circle cx="12" cy="11" r="3"/>'],
            ['Commande en ligne', 'Commandez jusqu\'à 48h à l\'avance. Retrait en boutique. Pour les grandes occasions, un devis personnalisé sous 48h.', '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'],
          ].map(function(item) {
            return '<div class="feature-card">' +
              '<div class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' + item[2] + '</svg></div>' +
              '<h3 class="feature-title">' + item[0] + '</h3>' +
              '<p class="feature-text">' + item[1] + '</p>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section">' +
      '<div class="container">' +
        '<div class="section-header">' +
          '<div class="eyebrow">' +
            '<span class="eyebrow-line"></span>' +
            '<span class="label color-bordeaux">Notre sélection</span>' +
          '</div>' +
          '<h2 class="display-lg">Les pâtisseries <em>du moment</em></h2>' +
        '</div>' +
        '<div class="products-grid products-grid-4">' +
          vedettes.map(productCard).join('') +
        '</div>' +
        '<div class="section-cta">' +
          '<button class="btn btn-outline" onclick="navigate(\'catalogue\')">Voir tout le catalogue →</button>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="about-section">' +
      '<div class="about-visual" aria-hidden="true">' +
        '<div class="about-visual-inner">' +
          '<div class="about-watermark">Artisan</div>' +
          '<div class="about-badge">' +
            '<svg class="about-badge-star" viewBox="0 0 40 40" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2"><polygon points="20,4 23,14 34,14 25,21 28,31 20,25 12,31 15,21 6,14 17,14"/></svg>' +
            '<div class="about-badge-name">Anass Oughar</div>' +
            '<div class="about-badge-title">Pâtissier artisan</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="about-content">' +
        '<div class="eyebrow mb-16">' +
          '<span class="eyebrow-line"></span>' +
          '<span class="label color-bordeaux">Notre histoire</span>' +
        '</div>' +
        '<h2 class="display-md mb-24">Une passion,<br><em>un atelier, une adresse</em></h2>' +
        '<p class="about-text">Maison Oughar est née d\'une conviction simple : la pâtisserie mérite d\'être prise au sérieux. Pas de recettes standardisées, pas de produits industriels — chaque création est le résultat d\'un travail minutieux, d\'une recherche permanente sur les textures et les saveurs.</p>' +
        '<p class="about-text">Installés au cœur de Bruxelles, nous préparons chaque commande le matin même du retrait. La fraîcheur n\'est pas une promesse — c\'est notre méthode de travail.</p>' +
        '<button class="btn btn-primary" style="margin-top:32px;" onclick="navigate(\'catalogue\')">Commander en ligne</button>' +
      '</div>' +
    '</section>' +

    '<section class="cta-section">' +
      '<div class="container">' +
        '<div class="cta-inner">' +
          '<div class="label" style="color:rgba(255,255,255,0.45);margin-bottom:12px;">Grandes occasions</div>' +
          '<h2 class="display-md cta-title">Une commande importante ?<br><em>Demandez un devis.</em></h2>' +
          '<p class="cta-text">Pour les mariages, baptêmes, anniversaires ou toute commande dépassant dix pièces, nous établissons un devis personnalisé avec acompte. Délai de réponse : 48h.</p>' +
          '<button class="btn btn-white btn-lg" onclick="navigate(\'devis\')">Demander un devis gratuit →</button>' +
        '</div>' +
      '</div>' +
    '</section>';
}
