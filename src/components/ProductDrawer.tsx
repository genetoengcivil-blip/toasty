"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/components/Toast";

export default function ProductDrawer() {
  const { drawerProduct, closeDrawer, addItemCustom, triggerFly } = useCartStore();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [obs, setObs] = useState("");
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedExtras([]);
    setQuantity(1);
    setObs("");
  }, [drawerProduct]);

  if (!drawerProduct) return null;

  const extras = drawerProduct.extras ?? [];

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const extrasPrice = selectedExtras.reduce((acc, id) => {
    const ext = extras.find((e) => e.id === id);
    return acc + (ext?.price ?? 0);
  }, 0);

  const total = drawerProduct.price * quantity + extrasPrice * quantity;

  const handleAdd = () => {
    const rect = addButtonRef.current?.getBoundingClientRect();
    if (rect) {
      triggerFly({
        x: rect.left + rect.width / 2,
        y: rect.top,
        emoji: drawerProduct?.emoji || "🍞",
      });
    }
    addItemCustom(drawerProduct, selectedExtras, obs, extrasPrice, quantity);
    showToast(`${quantity}x ${drawerProduct.name} adicionado`, drawerProduct.image);
    setQuantity(1);
    setSelectedExtras([]);
    setObs("");
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {drawerProduct && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 70 }}
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 flex flex-col overflow-hidden"
            style={{ width: "420px", maxWidth: "92vw", background: "var(--bg-page)", borderLeft: "1px solid var(--border-subtle)", zIndex: 80 }}
          >
        {/* Close button */}
        <div className="flex justify-end" style={{ padding: "16px 16px 0" }}>
          <button onClick={closeDrawer} style={{ background: "var(--bg-elevated)", border: "none", borderRadius: "50%", padding: "12px", cursor: "pointer", color: "var(--text-secondary)", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center" style={{ padding: "0 24px 24px" }}>
          {/* Product image */}
          <div style={{ width: "100%", maxWidth: "200px", aspectRatio: "1", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image
              src={drawerProduct.image}
              alt={drawerProduct.name}
              width={200}
              height={200}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>

          {/* Product name */}
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {drawerProduct.name}
          </h3>

          {/* Description */}
          {drawerProduct.description && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.5, marginBottom: "20px", maxWidth: "320px" }}>
              {drawerProduct.description}
            </p>
          )}

          {/* Ingredients */}
          {drawerProduct.ingredients && drawerProduct.ingredients.length > 0 && (
            <div className="w-full" style={{ maxWidth: "340px", marginBottom: "24px" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-faint)", textAlign: "center", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Ingredientes
              </p>
              <div className="flex flex-wrap justify-center" style={{ gap: "6px" }}>
                {drawerProduct.ingredients.map((ing) => (
                  <span
                    key={ing}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "50px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#C8943E" }}>
              {formatPrice(drawerProduct.price)}
            </span>
          </div>

          {/* Extras */}
          <div className="w-full" style={{ maxWidth: "340px" }}>
            {extras.length > 0 && (
              <>
                <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>
                  Extras
                </h4>
                <div className="flex flex-col gap-2.5" style={{ marginBottom: "24px" }}>
                  {extras.map((ext) => {
                    const active = selectedExtras.includes(ext.id);
                    return (
                      <button
                        key={ext.id}
                        onClick={() => toggleExtra(ext.id)}
                        className="flex items-center justify-between"
                        style={{
                          padding: "12px 16px",
                          background: active ? "rgba(123,0,28,0.15)" : "var(--bg-elevated)",
                          border: `1px solid ${active ? "rgba(123,0,28,0.4)" : "var(--border-subtle)"}`,
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                          {ext.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "0.8rem", color: "#C8943E" }}>+{formatPrice(ext.price)}</span>
                          <span style={{
                            width: "18px", height: "18px", borderRadius: "5px",
                            background: active ? "#7B001C" : "var(--bg-elevated)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.65rem", fontWeight: 700, color: "white",
                          }}>
                            {active ? "✓" : ""}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Observações */}
            <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>
              Observações
            </h4>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Ex: sem cebola, bem passado..."
              className="w-full"
              style={{
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                resize: "none",
                height: "70px",
                outline: "none",
                fontFamily: "inherit",
                marginBottom: "24px",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-subtle)" }}>
          {/* Quantity + Total centered */}
          <div className="flex items-center justify-center" style={{ gap: "24px", marginBottom: "16px" }}>
            <div className="flex items-center" style={{ gap: "14px" }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Minus size={15} />
              </button>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center"
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Plus size={15} />
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginBottom: "2px" }}>Total</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#C8943E" }}>
                {formatPrice(total)}
              </div>
            </div>
          </div>
          {/* Add to cart button centered */}
          <button ref={addButtonRef} onClick={handleAdd} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "0.9rem" }}>
            Adicionar ao Carrinho
          </button>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
