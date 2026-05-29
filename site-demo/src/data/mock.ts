export const PRODUCTS = [
  { id:"p-fraisier", name:"Fraisier", short:"Génoise légère, crème mousseline vanille, fraises Gariguette.", price:28, mode:"make_to_order", photo:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80", stock:null, active:true, badge:"Saison", options:{ taille:{"6 personnes":0,"8 personnes":8,"10 personnes":16} } },
  { id:"p-paris-brest", name:"Paris-Brest", short:"Pâte à choux, praliné noisette, crème mousseline.", price:7.5, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80", stock:14, active:true, options:{} },
  { id:"p-opera", name:"Opéra", short:"Biscuit Joconde, ganache chocolat noir, crème café.", price:8, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80", stock:22, active:true, options:{} },
  { id:"p-tarte-citron", name:"Tarte au citron meringuée", short:"Pâte sablée, crémeux citron de Menton, meringue italienne.", price:7, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1551404973-761c83cd8339?w=800&q=80", stock:9, active:true, options:{} },
  { id:"p-saint-honore", name:"Saint-Honoré", short:"Pâte feuilletée, choux caramel, chantilly vanille.", price:32, mode:"make_to_order", photo:"https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80", stock:null, active:true, options:{ taille:{"6 personnes":0,"8 personnes":10,"10 personnes":20} } },
  { id:"p-eclair-chocolat", name:"Éclair au chocolat", short:"Pâte à choux, crème onctueuse au chocolat noir.", price:5.5, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=800&q=80", stock:18, active:true, options:{} },
  { id:"p-mille-feuille", name:"Mille-feuille vanille", short:"Feuilletage caramélisé, crème pâtissière vanille Bourbon.", price:7.5, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80", stock:11, active:true, options:{} },
  { id:"p-macaron", name:"Coffret macarons", short:"Assortiment de 12 saveurs : rose, pistache, framboise…", price:24, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80", stock:7, active:true, options:{ coffret:{"Coffret 12":0,"Coffret 24":22} } },
  { id:"p-cannele", name:"Cannelés bordelais", short:"Coque caramélisée au rhum, cœur tendre à la vanille.", price:2.5, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80", stock:46, active:true, options:{ format:{"À l'unité":0,"Boîte de 6":12.5,"Boîte de 12":25} } },
  { id:"p-financier", name:"Financiers amande", short:"Petits gâteaux moelleux à la poudre d'amande et beurre noisette.", price:9, mode:"make_to_stock", photo:"https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80", stock:3, active:true, options:{} },
  { id:"p-galette", name:"Galette des Rois", short:"Pâte feuilletée pur beurre, frangipane maison.", price:26, mode:"make_to_order", photo:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", stock:null, active:false, badge:"Hors saison", options:{ taille:{"6 personnes":0,"8 personnes":8,"10 personnes":16} } },
  { id:"p-buche", name:"Bûche chocolat-marron", short:"Biscuit moelleux, mousse chocolat, insert marron glacé.", price:48, mode:"make_to_order", photo:"https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&q=80", stock:null, active:false, badge:"Hors saison", options:{ taille:{"6 personnes":0,"8 personnes":12,"12 personnes":24} } },
];

export const COMMANDES = [
  { id:"CMD-2031", client:"Camille Berthier", email:"camille.berthier@gmail.com", date:"2026-05-22", retrait:"2026-05-24 10:30", total:47, status:"confirmée", items:[{name:"Paris-Brest",qty:2,price:7.5},{name:"Éclair au chocolat",qty:4,price:5.5},{name:"Tarte au citron meringuée",qty:1,price:7}], note:"Pour un déjeuner en famille — pourriez-vous emballer séparément ?" },
  { id:"CMD-2030", client:"Antoine Mercier", email:"amercier@orange.fr", date:"2026-05-22", retrait:"2026-05-23 16:00", total:24, status:"prête", items:[{name:"Coffret macarons",qty:1,price:24}], note:"" },
  { id:"CMD-2029", client:"Hélène Rousseau", email:"helene.r@outlook.fr", date:"2026-05-21", retrait:"2026-05-23 11:00", total:32, status:"confirmée", items:[{name:"Saint-Honoré",qty:1,price:42}], note:"Anniversaire — pourrais-je récupérer une petite bougie ?" },
  { id:"CMD-2028", client:"Mathilde Dupont", email:"m.dupont@laposte.net", date:"2026-05-21", retrait:"2026-05-22 09:30", total:15.5, status:"récupérée", items:[{name:"Éclair au chocolat",qty:2,price:5.5},{name:"Cannelés bordelais",qty:1,price:12.5}], note:"" },
  { id:"CMD-2027", client:"Léo Vannier", email:"leo.vannier@gmail.com", date:"2026-05-20", retrait:"2026-05-22 14:00", total:18, status:"confirmée", items:[{name:"Opéra",qty:1,price:8},{name:"Mille-feuille vanille",qty:1,price:7.5}], note:"" },
  { id:"CMD-2026", client:"Inès Caron", email:"ines.caron@hotmail.fr", date:"2026-05-19", retrait:"2026-05-21 17:00", total:9, status:"récupérée", items:[{name:"Financiers amande",qty:1,price:9}], note:"" },
  { id:"CMD-2025", client:"Bertrand Lavoie", email:"blavoie@protonmail.com", date:"2026-05-18", retrait:"2026-05-20 12:00", total:56, status:"récupérée", items:[{name:"Fraisier",qty:1,price:36},{name:"Macarons",qty:1,price:24}], note:"" },
  { id:"CMD-2024", client:"Sophie Marin", email:"smarin@yahoo.fr", date:"2026-05-17", retrait:"2026-05-19 10:00", total:14, status:"annulée", items:[{name:"Paris-Brest",qty:1,price:7.5},{name:"Opéra",qty:1,price:8}], note:"Imprévu — désolée." },
];

export const DEVIS = [
  { id:"DEV-0142", client:"Caroline & Romain Aubert", email:"caroline.aubert@gmail.com", tel:"+33 6 14 22 88 03", event:"mariage", dateEvent:"2026-07-18", retrait:"2026-07-18 11:00", prixTotal:580, acompte:174, deja:174, status:"acompte_paye", items:[{name:"Pièce montée croquembouche",qty:1,price:480},{name:"Coffret macarons",qty:4,price:24}], noteClient:"Pièce montée pour 70 invités.", noteAdmin:"Confirmé après dégustation. Acompte 30% reçu." },
  { id:"DEV-0141", client:"Cabinet Dauvier & Associés", email:"office@dauvier.fr", tel:"+33 1 44 78 90 12", event:"autre", dateEvent:"2026-06-05", retrait:"2026-06-05 08:30", prixTotal:320, acompte:96, deja:0, status:"valide", items:[{name:"Coffret macarons",qty:8,price:24},{name:"Financiers amande",qty:12,price:9}], noteClient:"Petit-déjeuner d'entreprise pour 25 personnes.", noteAdmin:"" },
  { id:"DEV-0140", client:"Famille Naudet", email:"p.naudet@gmail.com", tel:"+33 6 78 55 21 09", event:"anniversaire", dateEvent:"2026-05-30", retrait:"2026-05-30 16:00", prixTotal:95, acompte:0, deja:0, status:"en_attente", items:[{name:"Saint-Honoré",qty:1,price:52},{name:"Coffret macarons",qty:1,price:46}], noteClient:"40 ans de mon mari — possibilité d'écrire un message dessus ?", noteAdmin:"" },
  { id:"DEV-0139", client:"Élise et Maxime Cordier", email:"elise.cordier@me.com", tel:"+33 6 91 03 47 18", event:"bapteme", dateEvent:"2026-06-21", retrait:"2026-06-21 12:00", prixTotal:240, acompte:72, deja:240, status:"pret", items:[{name:"Gâteau de baptême",qty:1,price:195},{name:"Cannelés bordelais",qty:1,price:25}], noteClient:"Glaçage rose poudré, prénom Léonie en lettres dorées.", noteAdmin:"Solde encaissé le 18/06. Prêt à 11h30." },
  { id:"DEV-0138", client:"Restaurant Le Sextant", email:"chef@lesextant.paris", tel:"+33 1 48 06 92 33", event:"autre", dateEvent:"2026-05-12", retrait:"—", prixTotal:180, acompte:0, deja:0, status:"annule", items:[{name:"Tarte au citron meringuée",qty:8,price:7},{name:"Mille-feuille vanille",qty:12,price:7.5}], noteClient:"Service du 14/05.", noteAdmin:"Annulé par le client." },
];

export const SERIES_7D = [
  { day:"Mer", value:132 },
  { day:"Jeu", value:198 },
  { day:"Ven", value:246 },
  { day:"Sam", value:312 },
  { day:"Dim", value:188 },
  { day:"Lun", value:8 },
  { day:"Mar", value:208 },
];

export const STATUTS_CMD: Record<string,{label:string;color:string}> = {
  confirmée:  { label:"Confirmée",  color:"#3a7bd5" },
  prête:      { label:"Prête",      color:"#1f8a5b" },
  récupérée:  { label:"Récupérée", color:"#6e7691" },
  annulée:    { label:"Annulée",   color:"#c45a5a" },
};

export const STATUTS_DEV: Record<string,{label:string;color:string}> = {
  en_attente:   { label:"En attente",   color:"#c9954f" },
  valide:       { label:"Validé",       color:"#3a7bd5" },
  acompte_paye: { label:"Acompte payé", color:"#7a4fc9" },
  pret:         { label:"Prêt",         color:"#1f8a5b" },
  annule:       { label:"Annulé",       color:"#c45a5a" },
  expire:       { label:"Expiré",       color:"#6e7691" },
};
