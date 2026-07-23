"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { products, sides, drinks, combos } from "@/data/products";
import { useAuth } from "@/components/AuthProvider";
import { getFavorites } from "@/lib/favorites";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const allItems = [...products, ...sides, ...drinks, ...combos];

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getFavorites(user.id).then((ids) => {
      setFavIds(ids);
      setLoading(false);
    });
  }, [user, authLoading]);

  const handleFavChange = (productId: string, isFav: boolean) => {
    setFavIds((prev) => isFav ? [...prev, productId] : prev.filter((id) => id !== productId));
  };

  const favItems = allItems.filter((item) => favIds.includes(item.id));

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-faint)", fontSize: "1rem" }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <div style={{ padding: "20px 16px", maxWidth: "800px", margin: "0 auto" }}>
        <button onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, marginBottom: "24px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={16} />
          Voltar
        </button>

        <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--text-primary)", marginBottom: "8px" }}>
          Favoritos
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "32px" }}>
          {favItems.length} {favItems.length === 1 ? "item" : "itens"} salvos.
        </p>
        <div className="section-divider" style={{ margin: "0 0 32px" }} />

        {favItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Heart size={48} style={{ color: "var(--text-faint)", marginBottom: "16px", opacity: 0.3 }} />
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "8px" }}>Nenhum favorito ainda.</p>
            <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>Toque no coração dos itens para salvar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favItems.map((item, i) => (
              <ProductCard key={item.id} item={item} i={i} favIds={favIds} onFavChange={handleFavChange} avgRating={null} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}