"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div className="flex items-center justify-center gap-2" style={{ marginBottom: "12px" }}>
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
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--text-secondary)",
          }}
        >
          TOASTY<span style={{ color: "#C8943E" }}>®</span>
        </span>
      </div>
      <p style={{ color: "var(--text-faint)", fontSize: "0.8rem", marginBottom: "16px" }}>
        Feito para você voltar.
      </p>
      <Link
        href="/pedidos"
        style={{
          display: "inline-block",
          color: "var(--text-faint)",
          fontSize: "0.7rem",
          textDecoration: "none",
          padding: "6px 14px",
          borderRadius: "50px",
          border: "1px solid var(--border-light)",
          transition: "all 0.3s",
          marginBottom: "16px",
        }}
      >
        Meus Pedidos
      </Link>
      <p style={{ color: "var(--text-faint)", fontSize: "0.7rem", marginTop: "12px" }}>
        © {new Date().getFullYear()} TOASTY. Todos os direitos reservados.
      </p>
    </footer>
  );
}
