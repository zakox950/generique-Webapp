'use strict';

function renderDevis() {
  var totalPrix = cartTotal();
  var totalPieces = cartTotalPieces();
  var minDate = getMinDate();
  var hasCart = cart.length > 0;
  var acompteEstim = hasCart ? formatPrix(totalPrix * 0.3) : 'calculé selon le devis';

  var cartSection = '';
  if (hasCart) {
    var orderItems = cart.map(function(item) {
      return '<div class="order-item">' +
        '<span>' + item.nom + ' × ' + item.qty + '</span>' +
        '<span class="order-item-price">' + formatPrix(item.prixUnit * item.qty) + '</span>' +
      '</div>';
    }).join('');
    cartSection = '<div class="form-section">' +
      '<h2 class="form-section-title">Produits dans votre panier</h2>' +
      '<div class="order-summary">' +
        orderItems +
        '<div class="summary-total"><span>Estimation initiale</span><span>' + formatPrix(totalPrix) + '</span></div>' +
      '</div>' +
      '<p class="form-hint" style="margin-top:8px;">Le prix final sera ajusté dans le devis selon vos besoins exacts.</p>' +
    '</div>';
  }

  var processSteps = [
    ['1', 'Vous soumettez la demande', 'Décrivez votre commande avec le plus de détails possible.'],
    ['2', 'Nous étudions votre devis', 'Réponse sous 48h maximum avec le devis détaillé.'],
    ['3', 'Vous validez et payez l\'acompte', '30 % à la confirmation. Le solde est réglé au retrait.'],
    ['4', 'Votre commande est préparée', 'Retrait en boutique à la date convenue.'],
  ];

  return '<div class="container">' +
    '<nav class="breadcrumb">' +
      '<button class="breadcrumb-link" onclick="navigate(hasCart ? \'panier\' : \'catalogue\')">← Retour</button>' +
    '</nav>' +

    '<div class="form-grid">' +
      '<div class="form-main">' +
        '<h1 class="display-md" style="margin-bottom:8px;">Demander un <em>devis</em></h1>' +
        '<p class="form-intro">Pour les commandes importantes ou les occasions spéciales, nous établissons un devis personnalisé sous 48h.</p>' +

        '<div class="devis-banner">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          '<div>' +
            '<strong>Comment fonctionne le devis ?</strong>' +
            '<p>Nous examinons votre demande et vous envoyons un devis détaillé sous 48h. Un acompte de 30 % est requis pour confirmer la commande.</p>' +
          '</div>' +
        '</div>' +

        '<form onsubmit="handleDevis(event)">' +
          '<div class="form-section">' +
            '<h2 class="form-section-title">Vos coordonnées</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Nom complet <span class="required">*</span></label>' +
              '<input type="text" class="form-input" id="dv-nom" placeholder="Sophie Martin" required>' +
            '</div>' +
            '<div class="form-row-2">' +
              '<div class="form-group">' +
                '<label class="form-label">Email <span class="required">*</span></label>' +
                '<input type="email" class="form-input" id="dv-mail" placeholder="sophie@example.com" required>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="form-label">Téléphone <span class="required">*</span></label>' +
                '<input type="tel" class="form-input" id="dv-tel" placeholder="+32 478 12 34 56" required>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="form-section">' +
            '<h2 class="form-section-title">L\'événement</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Type d\'événement</label>' +
              '<select class="form-select" id="dv-event">' +
                '<option value="">— Choisir (facultatif)</option>' +
                '<option value="mariage">Mariage</option>' +
                '<option value="anniversaire">Anniversaire</option>' +
                '<option value="bapteme">Baptême / Naissance</option>' +
                '<option value="communion">Communion</option>' +
                '<option value="professionnel">Événement professionnel</option>' +
                '<option value="autre">Autre</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-row-2">' +
              '<div class="form-group">' +
                '<label class="form-label">Date souhaitée <span class="required">*</span></label>' +
                '<input type="date" class="form-input" id="dv-date-souhaitee" min="' + minDate + '" required>' +
                '<p class="form-hint">Date idéale pour votre événement</p>' +
              '</div>' +
              '<div class="form-group">' +
                '<label class="form-label">Date de retrait <span class="required">*</span></label>' +
                '<input type="date" class="form-input" id="dv-date-retrait" min="' + minDate + '" required>' +
                '<p class="form-hint">Doit être ≥ date souhaitée</p>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="form-section">' +
            '<h2 class="form-section-title">Votre demande</h2>' +
            '<div class="form-group">' +
              '<label class="form-label">Description de la commande <span class="required">*</span></label>' +
              '<textarea class="form-textarea form-textarea-lg" id="dv-note" placeholder="Décrivez votre commande : produits souhaités, quantités, thème, contraintes alimentaires, présentation souhaitée…" required></textarea>' +
            '</div>' +
          '</div>' +

          cartSection +

          '<div class="acompte-info">Un acompte de <strong>30 %</strong> (estimé à ' + acompteEstim + ') sera demandé à la confirmation du devis.</div>' +

          '<button type="submit" class="btn btn-primary btn-lg btn-full">Envoyer la demande de devis</button>' +
        '</form>' +
      '</div>' +

      '<aside class="form-sidebar">' +
        '<div class="order-summary">' +
          '<h2 class="summary-title">Le processus</h2>' +
          processSteps.map(function(step) {
            return '<div class="devis-step">' +
              '<div class="devis-step-num">' + step[0] + '</div>' +
              '<div>' +
                '<div class="devis-step-title">' + step[1] + '</div>' +
                '<div class="devis-step-desc">' + step[2] + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +

        '<div class="cart-info-box">' +
          '<strong>Contact direct</strong>' +
          '<p>' + BOUTIQUE.tel + '<br>' + BOUTIQUE.email + '</p>' +
        '</div>' +
      '</aside>' +
    '</div>' +
  '</div>';
}

function handleDevis(e) {
  e.preventDefault();
  var nom = document.getElementById('dv-nom').value.trim();
  var mail = document.getElementById('dv-mail').value.trim();
  var tel = document.getElementById('dv-tel').value.trim();
  var note = document.getElementById('dv-note').value.trim();
  if (!nom || !mail || !tel || !note) return;
  cart = [];
  saveCart();
  navigate('confirmation/devis');
}
