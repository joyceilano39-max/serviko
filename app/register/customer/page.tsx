"use client";
import { useState } from "react";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", address: "", birthdate: "" });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          clerkId: null,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF0F6 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontWeight: 900, color: "#E61D72", margin: "0 0 8px" }}>Welcome to Serviko!</h1>
          <p style={{ color: "#888", margin: "0 0 24px" }}>Your account has been created successfully!</p>
          <div style={{ background: "#FFF0F6", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px", color: "#E61D72" }}>🎁 Welcome Gift!</p>
            <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>Use code <strong>FIRST50</strong> for ₱50 off your first booking!</p>
          </div>
          <Link href="/booking" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "15px", marginBottom: "12px" }}>
            Book a Service Now →
          </Link>
          <Link href="/dashboard" style={{ display: "block", background: "#f0f0f0", color: "#555", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF0F6 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link href="/register" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>← Back</Link>
          <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "24px", margin: "8px 0 4px" }}>🌸 Serviko</p>
          <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px" }}>Create Customer Account</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Book beauty & wellness services near you</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: "4px", borderRadius: "4px", background: s <= step ? "#E61D72" : "#FFD6E7" }} />
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Step 1 — Personal Info</h3>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Joyce Ilano" },
                { label: "Email", key: "email", type: "email", placeholder: "joyce@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "09XX XXX XXXX" },
                { label: "Password", key: "password", type: "password", placeholder: "Create a strong password" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder}
                    value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <button onClick={() => {
                if (!form.name || !form.email || !form.phone) { setError("Please fill in all fields."); return; }
                setError(""); setStep(2);
              }} style={{ background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                Continue →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Step 2 — Additional Info</h3>
              {[
                { label: "Home Address", key: "address", type: "text", placeholder: "e.g. Quezon City, Metro Manila" },
                { label: "Birthdate", key: "birthdate", type: "date", placeholder: "" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder}
                    value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "16px", fontSize: "13px" }}>
                <p style={{ fontWeight: 600, margin: "0 0 4px", color: "#E61D72" }}>🎁 Welcome Gift!</p>
                <p style={{ margin: 0, color: "#555" }}>Get <strong>₱50 OFF</strong> your first booking!</p>
              </div>
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ flex: 2, background: loading ? "#ccc" : "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                  {loading ? "Creating Account..." : "Create Account 🎉"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "16px" }}>
          Already have an account?{" "}
          <Link href="/sign-in" style={{ color: "#E61D72", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
