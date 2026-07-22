"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { drinks } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { supabase } from "@/lib/supabase-client";

function DrinkCard({ item, favIds, onFavChange }: { item: typeof drinks[0]; favIds: string[]; onFavChange: (id: string, isFav: boolean) => void }) {
  const { openDrawer, addItemCustom } = useCartStore();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  const fav = favIds.includes(item.id);

  useEffect(() => {
    supabase.from("reviews").select("rating").then(({ data }) => {
      if (data && data.length > 0) {
        const avg = data.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / data.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }
    });
  }, [item.id]);

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const isNowFav = await toggleFavorite(user.id, item.id);
    onFavChange(item.id, isNowFav);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${item.emoji} *${item.name}* — ${formatPrice(item.price)}\n\n${item.description}`)}`, "_blank");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemCustom({ id: item.id, name: item.name, description: item.description, ingredients: item.ingredients, price: item.price, image: item.image, emoji: item.emoji }, [], "", 0, qty);
    showToast(`${qty}x ${item.name} adicionado`, item.image);
    setQty(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="product-card"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "18px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
      onClick={() => openDrawer({ id: item.id, name: item.name, description: item.description, ingredients: item.ingredients, price: item.price, image: item.image, emoji: item.emoji })}
    >
      <div className="product-card-image" style={{ position: "relative", width: "100%", aspectRatio: "1", background: "var(--bg-elevated)", overflow: "hidden" }}>
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 480px) 50vw, 250px" style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px", zIndex: 2 }}>
          <button onClick={handleFav} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <Heart size={14} fill={fav ? "#ef4444" : "none"} color={fav ? "#ef4444" : "white"} />
          </button>
          <button onClick={handleShare} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <Share2 size={13} color="white" />
          </button>
        </div>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
          <h4 style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.2 }}>{item.name}</h4>
          {avgRating && <div style={{ display: "flex", alignItems: "center", gap: "3px" }}><Star size={12} fill="#C8943E" color="#C8943E" /><span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#C8943E" }}>{avgRating}</span></div>}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "10px" }}>{item.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#C8943E" }}>{formatPrice(item.price)}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--text-primary)" }}><Minus size={12} /></button>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", minWidth: "16px", textAlign: "center" }}>{qty}</span>
            <button onClick={(e) => { e.stopPropagation(); handleQuickAdd(e); }} style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#7B001C", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "white" }}><Plus size={12} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DrinksSection() {
  const { user } = useAuth();
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) { setFavIds([]); return; }
    getFavorites(user.id).then(setFavIds);
  }, [user]);

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
          {autorais.map((item) => <DrinkCard key={item.id} item={item} favIds={favIds} onFavChange={handleFavChange} />)}
        </div>
      </div>
      <div>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Refrigerantes Lata — 350ml</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {lata.map((item) => <DrinkCard key={item.id} item={item} favIds={favIds} onFavChange={handleFavChange} />)}
        </div>
      </div>
    </section>
  );
}