"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Lucas M.",
    text: "O melhor toast que eu já comi. O pão é incrível e o recheio sempre generoso.",
    rating: 5,
  },
  {
    name: "Ana R.",
    text: "Pedi pelo iFood e veio perfeito. Quente, crocante e com muito sabor. Peço toda semana.",
    rating: 5,
  },
  {
    name: "Felipe S.",
    text: "A combo vale muito a pena. O atendimento é ótimo e a entrega é rápida.",
    rating: 5,
  },
];

export default function Depoimentos() {
  return (
    <section id="depoimentos" style={{ padding: "48px 16px 60px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <span style={{ fontSize: "3rem" }}>🔥</span>
        <h2 className="section-heading" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
          Depoimentos
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "450px", margin: "0 auto 20px" }}>
          O que nossos clientes dizem.
        </p>
        <div className="section-divider" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "20px",
              padding: "clamp(20px, 4vw, 32px)",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "12px", color: "#C8943E", fontSize: "1.1rem", letterSpacing: "2px" }}>
              ★★★★★
            </div>
            <p
              style={{
                fontStyle: "italic",
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: "16px",
              }}
            >
              &ldquo;{review.text}&rdquo;
            </p>
            <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
              — {review.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
