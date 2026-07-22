"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, MapPin, Building2, Mail, Loader2, Save, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { formatPhone, formatCEP } from "@/lib/utils";

export default function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCEP] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [cepLoading, setCEPLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.full_name || "");
        setPhone(data.phone ? formatPhone(data.phone) : "");
        setCEP(data.cep ? formatCEP(data.cep) : "");
        setAddress(data.address || "");
        setNeighborhood(data.neighborhood || "");
        setCity(data.city || "");
        setEmail(data.email || user.email || "");
      } else {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || "");
        setPhone(user.user_metadata?.phone ? formatPhone(user.user_metadata.phone) : "");
        setCEP(user.user_metadata?.cep ? formatCEP(user.user_metadata.cep) : "");
        setAddress(user.user_metadata?.address || "");
        setNeighborhood(user.user_metadata?.neighborhood || "");
        setCity(user.user_metadata?.city || "");
      }
      setMounted(true);
    };

    loadProfile();
  }, [user, authLoading]);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const phoneDigits = phone.replace(/\D/g, "");
    const cepDigits = cep.replace(/\D/g, "");

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: name,
        phone: phoneDigits,
        cep: cepDigits,
        address,
        neighborhood,
        city,
        email,
      });

    if (updateError) {
      setError(updateError.message);
    } else {
      await supabase.auth.updateUser({
        data: {
          full_name: name,
          phone: phoneDigits,
          cep: cepDigits,
          address,
          neighborhood,
          city,
        },
      });
      setSuccess("Perfil atualizado!");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Digite a senha atual.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    });
    if (verifyError) {
      setPasswordError("Senha atual incorreta.");
      setSavingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    }
    setSavingPassword(false);
  };

  if (!mounted || authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-faint)", fontSize: "1rem" }}>Carregando...</div>
      </div>
    );
  }

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
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <div style={{ padding: "20px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Meu Perfil
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "32px" }}>
          Atualize seus dados de entrega.
        </p>
        <div className="section-divider" style={{ margin: "0 0 32px" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "20px" }}>
            Dados Pessoais
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <User size={16} style={iconStyle} />
                <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={iconStyle} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={iconStyle} />
                <input type="tel" placeholder="Telefone (WhatsApp)" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required style={inputStyle} />
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
                  <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                    <Loader2 size={16} style={{ color: "#C8943E", animation: "spinOnly 1s linear infinite" }} />
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
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Building2 size={16} style={iconStyle} />
                <input type="text" placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <Building2 size={16} style={iconStyle} />
                <input type="text" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "14px" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: "10px 14px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "10px", color: "#86efac", fontSize: "0.8rem", marginBottom: "14px" }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ width: "100%", padding: "15px", fontSize: "0.9rem", opacity: saving ? 0.6 : 1, pointerEvents: saving ? "none" : "auto" }}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "20px" }}>
            Alterar Senha
          </h3>
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", padding: "4px" }}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ ...inputStyle, paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", padding: "4px" }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div style={{ padding: "10px 14px", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "10px", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "14px" }}>
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div style={{ padding: "10px 14px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "10px", color: "#86efac", fontSize: "0.8rem", marginBottom: "14px" }}>
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-primary"
              style={{ width: "100%", padding: "15px", fontSize: "0.9rem", opacity: savingPassword ? 0.6 : 1, pointerEvents: savingPassword ? "none" : "auto" }}
            >
              {savingPassword ? "Alterando..." : "Alterar Senha"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
