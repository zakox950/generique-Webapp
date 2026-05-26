import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  option?: string;
}

interface CartStore {
  items: CartItem[];
  add: (item: CartItem) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const ex = s.items.find((i) => i.id === item.id);
          if (ex)
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
              ),
            };
          return { items: [...s.items, item] };
        }),
      update: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "patisserie-cart" }
  )
);
