'use strict';

function renderCommande() {
  var totalPrix = cartTotal();
  var minDate = getMinDate();

  var orderItems = cart.map(function(item) {
    var optStr = Object.keys(item.options || {}).length
      ? ' <span style="color:var(--gris);font-size:0.8em;">(' + Object.values(item.options).join(', ') + ')</span>'
      : '';
    return '<div class="order-item">' +
      '<span>' + item.nom + ' × ' + item.qty + optStr + '</span>' +
      '<span class="order-item-price">' + formatPrix(item.prixUnit * item.qty) + '</span>' +
    '</div>';
  }).join('');

  return '<div class="container">' +
    '<nav class="breadcrumb">' +
      '<button class="breadcrumb-link" onclick="navigate(\'panier\')">← Retour au panier</button>' +
    '</nav>' +

    '<div class="form-grid">' +
      '<div class="form-main">' +
        '<h1 class="display-md" style="margin-bottom:8px;">Finaliser la <em>commande</em></h1>' +
        '<p class="form-intro">Remplissez vos coordonnées pour confirmer votre commande directe.</p>' +

        '<form onsubmit="handleCommande(event)">' +
          '<div class="form-section">' +
            '<h2 class="form-section-title">Vos coordonnées</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Nom complet <span class="required">*</span></label>' +
              '<input type="text" class="form-input" id="cmd-nom" placeholder="Sophie Martin" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">Adresse email <span class="required">*</span></label>' +
              '<input type="email" class="form-input" id="cmd-mail" placeholder="sophie@example.com" required>' +
              '<p class="form-hint">La confirmation de commande sera envoyée à cette adresse.</p>' +
            '</div>' +
          '</div>' +

          '<div class="form-section">' +
            '<h2 class="form-section-title">Date de retrait</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Date souhaitée <span class="required">*</span></label>' +
              '<input type="date" class="form-input" id="cmd-date" min="' + minDate + '" required>' +
              '<p class="form-hint">Retrait possible à partir du ' + formatDateFr(minDate) + '. Ouvert mardi–samedi 9h–18h30, dimanche 9h–13h.</p>' +
            '</div>' +
          '</div>' +

          '<div class="form-section">' +
            '<h2 class="form-section-title">Informations complémentaires</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Note (facultatif)</label>' +
              '<textarea class="form-textarea" id="cmd-note" placeholder="Allergie, précision de présentation, message personnalisé…"></textarea>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">Mode de paiement</label>' +
              '<select class="form-select" id="cmd-paiement">' +
                '<option value="en_ligne">En ligne (Stripe)</option>' +
                '<option value="sur_place">Sur place lors du retrait</option>' +
              '</select>' +
            '</div>' +
          '</div>' +

          '<button type="submit" class="btn btn-primary btn-lg btn-full">Confirmer — ' + formatPrix(totalPrix) + '</button>' +
        '</form>' +
      '</div>' +

      '<aside class="form-sidebar">' +
        '<div class="order-summary">' +
          '<h2 class="summary-title">Votre commande</h2>' +
          orderItems +
          '<div class="summary-total">' +
            '<span>Total</span>' +
            '<span>' + formatPrix(totalPrix) + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="cart-info-box">' +
          '<strong>Ce qui se passe ensuite</strong>' +
          '<ol class="steps-list">' +
            '<li>Vous recevez un email de confirmation</li>' +
            '<li>Nous confirmons la date de retrait sous 24h</li>' +
            '<li>Votre commande est préparée le matin du retrait</li>' +
            '<li>Retrait en boutique aux horaires indiqués</li>' +
          '</ol>' +
        '</div>' +
      '</aside>' +
    '</div>' +
  '</div>';
}

function handleCommande(e) {
  e.preventDefault();
  var nom = document.getElementById('cmd-nom').value.trim();
  var mail = document.getElementById('cmd-mail').value.trim();
  var date = document.getElementById('cmd-date').value;
  if (!nom || !mail || !date) return;
  cart = [];
  saveCart();
  navigate('confirmation/commande');
}
