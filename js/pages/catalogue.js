'use strict';

function renderCatalogue() {
  return '' +
    '<div class="section">' +
      '<div class="container">' +
        '<div class="section-header">' +
          '<div class="eyebrow">' +
            '<span class="eyebrow-line"></span>' +
            '<span class="label color-bordeaux">Maison Oughar</span>' +
          '</div>' +
          '<h1 class="display-lg">Notre <em>catalogue</em></h1>' +
          '<p class="section-subtitle">Toutes nos créations artisanales, disponibles en commande directe. Pour plus de dix pièces, un devis est établi automatiquement.</p>' +
        '</div>' +
        '<div class="products-grid">' +
          PRODUITS.map(productCard).join('') +
        '</div>' +
      '</div>' +
    '</div>';
}
