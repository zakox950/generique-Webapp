'use strict';

let cart = JSON.parse(localStorage.getItem('mo_cart') || '[]');
let selectedOptions = {};
let productQty = 1;

function saveCart() {
  localStorage.setItem('mo_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var total = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  var badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;
}

function cartTotal() {
  return cart.reduce(function(s, i) { return s + i.prixUnit * i.qty; }, 0);
}

function cartTotalPieces() {
  return cart.reduce(function(s, i) { return s + i.qty; }, 0);
}

function addToCart(produit, qty, options) {
  var optKey = JSON.stringify(options || {});
  var existing = cart.find(function(i) {
    return i.id === produit.id && JSON.stringify(i.options || {}) === optKey;
  });

  var prixUnit = produit.prix;
  if (produit.prixOptions && options) {
    Object.keys(options).forEach(function(cat) {
      var val = options[cat];
      if (produit.prixOptions[cat] && produit.prixOptions[cat][val] !== undefined) {
        prixUnit += produit.prixOptions[cat][val];
      }
    });
  }

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: produit.id,
      nom: produit.nom,
      prixBase: produit.prix,
      prixUnit: prixUnit,
      qty: qty,
      options: options || {},
      gradient: produit.gradient
    });
  }
  saveCart();
  showToast('“' + produit.nom + '” ajouté au panier');
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  navigate('panier');
}

function updateCartQty(idx, delta) {
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
  navigate('panier');
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2800);
}
