"use client";

import { motion } from "framer-motion";
import { products, Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ShimmerImage } from "@/components/Shimmer";

interface MenuSectionProps {
  id: string;
  title: string;
  subtitle: string;
  category: Product["category"];
}

export default function MenuSection({ id, title, subtitle, category }: MenuSectionProps) {
  const { openDrawer } = useCartStore();
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

      <div className="flex flex-col" style={{ gap: "10px" }}>
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
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
            <div className="flex-shrink-0 product-card-image" style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", background: "var(--bg-elevated)" }}>
              <ShimmerImage
                src={product.image}
                alt={product.name}
                width={72}
                height={72}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5" style={{ flexWrap: "wrap" }}>
                <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{product.name}</h4>
                {product.badge && (
                  <span style={{ background: "#7B001C", color: "white", padding: "2px 6px", borderRadius: "50px", fontSize: "0.55rem", fontWeight: 700 }}>
                    {product.badge}
                  </span>
                )}
                {product.tag && (
                  <span style={{ background: "rgba(200,148,62,0.15)", color: "#E0B860", padding: "2px 6px", borderRadius: "50px", fontSize: "0.55rem", border: "1px solid rgba(200,148,62,0.25)" }}>
                    {product.tag}
                  </span>
                )}
              </div>
              <p style={{ color: "var(--text-faint)", fontSize: "0.7rem", marginTop: "2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.description}
              </p>
            </div>

            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#C8943E", flexShrink: 0 }}>
              {formatPrice(product.price)}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
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
