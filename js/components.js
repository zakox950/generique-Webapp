'use strict';

function productArt(produit, heightPx) {
  var h = heightPx ? heightPx + 'px' : '100%';
  return '<div style="width:100%;height:' + h + ';background:' + produit.gradient + ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;">' +
    '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-style:italic;font-size:1.1rem;color:rgba(255,255,255,0.88);text-align:center;line-height:1.35;">' + produit.nom + '</div>' +
    '<div style="width:28px;height:1px;background:rgba(255,255,255,0.28);"></div>' +
    '<div style="font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.4);">' + produit.motif + '</div>' +
    '</div>';
}

function productCard(p) {
  var hasOptions = p.prixOptions !== null && p.prixOptions !== undefined;
  return '<article class="product-card" onclick="navigate(\'produit/' + p.id + '\')">' +
    '<div class="product-image">' + productArt(p) + '</div>' +
    '<div class="product-info">' +
    (p.saison ? '<span class="product-saison">' + p.saison + '</span>' : '') +
    '<h3 class="product-name">' + p.nom + '</h3>' +
    '<p class="product-desc">' + p.description + '</p>' +
    '<div class="product-footer">' +
    '<div class="product-price">' +
    (hasOptions ? '<span class="product-price-from">à partir de</span>' : '') +
    '<span>' + p.prix + ' €</span>' +
    '</div>' +
    '<button class="btn btn-sm btn-outline" onclick="event.stopPropagation();navigate(\'produit/' + p.id + '\')">Choisir</button>' +
    '</div>' +
    '</div>' +
    '</article>';
}
