"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { drinks } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

function DrinkCard({ item, onOpen }: { item: typeof drinks[0]; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="product-card"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s",
      }}
      onClick={onOpen}
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
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 480px) 50vw, 250px"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "12px" }}>
        <h4
          style={{
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "var(--text-primary)",
            marginBottom: "4px",
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </h4>
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
          {item.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#C8943E" }}>
            {formatPrice(item.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="btn-primary"
            style={{ fontSize: "0.65rem", padding: "8px 12px", borderRadius: "50px", minWidth: "auto", minHeight: "36px" }}
          >
            + Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DrinksSection() {
  const { openDrawer } = useCartStore();

  const autorais = drinks.filter((d) => d.price === 18.9);
  const lata = drinks.filter((d) => d.price === 8.9);

  const handleOpen = (item: typeof drinks[0]) => {
    openDrawer({
      id: item.id,
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      price: item.price,
      image: item.image,
      emoji: item.emoji,
    });
  };

  return (
    <section id="bebidas" style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Bebidas
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>
          Refresque-se.
        </p>
        <div className="section-divider" />
      </div>

      {/* Autorais */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
          Autorais — 400ml
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {autorais.map((item) => (
            <DrinkCard key={item.id} item={item} onOpen={() => handleOpen(item)} />
          ))}
        </div>
      </div>

      {/* Refrigerantes Lata */}
      <div>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
          Refrigerantes Lata — 350ml
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {lata.map((item) => (
            <DrinkCard key={item.id} item={item} onOpen={() => handleOpen(item)} />
          ))}
        </div>
      </div>
    </section>
  );
}