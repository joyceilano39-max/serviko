"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", amount: 500 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const services = [
    { name: "Haircut & Styling", price: 500 },
    { name: "Full Body Massage", price: 800 },
    { name: "Facial Treatment", price: 650 },
    { name: "Manicure & Pedicure", price: 450 },
    { name: "Hair Coloring", price: 1200 },
    { name: "Hot Stone Massage", price: 1000 },
  ];

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = services.find(s => s.name === e.target.value);
    setForm({ ...form, service: e.target.value, amount: selected?.price || 500 });
  };

  const handlePay = async () => {
    if (!form.name || !form.email || !form.service) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: form.amount, description: form.service, name: form.name, email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "#E61D72", fontSize: "28px", fontWeight: 900, margin: 0 }}>🌸 Checkout</h1>
          <p style={{ color: "#888", marginTop: "8px" }}>Complete your booking payment</p>
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "16px" }}>

          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Joyce Ilano" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="joyce@email.com" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="09XX XXX XXXX" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Service</label>
            <select value={form.service} onChange={handleServiceChange}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
              <option value="">-- Select service --</option>
              {services.map(s => <option key={s.name} value={s.name}>{s.name} - ₱{s.price}</option>)}
            </select>
          </div>

          {/* Payment Methods */}
          <div style={{ background: "#FFF8FC", borderRadius: "12px", padding: "16px", border: "1px solid #FFD6E7" }}>
            <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 12px" }}>Payment Methods</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["💳 Credit Card", "📱 GCash", "🏦 Maya", "🏧 Online Banking"].map(method => (
                <span key={method} style={{ background: "#fff", border: "1px solid #FFD6E7", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 }}>{method}</span>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#FFF0F6", borderRadius: "12px" }}>
            <span style={{ fontWeight: 600 }}>Total Amount</span>
            <span style={{ fontWeight: 900, color: "#E61D72", fontSize: "24px" }}>₱{form.amount}</span>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}

          <button onClick={handlePay} disabled={loading}
            style={{ background: loading ? "#ccc" : "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing..." : `Pay ₱${form.amount} via PayMongo`}
          </button>

          <p style={{ textAlign: "center", color: "#888", fontSize: "12px", margin: 0 }}>🔒 Secured by PayMongo</p>
        </div>
      </div>
    </div>
  );
}