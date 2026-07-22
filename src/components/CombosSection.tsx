"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { combos } from "@/data/products";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Image from "next/image";

export default function CombosSection() {
  const { openDrawer } = useCartStore();

  return (
    <section id="combos" style={{ padding: "48px 16px", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Combos
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>
          Economize montando seu combo.
        </p>
        <div className="section-divider" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "20px" }}>
        {combos.map((combo, i) => (
          <ComboCard key={combo.id} combo={combo} index={i} onOpen={openDrawer} />
        ))}
      </div>
    </section>
  );
}

function ComboCard({ combo, index, onOpen }: { combo: typeof combos[number]; index: number; onOpen: (p: { id: string; name: string; description: string; ingredients: string[]; price: number; image: string; emoji: string; badge?: string }) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="product-card"
      style={{ display: "flex", flexDirection: "column" }}
      onClick={() =>
        onOpen({
          id: combo.id,
          name: combo.name,
          description: combo.description,
          ingredients: combo.ingredients,
          price: combo.price,
          image: combo.image,
          emoji: combo.emoji,
          badge: combo.badge,
        })
      }
    >
      <div className="product-card-image" style={{ height: "220px" }}>
        {!imgLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        )}
        <Image
          src={combo.image}
          alt={combo.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />

        {combo.badge && (
          <span
            className="absolute z-10"
            style={{
              top: "16px",
              left: "16px",
              background: "#7B001C",
              color: "white",
              padding: "6px 18px",
              borderRadius: "50px",
              fontSize: "0.75rem",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(123,0,28,0.6), 0 0 20px rgba(123,0,28,0.3)",
              letterSpacing: "0.5px",
              animation: "comboGlow 2s ease-in-out infinite",
            }}
          >
            {combo.badge}
          </span>
        )}

        {combo.savings && (
          <div
            className="absolute z-10"
            style={{
              bottom: "14px",
              right: "14px",
              background: "linear-gradient(135deg, #C8943E, #E0B860)",
              color: "#060606",
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: "0.8rem",
              fontWeight: 800,
              boxShadow: "0 4px 16px rgba(200,148,62,0.5), 0 0 24px rgba(200,148,62,0.3)",
              animation: "savingsGlow 2s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>💰</span>
            <span>Economize {formatDiscount(combo.savings, combo.originalPrice)}</span>
          </div>
        )}
      </div>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: "1.4rem",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          {combo.name}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.5 }}>
          {combo.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#C8943E" }}>
              {formatPrice(combo.price)}
            </span>
            {combo.originalPrice && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "var(--text-faint)",
                  fontSize: "0.9rem",
                  marginLeft: "10px",
                }}
              >
                {formatPrice(combo.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen({
              id: combo.id,
              name: combo.name,
              description: combo.description,
              ingredients: combo.ingredients,
              price: combo.price,
              image: combo.image,
              emoji: combo.emoji,
              badge: combo.badge,
            });
          }}
          className="btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: "0.9rem" }}
        >
          Escolher
        </button>
      </div>
    </motion.div>
  );
}
