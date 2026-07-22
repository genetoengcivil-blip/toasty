"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-primary)", marginBottom: "12px" }}>
          Algo deu errado
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
          Tente novamente ou volte ao cardápio.
        </p>
        <button onClick={reset} style={{ padding: "14px 32px", fontSize: "0.9rem", background: "#7B001C", color: "white", borderRadius: "50px", fontWeight: 700, border: "none", cursor: "pointer" }}>
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}