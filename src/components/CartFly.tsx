"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";

export default function CartFly() {
  const flyTarget = useCartStore((s) => s.flyTarget);
  const clearFly = useCartStore((s) => s.clearFly);
  const [cartX, setCartX] = useState(900);

  useEffect(() => {
    setCartX(window.innerWidth - 80);
    const handleResize = () => setCartX(window.innerWidth - 80);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (flyTarget) {
      const timer = setTimeout(clearFly, 700);
      return () => clearTimeout(timer);
    }
  }, [flyTarget, clearFly]);

  return (
    <AnimatePresence>
      {flyTarget && (
        <motion.div
          key="fly"
          initial={{
            opacity: 1,
            scale: 1.4,
            x: flyTarget.x,
            y: flyTarget.y,
          }}
          animate={{
            opacity: 0,
            scale: 0.3,
            x: cartX,
            y: 90,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            zIndex: 9999,
            fontSize: "1.8rem",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
            pointerEvents: "none",
            marginTop: "-8px",
          }}
        >
          {flyTarget.emoji}
        </motion.div>
      )}
    </AnimatePresence>
  );
}