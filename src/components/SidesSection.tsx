"use client";

import { motion } from "framer-motion";
import { sides } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ShimmerImage } from "@/components/Shimmer";

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

      <div className="flex flex-col" style={{ gap: "10px" }}>
        {sides.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center product-card"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              padding: "10px",
              gap: "10px",
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
            <div className="flex-shrink-0 product-card-image" style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", background: "var(--bg-elevated)" }}>
              <ShimmerImage
                src={item.image}
                alt={item.name}
                width={72}
                height={72}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.name}</h4>
              <p style={{ color: "var(--text-faint)", fontSize: "0.7rem", marginTop: "2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.description}
              </p>
            </div>

            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#C8943E", flexShrink: 0 }}>
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
              className="btn-primary flex-shrink-0"
              style={{ fontSize: "0.7rem", padding: "10px 14px", minWidth: "44px", minHeight: "44px" }}
            >
              + Adicionar
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
