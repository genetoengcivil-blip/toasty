"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { sides } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabase-client";

const WHATSAPP_NUMBER = "5583986667292";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("toasty-favs") || "[]"); } catch { return []; }
}

function toggleFavorite(id: string) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem("toasty-favs", JSON.stringify(next));
}

function SideCard({ item, i }: { item: typeof sides[0]; i: number }) {
  const { openDrawer, addItemCustom } = useCartStore();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(getFavorites().includes(item.id));
  }, [item.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    setFav(!fav);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${item.emoji} *${item.name}* — ${formatPrice(item.price)}\n\n${item.description}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemCustom(
      { id: item.id, name: item.name, description: item.description, ingredients: item.ingredients, price: item.price, image: item.image, emoji: item.emoji },
      [], "", 0, qty
    );
    showToast(`${qty}x ${item.name} adicionado`, item.image);
    setQty(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
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
        <h4 style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "4px", lineHeight: 1.2 }}>{item.name}</h4>
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

export default function SidesSection() {
  return (
    <section id="acompanhamentos" style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Acompanhamentos</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>Completam seu pedido.</p>
        <div className="section-divider" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {sides.map((item, i) => <SideCard key={item.id} item={item} i={i} />)}
      </div>
    </section>
  );
}