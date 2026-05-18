// src/__tests__/config.service.test.ts
import {
  getSeuilDevis,
  getModeCommande,
  getDelaiRetrait,
  getLimiteParCommande,
  getDevisExpireDays,
  getAcompteMode,
  getAcompteValeur,
  getModePaiement,
  getNotifAdminEmail,
  getBoutiqueNom,
  setConfig,
} from '../lib/config'
import prisma from '../lib/prisma'

const prismaMock = prisma as jest.Mocked<typeof prisma>

// Données de config par défaut
const configMock = [
  { id: 1, nameVariable: 'seuil_devis', valeur: '10', description: null },
  { id: 2, nameVariable: 'mode_commande', valeur: 'seuil', description: null },
  { id: 3, nameVariable: 'delai_retrait_jours', valeur: '2', description: null },
  { id: 4, nameVariable: 'limite_par_commande', valeur: '0', description: null },
  { id: 5, nameVariable: 'devis_expire_days', valeur: '14', description: null },
  { id: 6, nameVariable: 'acompte_mode', valeur: 'pourcentage', description: null },
  { id: 7, nameVariable: 'acompte_valeur', valeur: '30', description: null },
  { id: 8, nameVariable: 'mode_paiement', valeur: 'en_ligne', description: null },
  { id: 9, nameVariable: 'notif_admin_email', valeur: 'admin@test.be', description: null },
  { id: 10, nameVariable: 'boutique_nom', valeur: 'La Pâtisserie', description: null },
]

beforeEach(() => {
  ;(prismaMock.config.findMany as jest.Mock).mockResolvedValue(configMock)
})

// =========================================
// TESTS lecture des variables
// =========================================

describe('getSeuilDevis', () => {
  it('retourne le seuil comme nombre', async () => {
    const result = await getSeuilDevis()
    expect(result).toBe(10)
    expect(typeof result).toBe('number')
  })
})

describe('getModeCommande', () => {
  it('retourne le mode de commande comme string', async () => {
    const result = await getModeCommande()
    expect(result).toBe('seuil')
  })
})

describe('getDelaiRetrait', () => {
  it('retourne le délai comme nombre', async () => {
    const result = await getDelaiRetrait()
    expect(result).toBe(2)
    expect(typeof result).toBe('number')
  })
})

describe('getLimiteParCommande', () => {
  it('retourne 0 quand illimité', async () => {
    const result = await getLimiteParCommande()
    expect(result).toBe(0)
  })
})

describe('getDevisExpireDays', () => {
  it('retourne le nombre de jours avant expiration', async () => {
    const result = await getDevisExpireDays()
    expect(result).toBe(14)
  })
})

describe('getAcompteMode', () => {
  it('retourne le mode d\'acompte', async () => {
    const result = await getAcompteMode()
    expect(result).toBe('pourcentage')
  })
})

describe('getAcompteValeur', () => {
  it('retourne la valeur d\'acompte comme nombre décimal', async () => {
    const result = await getAcompteValeur()
    expect(result).toBe(30)
    expect(typeof result).toBe('number')
  })
})

describe('getModePaiement', () => {
  it('retourne le mode de paiement', async () => {
    const result = await getModePaiement()
    expect(result).toBe('en_ligne')
  })
})

describe('getNotifAdminEmail', () => {
  it('retourne l\'email admin', async () => {
    const result = await getNotifAdminEmail()
    expect(result).toBe('admin@test.be')
  })
})

describe('getBoutiqueNom', () => {
  it('retourne le nom de la boutique', async () => {
    const result = await getBoutiqueNom()
    expect(result).toBe('La Pâtisserie')
  })
})

// =========================================
// TESTS modification
// =========================================

describe('setConfig', () => {
  it('met à jour une variable de config', async () => {
    ;(prismaMock.config.update as jest.Mock).mockResolvedValue({
      id: 1,
      nameVariable: 'seuil_devis',
      valeur: '15',
      description: null,
    })

    await setConfig('seuil_devis', '15')

    expect(prismaMock.config.update).toHaveBeenCalledWith({
      where: { nameVariable: 'seuil_devis' },
      data: { valeur: '15' },
    })
  })
})
