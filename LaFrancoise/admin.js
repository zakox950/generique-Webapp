/* ============================================================
   Spyfi Admin — logique & données partagées
   Modèle calqué sur le schéma SQL (Catalogue, CommandeDirect,
   Devis, Config, DayLimit/WeekLimit). Données fictives.
   ============================================================ */

/* ---------- Helpers format ---------- */
const eur = n => (Math.round(n*100)/100).toFixed(2).replace('.',',') + ' €';
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- CATALOGUE (table Catalogue + Photo + limites) ---------- */
const CATALOGUE = [
  {id:1, nom:"Croissant au beurre", prix:1.80, modeVente:"make_to_stock", stockDisponible:46, isActif:true,
   ingredient:"Farine T65, beurre AOP, levure, sel, sucre", description:"Pur beurre, feuilletage 72 h.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=75&auto=format&fit=crop"},
  {id:2, nom:"Pain de campagne au levain", prix:4.20, modeVente:"make_to_stock", stockDisponible:12, isActif:true,
   ingredient:"Farine T80, levain naturel, eau, sel", description:"Levain naturel, croûte épaisse.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=75&auto=format&fit=crop"},
  {id:3, nom:"Éclair vanille de Tahiti", prix:4.50, modeVente:"make_to_order", stockDisponible:0, isActif:true,
   ingredient:"Pâte à choux, crème pâtissière vanille, fondant", description:"Crème vanille, glaçage nacré.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:20, weekLimit:90,
   photo:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=75&auto=format&fit=crop"},
  {id:4, nom:"Fraisier", prix:5.50, modeVente:"make_to_order", stockDisponible:0, isActif:true,
   ingredient:"Génoise, crème mousseline, fraises de Wépion", description:"Fraises de Wépion, crème mousseline.",
   dateDebutActif:null, dateFinActif:null, prixOptions:{"Taille":{"6 personnes":0,"10 personnes":15}}, dayLimit:8, weekLimit:30,
   photo:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=75&auto=format&fit=crop"},
  {id:5, nom:"Forêt-Noire", prix:6.20, modeVente:"make_to_order", stockDisponible:0, isActif:true,
   ingredient:"Génoise cacao, griottes, chantilly", description:"Griottes et chantilly maison.",
   dateDebutActif:null, dateFinActif:null, prixOptions:{"Taille":{"6 personnes":0,"10 personnes":18}}, dayLimit:6, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=75&auto=format&fit=crop"},
  {id:6, nom:"Entremets chocolat grand cru", prix:5.80, modeVente:"make_to_order", stockDisponible:0, isActif:true,
   ingredient:"Ganache grand cru, biscuit, glaçage miroir", description:"Ganache grand cru, glaçage miroir.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=75&auto=format&fit=crop"},
  {id:7, nom:"Cupcake vanille", prix:3.40, modeVente:"make_to_stock", stockDisponible:24, isActif:true,
   ingredient:"Vanille de Madagascar, glaçage", description:"Vanille de Madagascar, glaçage léger.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=75&auto=format&fit=crop"},
  {id:8, nom:"Sablés du dimanche · les 6", prix:4.90, modeVente:"make_to_stock", stockDisponible:30, isActif:true,
   ingredient:"Beurre, farine, fleur d'oranger", description:"Pur beurre, fleur d'oranger.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=500&q=75&auto=format&fit=crop"},
  {id:9, nom:"Verrine fraise mascarpone", prix:4.60, modeVente:"make_to_stock", stockDisponible:0, isActif:true,
   ingredient:"Mascarpone, fraises, sablé breton", description:"Mascarpone fouetté, fraises fraîches.",
   dateDebutActif:null, dateFinActif:null, prixOptions:null, dayLimit:null, weekLimit:null,
   photo:"https://images.unsplash.com/photo-1542124948-dc391252a940?w=500&q=75&auto=format&fit=crop"},
  {id:10, nom:"Bûche de Noël praliné", prix:28.00, modeVente:"make_to_order", stockDisponible:0, isActif:false,
   ingredient:"Biscuit roulé, praliné noisette, décor", description:"Édition de fin d'année.",
   dateDebutActif:"2026-12-01", dateFinActif:"2026-12-31", prixOptions:{"Taille":{"6 personnes":0,"8 personnes":8,"12 personnes":20}}, dayLimit:5, weekLimit:25,
   photo:"https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=75&auto=format&fit=crop"},
];
const MODE_VENTE = {make_to_order:"À la commande", make_to_stock:"Sur stock"};

/* ---------- COMMANDES DIRECTES (table CommandeDirect + CatalogueItem) ---------- */
/* Pas de colonne statut en base : seule l'action marquer_prête existe.
   On modélise donc : prete (bool). Payée car créée après Stripe. */
const COMMANDES = [
  {id:1042, dateCommande:"2026-05-30 08:12", dateRetrait:"2026-05-31", heure:"10:30", nom:"Marie Dupont", mail:"marie.dupont@email.be", tel:"+32 478 21 04 55", paiementChoisi:"en_ligne", prete:true, noteClient:"Sans cardamome svp.",
   items:[{nom:"Fraisier",q:1,pu:5.50,opt:"10 personnes"},{nom:"Éclair vanille de Tahiti",q:2,pu:4.50}], total:24.80},
  {id:1041, dateCommande:"2026-05-30 09:40", dateRetrait:"2026-05-30", heure:"17:00", nom:"Lucas Vermeulen", mail:"l.vermeulen@email.be", tel:"+32 495 88 12 30", paiementChoisi:"sur_place", prete:false, noteClient:null,
   items:[{nom:"Croissant au beurre",q:6,pu:1.80},{nom:"Pain de campagne au levain",q:1,pu:4.20}], total:15.00},
  {id:1040, dateCommande:"2026-05-29 18:03", dateRetrait:"2026-05-31", heure:"14:15", nom:"Sophie Lemaire", mail:"sophie.l@email.be", tel:"+32 472 60 39 11", paiementChoisi:"en_ligne", prete:false, noteClient:"Pour un anniversaire.",
   items:[{nom:"Forêt-Noire",q:1,pu:6.20,opt:"10 personnes"},{nom:"Cupcake vanille",q:6,pu:3.40}], total:44.60},
  {id:1039, dateCommande:"2026-05-29 11:22", dateRetrait:"2026-06-01", heure:"09:00", nom:"Thomas De Smet", mail:"t.desmet@email.be", tel:"+32 488 17 72 49", paiementChoisi:"sur_place", prete:false, noteClient:null,
   items:[{nom:"Cupcake vanille",q:12,pu:3.40}], total:40.80},
  {id:1038, dateCommande:"2026-05-29 16:51", dateRetrait:"2026-05-30", heure:"12:00", nom:"Emma Janssens", mail:"emma.j@email.be", tel:"+32 471 09 56 83", paiementChoisi:"en_ligne", prete:true, noteClient:null,
   items:[{nom:"Verrine fraise mascarpone",q:4,pu:4.60},{nom:"Sablés du dimanche · les 6",q:1,pu:4.90}], total:23.30},
  {id:1037, dateCommande:"2026-05-28 14:09", dateRetrait:"2026-05-29", heure:"16:30", nom:"Nadia El Amrani", mail:"nadia.ea@email.be", tel:"+32 477 33 21 88", paiementChoisi:"en_ligne", prete:true, noteClient:"Merci !",
   items:[{nom:"Entremets chocolat grand cru",q:2,pu:5.80}], total:11.60},
];

/* ---------- DEVIS (table Devis + CatalogueDevisItem) ---------- */
/* statutEnum : en_attente | valide | acompte_paye | pret | annule | expire */
const DEVIS = [
  {id:218, statut:"en_attente", nom:"Atelier Verde", mail:"contact@atelierverde.be", tel:"+32 489 22 11 03", typeEvenement:"Buffet inauguration",
   dateCommande:"2026-05-28", dateSouhaitee:"2026-06-12", dateRetrait:"2026-06-12", expireAt:"2026-06-11",
   prixTotal:480, acompte:144, dejaPaye:0, noteClient:"Une trentaine de personnes, format finger food.", noteAdmin:null,
   items:[{nom:"Éclair vanille de Tahiti",q:40,pu:4.50},{nom:"Verrine fraise mascarpone",q:40,pu:4.60}]},
  {id:217, statut:"valide", nom:"Famille Moreau", mail:"moreau.famille@email.be", tel:"+32 470 18 55 92", typeEvenement:"Pièce montée mariage",
   dateCommande:"2026-05-26", dateSouhaitee:"2026-07-05", dateRetrait:"2026-07-05", expireAt:"2026-06-09",
   prixTotal:650, acompte:195, dejaPaye:0, noteClient:"120 convives, thème champêtre.", noteAdmin:"Devis envoyé le 27/05, en attente d'acompte.",
   items:[{nom:"Pièce montée choux",q:1,pu:650}]},
  {id:216, statut:"en_attente", nom:"École Saint-Joseph", mail:"direction@stjoseph.be", tel:"+32 2 538 77 12", typeEvenement:"Goûter fin d'année",
   dateCommande:"2026-05-27", dateSouhaitee:"2026-06-27", dateRetrait:"2026-06-27", expireAt:"2026-06-10",
   prixTotal:320, acompte:96, dejaPaye:0, noteClient:"80 enfants.", noteAdmin:null,
   items:[{nom:"Cupcake vanille",q:80,pu:3.40},{nom:"Sablés du dimanche · les 6",q:8,pu:4.90}]},
  {id:215, statut:"acompte_paye", nom:"Boutique Lila", mail:"hello@boutiquelila.be", tel:"+32 486 40 27 65", typeEvenement:"Lancement collection",
   dateCommande:"2026-05-20", dateSouhaitee:"2026-06-06", dateRetrait:"2026-06-06", expireAt:"2026-06-03",
   prixTotal:540, acompte:162, dejaPaye:162, noteClient:"Petits fours sucrés/salés.", noteAdmin:"Acompte reçu 30/05.",
   items:[{nom:"Verrine fraise mascarpone",q:60,pu:4.60},{nom:"Éclair vanille de Tahiti",q:60,pu:4.50}]},
  {id:214, statut:"pret", nom:"Cabinet Vanderlinden", mail:"office@vanderlinden.be", tel:"+32 475 92 16 40", typeEvenement:"Réunion clients",
   dateCommande:"2026-05-18", dateSouhaitee:"2026-05-30", dateRetrait:"2026-05-30", expireAt:"2026-06-01",
   prixTotal:210, acompte:63, dejaPaye:210, noteClient:"Plateau viennoiseries 25 pers.", noteAdmin:"Tout réglé, prêt pour retrait.",
   items:[{nom:"Croissant au beurre",q:50,pu:1.80},{nom:"Pain de campagne au levain",q:25,pu:4.20}]},
  {id:213, statut:"expire", nom:"Julie Coppens", mail:"julie.coppens@email.be", tel:"+32 491 03 88 71", typeEvenement:"Anniversaire 30 ans",
   dateCommande:"2026-05-02", dateSouhaitee:"2026-05-16", dateRetrait:"2026-05-16", expireAt:"2026-05-16",
   prixTotal:95, acompte:28.50, dejaPaye:0, noteClient:"Layer cake chocolat.", noteAdmin:"Sans réponse, expiré.",
   items:[{nom:"Entremets chocolat grand cru",q:1,pu:95}]},
];
const DEVIS_STATUT = {
  en_attente:  {cls:"badge-warn",  label:"En attente"},
  valide:      {cls:"badge-info",  label:"Validé"},
  acompte_paye:{cls:"badge-info",  label:"Acompte payé"},
  pret:        {cls:"badge-ok",    label:"Prêt"},
  annule:      {cls:"badge-error", label:"Annulé"},
  expire:      {cls:"badge-muted", label:"Expiré"},
};

/* ---------- CONFIG (table Config — valeurs initiales du SQL) ---------- */
const CONFIG = {
  mode_production_global:"make_to_order",
  mode_commande:"seuil",
  seuil_devis:"10",
  delai_retrait_jours:"2",
  limite_par_commande:"0",
  devis_expire_days:"14",
  acompte_mode:"pourcentage",
  acompte_valeur:"30",
  paiement_en_ligne:"obligatoire",
  mode_retrait:"boutique",
  frais_livraison:"0.00",
  zone_livraison:"",
  notif_admin_email:"contact@francoise.be",
  notif_client_statut:"true",
  notif_admin_commande:"true",
  notif_admin_devis:"true",
  boutique_nom:"Pâtisserie Françoise",
  boutique_adresse:"42 rue de Moscou, 1060 Saint-Gilles, Bruxelles",
  boutique_tel:"+32 2 538 14 90",
  boutique_horaires:"Mar–Sam 7h–19h · Dim 7h30–13h · Lundi fermé",
  mode_paiement:"en_ligne",
};

/* ---------- STATISTIQUES (dérivées, fictives) ---------- */
const STATS = {
  revenus:{
    week:{labels:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"], values:[320,290,410,360,387,520,445], sub:"7 derniers jours"},
    month:{labels:["S1","S2","S3","S4"], values:[1980,2240,2090,2610], sub:"4 dernières semaines"},
    year:{labels:["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"], values:[7200,6800,8100,8600,9200,9800,8400,6100,8900,9600,10400,13200], sub:"12 derniers mois"},
  },
  topProduits:[
    {nom:"Croissant au beurre", n:612},
    {nom:"Pain de campagne au levain", n:284},
    {nom:"Éclair vanille de Tahiti", n:198},
    {nom:"Cupcake vanille", n:166},
    {nom:"Sablés du dimanche · les 6", n:142},
    {nom:"Fraisier", n:97},
  ],
  heuresRetrait:{labels:["7h","8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h"], values:[8,22,34,28,19,31,12,9,14,21,38,17]},
};

/* ============================================================
   UI partagée
   ============================================================ */

/* ---------- Toast ---------- */
let _tt;
function showToast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),2400);
}

/* ---------- Modal ---------- */
const ICON_X='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
function ensureModal(){
  let ov=document.getElementById('modalOverlay');
  if(!ov){
    ov=document.createElement('div');ov.id='modalOverlay';ov.className='modal-overlay';
    ov.innerHTML='<div class="glass-raised modal" id="modal"></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',e=>{if(e.target===ov)closeModal();});
  }
  return ov;
}
function openModal(html, wide){
  const ov=ensureModal();const m=document.getElementById('modal');
  m.className='glass-raised modal'+(wide?' wide':'');
  m.innerHTML=html;ov.classList.add('open');
}
function closeModal(){const ov=document.getElementById('modalOverlay');if(ov)ov.classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ---------- Theme toggle ---------- */
const _SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/>';
const _MOON='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  const ic=document.getElementById('themeIcon');
  if(ic)ic.innerHTML=t==='dark'?_MOON:_SUN;
  localStorage.setItem('spyfi_theme',t);
}
function initTheme(){
  applyTheme(localStorage.getItem('spyfi_theme')||'dark');
  const btn=document.getElementById('themeToggle');
  if(btn)btn.addEventListener('click',()=>applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
}

/* ---------- Bottom nav scroll hide ---------- */
function initNavScroll(){
  const bn=document.getElementById('bottomNav');if(!bn)return;
  let lastY=window.scrollY;const TH=8;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY,d=y-lastY;
    if(Math.abs(d)>TH){if(d>0&&y>120)bn.classList.add('hidden');else bn.classList.remove('hidden');lastY=y;}
  },{passive:true});
}

/* ---------- Déconnexion ---------- */
function confirmLogout(e){
  if(e)e.preventDefault();
  openModal(`
    <div class="modal-head"><div><div class="modal-title">Déconnexion</div><div class="modal-sub">Vous reviendrez à l'écran de connexion.</div></div><button class="modal-x" onclick="closeModal()">${ICON_X}</button></div>
    <div class="modal-divider"></div>
    <p style="font-size:var(--text-sm);color:var(--color-muted);">Voulez-vous vraiment vous déconnecter de Spyfi Admin ?</p>
    <div class="modal-actions"><button class="btn-ghost grow" onclick="closeModal()">Annuler</button><button class="btn-danger grow" onclick="closeModal();showToast('Déconnexion — démo')">Se déconnecter</button></div>`);
}

/* ---------- Line chart réutilisable ---------- */
function makeChart(svgId, wrapId, data, opts){
  opts=opts||{};
  const svg=document.getElementById(svgId), wrap=document.getElementById(wrapId);
  const tip=wrap.querySelector('.chart-tip');
  const VW=720,VH=opts.vh||300,PADX=46,PADTOP=24,PADBOT=40;
  const unit=opts.unit||'';
  function smooth(pts){
    let d=`M ${pts[0].x} ${pts[0].y}`;
    for(let i=0;i<pts.length-1;i++){
      const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
      d+=` C ${p1.x+(p2.x-p0.x)/6} ${p1.y+(p2.y-p0.y)/6}, ${p2.x-(p3.x-p1.x)/6} ${p2.y-(p3.y-p1.y)/6}, ${p2.x} ${p2.y}`;
    }
    return d;
  }
  const {labels,values}=data;
  const max=Math.max(...values)*1.12, min=Math.min(...values,0)*1 + Math.min(...values)*0; 
  const lo=Math.min(...values)*0.82;
  const X0=PADX,X1=VW-PADX/2,plotW=X1-X0,plotH=VH-PADTOP-PADBOT;
  const xOf=i=>X0+plotW*(i/(values.length-1));
  const yOf=v=>PADTOP+plotH*(1-(v-lo)/(max-lo));
  const pts=values.map((v,i)=>({x:xOf(i),y:yOf(v),v,label:labels[i]}));
  let grid='',ylab='';const ticks=4;
  for(let t=0;t<=ticks;t++){const val=lo+(max-lo)*(t/ticks);const y=yOf(val);
    grid+=`<line x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" stroke="var(--grid-line)" stroke-width="1"/>`;
    ylab+=`<text x="${X0-10}" y="${y+4}" text-anchor="end" font-size="12" fill="var(--color-muted)">${Math.round(val)}${unit}</text>`;}
  let xlab='';const step=Math.ceil(pts.length/8);
  pts.forEach((p,i)=>{if(i%step===0||i===pts.length-1)xlab+=`<text x="${p.x}" y="${VH-14}" text-anchor="middle" font-size="12" fill="var(--color-muted)">${p.label}</text>`;});
  const line=smooth(pts);
  const area=line+` L ${pts[pts.length-1].x} ${VH-PADBOT} L ${pts[0].x} ${VH-PADBOT} Z`;
  let dots='';pts.forEach((p,i)=>dots+=`<circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="5" fill="var(--color-accent-light)" stroke="var(--color-glass-modal)" stroke-width="2" data-i="${i}"/>`);
  svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`);
  svg.innerHTML=`<defs><linearGradient id="grad_${svgId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#697C70" stop-opacity="0.34"/><stop offset="100%" stop-color="#697C70" stop-opacity="0"/></linearGradient></defs>
    ${grid}${ylab}${xlab}
    <path d="${area}" fill="url(#grad_${svgId})"/>
    <path d="${line}" fill="none" stroke="#697C70" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
  if(tip){
    svg.querySelectorAll('.chart-dot').forEach(dot=>{
      dot.addEventListener('mouseenter',()=>{const p=pts[+dot.dataset.i];const r=wrap.getBoundingClientRect();
        tip.style.left=(p.x/VW)*r.width+'px';tip.style.top=(p.y/VH)*r.height+'px';
        tip.innerHTML=`<div class="v">${opts.fmt?opts.fmt(p.v):p.v+unit}</div><div class="d">${p.label}</div>`;tip.style.opacity='1';});
      dot.addEventListener('mouseleave',()=>tip.style.opacity='0');
    });
  }
}

/* ---------- Chrome partagé (sidebar + topbar + bottom nav) ---------- */
const ICONS={
  dashboard:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>',
  produits:'<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
  commandes:'<path d="M5 4h14l-1 16H6L5 4Z"/><path d="M9 4a3 3 0 0 1 6 0"/>',
  devis:'<path d="M6 2h9l5 5v15H6Z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
  stats:'<path d="M4 19V5M4 19h16"/><path d="M7 15l4-5 3 3 4-6"/>',
  config:'<path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h7M15 17h5"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="17" r="2"/>',
  params:'<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H4a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 .9-1.4V4a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.4.9H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5.9Z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
};
const PAGES=[
  {key:"Dashboard",href:"Spyfi Admin.html",icon:"dashboard",bn:true,bnLabel:"Dashboard"},
  {key:"Produits",href:"Produits.html",icon:"produits",bn:true,bnLabel:"Produits"},
  {key:"Commandes",href:"Commandes.html",icon:"commandes",bn:true,bnLabel:"Commandes"},
  {key:"Devis",href:"Devis.html",icon:"devis",bn:false},
  {key:"Statistiques",href:"Statistiques.html",icon:"stats",bn:true,bnLabel:"Stats"},
  {key:"Configuration",href:"Configuration.html",icon:"config",bn:true,bnLabel:"Config"},
];
const sv=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[p]}</svg>`;
function renderChrome(active){
  const sideLinks=PAGES.map(p=>`<a class="nav-link${p.key===active?' active':''}" href="${p.href}">${sv(p.icon)}${p.key}</a>`).join('');
  const sidebar=`<aside class="sidebar">
    <div class="brand">
      <a class="logo" href="Spyfi Admin.html"><span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6 4 4 6-7"/></svg></span>Spyfi</a>
      <div class="client">Pâtisserie Françoise</div>
    </div>
    <nav class="nav-list">${sideLinks}
      <div class="nav-sep"></div>
      <a class="nav-link${active==='Paramètres'?' active':''}" href="Parametres.html">${sv('params')}Paramètres</a>
      <a class="nav-link" href="#" onclick="confirmLogout(event)">${sv('logout')}Déconnexion</a>
    </nav>
  </aside>`;
  const topbar=`<header class="topbar">
    <div class="breadcrumb"><a class="topbar-brand" href="Spyfi Admin.html" aria-label="Accueil"><span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6 4 4 6-7"/></svg></span></a><span class="crumb-root">Spyfi Admin</span><span class="sep">/</span><span>${active}</span></div>
    <div class="topbar-actions">
      <button class="icon-btn" aria-label="Notifications" onclick="showToast('3 nouvelles notifications')"><span class="dot"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></button>
      <button class="icon-btn" id="themeToggle" aria-label="Thème"><svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></svg></button>
      <a class="avatar" href="Parametres.html" title="Françoise P.">FP</a>
    </div>
  </header>`;
  const bn=PAGES.filter(p=>p.bn).map(p=>`<a class="bn-item${p.key===active?' active':''}" href="${p.href}">${sv(p.icon)}${p.bnLabel}</a>`).join('');
  const bottomNav=`<nav class="bottom-nav" id="bottomNav">${bn}</nav>`;

  const sideMount=document.getElementById('sidebar-mount');
  const topMount=document.getElementById('topbar-mount');
  const bnMount=document.getElementById('bottomnav-mount');
  if(sideMount)sideMount.outerHTML=sidebar;
  if(topMount)topMount.outerHTML=topbar;
  if(bnMount)bnMount.outerHTML=bottomNav;
}

/* ---------- Init commun ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  const active=document.body.getAttribute('data-page');
  if(active)renderChrome(active);
  initTheme();
  initNavScroll();
  ensureModal();
});
