'use strict';

function navigate(route) {
  window.location.hash = '#' + route;
}

function render(route) {
  var app = document.getElementById('app');
  if (!app) return;

  var parts = route.split('/');
  var page = parts[0] || 'home';
  var param = parts[1];

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update nav active state
  document.querySelectorAll('.nav-link[data-route]').forEach(function(el) {
    el.classList.toggle('active', el.getAttribute('data-route') === page);
  });

  // Close mobile nav if open
  var navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('open');

  switch (page) {
    case 'home':         app.innerHTML = renderHome();            break;
    case 'catalogue':    app.innerHTML = renderCatalogue();        break;
    case 'produit':      app.innerHTML = renderProduit(parseInt(param, 10)); break;
    case 'panier':       app.innerHTML = renderPanier();           break;
    case 'commande':     app.innerHTML = renderCommande();         break;
    case 'devis':        app.innerHTML = renderDevis();            break;
    case 'confirmation': app.innerHTML = renderConfirmation(param); break;
    case 'contact':      app.innerHTML = renderContact();          break;
    default:             app.innerHTML = renderHome();
  }
}

window.addEventListener('hashchange', function() {
  var hash = window.location.hash.slice(1) || 'home';
  render(hash);
});
