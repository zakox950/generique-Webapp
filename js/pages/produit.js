'use strict';

function renderProduit(id) {
  var p = PRODUITS.find(function(x) { return x.id === id; });
  if (!p) return '<div class="container" style="padding:80px 0;text-align:center;"><h2>Produit introuvable</h2><button class="btn btn-primary" style="margin-top:24px;" onclick="navigate(\'catalogue\')">Retour au catalogue</button></div>';

  productQty = 1;
  if (!selectedOptions[id]) selectedOptions[id] = {};

  // Auto-select first option in each category
  if (p.prixOptions) {
    Object.keys(p.prixOptions).forEach(function(cat) {
      if (!selectedOptions[id][cat]) {
        selectedOptions[id][cat] = Object.keys(p.prixOptions[cat])[0];
      }
    });
  }

  var optionsHtml = '';
  if (p.prixOptions) {
    Object.keys(p.prixOptions).forEach(function(cat) {
      var variants = p.prixOptions[cat];
      var catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
      optionsHtml += '<div class="options-group">' +
        '<span class="options-label">' + catLabel + '</span>' +
        '<div class="options-list">' +
        Object.keys(variants).map(function(label) {
          var surprix = variants[label];
          var isSelected = selectedOptions[id][cat] === label;
          return '<button class="option-btn' + (isSelected ? ' selected' : '') + '" onclick="selectOption(' + id + ',\'' + cat + '\',\'' + label + '\',' + surprix + ',this)">' +
            label + (surprix > 0 ? ' <span class="option-surprix">+' + surprix + ' €</span>' : '') +
            '</button>';
        }).join('') +
        '</div></div>';
    });
  }

  var currentPrice = computeProductPrice(p);
  var similaires = PRODUITS.filter(function(x) { return x.id !== id; }).slice(0, 4);

  return '' +
    '<div class="container">' +
      '<nav class="breadcrumb">' +
        '<button class="breadcrumb-link" onclick="navigate(\'home\')">Accueil</button>' +
        '<span class="breadcrumb-sep">/</span>' +
        '<button class="breadcrumb-link" onclick="navigate(\'catalogue\')">Catalogue</button>' +
        '<span class="breadcrumb-sep">/</span>' +
        '<span>' + p.nom + '</span>' +
      '</nav>' +

      '<div class="product-detail">' +
        '<div class="product-detail-image">' +
          productArt(p, 540) +
          (p.saison ? '<div class="product-detail-badge">' + p.saison + '</div>' : '') +
        '</div>' +

        '<div class="product-detail-info">' +
          '<span class="product-motif-tag">' + p.motif + '</span>' +
          '<h1 class="product-detail-name">' + p.nom + '</h1>' +
          '<div class="product-detail-price" id="price-display">' + currentPrice + ' €</div>' +
          '<p class="product-detail-desc">' + p.description + '</p>' +

          '<div class="product-detail-ingredients">' +
            '<strong>Ingrédients</strong>' +
            '<p>' + p.ingredient + '</p>' +
          '</div>' +

          optionsHtml +

          '<div class="qty-row">' +
            '<span class="options-label">Quantité</span>' +
            '<div class="qty-control">' +
              '<button class="qty-btn" onclick="changeQty(-1)">−</button>' +
              '<span class="qty-value" id="qty-display">1</span>' +
              '<button class="qty-btn" onclick="changeQty(1)">+</button>' +
            '</div>' +
          '</div>' +

          '<div class="product-detail-actions">' +
            '<button class="btn btn-primary btn-lg product-add-btn" onclick="handleAddToCart(' + id + ')">Ajouter au panier</button>' +
            '<button class="btn btn-ghost" onclick="navigate(\'panier\')" title="Voir le panier">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
            '</button>' +
          '</div>' +

          '<div class="product-detail-meta">' +
            '<span>Retrait sous 48h minimum</span>' +
            '<span class="meta-sep">·</span>' +
            '<span>Préparé le jour du retrait</span>' +
            '<span class="meta-sep">·</span>' +
            '<span>Retrait en boutique</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<section class="section">' +
        '<div class="section-header">' +
          '<h2 class="display-sm">Vous pourriez aussi <em>aimer</em></h2>' +
        '</div>' +
        '<div class="products-grid products-grid-4">' +
          similaires.map(productCard).join('') +
        '</div>' +
      '</section>' +
    '</div>';
}

function selectOption(productId, cat, label, surprix, el) {
  if (!selectedOptions[productId]) selectedOptions[productId] = {};
  selectedOptions[productId][cat] = label;

  el.closest('.options-list').querySelectorAll('.option-btn').forEach(function(b) {
    b.classList.remove('selected');
  });
  el.classList.add('selected');

  var p = PRODUITS.find(function(x) { return x.id === productId; });
  var price = computeProductPrice(p);
  var priceDisplay = document.getElementById('price-display');
  if (priceDisplay) priceDisplay.textContent = price + ' €';
}

function changeQty(delta) {
  productQty = Math.max(1, productQty + delta);
  var display = document.getElementById('qty-display');
  if (display) display.textContent = productQty;
}

function handleAddToCart(id) {
  var p = PRODUITS.find(function(x) { return x.id === id; });
  if (!p) return;
  addToCart(p, productQty, Object.assign({}, selectedOptions[id] || {}));
  productQty = 1;
  var qd = document.getElementById('qty-display');
  if (qd) qd.textContent = '1';
}
