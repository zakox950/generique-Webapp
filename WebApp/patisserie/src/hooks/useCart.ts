"use client";
import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  photoUrl?: string;
  options?: Record<string, string>;
}

const STORAGE_KEY = "patisserie_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setMounted(true);
  }, []);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantite"> & { quantite?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.id === item.id
              ? { ...i, quantite: i.quantite + (item.quantite ?? 1) }
              : i,
          );
        } else {
          next = [...prev, { ...item, quantite: item.quantite ?? 1 }];
        }
        writeCart(next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((id: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      writeCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: number, quantite: number) => {
    if (quantite <= 0) {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        writeCart(next);
        return next;
      });
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, quantite } : i));
      writeCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    writeCart([]);
  }, []);

  const total = items.reduce((acc, i) => acc + i.prix * i.quantite, 0);
  const count = items.reduce((acc, i) => acc + i.quantite, 0);

  return { items, total, count, mounted, addItem, removeItem, updateQuantity, clearCart };
}
