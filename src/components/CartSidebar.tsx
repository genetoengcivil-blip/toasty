"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, LogIn, Clock, AlertTriangle, MapPin, Edit2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase-client";
import Link from "next/link";

const WHATSAPP_NUMBER = "5583986667292";
const MIN_ORDER = 25;

function buildWhatsAppMessage(items: CartItem[], total: number, address?: string, neighborhood?: string): string {
  let msg = "🍽 *Pedido TOASTY*\n\n";

  items.forEach((item) => {
    const unitPrice = item.price + item.extrasPrice;
    const itemTotal = unitPrice * item.quantity;

    msg += `${item.quantity}x *${item.name}*\n`;
    msg += `   ${formatPrice(unitPrice)} cada\n`;
    msg += `   Subtotal: ${formatPrice(itemTotal)}\n`;

    if (item.extras.length > 0) {
      msg += `   Extras: ${item.extras.join(", ")}\n`;
    }
    if (item.obs) {
      msg += `   Obs: ${item.obs}\n`;
    }
    msg += "\n";
  });

msg += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;
  if (address) {
    msg += `📍 *Entrega para:* ${address}${neighborhood ? `, ${neighborhood}` : ""}\n\n`;
  }
  msg += `📍 Entrega estimada: 30–45 min\n`;
  msg += "Aguardo confirmação. Obrigado! 🙏";
  return msg;
}

export default function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, total, saveOrder } = useCartStore();
  const { user } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("");
  const snapshotRef = useRef<{ items: CartItem[]; total: number }>({ items: [], total: 0 });

  const handleWhatsApp = useCallback(() => {
    const { items: snapItems, total: snapTotal } = snapshotRef.current;
    const message = buildWhatsAppMessage(snapItems, snapTotal, deliveryAddress, deliveryNeighborhood);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  }, [deliveryAddress, deliveryNeighborhood]);

  const handleConfirm = async () => {
    if (!user || confirming) return;
    setConfirming(true);
    snapshotRef.current = { items: [...items], total: total() };
    await saveOrder(user.id);
    setConfirmed(true);
    setConfirming(false);
  };

  // Load saved address from profile
  useEffect(() => {
    if (!user || deliveryAddress) return;
    supabase
      .from("profiles")
      .select("address, neighborhood")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.address) setDeliveryAddress(data.address);
        if (data?.neighborhood) setDeliveryNeighborhood(data.neighborhood);
      });
  }, [user]);

  const handleAddressSave = async () => {
    if (user && deliveryAddress) {
      await supabase
        .from("profiles")
        .update({ address: deliveryAddress, neighborhood: deliveryNeighborhood })
        .eq("id", user.id);
    }
    setShowAddressForm(false);
  };

  const handleClose = () => {
    setConfirmed(false);
    snapshotRef.current = { items: [], total: 0 };
    toggleCart();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const displayItems = confirmed ? snapshotRef.current.items : items;
  const displayTotal = confirmed ? snapshotRef.current.total : total();
  const belowMinimum = !confirmed && items.length > 0 && displayTotal < MIN_ORDER;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 70 }}
          />
          <motion.div
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 flex flex-col overflow-hidden"
            style={{ width: "420px", maxWidth: "92vw", background: "var(--bg-page)", borderLeft: "1px solid var(--border-subtle)", zIndex: 80 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="TOASTY"
                  width={36}
                  height={36}
                  style={{ borderRadius: "8px" }}
                />
                <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                  {confirmed ? "Pedido Confirmado" : "Seu Pedido"}
                </span>
              </div>
              <button onClick={handleClose} style={{ background: "var(--bg-elevated)", border: "none", borderRadius: "50%", padding: "12px", cursor: "pointer", color: "var(--text-secondary)", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>

            {/* Delivery estimate */}
            {!confirmed && items.length > 0 && (
              <div style={{ padding: "10px 24px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Clock size={13} style={{ color: "#C8943E" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Entrega estimada: <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>30–45 min</span>
                </span>
              </div>
            )}

            {/* Items or Confirmation */}
            <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>
              {confirmed ? (
                <div className="flex flex-col items-center justify-center" style={{ height: "100%", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "12px" }}>
                    Pedido Confirmado!
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "6px" }}>
                    {snapshotRef.current.items.length} {snapshotRef.current.items.length === 1 ? "item" : "itens"} no pedido
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "8px" }}>
                    Total: <span style={{ color: "#C8943E", fontWeight: 700 }}>{formatPrice(snapshotRef.current.total)}</span>
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
                    <Clock size={13} style={{ color: "var(--text-faint)" }} />
                    <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>
                      Entrega em 30–45 min
                    </p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="btn-primary"
                    style={{ padding: "16px 40px", fontSize: "0.95rem", background: "#25D366" }}
                  >
                    Finalizar no WhatsApp
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center" style={{ padding: "40px 0", color: "var(--text-faint)" }}>
                  <ShoppingBag size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                  <p style={{ fontSize: "1rem" }}>Seu carrinho está vazio.</p>
                  <p style={{ fontSize: "0.8rem", marginTop: "8px" }}>Adicione itens do cardápio.</p>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: "12px" }}>
                  <AnimatePresence initial={false}>
                    {items.map((item, idx) => (
                      <motion.div
                        key={`${item.id}-${idx}`}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "14px",
                          padding: "14px",
                        }}
                      >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-start flex-1">
                          <div className="flex-shrink-0" style={{ width: "64px", height: "64px", borderRadius: "12px", overflow: "hidden", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{item.name}</h4>
                            {item.extras.length > 0 && (
                              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "3px" }}>
                                Extras: {item.extras.join(", ")}
                              </p>
                            )}
                            {item.obs && (
                              <p style={{ fontSize: "0.7rem", color: "rgba(200,148,62,0.6)", marginTop: "2px", fontStyle: "italic" }}>
                                Obs: {item.obs}
                              </p>
                            )}
                            <div className="flex items-center" style={{ gap: "10px", marginTop: "8px" }}>
                              <button
                                onClick={() => updateQuantity(idx, item.quantity - 1)}
                                className="flex items-center justify-center"
                                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <Minus size={12} />
                              </button>
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(idx, item.quantity + 1)}
                                className="flex items-center justify-center"
                                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: "#C8943E", fontSize: "0.95rem" }}>
                            {formatPrice((item.price + item.extrasPrice) * item.quantity)}
                          </div>
                          <button
                            onClick={() => removeItem(idx)}
                            style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", marginTop: "6px", padding: "8px", minWidth: "36px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {displayItems.length > 0 && !confirmed && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-subtle)" }}>
                {belowMinimum && (
                  <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: "10px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertTriangle size={14} style={{ color: "#eab308", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Pedido mínimo: {formatPrice(MIN_ORDER)}. Faltam {formatPrice(MIN_ORDER - displayTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between" style={{ marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>Total</span>
                  <span style={{ fontWeight: 800, color: "#C8943E", fontSize: "1.15rem" }}>{formatPrice(displayTotal)}</span>
                </div>

                {/* Address selector */}
                {user && (
                  <div style={{ marginBottom: "12px", padding: "12px", background: "var(--bg-elevated)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                    {showAddressForm ? (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem" }}>Endereço de entrega</span>
                          <button onClick={handleAddressSave} style={{ background: "none", border: "none", color: "#C8943E", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Salvar</button>
                        </div>
                        <input
                          type="text"
                          placeholder="Endereço completo"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.82rem", fontFamily: "inherit", outline: "none", marginBottom: "8px" }}
                        />
                        <input
                          type="text"
                          placeholder="Bairro"
                          value={deliveryNeighborhood}
                          onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)", fontSize: "0.82rem", fontFamily: "inherit", outline: "none" }}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <MapPin size={14} style={{ color: "#C8943E", flexShrink: 0 }} />
                            <div>
                              {deliveryAddress ? (
                                <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                  {deliveryAddress}{deliveryNeighborhood ? `, ${deliveryNeighborhood}` : ""}
                                </p>
                              ) : (
                                <p style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>Sem endereço salvo</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowAddressForm(true)}
                            style={{ background: "none", border: "none", color: "#C8943E", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
                          >
                            <Edit2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {user ? (
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "16px",
                      fontSize: "0.95rem",
                      opacity: belowMinimum || confirming ? 0.5 : 1,
                      pointerEvents: belowMinimum || confirming ? "none" : "auto",
                    }}
                  >
                    {confirming ? "Confirmando..." : "Finalizar Pedido"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="btn-primary"
                    style={{ width: "100%", padding: "16px", fontSize: "0.95rem", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    <LogIn size={18} />
                    Faça login para finalizar
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
