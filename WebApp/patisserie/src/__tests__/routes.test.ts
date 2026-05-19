// src/__tests__/routes.test.ts
// Tests des routes API — on mock les services et on appelle les fonctions de route directement

// =========================================
// MOCK DES SERVICES
// =========================================

jest.mock("../lib/services/catalogue.service", () => ({
  getProduitActifs: jest.fn(),
  getTousProduits: jest.fn(),
  creerProduit: jest.fn(),
  modifierProduit: jest.fn(),
  toggleActif: jest.fn(),
  ajouterPhoto: jest.fn(),
  supprimerPhoto: jest.fn(),
}));

jest.mock("../lib/services/commande.service", () => ({
  creerCommande: jest.fn(),
  getCommandes: jest.fn(),
  getCommandeById: jest.fn(),
  supprimerCommande: jest.fn(),
}));

jest.mock("../lib/services/devis.service", () => ({
  creerDevis: jest.fn(),
  getDevis: jest.fn(),
  getDevisById: jest.fn(),
  getDevisByStatut: jest.fn(),
  validerDevis: jest.fn(),
  refuserDevis: jest.fn(),
  marquerAcomptePaye: jest.fn(),
  marquerDevisPret: jest.fn(),
  modifierPrixDevis: jest.fn(),
  modifierDateRetrait: jest.fn(),
}));

jest.mock("../lib/config", () => ({
  getModeCommande: jest.fn(),
  getSeuilDevis: jest.fn(),
  getAllConfigPublic: jest.fn(),
  setConfig: jest.fn(),
}));

jest.mock("../lib/services/stock.service", () => ({
  getStocks: jest.fn(),
  reapprovisionner: jest.fn(),
  setStock: jest.fn(),
}));

// =========================================
// IMPORTS APRÈS LES MOCKS
// =========================================

import { GET as getCatalogue } from "../../app/api/catalogue/route";
import { POST as postCommande } from "../../app/api/commande/route";
import { POST as postDevis } from "../../app/api/devis/route";
import {
  GET as getAdminCatalogue,
  POST as postAdminCatalogue,
} from "../../app/api/admin/catalogue/route";
import { GET as getAdminCommandes } from "../../app/api/admin/commandes/route";
import { GET as getAdminDevis } from "../../app/api/admin/devis/route";
import {
  GET as getAdminConfig,
  PATCH as patchAdminConfig,
} from "../../app/api/admin/config/route";
import {
  GET as getAdminStock,
  PATCH as patchAdminStock,
} from "../../app/api/admin/stock/route";

import {
  getProduitActifs,
  getTousProduits,
  creerProduit,
} from "../lib/services/catalogue.service";
import { creerCommande } from "../lib/services/commande.service";
import {
  creerDevis,
  getDevis,
  getDevisByStatut,
} from "../lib/services/devis.service";
import {
  getModeCommande,
  getSeuilDevis,
  getAllConfigPublic,
  setConfig,
} from "../lib/config";
import {
  getStocks,
  reapprovisionner,
  setStock,
} from "../lib/services/stock.service";

// Helper pour créer une Request Next.js simulée
function makeRequest(
  body?: object,
  searchParams?: Record<string, string>,
): Request {
  const url = new URL("http://localhost/api/test");
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) =>
      url.searchParams.set(k, v),
    );
  }
  return new Request(url.toString(), {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
});

// =========================================
// GET /api/catalogue
// =========================================

describe("GET /api/catalogue", () => {
  it("retourne les produits actifs avec status 200", async () => {
    const produitsMock = [{ id: 1, nom: "Croissant", prix: 1.5, photos: [] }];
    (getProduitActifs as jest.Mock).mockResolvedValue(produitsMock);

    const res = await getCatalogue();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].nom).toBe("Croissant");
  });

  it("retourne 500 si le service échoue", async () => {
    (getProduitActifs as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await getCatalogue();

    expect(res.status).toBe(500);
  });
});

// =========================================
// POST /api/commande
// =========================================

describe("POST /api/commande", () => {
  const dateValide = new Date(Date.now() + 86400000 * 3).toISOString();

  const bodyValide = {
    nom: "Anass",
    mail: "anass@test.be",
    dateRetrait: dateValide,
    items: [{ idCatalogue: 1, quantite: 2 }],
  };

  it("crée une commande et retourne 201", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("direct_only");
    (creerCommande as jest.Mock).mockResolvedValue({ id: 1, ...bodyValide });

    const req = makeRequest(bodyValide);
    const res = await postCommande(req);

    expect(res.status).toBe(201);
  });

  it("retourne 403 si mode = devis_only", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("devis_only");

    const req = makeRequest(bodyValide);
    const res = await postCommande(req);
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.error).toContain("devis");
  });

  it("retourne 422 si le seuil devis est dépassé", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("seuil");
    (getSeuilDevis as jest.Mock).mockResolvedValue(5);

    const req = makeRequest({
      ...bodyValide,
      items: [{ idCatalogue: 1, quantite: 10 }], // dépasse le seuil de 5
    });
    const res = await postCommande(req);
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.redirect).toBe("devis");
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = makeRequest({ nom: "", mail: "pasunemail", items: [] });
    const res = await postCommande(req);

    expect(res.status).toBe(400);
  });

  it("retourne 422 si le service lève une erreur métier", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("direct_only");
    (creerCommande as jest.Mock).mockRejectedValue(
      new Error("Limite journalière atteinte"),
    );

    const req = makeRequest(bodyValide);
    const res = await postCommande(req);
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.error).toBe("Limite journalière atteinte");
  });
});

// =========================================
// POST /api/devis
// =========================================

describe("POST /api/devis", () => {
  const dateRetrait = new Date(Date.now() + 86400000 * 5).toISOString();
  const dateSouhaitee = new Date(Date.now() + 86400000 * 4).toISOString();

  const bodyValide = {
    nom: "Anass",
    mail: "anass@test.be",
    numeroTel: "+32 478 12 34 56",
    dateRetrait,
    dateSouhaitee,
    items: [{ idCatalogue: 1, quantite: 15 }],
  };

  it("crée un devis et retourne 201", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("seuil");
    (creerDevis as jest.Mock).mockResolvedValue({ id: 1, ...bodyValide });

    const req = makeRequest(bodyValide);
    const res = await postDevis(req);

    expect(res.status).toBe(201);
  });

  it("retourne 403 si mode = direct_only", async () => {
    (getModeCommande as jest.Mock).mockResolvedValue("direct_only");

    const req = makeRequest(bodyValide);
    const res = await postDevis(req);

    expect(res.status).toBe(403);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = makeRequest({ nom: "", mail: "pasunemail", items: [] });
    const res = await postDevis(req);

    expect(res.status).toBe(400);
  });
});

// =========================================
// GET /api/admin/catalogue
// =========================================

describe("GET /api/admin/catalogue", () => {
  it("retourne tous les produits avec status 200", async () => {
    (getTousProduits as jest.Mock).mockResolvedValue([
      { id: 1, nom: "Croissant" },
    ]);

    const res = await getAdminCatalogue();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
  });

  it("retourne 500 si le service échoue", async () => {
    (getTousProduits as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await getAdminCatalogue();

    expect(res.status).toBe(500);
  });
});

// =========================================
// POST /api/admin/catalogue
// =========================================

describe("POST /api/admin/catalogue", () => {
  it("crée un produit et retourne 201", async () => {
    (creerProduit as jest.Mock).mockResolvedValue({
      id: 1,
      nom: "Tarte",
      prix: 15,
    });

    const req = makeRequest({ nom: "Tarte", prix: 15 });
    const res = await postAdminCatalogue(req);

    expect(res.status).toBe(201);
  });

  it("retourne 400 si les données sont invalides", async () => {
    const req = makeRequest({ nom: "", prix: -1 });
    const res = await postAdminCatalogue(req);

    expect(res.status).toBe(400);
  });
});

// =========================================
// GET /api/admin/commandes
// =========================================

describe("GET /api/admin/commandes", () => {
  it("retourne toutes les commandes", async () => {
    const { getCommandes } = await import("../lib/services/commande.service");
    (getCommandes as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const res = await getAdminCommandes();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
  });
});

// =========================================
// GET /api/admin/devis
// =========================================

describe("GET /api/admin/devis", () => {
  it("retourne tous les devis sans filtre", async () => {
    (getDevis as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const req = makeRequest();
    const res = await getAdminDevis(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
  });

  it("filtre les devis par statut", async () => {
    (getDevisByStatut as jest.Mock).mockResolvedValue([
      { id: 1, statutEnum: "en_attente" },
    ]);

    const req = makeRequest(undefined, { statut: "en_attente" });
    const res = await getAdminDevis(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(getDevisByStatut).toHaveBeenCalledWith("en_attente");
  });

  it("retourne 400 pour un statut invalide", async () => {
    const req = makeRequest(undefined, { statut: "statut_invalide" });
    const res = await getAdminDevis(req);

    expect(res.status).toBe(400);
  });
});

// =========================================
// GET /api/admin/config
// =========================================

describe("GET /api/admin/config", () => {
  it("retourne toutes les variables de config", async () => {
    (getAllConfigPublic as jest.Mock).mockResolvedValue([
      { nameVariable: "seuil_devis", valeur: "10" },
    ]);

    const res = await getAdminConfig();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
  });
});

// =========================================
// PATCH /api/admin/config
// =========================================

describe("PATCH /api/admin/config", () => {
  it("modifie une variable et retourne 200", async () => {
    (setConfig as jest.Mock).mockResolvedValue({
      nameVariable: "seuil_devis",
      valeur: "15",
    });

    const req = new Request("http://localhost/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameVariable: "seuil_devis", valeur: "15" }),
    });

    const res = await patchAdminConfig(req);

    expect(res.status).toBe(200);
    expect(setConfig).toHaveBeenCalledWith("seuil_devis", "15");
  });

  it("retourne 400 si nameVariable est vide", async () => {
    const req = new Request("http://localhost/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameVariable: "", valeur: "15" }),
    });

    const res = await patchAdminConfig(req);

    expect(res.status).toBe(400);
  });
});

// =========================================
// GET /api/admin/stock
// =========================================

describe("GET /api/admin/stock", () => {
  it("retourne tous les stocks", async () => {
    (getStocks as jest.Mock).mockResolvedValue([
      { id: 1, nom: "Tarte", stockDisponible: 10 },
    ]);

    const res = await getAdminStock();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
  });
});

// =========================================
// PATCH /api/admin/stock
// =========================================

describe("PATCH /api/admin/stock", () => {
  it("réapprovisionne un produit", async () => {
    (reapprovisionner as jest.Mock).mockResolvedValue({
      id: 1,
      stockDisponible: 20,
    });

    const req = new Request("http://localhost/api/admin/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCatalogue: 1,
        action: "reapprovisionner",
        quantite: 10,
      }),
    });

    const res = await patchAdminStock(req);

    expect(res.status).toBe(200);
    expect(reapprovisionner).toHaveBeenCalledWith(1, 10);
  });

  it("retourne 400 si idCatalogue est manquant", async () => {
    const req = new Request("http://localhost/api/admin/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reapprovisionner", quantite: 10 }),
    });

    const res = await patchAdminStock(req);

    expect(res.status).toBe(400);
  });

  it("définit le stock à une valeur précise", async () => {
    (setStock as jest.Mock).mockResolvedValue({ id: 1, stockDisponible: 25 });

    const req = new Request("http://localhost/api/admin/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCatalogue: 1,
        action: "set_stock",
        quantite: 25,
      }),
    });

    const res = await patchAdminStock(req);

    expect(res.status).toBe(200);
    expect(setStock).toHaveBeenCalledWith(1, 25);
  });
});
