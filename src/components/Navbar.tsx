"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, LogOut, UserCircle, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Salgados", href: "#salgados" },
  { label: "Doces", href: "#doces" },
  { label: "Veggie", href: "#veggie" },
  { label: "Acompanhamentos", href: "#acompanhamentos" },
  { label: "Bebidas", href: "#bebidas" },
];

function usePrev<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  const prev = ref.current;
  ref.current = value;
  return prev;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { toggleCart, itemCount } = useCartStore();
  const { user, signOut } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const count = itemCount();
  const prevCount = usePrev(count);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (count > (prevCount ?? 0)) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [count, prevCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navColor = "var(--text-secondary)";
  const navColorHover = "#E0B860";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass" : ""
        }`}
        style={{ padding: scrolled ? "12px 0" : "20px 0" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-2 no-underline">
            <Image
              src="/images/logo.png"
              alt="TOASTY"
              width={40}
              height={40}
              style={{ borderRadius: "8px" }}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              TOASTY
            </span>
            <span style={{ color: "#C8943E", fontWeight: 700, fontSize: "0.9rem" }}>
              ®
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="no-underline transition-colors duration-300"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: navColor,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = navColorHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = navColor)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/pedidos"
              className="no-underline transition-colors duration-300"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: navColor,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = navColorHover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = navColor)}
            >
              Meus Pedidos
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-transparent border-none cursor-pointer"
              style={{ color: navColor }}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleCart}
              className="relative p-2.5 bg-transparent border-none cursor-pointer transition-transform duration-300"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {count > 0 && hydrated && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: badgePulse ? [1, 1.5, 1] : 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute flex items-center justify-center"
                  style={{
                    top: "-2px",
                    right: "-2px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#7B001C",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(123,0,28,0.5)",
                  }}
                >
                  {count}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  href="/perfil"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(200,148,62,0.15)",
                    border: "1px solid rgba(200,148,62,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C8943E",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                  title="Meu Perfil"
                >
                  {(user.user_metadata?.full_name || user.email || "?")[0].toUpperCase()}
                </Link>
                <button
                  onClick={signOut}
                  className="bg-transparent border-none cursor-pointer"
                  style={{ color: "var(--text-muted)", padding: "6px", display: "flex", alignItems: "center" }}
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 no-underline"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: navColor,
                  padding: "6px 14px",
                  borderRadius: "50px",
                  border: "1px solid var(--border-light)",
                  transition: "all 0.3s",
                }}
              >
                <User size={14} />
                Entrar
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-transparent border-none cursor-pointer"
              style={{ color: navColor }}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{
              background: "var(--bg-page)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-center justify-between px-6 h-16">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="TOASTY"
                  width={32}
                  height={32}
                  style={{ borderRadius: "6px" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  TOASTY
                </span>
                <span style={{ color: "#C8943E", fontSize: "0.8rem" }}>®</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 bg-transparent border-none cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium no-underline py-3 px-8 rounded-xl transition-all w-64 text-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
              >
                <Link
                  href="/pedidos"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium no-underline py-3 px-8 rounded-xl transition-all w-64 text-center block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Meus Pedidos
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.06 }}
              >
                {user ? (
                  <div className="flex flex-col items-center gap-3">
                    <Link
                      href="/perfil"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(200,148,62,0.15)",
                        border: "1px solid rgba(200,148,62,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C8943E",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {(user.user_metadata?.full_name || user.email || "?")[0].toUpperCase()}
                    </Link>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <Link
                      href="/perfil"
                      onClick={() => setMobileOpen(false)}
                      style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                    >
                      <UserCircle size={14} />
                      Editar Perfil
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="bg-transparent border-none cursor-pointer"
                      style={{ color: "var(--text-faint)", fontSize: "0.85rem", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 no-underline"
                    style={{ color: "var(--text-secondary)", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "12px", border: "1px solid var(--border-light)" }}
                  >
                    <User size={18} />
                    Entrar
                  </Link>
                )}
              </motion.div>
            </div>
            <div className="p-6 text-center flex flex-col items-center gap-3">
              <button
                onClick={toggleTheme}
                className="bg-transparent border-none cursor-pointer flex items-center gap-2"
                style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "8px 16px" }}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </button>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Feito para você voltar.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
