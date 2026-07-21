"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { products, sides, drinks, combos } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { DrawerProduct } from "@/store/cart";

type AllItem = (typeof products)[0] | (typeof sides)[0] | (typeof drinks)[0] | (typeof combos)[0];

function toDrawerProduct(item: AllItem): DrawerProduct {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    ingredients: item.ingredients,
    price: item.price,
    image: item.image,
    emoji: item.emoji,
    badge: "badge" in item ? item.badge : undefined,
    tag: "tag" in item ? item.tag : undefined,
    extras: "extras" in item ? item.extras : undefined,
  };
}

type Category = "todos" | "salgado" | "doce" | "veggie" | "side" | "drink" | "combo";

const categories: { id: Category; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "salgado", label: "Salgados" },
  { id: "doce", label: "Doces" },
  { id: "veggie", label: "Veggie" },
  { id: "side", label: "Acompanhamentos" },
  { id: "drink", label: "Bebidas" },
  { id: "combo", label: "Combos" },
];

const categoryLabels: Record<string, string> = {
  salgado: "Salgado",
  doce: "Doce",
  veggie: "Veggie",
  side: "Acompanhamento",
  drink: "Bebida",
  combo: "Combo",
};

function getCategory(item: AllItem): string {
  if ("category" in item && typeof item.category === "string") return item.category;
  return "combo";
}

export default function MenuSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [isFiltering, setIsFiltering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openDrawer } = useCartStore();

  const allItems: AllItem[] = [...products, ...(sides as AllItem[]), ...(drinks as AllItem[]), ...(combos as AllItem[])];

  const filtered = allItems.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.ingredients.some((i) => i.toLowerCase().includes(q));

    const matchesCategory = activeCategory === "todos" || getCategory(item) === activeCategory;

    return matchesQuery && matchesCategory;
  });

  useEffect(() => {
    setIsFiltering(query.trim() !== "" || activeCategory !== "todos");
  }, [query, activeCategory]);

  const handleOpen = (item: AllItem) => {
    openDrawer(toDrawerProduct(item));
  };

  return (
    <section style={{ padding: "40px 16px 0", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Search bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "16px",
              color: "var(--text-faint)",
              pointerEvents: "none",
            }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar no cardápio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 48px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "50px",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "16px",
                background: "none",
                border: "none",
                color: "var(--text-faint)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "8px 18px",
              borderRadius: "50px",
              border: "1px solid",
              borderColor:
                activeCategory === cat.id ? "#C8943E" : "var(--border-light)",
              background:
                activeCategory === cat.id
                  ? "rgba(200,148,62,0.12)"
                  : "var(--bg-card)",
              color:
                activeCategory === cat.id ? "#C8943E" : "var(--text-secondary)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence>
        {isFiltering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: "32px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {filtered.length === 0
                  ? "Nenhum resultado"
                  : `${filtered.length} resultado${filtered.length > 1 ? "s" : ""}`}
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("todos");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C8943E",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Limpar
              </button>
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 24px",
                  background: "var(--bg-card)",
                  borderRadius: "20px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <p style={{ color: "var(--text-faint)", fontSize: "1rem", marginBottom: "8px" }}>
                  Nenhum produto encontrado
                </p>
                <p style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>
                  Tente outro termo ou categoria
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "16px",
                  paddingBottom: "60px",
                }}
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleOpen(item)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,148,62,0.3)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        height: "180px",
                        background: "var(--bg-elevated)",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        style={{ objectFit: "cover" }}
                      />
                      {"badge" in item && item.badge && (
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "#7B001C",
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "50px",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            zIndex: 2,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "var(--font-playfair)",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {item.name}
                        </h3>
                        <span
                          style={{
                            fontWeight: 800,
                            color: "#C8943E",
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.78rem",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </p>
                      <div
                        style={{
                          marginTop: "8px",
                          display: "inline-block",
                          padding: "3px 10px",
                          background: "var(--bg-elevated)",
                          borderRadius: "50px",
                          fontSize: "0.62rem",
                          color: "var(--text-faint)",
                          fontWeight: 600,
                        }}
                      >
                        {categoryLabels[getCategory(item)] || getCategory(item)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}