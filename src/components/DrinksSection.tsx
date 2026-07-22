"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { drinks } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { supabase } from "@/lib/supabase-client";
import { ProductCard } from "@/components/ProductCard";

export default function DrinksSection() {
  const { user } = useAuth();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { setFavIds([]); return; }
    getFavorites(user.id).then(setFavIds);
  }, [user]);

  useEffect(() => {
    supabase.from("reviews").select("rating").then(({ data }) => {
      if (data && data.length > 0) {
        const avg = data.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / data.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }
    });
  }, []);

  const handleFavChange = (productId: string, isFav: boolean) => {
    setFavIds((prev) => isFav ? [...prev, productId] : prev.filter((id) => id !== productId));
  };

  const autorais = drinks.filter((d) => d.price === 18.9);
  const lata = drinks.filter((d) => d.price === 8.9);

  return (
    <section id="bebidas" style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Bebidas</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>Refresque-se.</p>
        <div className="section-divider" />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Autorais — 400ml</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {autorais.map((item, i) => <ProductCard key={item.id} item={item} i={i} favIds={favIds} onFavChange={handleFavChange} avgRating={avgRating} />)}
        </div>
      </div>
      <div>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Refrigerantes Lata — 350ml</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {lata.map((item, i) => <ProductCard key={item.id} item={item} i={i} favIds={favIds} onFavChange={handleFavChange} avgRating={avgRating} />)}
        </div>
      </div>
    </section>
  );
}