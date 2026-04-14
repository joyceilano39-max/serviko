"use client";
import { useState } from "react";
import Link from "next/link";

const allServices = ["Haircut & Styling", "Hair Coloring", "Full Body Massage", "Hot Stone Massage", "Facial Treatment", "Manicure & Pedicure", "Lash Extensions", "Eyebrow Threading", "Body Waxing", "Makeup"];

export default function ArtistRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", address: "", bio: "", experience: "", gcash: "" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (s: string) => {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!form.gcash) { setError("Please enter your GCash number."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          bio: form.bio,
          experience: form.experience,
          services: selectedServices,
          gcash: form.gcash,
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
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎨</div>
          <h1 style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px" }}>Welcome to Serviko!</h1>
          <p style={{ color: "#888", margin: "0 0 8px" }}>Your artist account has been created!</p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 24px" }}>Our team will review your profile within 24 hours.</p>
          <div style={{ background: "#F5F3FF", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px", color: "#7C3AED" }}>What's next?</p>
            {["Check your email for confirmation", "Wait for account approval (24hrs)", "Start accepting bookings!"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                <span style={{ color: "#7C3AED", fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ color: "#555" }}>{t}</span>
              </div>
            ))}
          </div>
          <Link href="/artist-dashboard" style={{ display: "block", background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}>
            Go to Artist Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link href="/register" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>← Back</Link>
          <p style={{ color: "#7C3AED", fontWeight: 900, fontSize: "24px", margin: "8px 0 4px" }}>🎨 Serviko</p>
          <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px" }}>Become a Serviko Artist</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Earn money doing what you love</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: "4px", borderRadius: "4px", background: s <= step ? "#7C3AED" : "#EDE9FE" }} />
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Step 1 — Personal Info</h3>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Maria Santos" },
                { label: "Email", key: "email", type: "email", placeholder: "maria@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "09XX XXX XXXX" },
                { label: "Password", key: "password", type: "password", placeholder: "Create a strong password" },
                { label: "City / Location", key: "address", type: "text", placeholder: "e.g. Quezon City" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder}
                    value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <button onClick={() => {
                if (!form.name || !form.email || !form.phone) { setError("Please fill in all fields."); return; }
                setError(""); setStep(2);
              }} style={{ background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                Continue →
              </button>
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Step 2 — Your Services</h3>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Select all services you offer</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {allServices.map(s => (
                  <button key={s} onClick={() => toggleService(s)}
                    style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px",
                      background: selectedServices.includes(s) ? "#7C3AED" : "#EDE9FE",
                      color: selectedServices.includes(s) ? "#fff" : "#7C3AED" }}>
                    {selectedServices.includes(s) ? "✓ " : ""}{s}
                  </button>
                ))}
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Years of Experience</label>
                <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px" }}>
                  <option value="">Select experience</option>
                  <option>Less than 1 year</option>
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Short Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell customers about yourself and your skills..."
                  rows={3} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => {
                  if (selectedServices.length === 0) { setError("Please select at least one service."); return; }
                  setError(""); setStep(3);
                }} style={{ flex: 2, background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>Continue →</button>
              </div>
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Step 3 — Payout Setup</h3>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>GCash Number</label>
                <input type="tel" placeholder="09XX XXX XXXX" value={form.gcash} onChange={e => setForm({ ...form, gcash: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ background: "#F5F3FF", borderRadius: "16px", padding: "16px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 10px", color: "#7C3AED" }}>🎨 Artist Benefits</p>
                {["Keep 90% of every booking", "Get paid within 24 hours via GCash", "Set your own schedule & rates", "Free profile on Serviko"].map(b => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ color: "#7C3AED" }}>✓</span><span style={{ color: "#555" }}>{b}</span>
                  </div>
                ))}
              </div>
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ flex: 2, background: loading ? "#ccc" : "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                  {loading ? "Creating Account..." : "Start Earning 🎨"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
