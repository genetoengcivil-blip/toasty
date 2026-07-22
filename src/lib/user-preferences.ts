import { supabase } from "@/lib/supabase-client";

type Theme = "dark" | "light";

export async function getTheme(userId: string): Promise<Theme> {
  const { data } = await supabase
    .from("user_preferences")
    .select("theme")
    .eq("user_id", userId)
    .maybeSingle();
  return (data?.theme as Theme) || "dark";
}

export async function saveTheme(userId: string, theme: Theme): Promise<void> {
  await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, theme, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}
