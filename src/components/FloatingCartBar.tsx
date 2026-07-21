"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function FloatingCartBar() {
  const { items, total, toggleCart } = useCartStore();
  const [hydrated, setHydrated] = useState(false);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || count === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50 lg:hidden"
      style={{
        bottom: "env(safe-area-inset-bottom, 0px)",
        padding: "0 12px 12px",
      }}
    >
      <button
        onClick={toggleCart}
        className="w-full flex items-center justify-between"
        style={{
          background: "#7B001C",
          color: "white",
          border: "none",
          borderRadius: "16px",
          padding: "14px 20px",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(123, 0, 28, 0.6), 0 0 0 1px rgba(200, 148, 62, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(123,0,28,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBag size={18} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 500 }}>
              {count} {count === 1 ? "item" : "itens"}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#E0B860" }}>
              {formatPrice(total())}
            </div>
          </div>
        </div>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.5px" }}>
          Ver Carrinho →
        </span>
      </button>
    </div>
  );
}
