"use client";

import { useState, useEffect } from "react";
import { sides } from "@/data/products";
import { useAuth } from "@/components/AuthProvider";
import { getFavorites } from "@/lib/favorites";
import { supabase } from "@/lib/supabase-client";
import { ProductCard } from "@/components/ProductCard";

export default function SidesSection() {
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

  return (
    <section id="acompanhamentos" style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Acompanhamentos</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>Completam seu pedido.</p>
        <div className="section-divider" />
      </div>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
        {sides.map((item, i) => (
          <ProductCard key={item.id} item={item} i={i} favIds={favIds} onFavChange={handleFavChange} avgRating={avgRating} />
        ))}
      </div>
    </section>
  );
}