export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-card)", margin: "0 auto 16px", animation: "shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ width: "120px", height: "12px", borderRadius: "6px", background: "var(--bg-card)", margin: "0 auto", animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}