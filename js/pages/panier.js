'use strict';

function renderPanier() {
  var totalPieces = cartTotalPieces();
  var totalPrix = cartTotal();
  var isDevis = totalPieces > SEUIL_DEVIS;

  if (cart.length === 0) {
    return '<div class="container">' +
      '<div class="cart-empty">' +
        '<div class="cart-empty-icon">' +
          '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M16 8 10 16v36a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4V16l-6-8z"/><line x1="10" y1="16" x2="54" y2="16"/><path d="M40 24a8 8 0 0 1-16 0"/></svg>' +
        '</div>' +
        '<h2 class="display-sm">Votre panier est vide</h2>' +
        '<p class="cart-empty-sub">Découvrez notre catalogue et choisissez vos pâtisseries.</p>' +
        '<button class="btn btn-primary" onclick="navigate(\'catalogue\')">Découvrir le catalogue</button>' +
      '</div>' +
    '</div>';
  }

  var itemsHtml = cart.map(function(item, idx) {
    var optStr = Object.keys(item.options || {}).length
      ? Object.entries(item.options).map(function(e) { return e[0] + ': ' + e[1]; }).join(', ')
      : '';
    return '<div class="cart-item">' +
      '<div class="cart-item-thumb" style="background:' + item.gradient + ';"></div>' +
      '<div class="cart-item-meta">' +
        '<div class="cart-item-name">' + item.nom + '</div>' +
        (optStr ? '<div class="cart-item-option">' + optStr + '</div>' : '') +
        '<div class="cart-item-controls">' +
          '<button class="cart-qty-btn" onclick="updateCartQty(' + idx + ',-1)">−</button>' +
          '<span class="cart-qty-val">' + item.qty + '</span>' +
          '<button class="cart-qty-btn" onclick="updateCartQty(' + idx + ',1)">+</button>' +
          '<button class="cart-item-remove" onclick="removeFromCart(' + idx + ')">Retirer</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-item-price">' + formatPrix(item.prixUnit * item.qty) + '</div>' +
    '</div>';
  }).join('');

  var summaryRows = cart.map(function(item) {
    return '<div class="summary-row">' +
      '<span>' + item.nom + ' × ' + item.qty + '</span>' +
      '<span>' + formatPrix(item.prixUnit * item.qty) + '</span>' +
    '</div>';
  }).join('');

  var piecesLeft = SEUIL_DEVIS - totalPieces;
  var piecesInfo = isDevis
    ? '<span class="badge-devis">Devis requis</span>'
    : '<span>' + piecesLeft + ' pièce' + (piecesLeft > 1 ? 's' : '') + ' avant devis</span>';

  var ctaHtml = isDevis
    ? '<div class="cart-alert"><strong class="cart-alert-title">Devis obligatoire</strong>Votre commande dépasse ' + SEUIL_DEVIS + ' pièces. Un devis personnalisé sera établi avec un acompte de 30 %.</div>' +
      '<button class="btn btn-primary btn-full" onclick="navigate(\'devis\')">Demander un devis</button>'
    : '<button class="btn btn-primary btn-full" onclick="navigate(\'commande\')">Commander</button>' +
      '<p class="cart-or">ou <button class="link-btn" onclick="navigate(\'devis\')">demander un devis</button></p>';

  return '<div class="container">' +
    '<nav class="breadcrumb">' +
      '<button class="breadcrumb-link" onclick="navigate(\'home\')">Accueil</button>' +
      '<span class="breadcrumb-sep">/</span>' +
      '<span>Panier</span>' +
    '</nav>' +
    '<h1 class="display-md" style="margin-bottom:32px;">Mon <em>panier</em></h1>' +

    '<div class="cart-grid">' +
      '<div class="cart-items">' + itemsHtml + '</div>' +

      '<aside class="cart-sidebar">' +
        '<div class="cart-summary">' +
          '<h2 class="summary-title">Récapitulatif</h2>' +
          summaryRows +
          '<div class="summary-meta">' +
            '<span>' + totalPieces + ' pièce' + (totalPieces > 1 ? 's' : '') + '</span>' +
            piecesInfo +
          '</div>' +
          '<div class="summary-total">' +
            '<span>Total</span>' +
            '<span>' + formatPrix(totalPrix) + '</span>' +
          '</div>' +
          ctaHtml +
        '</div>' +

        '<div class="cart-info-box">' +
          '<strong>Retrait en boutique</strong>' +
          '<p>Commande disponible 48h après validation. Vous recevrez un email de confirmation avec la date de retrait confirmée.</p>' +
        '</div>' +
      '</aside>' +
    '</div>' +
  '</div>';
}
