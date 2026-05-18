// src/__tests__/stock.service.test.ts
import {
  verifierStock,
  decrementerStock,
  reapprovisionner,
  setStock,
  getStocks,
} from '../lib/services/stock.service'
import prisma from '../lib/prisma'

const prismaMock = prisma as jest.Mocked<typeof prisma>

const produitMakeToStock = {
  id: 1,
  nom: 'Tarte aux fraises',
  modeVente: 'make_to_stock',
  stockDisponible: 10,
  isActif: true,
}

const produitMakeToOrder = {
  id: 2,
  nom: 'Croissant',
  modeVente: 'make_to_order',
  stockDisponible: 0,
  isActif: true,
}

// =========================================
// TESTS verifierStock
// =========================================

describe('verifierStock', () => {
  it('retourne ok si le stock est suffisant', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToStock)

    const result = await verifierStock(1, 5)

    expect(result.ok).toBe(true)
  })

  it('retourne ok si le produit est make_to_order', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToOrder)

    const result = await verifierStock(2, 100)

    expect(result.ok).toBe(true)
  })

  it('retourne une erreur si le stock est insuffisant', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToStock)

    const result = await verifierStock(1, 15)

    expect(result.ok).toBe(false)
    expect(result.message).toContain('Stock insuffisant')
    expect(result.message).toContain('10')
  })

  it('retourne une erreur si le produit n\'existe pas', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await verifierStock(999, 1)

    expect(result.ok).toBe(false)
    expect(result.message).toContain('999')
  })
})

// =========================================
// TESTS decrementerStock
// =========================================

describe('decrementerStock', () => {
  it('décrémente le stock d\'un produit make_to_stock', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToStock)
    ;(prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMakeToStock,
      stockDisponible: 7,
    })

    await decrementerStock(1, 3)

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { stockDisponible: 7 },
    })
  })

  it('ne fait rien pour un produit make_to_order', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToOrder)

    await decrementerStock(2, 5)

    expect(prismaMock.catalogue.update).not.toHaveBeenCalled()
  })

  it('ne descend pas en dessous de 0', async () => {
    const produitAvec2 = { ...produitMakeToStock, stockDisponible: 2 }
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitAvec2)
    ;(prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMakeToStock,
      stockDisponible: 0,
    })

    await decrementerStock(1, 5)

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { stockDisponible: 0 },
    })
  })
})

// =========================================
// TESTS reapprovisionner
// =========================================

describe('reapprovisionner', () => {
  it('ajoute la quantité au stock existant', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(produitMakeToStock)
    ;(prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMakeToStock,
      stockDisponible: 20,
    })

    await reapprovisionner(1, 10)

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { stockDisponible: 20 },
    })
  })

  it('throw une erreur si le produit n\'existe pas', async () => {
    ;(prismaMock.catalogue.findUnique as jest.Mock).mockResolvedValue(null)

    await expect(reapprovisionner(999, 10)).rejects.toThrow('999')
  })
})

// =========================================
// TESTS setStock
// =========================================

describe('setStock', () => {
  it('définit le stock à une valeur précise', async () => {
    ;(prismaMock.catalogue.update as jest.Mock).mockResolvedValue({
      ...produitMakeToStock,
      stockDisponible: 25,
    })

    await setStock(1, 25)

    expect(prismaMock.catalogue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { stockDisponible: 25 },
    })
  })
})

// =========================================
// TESTS getStocks
// =========================================

describe('getStocks', () => {
  it('retourne uniquement les produits make_to_stock', async () => {
    ;(prismaMock.catalogue.findMany as jest.Mock).mockResolvedValue([
      { id: 1, nom: 'Tarte', stockDisponible: 10, isActif: true },
    ])

    const result = await getStocks()

    expect(prismaMock.catalogue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { modeVente: 'make_to_stock' },
      })
    )
    expect(result).toHaveLength(1)
  })
})
