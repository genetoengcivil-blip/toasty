"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Award, RotateCcw, Star, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

interface Stats {
  totalOrders: number;
  favoriteItem: { name: string; count: number; image: string } | null;
  totalItems: number;
}

function computeStats(orders: Order[]): Stats {
  if (orders.length === 0) {
    return { totalOrders: 0, favoriteItem: null, totalItems: 0 };
  }

  const totalItems = orders.reduce(
    (acc, o) => acc + o.items.reduce((a, i) => a + i.quantity, 0),
    0
  );

  const itemCounts: Record<string, { name: string; count: number; image: string }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = item.id;
      if (itemCounts[key]) {
        itemCounts[key].count += item.quantity;
      } else {
        itemCounts[key] = { name: item.name, count: item.quantity, image: item.image };
      }
    }
  }

  const sorted = Object.values(itemCounts).sort((a, b) => b.count - a.count);
  const favoriteItem = sorted.length > 0 ? sorted[0] : null;

  return { totalOrders: orders.length, favoriteItem, totalItems };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, favoriteItem: null, totalItems: 0 });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [submittedRatings, setSubmittedRatings] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    const userId = user.id;

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const parsed: Order[] = (data || []).map((o) => ({
          id: o.id,
          items: o.items,
          total: o.total,
          date: o.created_at,
        }));
        setOrders(parsed);
        setStats(computeStats(parsed));
        setLoading(false);
        setMounted(true);
      });
  }, [user, authLoading]);

  // Load existing reviews
  useEffect(() => {
    if (!user) return;
    supabase
      .from("reviews")
      .select("order_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSubmittedRatings(new Set(data.map((r: { order_id: string }) => r.order_id)));
      });
  }, [user]);

  const handleSubmitRating = async () => {
    if (!user || !ratingOrderId || ratingValue === 0) return;
    setRatingSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      order_id: ratingOrderId,
      user_id: user.id,
      rating: ratingValue,
      comment: ratingComment,
    });
    setRatingSubmitting(false);
    if (!error) {
      setSubmittedRatings((prev) => new Set([...prev, ratingOrderId]));
      setRatingOrderId(null);
      setRatingValue(0);
      setRatingComment("");
      showToast("Obrigado pela avaliação! 🌟");
    }
  };

  const handleReorder = (order: Order) => {
    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          description: item.description,
          ingredients: item.ingredients,
          price: item.price,
          image: item.image,
          emoji: item.emoji,
          badge: item.badge,
          tag: item.tag,
        });
      }
    }
    openCart();
    showToast("Itens adicionados ao carrinho!");
  };

  if (!mounted || authLoading) {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--text-faint)", fontSize: "1rem" }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <div style={{ padding: "20px 16px", maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
            }}
          >
            Meus Pedidos
          </h1>
          <Link
            href="/perfil"
            style={{
              padding: "8px 16px",
              borderRadius: "50px",
              border: "1px solid rgba(200,148,62,0.25)",
              background: "rgba(200,148,62,0.08)",
              color: "#C8943E",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Editar Perfil
          </Link>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "32px" }}>
          Olá, {user?.user_metadata?.full_name || user?.email}
        </p>
        <div className="section-divider" style={{ margin: "0 0 40px" }} />
      </div>

      <div style={{ padding: "0 16px", maxWidth: "800px", margin: "0 auto" }}>
        {stats.totalOrders === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "60px 24px",
              background: "var(--bg-card)",
              borderRadius: "20px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <ShoppingBag size={48} style={{ color: "var(--text-faint)", margin: "0 auto 20px" }} />
            <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Nenhum pedido ainda
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
              Seus pedidos aparecerão aqui depois que você finalizar.
            </p>
            <Link href="/#salgados" className="btn-primary" style={{ padding: "14px 32px", fontSize: "0.9rem" }}>
              Ver Cardápio
            </Link>
          </motion.div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "32px" }}>
              {[
                { label: "Pedidos", value: stats.totalOrders.toString(), icon: <ShoppingBag size={20} /> },
                { label: "Itens Pedidos", value: stats.totalItems.toString(), icon: <Award size={20} /> },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "16px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#C8943E", marginBottom: "8px", display: "flex", justifyContent: "center" }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {stats.favoriteItem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: "linear-gradient(135deg, rgba(123,0,28,0.15), rgba(123,0,28,0.05))",
                  border: "1px solid rgba(123,0,28,0.2)",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", overflow: "hidden", background: "var(--bg-elevated)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src={stats.favoriteItem.image} alt={stats.favoriteItem.name} width={56} height={56} style={{ objectFit: "contain" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#E0B860", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    Seu favorito
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {stats.favoriteItem.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Pedido {stats.favoriteItem.count}x
                  </div>
                </div>
              </motion.div>
            )}

            <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "16px" }}>
              Histórico
            </h3>

            <div className="flex flex-col" style={{ gap: "12px", paddingBottom: "40px" }}>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-faint)" }}>
                      {formatDate(order.date)}
                    </span>
                    <span style={{ fontWeight: 800, color: "#C8943E", fontSize: "1rem" }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex flex-col" style={{ gap: "6px", marginBottom: "12px" }}>
                    {order.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-elevated)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Image src={item.image} alt={item.name} width={32} height={32} style={{ objectFit: "contain" }} />
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", flex: 1 }}>
                          {item.quantity}x {item.name}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {formatPrice((item.price + item.extrasPrice) * item.quantity)}
                        </span>
                      </div>
                    ))}
</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleReorder(order)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid rgba(200,148,62,0.2)",
                        background: "rgba(200,148,62,0.06)",
                        color: "#C8943E",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s",
                      }}
                    >
                      <RotateCcw size={14} />
                      Refazer
                    </button>
                    <button
                      onClick={() => setRatingOrderId(order.id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid rgba(200,148,62,0.2)",
                        background: "rgba(200,148,62,0.06)",
                        color: "#C8943E",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Star size={14} />
                      {submittedRatings.has(order.id) ? "Avaliado" : "Avaliar"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingOrderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setRatingOrderId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "20px",
                padding: "28px",
                maxWidth: "400px",
                width: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>
                  Avalie seu pedido
                </h3>
                <button onClick={() => setRatingOrderId(null)} style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              {/* Stars */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingValue(star)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                  >
                    <Star
                      size={32}
                      fill={star <= ratingValue ? "#C8943E" : "none"}
                      color={star <= ratingValue ? "#C8943E" : "var(--text-faint)"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Deixe um comentário (opcional)..."
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  resize: "none",
                  height: "80px",
                  outline: "none",
                  marginBottom: "16px",
                }}
              />

              <button
                onClick={handleSubmitRating}
                disabled={ratingValue === 0 || ratingSubmitting}
                className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "0.9rem", opacity: ratingValue === 0 ? 0.5 : 1, pointerEvents: ratingValue === 0 ? "none" : "auto" }}
              >
                {ratingSubmitting ? "Enviando..." : "Enviar Avaliação"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
