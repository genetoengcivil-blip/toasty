import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🍞</div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "2rem", color: "var(--text-primary)", marginBottom: "12px" }}>
          404
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "24px" }}>
          Essa página não existe ou foi removida.
        </p>
        <Link href="/" style={{ display: "inline-block", padding: "14px 32px", fontSize: "0.9rem", background: "#7B001C", color: "white", borderRadius: "50px", fontWeight: 700, textDecoration: "none" }}>
          Voltar ao Cardápio
        </Link>
      </div>
    </div>
  );
}