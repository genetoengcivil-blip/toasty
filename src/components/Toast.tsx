"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

interface Toast {
  id: number;
  message: string;
  image?: string;
}

interface ToastContextType {
  showToast: (message: string, image?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = useRef(0);

  const showToast = useCallback((message: string, image?: string) => {
    const id = ++nextIdRef.current;
    setToasts((prev) => [...prev, { id, message, image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: "100px", left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", pointerEvents: "none" }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(200,148,62,0.25)",
                borderRadius: "50px",
                padding: toast.image ? "6px 18px 6px 6px" : "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {toast.image ? (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  <Image src={toast.image} alt="" fill sizes="32px" style={{ objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={13} color="white" strokeWidth={3} />
                </div>
              )}
              <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}