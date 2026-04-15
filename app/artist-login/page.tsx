"use client";
import { useState } from "react";
import Link from "next/link";

export default function ArtistLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      window.location.href = "/artist-dashboard";
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ color: "#7C3AED", fontWeight: 900, fontSize: "28px", margin: "0 0 8px" }}>🎨 Serviko</p>
          </Link>
          <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 8px" }}>Artist Login</h1>
          <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>Welcome back! Login to manage your bookings</p>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
            <input type="email" placeholder="maria@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
          </div>

          {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading}
            style={{ background: loading ? "#ccc" : "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
            {loading ? "Logging in..." : "Login as Artist 🎨"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
            <Link href="/artist-login#" style={{ color: "#7C3AED", textDecoration: "none" }}>Forgot password?</Link>
            <Link href="/register/artist" style={{ color: "#7C3AED", textDecoration: "none" }}>Register as Artist</Link>
          </div>

          <div style={{ borderTop: "1px solid #EDE9FE", paddingTop: "16px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 12px" }}>Are you a customer?</p>
            <Link href="/sign-in" style={{ display: "block", background: "#FFF0F6", color: "#E61D72", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
              Customer Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}