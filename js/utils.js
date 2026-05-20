'use strict';

function getMinDate() {
  var d = new Date();
  d.setDate(d.getDate() + DELAI_RETRAIT_JOURS);
  return d.toISOString().split('T')[0];
}

function formatDateFr(isoDate) {
  var d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatPrix(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

function computeProductPrice(produit) {
  var prix = produit.prix;
  var opts = selectedOptions[produit.id] || {};
  if (produit.prixOptions) {
    Object.keys(opts).forEach(function(cat) {
      var val = opts[cat];
      if (produit.prixOptions[cat] && produit.prixOptions[cat][val] !== undefined) {
        prix += produit.prixOptions[cat][val];
      }
    });
  }
  return prix;
}

function toggleMobileNav() {
  var links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}
