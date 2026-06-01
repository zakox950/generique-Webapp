// src/__tests__/config-public.route.test.ts
// Vérifie que la route publique GET /api/config n'expose que des variables
// non sensibles (pas d'email admin, pas de secrets).

import { GET as getPublicConfig } from "../../app/api/config/route";
import prisma from "../lib/prisma";

const prismaMock = prisma as jest.Mocked<typeof prisma>;

// Clés sensibles qui ne doivent JAMAIS être demandées par la route publique
const CLES_SENSIBLES = [
  "notif_admin_email",
  "notif_admin_commande",
  "notif_admin_devis",
  "acompte_mode",
  "acompte_valeur",
];

describe("GET /api/config (public)", () => {
  it("ne requête que des variables publiques et exclut les clés sensibles", async () => {
    (prismaMock.config.findMany as jest.Mock).mockResolvedValue([
      { nameVariable: "boutique_nom", valeur: "Françoise" },
      { nameVariable: "mode_commande", valeur: "seuil" },
    ]);

    const res = await getPublicConfig();
    const body = await res.json();

    // Récupère la liste des clés demandées dans le where
    const call = (prismaMock.config.findMany as jest.Mock).mock.calls[0][0];
    const clesDemandees: string[] = call.where.nameVariable.in;

    for (const sensible of CLES_SENSIBLES) {
      expect(clesDemandees).not.toContain(sensible);
    }

    expect(body).toEqual({
      boutique_nom: "Françoise",
      mode_commande: "seuil",
    });
  });

  it("renvoie un en-tête de cache", async () => {
    (prismaMock.config.findMany as jest.Mock).mockResolvedValue([]);
    const res = await getPublicConfig();
    expect(res.headers.get("Cache-Control")).toContain("max-age");
  });
});
