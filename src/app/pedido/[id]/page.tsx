"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChefHat, Bike, Package, Clock, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/components/AuthProvider";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/store/cart";

type OrderStage = "received" | "preparing" | "delivering" | "delivered";

const stages = [
  { id: "received" as OrderStage, label: "Recebido", icon: Package, time: "0–5 min" },
  { id: "preparing" as OrderStage, label: "Preparando", icon: ChefHat, time: "5–20 min" },
  { id: "delivering" as OrderStage, label: "Saiu", icon: Bike, time: "20–35 min" },
  { id: "delivered" as OrderStage, label: "Entregue", icon: Check, time: "35+ min" },
];

function stageIndex(stage: OrderStage) {
  return stages.findIndex((s) => s.id === stage);
}

export default function OrderStatusPage() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState<OrderStage>("received");

  const orderId = params.id as string;

  useEffect(() => {
    if (!user) return;

    supabase
      .from("orders")
      .select("id, items, total, created_at, status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const o: Order = {
            id: data.id,
            items: data.items,
            total: data.total,
            date: data.created_at,
            status: data.status,
          };
          setOrder(o);
          setCurrentStage(data.status as OrderStage);
        }
        setLoading(false);
      });
  }, [user, orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-faint)" }}>Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "var(--text-muted)" }}>Pedido não encontrado</p>
        <Link href="/pedidos" className="btn-primary" style={{ padding: "14px 32px", textDecoration: "none" }}>
          Meus Pedidos
        </Link>
      </div>
    );
  }

  const currentIdx = stageIndex(currentStage);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/pedidos" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: "640px", margin: "0 auto" }}>
        {/* Order title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: "2rem", color: "var(--text-primary)", marginBottom: "4px" }}>
            Pedido #{order.id.slice(0, 8)}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {new Date(order.date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </motion.div>

        {/* Stage timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            margin: "32px 0",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "20px",
            padding: "28px 20px",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "24px", textAlign: "center" }}>
            Acompanhe seu pedido
          </h2>

          {/* Stage indicator */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
            {/* Line connecting dots */}
            <div style={{ position: "absolute", top: "20px", left: "24px", right: "24px", height: "2px", background: "var(--border-light)" }} />
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "24px",
                height: "2px",
                background: "#C8943E",
                width: `${(currentIdx / (stages.length - 1)) * 100}%`,
                transition: "width 0.8s ease",
              }}
            />

            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={stage.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: done ? "#C8943E" : "var(--bg-elevated)",
                      border: done ? "none" : "2px solid var(--border-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                      boxShadow: active ? "0 0 20px rgba(200,148,62,0.6)" : done ? "0 4px 12px rgba(200,148,62,0.3)" : "none",
                      animation: active ? "stagePulse 1.5s ease-in-out infinite" : "none",
                    }}
                  >
                    <Icon size={18} color={done ? "white" : "var(--text-faint)"} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: done ? "#C8943E" : "var(--text-faint)", marginBottom: "2px" }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-faint)" }}>
                      {stage.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current stage message */}
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: currentStage === "delivered"
                ? "rgba(34,197,94,0.1)"
                : "rgba(200,148,62,0.08)",
              border: `1px solid ${currentStage === "delivered" ? "rgba(34,197,94,0.2)" : "rgba(200,148,62,0.15)"}`,
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p style={{ color: currentStage === "delivered" ? "#86efac" : "#E0B860", fontWeight: 700, fontSize: "0.95rem" }}>
              {currentStage === "received" && "Seu pedido foi recebido e está na fila!"}
              {currentStage === "preparing" && "Estamos preparando seu pedido com carinho 🍳"}
              {currentStage === "delivering" && "Seu pedido saiu! Chegará em breve 🛵"}
              {currentStage === "delivered" && "Pedido entregue! Bom apetite! 🎉"}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
              Entrega estimada: 30–45 min
            </p>
          </div>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "16px" }}>
            Resumo do pedido
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "1.4rem" }}>{item.emoji}</span>
                  <div>
                    <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                      {item.quantity}x {item.name}
                    </div>
                    {item.extras.length > 0 && (
                      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        {item.extras.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <span style={{ color: "#C8943E", fontWeight: 700, fontSize: "0.9rem" }}>
                  {formatPrice((item.price + item.extrasPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "16px", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
            <span style={{ fontWeight: 800, color: "#C8943E", fontSize: "1.2rem" }}>{formatPrice(order.total)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}