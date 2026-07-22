"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sides } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export default function SidesSection() {
  const { openDrawer } = useCartStore();

  return (
    <section id="acompanhamentos" style={{ padding: "48px 16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Acompanhamentos
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", maxWidth: "500px", margin: "0 auto 20px" }}>
          Completam seu pedido.
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
        {sides.map((item, i) => (
          <motion.div
            key={item.id}
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
                id: item.id,
                name: item.name,
                description: item.description,
                ingredients: item.ingredients,
                price: item.price,
                image: item.image,
                emoji: item.emoji,
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
                    openDrawer({
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      ingredients: item.ingredients,
                      price: item.price,
                      image: item.image,
                      emoji: item.emoji,
                    });
                  }}
                  className="btn-primary"
                  style={{ fontSize: "0.65rem", padding: "8px 12px", borderRadius: "50px", minWidth: "auto", minHeight: "36px" }}
                >
                  + Adicionar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}