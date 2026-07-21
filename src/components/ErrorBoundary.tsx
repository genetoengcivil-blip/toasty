"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{ textAlign: "center" }}>
              <AlertTriangle size={40} style={{ color: "#C8943E", marginBottom: "16px", opacity: 0.6 }} />
              <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "8px" }}>
                Algo deu errado
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "20px" }}>
                Tente novamente mais tarde.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                style={{
                  padding: "10px 24px",
                  borderRadius: "50px",
                  border: "1px solid rgba(200,148,62,0.3)",
                  background: "rgba(200,148,62,0.1)",
                  color: "#C8943E",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <RefreshCcw size={14} />
                Tentar novamente
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
