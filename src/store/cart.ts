import { create } from "zustand";
import { supabase } from "@/lib/supabase-client";
import { saveCart } from "@/lib/cart-sync";
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
  status?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  drawerProduct: DrawerProduct | null;
  flyTarget: { x: number; y: number; emoji: string } | null;
  userId: string | null;
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
  setUserId: (userId: string | null) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  saveOrder: (userId: string) => Promise<Order | null>;
  getOrders: (userId: string) => Promise<Order[]>;
  total: () => number;
  itemCount: () => number;
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSync(userId: string, items: CartItem[]) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    saveCart(userId, items);
  }, 1000);
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isOpen: false,
  drawerProduct: null,
  flyTarget: null,
  userId: null,
  triggerFly: (target) => set({ flyTarget: target }),
  clearFly: () => set({ flyTarget: null }),
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.id === item.id && i.extras.length === 0 && i.obs === ""
      );
      const newItems = existing
        ? state.items.map((i, j) =>
            j === state.items.indexOf(existing) ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...item, quantity: 1, extras: [], obs: "", extrasPrice: 0 }];
      if (state.userId) debouncedSync(state.userId, newItems);
      return { items: newItems };
    }),
  addItemCustom: (product, extras, obs, extrasPrice, quantity) =>
    set((state) => {
      const newItems = [...state.items, { ...product, quantity, extras, obs, extrasPrice }];
      if (state.userId) debouncedSync(state.userId, newItems);
      return { items: newItems };
    }),
  removeItem: (index) =>
    set((state) => {
      const newItems = state.items.filter((_, i) => i !== index);
      if (state.userId) debouncedSync(state.userId, newItems);
      return { items: newItems };
    }),
  updateQuantity: (index, quantity) =>
    set((state) => {
      const newItems =
        quantity <= 0
          ? state.items.filter((_, i) => i !== index)
          : state.items.map((i, j) => (j === index ? { ...i, quantity } : i));
      if (state.userId) debouncedSync(state.userId, newItems);
      return { items: newItems };
    }),
  clearCart: () => {
    const state = get();
    if (state.userId) debouncedSync(state.userId, []);
    set({ items: [] });
  },
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  openDrawer: (product) => set({ drawerProduct: product }),
  closeDrawer: () => set({ drawerProduct: null }),
  setUserId: (userId) => set({ userId }),
  loadFromSupabase: async (userId: string) => {
    const { loadCart } = await import("@/lib/cart-sync");
    const items = await loadCart(userId);
    set({ items, userId });
  },
  saveOrder: async (userId: string) => {
    const { items, total } = get();
    if (items.length === 0) return null;
    const snapshot = { items: [...items], total: total() };
    const { data, error } = await supabase
      .from("orders")
      .insert({ user_id: userId, items, total: total() })
      .select()
      .single();
    if (error) {
      console.error("saveOrder error:", error.message, error.details, error.hint);
      return null;
    }
    set({ items: [] });
    saveCart(userId, []);
    return { id: data.id, ...snapshot, date: data.created_at };
  },
  getOrders: async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, items, total, created_at")
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
}));