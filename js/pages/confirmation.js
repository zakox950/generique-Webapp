'use strict';

function renderConfirmation(type) {
  var isDevis = type === 'devis';
  return '<div class="confirmation-page">' +
    '<div class="confirmation-icon">' +
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' +
    '</div>' +
    '<h1 class="display-md" style="margin-bottom:16px;">' + (isDevis ? 'Demande envoyée !' : 'Commande confirmée !') + '</h1>' +
    '<p class="confirmation-text">' +
      (isDevis
        ? 'Votre demande de devis a bien été reçue. Nous vous répondrons dans les 48h avec un devis personnalisé par email et téléphone.'
        : 'Votre commande a bien été enregistrée. Vous recevrez sous peu un email de confirmation avec votre date de retrait en boutique.') +
    '</p>' +
    '<div class="confirmation-divider"></div>' +
    '<div class="confirmation-actions">' +
      '<button class="btn btn-primary" onclick="navigate(\'catalogue\')">Retour au catalogue</button>' +
      '<button class="btn btn-outline" onclick="navigate(\'home\')">Accueil</button>' +
    '</div>' +
  '</div>';
}
