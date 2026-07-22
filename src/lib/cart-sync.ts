import { supabase } from "@/lib/supabase-client";
import type { CartItem } from "@/store/cart";

export async function loadCart(userId: string): Promise<CartItem[]> {
  const { data } = await supabase
    .from("carts")
    .select("items")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data?.items) return [];
  return data.items as CartItem[];
}

export async function saveCart(userId: string, items: CartItem[]): Promise<void> {
  await supabase
    .from("carts")
    .upsert(
      { user_id: userId, items, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
}
