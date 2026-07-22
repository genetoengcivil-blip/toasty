"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { products, Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabase-client";

interface MenuSectionProps {
  id: string;
  title: string;
  subtitle: string;
  category: Product["category"];
}

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

function ProductCard({ product, i }: { product: Product; i: number }) {
  const { openDrawer, addItemCustom } = useCartStore();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    setFav(getFavorites().includes(product.id));

    supabase
      .from("reviews")
      .select("rating")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const avg = data.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / data.length;
          setAvgRating(Math.round(avg * 10) / 10);
        }
      });
  }, [product.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    setFav(!fav);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${product.emoji} *${product.name}* — ${formatPrice(product.price)}\n\n${product.description}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemCustom(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        ingredients: product.ingredients,
        price: product.price,
        image: product.image,
        emoji: product.emoji,
        badge: product.badge,
        tag: product.tag,
        extras: product.extras,
      },
      [],
      "",
      0,
      qty
    );
    showToast(`${qty}x ${product.name} adicionado`, product.image);
    setQty(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className="product-card"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onClick={() =>
        openDrawer({
          id: product.id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          price: product.price,
          image: product.image,
          emoji: product.emoji,
          badge: product.badge,
          tag: product.tag,
          extras: product.extras,
        })
      }
    >
      {/* Image */}
      <div
        className="product-card-image"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          background: "var(--bg-elevated)",
          overflow: "hidden",
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 50vw, 250px"
          style={{ objectFit: "cover" }}
        />
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "#7B001C",
              color: "white",
              padding: "3px 8px",
              borderRadius: "50px",
              fontSize: "0.55rem",
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            {product.badge}
          </span>
        )}
        {product.tag && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(200,148,62,0.9)",
              color: "#060606",
              padding: "3px 8px",
              borderRadius: "50px",
              fontSize: "0.55rem",
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            {product.tag}
          </span>
        )}
        {/* Fav + Share */}
        <div style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", gap: "6px", zIndex: 2 }}>
          <button
            onClick={handleFav}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Heart size={14} fill={fav ? "#ef4444" : "none"} color={fav ? "#ef4444" : "white"} />
          </button>
          <button
            onClick={handleShare}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Share2 size={13} color="white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
          <h4
            style={{
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h4>
          {avgRating && (
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Star size={12} fill="#C8943E" color="#C8943E" />
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#C8943E" }}>{avgRating}</span>
            </div>
          )}
        </div>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.68rem",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          {product.description}
        </p>

        {/* Price + quantity selector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#C8943E" }}>
            {formatPrice(product.price)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                color: "var(--text-primary)",
              }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", minWidth: "16px", textAlign: "center" }}>
              {qty}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAdd(e);
              }}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#7B001C",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                color: "white",
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuSection({ id, title, subtitle, category }: MenuSectionProps) {
  const filtered = products.filter((p) => p.category === category);

  if (filtered.length === 0) return null;

  return (
    <section id={id} style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {title}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>
          {subtitle}
        </p>
        <div className="section-divider" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} i={i} />
        ))}
      </div>
    </section>
  );
}