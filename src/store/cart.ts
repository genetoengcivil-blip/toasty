import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase-client";
import type { Extra } from "@/data/products";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  ingredients?: string[];
  price: number;
  image: string;
  emoji: string;
  badge?: string;
  tag?: string;
  quantity: number;
  extras: string[];
  obs: string;
  extrasPrice: number;
}

export type DrawerProduct = Omit<CartItem, "quantity" | "extras" | "obs" | "extrasPrice"> & { extras?: Extra[] };

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  drawerProduct: DrawerProduct | null;
  flyTarget: { x: number; y: number; emoji: string } | null;
  triggerFly: (target: { x: number; y: number; emoji: string }) => void;
  clearFly: () => void;
  addItem: (item: DrawerProduct) => void;
  addItemCustom: (
    product: DrawerProduct,
    extras: string[],
    obs: string,
    extrasPrice: number,
    quantity: number
  ) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openDrawer: (product: DrawerProduct) => void;
  closeDrawer: () => void;
  saveOrder: (userId: string) => Promise<Order | null>;
  getOrders: (userId: string) => Promise<Order[]>;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      drawerProduct: null,
      flyTarget: null,
      triggerFly: (target) => set({ flyTarget: target }),
      clearFly: () => set({ flyTarget: null }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === item.id &&
              i.extras.length === 0 &&
              i.obs === ""
          );
          if (existing) {
            const idx = state.items.indexOf(existing);
            return {
              items: state.items.map((i, j) =>
                j === idx ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: 1, extras: [], obs: "", extrasPrice: 0 },
            ],
          };
        }),
      addItemCustom: (product, extras, obs, extrasPrice, quantity) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...product, quantity, extras, obs, extrasPrice },
          ],
        })),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      updateQuantity: (index, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((_, i) => i !== index)
              : state.items.map((i, j) => (j === index ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openDrawer: (product) => set({ drawerProduct: product }),
      closeDrawer: () => set({ drawerProduct: null }),
      saveOrder: async (userId: string) => {
        const { items, total } = get();
        if (items.length === 0) return null;
        const snapshot = { items: [...items], total: total() };
        const { data, error } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            items: items,
            total: total(),
          })
          .select()
          .single();
        set({ items: [] });
        if (error) return null;
        return { id: data.id, ...snapshot, date: data.created_at };
      },
      getOrders: async (userId: string) => {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error || !data) return [];
        return data.map((o) => ({
          id: o.id,
          items: o.items,
          total: o.total,
          date: o.created_at,
        }));
      },
      total: () =>
        get().items.reduce(
          (acc, item) => acc + (item.price + item.extrasPrice) * item.quantity,
          0
        ),
      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "toasty-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
