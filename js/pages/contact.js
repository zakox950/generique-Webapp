'use strict';

function renderContact() {
  var horaires = [
    ['Mardi — Vendredi', '9h00 — 18h30'],
    ['Samedi', '9h00 — 18h30'],
    ['Dimanche', '9h00 — 13h00'],
    ['Lundi', 'Fermé'],
  ];

  var coordonnees = [
    ['Adresse', '14, Rue des Artisans<br>1000 Bruxelles', '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'],
    ['Téléphone', BOUTIQUE.tel, '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 10.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.77-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>'],
    ['Email', BOUTIQUE.email, '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'],
  ];

  return '<section class="section">' +
    '<div class="container">' +
      '<nav class="breadcrumb">' +
        '<button class="breadcrumb-link" onclick="navigate(\'home\')">Accueil</button>' +
        '<span class="breadcrumb-sep">/</span>' +
        '<span>La Boutique</span>' +
      '</nav>' +

      '<div class="contact-grid">' +
        '<div class="contact-info">' +
          '<div class="eyebrow mb-16">' +
            '<span class="eyebrow-line"></span>' +
            '<span class="label color-bordeaux">Maison Oughar</span>' +
          '</div>' +
          '<h1 class="display-lg" style="margin-bottom:24px;">La <em>Boutique</em></h1>' +
          '<p class="about-text">Notre atelier et point de vente se trouvent au cœur de Bruxelles. Toutes les commandes se retirent sur place — nous ne livrons pas à domicile pour garantir la qualité optimale des pâtisseries.</p>' +

          '<div class="contact-items">' +
            coordonnees.map(function(c) {
              return '<div class="contact-item">' +
                '<div class="contact-icon">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--bordeaux)" stroke-width="1.5" stroke-linecap="round">' + c[2] + '</svg>' +
                '</div>' +
                '<div>' +
                  '<div class="contact-label">' + c[0] + '</div>' +
                  '<div class="contact-val">' + c[1] + '</div>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="contact-right">' +
          '<div class="hours-card">' +
            '<h2 class="hours-title">Horaires d\'ouverture</h2>' +
            horaires.map(function(h) {
              return '<div class="hours-row">' +
                '<span class="hours-day">' + h[0] + '</span>' +
                '<span class="hours-val' + (h[1] === 'Fermé' ? ' hours-closed' : '') + '">' + h[1] + '</span>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<div class="contact-cta-box">' +
            '<h3 class="contact-cta-title"><em>Commander en avance</em></h3>' +
            '<p class="contact-cta-text">Pour garantir la fraîcheur, toutes nos pâtisseries sont préparées le matin du retrait. Les commandes doivent être passées au moins 48h à l\'avance.</p>' +
            '<button class="btn btn-white btn-lg" onclick="navigate(\'catalogue\')">Commander en ligne →</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}
