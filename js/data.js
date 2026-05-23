'use strict';

const BOUTIQUE = {
  nom: 'Maison Oughar',
  adresse: '14, Rue des Artisans\n1000 Bruxelles',
  tel: '+32 2 123 45 67',
  email: 'contact@maisonoughar.be',
  horaires: 'Mar–Sam : 9h–18h30 | Dim : 9h–13h | Lun : Fermé'
};

const SEUIL_DEVIS = 10;
const DELAI_RETRAIT_JOURS = 2;

const PRODUITS = [
  {
    id: 1,
    nom: 'Tarte Frangipane aux Figues',
    prix: 32,
    description:
      'Une tarte généreuse aux figues de saison, sur fond sablé pur beurre garni d’une crème frangipane maison. L’équilibre subtil entre la douceur de l’amande et la profondeur sucrée de la figue noire.',
    ingredient:
      'Farine T55, beurre AOP Charentes-Poitou, sucre, poudre d’amandes, figues fraîches, œufs plein-air, crème fleurette',
    prixOptions: { taille: { '6 personnes': 0, '10 personnes': 15 } },
    gradient: 'linear-gradient(150deg,#3D0E15 0%,#5C1A24 40%,#8B3050 75%,#C4566A 100%)',
    motif: 'Figues & Amandes',
    saison: 'Automne'
  },
  {
    id: 2,
    nom: 'Charlotte aux Framboises',
    prix: 28,
    description:
      'Biscuits cuillère imbibés au sirop léger, mousse aérienne à la framboise, cœur composée de framboises fraîches. Fraîs, délicat, intemporel.',
    ingredient:
      'Framboises fraîches, biscuits cuillère, crème fleurette 35%, sucre semoule, gélatine, citron bio',
    prixOptions: null,
    gradient: 'linear-gradient(150deg,#6B1228 0%,#9B2D4A 40%,#C4566A 75%,#E8A0B0 100%)',
    motif: 'Framboise & Vanille',
    saison: 'Été'
  },
  {
    id: 3,
    nom: 'Tarte au Citron Meringuiée',
    prix: 26,
    description:
      'Fond sablé croustillant, curd citron acidulé à point, meringue italienne dorée au chalumeau. La quintessence de la pâtisserie française, exécutée sans concession.',
    ingredient:
      'Citrons de Menton, sucre, beurre AOP, œufs entiers, blancs d’œufs, farine T45, sel fin',
    prixOptions: { taille: { '6 personnes': 0, '8 personnes': 10 } },
    gradient: 'linear-gradient(150deg,#6B4800 0%,#A07010 40%,#C8960C 75%,#F0C040 100%)',
    motif: 'Citron de Menton',
    saison: 'Toute l’année'
  },
  {
    id: 4,
    nom: 'Entremets Passion-Mangue',
    prix: 38,
    description:
      'Mousse passion intense portée par un insert mangue Alphonso, sur biscuit dacquoise coco. Les saveurs exotiques au service d’une élégance toute française.',
    ingredient:
      'Fruits de la passion, mangue Alphonso, noix de coco râpée, blanc d’œuf, crème de coco, gélatine or',
    prixOptions: { taille: { '6 personnes': 0, '10 personnes': 18 } },
    gradient: 'linear-gradient(150deg,#8B3800 0%,#B85C10 40%,#D4821A 75%,#F0B060 100%)',
    motif: 'Passion & Mangue',
    saison: 'Printemps–Été'
  },
  {
    id: 5,
    nom: 'Clafoutis aux Cerises',
    prix: 22,
    description:
      'Clafoutis traditionnel aux cerises griottines, appareil vanilé monté à la perfection. Un classique revisité avec l’exigence qui caractérise notre maison.',
    ingredient:
      'Cerises griottines dénoyautées, lait entier, crème fraîche, œufs plein-air, sucre, vanille Bourbon, farine T45',
    prixOptions: null,
    gradient: 'linear-gradient(150deg,#3D0505 0%,#6B1010 40%,#9B2020 75%,#C04040 100%)',
    motif: 'Cerises Griottines',
    saison: 'Été'
  },
  {
    id: 6,
    nom: 'Paris-Brest Noisette',
    prix: 30,
    description:
      'Pâte à choux généreuse dorée, crème mousseline pralinée aux noisettes du Piémont, éclats caramelîs. La force et la finesse réunies en un seul gâteau.',
    ingredient:
      'Farine, beurre, œufs, praliné noisettes Piémont 65%, lait entier, crème, sucre glace, amandes effilées',
    prixOptions: null,
    gradient: 'linear-gradient(150deg,#280E00 0%,#4A1E08 40%,#6B3A18 75%,#9A6030 100%)',
    motif: 'Praliné Noisette',
    saison: 'Toute l’année'
  },
  {
    id: 7,
    nom: 'Millefeuille Vanille Bourbon',
    prix: 24,
    description:
      'Feuilletage inversé caramelé maison, crème pâtissière à la vanille Bourbon infusée 24 heures. Le classique des classiques, exécuté sans compromis.',
    ingredient:
      'Farine T55, beurre de tourage AOC, fleur de sel, lait entier, vanille Bourbon de Madagascar, jaunes d’œuf, sucre',
    prixOptions: null,
    gradient: 'linear-gradient(150deg,#5A3C00 0%,#8B6000 40%,#B8860B 75%,#D4A820 100%)',
    motif: 'Vanille Bourbon',
    saison: 'Toute l’année'
  },
  {
    id: 8,
    nom: 'Opéra Grand Cru',
    prix: 40,
    description:
      'Sept couches d’excellence : biscuit joconde amandes, sirop café arabica, crème au beurre café, ganache chocolat Valrhona 70 %. Une émotion à chaque bouchée.',
    ingredient:
      'Chocolat Valrhona Guanaja 70%, café arabica Ethiopia, amandes, beurre extra-fin, sucre, œufs, crème',
    prixOptions: { taille: { '6 personnes': 0, '10 personnes': 20 } },
    gradient: 'linear-gradient(150deg,#080302 0%,#1A0A04 40%,#2E1208 75%,#4A2010 100%)',
    motif: 'Chocolat & Café',
    saison: 'Toute l’année'
  }
];
