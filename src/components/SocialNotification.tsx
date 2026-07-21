"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const fakeOrders = [
  { name: "Carolina S.", item: "Toasty Carne", emoji: "🥩" },
  { name: "Rafael M.", item: "Combo Duplo", emoji: "🔥" },
  { name: "Juliana P.", item: "Toasty Chicken", emoji: "🍗" },
  { name: "Lucas R.", item: "Tropical Passion", emoji: "🥭" },
  { name: "Fernanda L.", item: "Combo Família", emoji: "👑" },
  { name: "Pedro H.", item: "Toasty Calabresa", emoji: "🌶️" },
  { name: "Amanda B.", item: "Red Berry Soda", emoji: "🍓" },
  { name: "Bruno T.", item: "Batata Rústica", emoji: "🥔" },
  { name: "Camila D.", item: "Toasty Queijo", emoji: "🧀" },
  { name: "Gustavo A.", item: "Combo Clássico", emoji: "✨" },
  { name: "Isabela N.", item: "Onion Rings", emoji: "🧅" },
  { name: "Thiago F.", item: "Citrus Fresh", emoji: "🍋" },
];

export default function SocialNotification() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<typeof fakeOrders[number] | null>(null);
  const [used, setUsed] = useState<Set<number>>(new Set());

  const showNotification = () => {
    const available = fakeOrders
      .map((o, i) => ({ o, i }))
      .filter(({ i }) => !used.has(i));
    if (available.length === 0) return;

    const pick = available[Math.floor(Math.random() * available.length)];
    setUsed((prev) => new Set([...prev, pick.i]));
    setCurrent(pick.o);
    setVisible(true);

    setTimeout(() => setVisible(false), 4000);
  };

  useEffect(() => {
    // First notification after 15s, then every 45-90s
    const initial = setTimeout(showNotification, 15000);
    let running = true;

    const scheduleNext = () => {
      if (!running) return;
      const delay = 45000 + Math.random() * 45000;
      const t = setTimeout(() => {
        showNotification();
        scheduleNext();
      }, delay);
      return t;
    };

    const t = scheduleNext();

    return () => {
      running = false;
      clearTimeout(initial);
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          key={current.name}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            zIndex: 120,
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "300px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,148,62,0.15)",
            cursor: "default",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(200,148,62,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            {current.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.82rem", lineHeight: 1.3 }}>
              <span style={{ color: "#C8943E" }}>{current.name}</span>{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>acabou de fazer um pedido</span>
            </p>
            <p style={{ color: "var(--text-faint)", fontSize: "0.72rem", marginTop: "1px" }}>
              {current.item}
            </p>
          </div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              animation: "socialPulse 2s ease-in-out infinite",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}