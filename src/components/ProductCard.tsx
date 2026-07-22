"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type DrawerProduct } from "@/store/cart";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { toggleFavorite } from "@/lib/favorites";

interface CardItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  emoji: string;
  badge?: string;
  tag?: string;
  extras?: { id: string; price: number }[];
}

interface ProductCardProps {
  item: CardItem;
  i: number;
  favIds: string[];
  onFavChange: (id: string, isFav: boolean) => void;
  avgRating: number | null;
}

export function ProductCard({ item, i, favIds, onFavChange, avgRating }: ProductCardProps) {
  const { openDrawer, addItemCustom } = useCartStore();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);

  const fav = favIds.includes(item.id);

  const handleFav = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const isNowFav = await toggleFavorite(user.id, item.id);
    onFavChange(item.id, isNowFav);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${item.emoji} *${item.name}* — ${formatPrice(item.price)}\n\n${item.description}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemCustom(
      { id: item.id, name: item.name, description: item.description, ingredients: item.ingredients, price: item.price, image: item.image, emoji: item.emoji, badge: item.badge, tag: item.tag, extras: item.extras },
      [], "", 0, qty
    );
    showToast(`${qty}x ${item.name} adicionado`, item.image);
    setQty(1);
  };

  const drawerPayload: DrawerProduct = {
    id: item.id, name: item.name, description: item.description, ingredients: item.ingredients,
    price: item.price, image: item.image, emoji: item.emoji, badge: item.badge, tag: item.tag, extras: item.extras,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="product-card"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "18px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
      onClick={() => openDrawer(drawerPayload)}
    >
      <div className="product-card-image" style={{ position: "relative", width: "100%", aspectRatio: "1", background: "var(--bg-elevated)", overflow: "hidden" }}>
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 480px) 50vw, 250px" style={{ objectFit: "cover" }} />
        {item.badge && <span style={{ position: "absolute", top: "8px", left: "8px", background: "#7B001C", color: "white", padding: "3px 8px", borderRadius: "50px", fontSize: "0.55rem", fontWeight: 700, zIndex: 2 }}>{item.badge}</span>}
        {item.tag && <span style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(200,148,62,0.9)", color: "#060606", padding: "3px 8px", borderRadius: "50px", fontSize: "0.55rem", fontWeight: 700, zIndex: 2 }}>{item.tag}</span>}
        <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px", zIndex: 2 }}>
          <button onClick={handleFav} aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <Heart size={14} fill={fav ? "#ef4444" : "none"} color={fav ? "#ef4444" : "white"} />
          </button>
          <button onClick={handleShare} aria-label="Compartilhar no WhatsApp" style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
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
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir quantidade" style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--text-primary)" }}><Minus size={12} /></button>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", minWidth: "16px", textAlign: "center" }}>{qty}</span>
            <button onClick={(e) => { e.stopPropagation(); handleQuickAdd(e); }} aria-label="Adicionar ao carrinho" style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#7B001C", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "white" }}><Plus size={12} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}