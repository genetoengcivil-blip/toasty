"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.4) saturate(1.2)" }}
      >
        <source src="/images/toasty.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,6,6,0.3) 0%, rgba(6,6,6,0.1) 40%, rgba(6,6,6,0.7) 80%, var(--bg-page) 100%)",
        }}
      />



      {/* Content */}
      <div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ animation: "fadeInUp 1s ease forwards" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-4"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Image
            src="/images/logo.png"
            alt="TOASTY Logo"
            width={120}
            height={120}
            style={{ borderRadius: "24px", objectFit: "cover", objectPosition: "center 30%" }}
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="leading-none mb-3"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "clamp(4rem, 10vw, 9rem)",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.03em",
          }}
        >
          TOASTY<span style={{ color: "#C8943E", fontSize: "0.4em", verticalAlign: "super" }}>®</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-10"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 300,
            letterSpacing: "0.5px",
          }}
        >
          Feito para você voltar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
          style={{ padding: "0 8px" }}
        >
          <a href="#salgados" className="btn-primary" style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", padding: "clamp(14px, 3vw, 18px) clamp(24px, 5vw, 40px)" }}>
            Pedir Agora
          </a>
          <a
            href="#salgados"
            className="btn-outline"
            style={{
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              padding: "clamp(13px, 3vw, 17px) clamp(22px, 5vw, 38px)",
              color: "white",
              borderColor: "rgba(255,255,255,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8943E";
              e.currentTarget.style.color = "#C8943E";
              e.currentTarget.style.background = "rgba(200,148,62,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Explorar Cardápio
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center justify-center gap-2"
          style={{ marginTop: "32px" }}
        >
          <Clock size={14} style={{ color: "#C8943E" }} />
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            Entrega estimada em <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>30–45 min</span>
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: "40px",
          transform: "translateX(-50%)",
          animation: "float 2.5s ease-in-out infinite",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </div>
    </section>
  );
}
