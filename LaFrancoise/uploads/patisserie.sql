-- =========================================
-- CATALOGUE
-- =========================================

CREATE TABLE Catalogue (
  id               SERIAL PRIMARY KEY,
  nom              VARCHAR(255) UNIQUE NOT NULL,
  prix             DECIMAL(10,2) NOT NULL,
  ingredient       TEXT,
  description      TEXT,
  isActif          BOOLEAN DEFAULT TRUE,
  modeVente        VARCHAR(20) DEFAULT 'make_to_order' CHECK (modeVente IN ('make_to_order', 'make_to_stock')),
  stockDisponible  INT DEFAULT 0,
  dateDebutActif   DATE,
  dateFinActif     DATE,
  prixOptions      JSONB
);

-- =========================================
-- PHOTOS
-- =========================================

CREATE TABLE Photo (
  id           SERIAL PRIMARY KEY,
  idCatalogue  INT NOT NULL REFERENCES Catalogue(id),
  photo_url    TEXT
);

-- =========================================
-- COMMANDES DIRECTES
-- =========================================

CREATE TABLE CommandeDirect (
  id            SERIAL PRIMARY KEY,
  dateCommande  TIMESTAMP DEFAULT NOW(),
  dateRetrait   DATE NOT NULL,
  prixTotal     DECIMAL(10,2) NOT NULL,
  nom           VARCHAR(255) NOT NULL,
  mail          TEXT NOT NULL,

  noteClient    TEXT,
  paiementChoisi  VARCHAR(20) CHECK (paiementChoisi IN ('en_ligne', 'sur_place'))
);

-- =========================================
-- DEVIS
-- =========================================

CREATE TYPE statut_type_devis AS ENUM (
  'en_attente',
  'valide',
  'acompte_paye',
  'pret',
  'annule',
  'expire'
);

CREATE TABLE Devis (
  id              SERIAL PRIMARY KEY,
  statutEnum      statut_type_devis DEFAULT 'en_attente',
  dateCommande    TIMESTAMP DEFAULT NOW(),
  dateRetrait     DATE NOT NULL,
  dateSouhaitee   TIMESTAMP NOT NULL,
  acompte         DECIMAL(10,2) NOT NULL,
  prixTotal       DECIMAL(10,2) NOT NULL,
  dejaPaye        DECIMAL(10,2) DEFAULT 0,
  typeEvenement   VARCHAR(255),
  numeroTel       VARCHAR(255) NOT NULL,
  expireAt        TIMESTAMP,
  nom             VARCHAR(255) NOT NULL,
  mail            TEXT NOT NULL,
  noteClient      TEXT,
  noteAdmin       TEXT
);

-- =========================================
-- ITEMS COMMANDE DIRECTE
-- =========================================

CREATE TABLE CatalogueItem (
  id           SERIAL PRIMARY KEY,
  idCommande   INT NOT NULL REFERENCES CommandeDirect(id),
  idCatalogue  INT NOT NULL REFERENCES Catalogue(id),
  quantite     INT DEFAULT 1,
  prixUnite    DECIMAL(10,2) NOT NULL,
  options      JSONB
);

-- =========================================
-- ITEMS DEVIS
-- =========================================

CREATE TABLE CatalogueDevisItem (
  id           SERIAL PRIMARY KEY,
  idDevis      INT NOT NULL REFERENCES Devis(id),
  idCatalogue  INT NOT NULL REFERENCES Catalogue(id),
  quantite     INT DEFAULT 1,
  prixUnite    DECIMAL(10,2) NOT NULL,
  options      JSONB
);

-- =========================================
-- LIMITES DE PRODUCTION
-- =========================================

CREATE TABLE DayLimit (
  id           SERIAL PRIMARY KEY,
  dayStart     DATE DEFAULT CURRENT_DATE,
  idCatalogue  INT NOT NULL REFERENCES Catalogue(id),
  limitPerDay  INT DEFAULT 10 NOT NULL,
  isActif      BOOLEAN DEFAULT FALSE
);

CREATE TABLE WeekLimit (
  id            SERIAL PRIMARY KEY,
  weekStart     DATE DEFAULT CURRENT_DATE,
  idCatalogue   INT NOT NULL REFERENCES Catalogue(id),
  limitPerWeek  INT DEFAULT 10 NOT NULL,
  isActif       BOOLEAN DEFAULT FALSE
);

-- =========================================
-- ADMIN
-- =========================================

CREATE TABLE Admin (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  passwordHash  VARCHAR(255) NOT NULL,
  role          VARCHAR(50) DEFAULT 'admin',
  createdAt     TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- CONFIG
-- =========================================

CREATE TABLE Config (
  id           SERIAL PRIMARY KEY,
  nameVariable VARCHAR(255) UNIQUE NOT NULL,
  valeur       TEXT NOT NULL,
  description  TEXT
);

INSERT INTO Config (nameVariable, valeur, description) VALUES
('mode_production_global',   'make_to_order',  'make_to_order | make_to_stock | mixte'),
('mode_commande',            'seuil',          'direct_only | devis_only | seuil'),
('seuil_devis',              '10',             'Nb de pièces total panier déclenchant un devis'),
('delai_retrait_jours',      '2',              'Jours minimum avant retrait commande directe'),
('limite_par_commande',      '0',              'Nb max de pièces par commande (0 = illimité)'),
('devis_expire_days',        '14',             'Jours avant expiration automatique d un devis'),
('acompte_mode',             'pourcentage',    'desactive | pourcentage | montant_fixe'),
('acompte_valeur',           '30',             'Valeur de l acompte selon le mode (% ou € fixe)'),
('paiement_en_ligne',        'obligatoire',    'obligatoire | desactive'),
('mode_retrait',             'boutique',       'boutique | livraison | les_deux'),
('frais_livraison',          '0.00',           'Frais de livraison en euros'),
('zone_livraison',           '',               'Description zone de livraison (texte libre)'),
('notif_admin_email',        '',               'Email destinataire des notifications admin'),
('notif_client_statut',      'true',           'Envoyer email client à chaque changement de statut'),
('notif_admin_commande',     'true',           'Notifier admin à chaque nouvelle commande'),
('notif_admin_devis',        'true',           'Notifier admin à chaque nouveau devis'),
('boutique_nom',             '',               'Nom affiché dans les emails et le header'),
('boutique_adresse',         '',               'Adresse affichée dans les emails de confirmation'),
('boutique_tel',             '',               'Téléphone affiché sur le site'),
('boutique_horaires',        '',               'Horaires affichés sur le site (texte libre)'),
('mode_paiement',            'en_ligne',       'en_ligne | sur_place | acompte | au_choix_client')
