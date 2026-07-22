import { supabase } from "@/lib/supabase-client";

export async function getFavorites(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);
  if (!data) return [];
  return data.map((f) => f.product_id);
}

export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase.from("favorites").insert({ user_id: userId, product_id: productId });
    return true;
  }
}
