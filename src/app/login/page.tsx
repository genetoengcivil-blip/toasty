"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCEP] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCEPLoading] = useState(false);

  const handleCEPLookup = useCallback(async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCEPLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
      }
    } catch {
      // ignore
    } finally {
      setCEPLoading(false);
    }
  }, []);

  if (user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>Você já está logado.</p>
          <Link href="/pedidos" className="btn-primary" style={{ padding: "14px 32px", fontSize: "0.9rem" }}>
            Ver Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const phoneDigits = phone.replace(/\D/g, "");
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phoneDigits,
            cep: cep.replace(/\D/g, ""),
            address,
            neighborhood,
            city,
          },
        },
      });

      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: name,
          phone: phoneDigits,
          cep: cep.replace(/\D/g, ""),
          address,
          neighborhood,
          city,
          email,
        });
      }

      alert("Conta criada! Verifique seu email para confirmar.");
      router.push("/pedidos");
    } else {
      const result = await signIn(email, password);
      setLoading(false);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/pedidos");
      }
    }
  };

  const inputStyle = {
    padding: "14px 14px 14px 42px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    color: "var(--text-primary)" as const,
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
    width: "100%" as const,
  };

  const iconStyle = {
    position: "absolute" as const,
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-faint)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "32px",
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image src="/images/logo.png" alt="TOASTY" width={80} height={80} style={{ borderRadius: "16px", marginBottom: "20px", display: "block", margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "8px" }}>
            {isSignUp ? "Criar Conta" : "Entrar"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {isSignUp ? "Preencha seus dados para entrega." : "Acesse seus pedidos e favoritos."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={iconStyle} />
                    <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={iconStyle} />
                    <input
                      type="tel"
                      placeholder="Telefone (WhatsApp)"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} style={iconStyle} />
                    <input
                      type="text"
                      placeholder="CEP"
                      value={cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        setCEP(formatted);
                        handleCEPLookup(formatted);
                      }}
                      required
                      style={inputStyle}
                    />
                    {cepLoading && (
                      <span
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                        }}
                      >
                        <Loader2
                          size={16}
                          style={{ color: "#C8943E", animation: "spinOnly 1s linear infinite" }}
                        />
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} style={iconStyle} />
                    <input type="text" placeholder="Endereço completo" value={address} onChange={(e) => setAddress(e.target.value)} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Building2 size={16} style={iconStyle} />
                    <input type="text" placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required style={inputStyle} />
                  </div>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Building2 size={16} style={iconStyle} />
                    <input type="text" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} required style={inputStyle} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: "14px" }}>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={iconStyle} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ ...inputStyle, paddingRight: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-faint)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "10px 14px",
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                borderRadius: "10px",
                color: "#fca5a5",
                fontSize: "0.8rem",
                marginBottom: "16px",
              }}
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            style={{
              padding: "15px",
              fontSize: "0.9rem",
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            {loading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
