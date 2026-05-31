/* ============ Pâtisserie Françoise — logique partagée ============ */

/* ---------- Images ---------- */
const IMG = (id, w) => `https://images.unsplash.com/${id}?w=${w||600}&q=75&auto=format&fit=crop`;

/* ---------- Catalogue produits ---------- */
const PRODUCTS = [
  { id:"croissant", name:"Croissant au beurre",        cat:"Viennoiseries", desc:"Pur beurre AOP, feuilletage 72 h.",            price:1.80, status:"available", photo:"photo-1555507036-ab1f4038808a" },
  { id:"pain",      name:"Pain de campagne au levain", cat:"Boulangerie",   desc:"Levain naturel, croûte épaisse, mie alvéolée.",price:4.20, status:"available", photo:"photo-1509440159596-0249088772ff" },
  { id:"fraisier",  name:"Fraisier",                   cat:"Pâtisseries",   desc:"Fraises de Wépion, crème mousseline vanille.", price:5.50, status:"limited",   photo:"photo-1565958011703-44f9829ba187" },
  { id:"entremets", name:"Entremets chocolat",         cat:"Pâtisseries",   desc:"Ganache grand cru, glaçage miroir.",          price:5.80, status:"available", photo:"photo-1578985545062-69928b1d9587" },
  { id:"foret",     name:"Forêt-Noire",                cat:"Pâtisseries",   desc:"Génoise cacao, griottes, chantilly maison.",  price:6.20, status:"limited",   photo:"photo-1606890737304-57a1ca8a5b62" },
  { id:"cupcake",   name:"Cupcake vanille",            cat:"Pâtisseries",   desc:"Vanille de Madagascar, glaçage léger.",       price:3.40, status:"available", photo:"photo-1519869325930-281384150729" },
  { id:"sables",    name:"Sablés du dimanche · les 6", cat:"Boulangerie",   desc:"Pur beurre, parfum fleur d'oranger.",         price:4.90, status:"available", photo:"photo-1464195244916-405fa0a82545" },
  { id:"verrine",   name:"Verrine fraise mascarpone",  cat:"Pâtisseries",   desc:"Mascarpone fouetté, fraises fraîches, sablé.",price:4.60, status:"out",       photo:"photo-1488477181946-6428a0291777" },
];
const BESTSELLERS = ["croissant","foret","entremets","sables"];

const STATUS = {
  available:{cls:"badge-available",label:"Disponible"},
  limited:  {cls:"badge-limited",  label:"Stock limité"},
  out:      {cls:"badge-out",      label:"Épuisé"},
};
const productById = id => PRODUCTS.find(p=>p.id===id);
const fmt = n => n.toFixed(2).replace('.',',') + ' €';

/* ---------- SVG icons ---------- */
const ICON_PLUS = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';
const STAR_FULL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 21.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z"/></svg>';
const STAR_EMPTY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 21.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z"/></svg>';

/* ---------- Carte produit ---------- */
function productCard(p){
  const s = STATUS[p.status];
  const out = p.status === 'out';
  return `<article class="surface-card prod-card">
    <div class="prod-img ${out?'out':''}">
      <img src="${IMG(p.photo,500)}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
      <span class="badge ${s.cls}">${s.label}</span>
    </div>
    <div class="prod-body">
      <div class="prod-name">${p.name}</div>
      <div class="prod-desc">${p.desc}</div>
      <div class="prod-foot">
        <span class="prod-price">${fmt(p.price)}</span>
        <button class="add-btn" ${out?'disabled':''} data-add="${p.id}" aria-label="Ajouter ${p.name}">${ICON_PLUS}</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(target, list){
  const el = typeof target==='string' ? document.getElementById(target) : target;
  if(!el) return;
  el.innerHTML = list.map(productCard).join('');
}

/* ---------- Panier (localStorage) ---------- */
const CART_KEY = 'pf_cart_v1';
function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateBadges(); }
function cartCount(c){ c=c||getCart(); return Object.values(c).reduce((a,b)=>a+b,0); }
function cartTotal(c){ c=c||getCart(); return Object.entries(c).reduce((a,[id,q])=>{const p=productById(id);return a + (p?p.price*q:0);},0); }
function addToCart(id, n){
  const c = getCart();
  c[id] = (c[id]||0) + (n||1);
  if(c[id] <= 0) delete c[id];
  saveCart(c);
}
function setQty(id, q){
  const c = getCart();
  if(q <= 0) delete c[id]; else c[id] = q;
  saveCart(c);
}

/* ---------- Badges (header + nav) ---------- */
function updateBadges(){
  const n = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el=>{
    el.textContent = n;
    el.classList.toggle('show', n>0);
  });
}

/* ---------- Toast ---------- */
let _toastT;
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastT);
  _toastT = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------- Bottom nav : masquer/afficher au scroll ---------- */
function initNavScroll(){
  const nav = document.getElementById('bottomNav');
  if(!nav) return;
  let lastY = window.scrollY;
  const THRESH = 8;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    const d = y - lastY;
    if(Math.abs(d) > THRESH){
      if(d > 0 && y > 120) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      lastY = y;
    }
  }, {passive:true});
}

/* ---------- Clic « Ajouter » global ---------- */
function initAddButtons(){
  document.addEventListener('click', e=>{
    const btn = e.target.closest('[data-add]');
    if(!btn || btn.disabled) return;
    const p = productById(btn.dataset.add);
    addToCart(p.id);
    showToast(p.name + ' ajouté au panier');
    btn.style.transform = 'scale(.8)';
    setTimeout(()=>btn.style.transform='', 150);
  });
}

/* ---------- Reveal au scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length){ els.forEach(el=>el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
}

/* ---------- Init commun ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  updateBadges();
  initNavScroll();
  initAddButtons();
  initReveal();
});
