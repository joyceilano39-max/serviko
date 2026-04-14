"use client";
import { useState } from "react";

const vouchers: Record<string, { discount: number; type: "fixed" | "percent"; minOrder: number; description: string }> = {
  "FIRST50": { discount: 50, type: "fixed", minOrder: 300, description: "₱50 off your first booking!" },
  "REFER100": { discount: 100, type: "fixed", minOrder: 500, description: "₱100 referral reward" },
  "SUMMER20": { discount: 20, type: "percent", minOrder: 200, description: "20% off summer promo" },
  "LOYAL200": { discount: 200, type: "fixed", minOrder: 800, description: "₱200 loyalty reward" },
  "WELCOME50": { discount: 50, type: "fixed", minOrder: 0, description: "Welcome gift for new users" },
};

const services = [
  { name: "Haircut & Styling", price: 500, duration: "45 mins" },
  { name: "Full Body Massage", price: 800, duration: "60 mins" },
  { name: "Facial Treatment", price: 650, duration: "60 mins" },
  { name: "Manicure & Pedicure", price: 450, duration: "60 mins" },
  { name: "Hair Coloring", price: 1200, duration: "2 hrs" },
  { name: "Hot Stone Massage", price: 1000, duration: "90 mins" },
  { name: "House Cleaning (2BR)", price: 1200, duration: "3 hrs" },
  { name: "Grass Cutting", price: 500, duration: "1 hr" },
  { name: "1 Room Painting", price: 1500, duration: "1 day" },
];

const transportFees: Record<string, number> = {
  "0-3 km": 50,
  "3-7 km": 100,
  "7-15 km": 150,
  "15+ km": 200,
};

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", amount: 0 });
  const [distance, setDistance] = useState("0-3 km");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = services.find(s => s.name === e.target.value);
    setForm({ ...form, service: e.target.value, amount: selected?.price || 0 });
  };

  const applyVoucher = () => {
    const code = voucherCode.toUpperCase().trim();
    const voucher = vouchers[code];
    if (!voucher) { setVoucherMsg("❌ Invalid voucher code."); setAppliedVoucher(null); return; }
    if (form.amount < voucher.minOrder) { setVoucherMsg(`❌ Minimum order of ₱${voucher.minOrder} required.`); setAppliedVoucher(null); return; }
    const discountAmount = voucher.type === "percent" ? Math.round(form.amount * voucher.discount / 100) : voucher.discount;
    setAppliedVoucher({ code, discount: discountAmount, description: voucher.description });
    setVoucherMsg(`✅ Voucher applied! You save ₱${discountAmount}`);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherMsg("");
  };

  const transport = transportFees[distance];
  const subtotal = form.amount;
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal + transport - discount);

  const handlePay = async () => {
    if (!form.name || !form.email || !form.service) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `${form.service} + Transport`,
          name: form.name,
          email: form.email,
        }),
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
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/booking" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Back to Booking</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 0" }}>💳 Checkout</h1>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Customer Info */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>👤 Your Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Joyce Ilano" },
              { label: "Email", key: "email", type: "email", placeholder: "joyce@email.com" },
              { label: "Phone", key: "phone", type: "tel", placeholder: "09XX XXX XXXX" },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder}
                  value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Service */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>🌸 Service</h3>
          <select value={form.service} onChange={handleServiceChange}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
            <option value="">-- Select service --</option>
            {services.map(s => <option key={s.name} value={s.name}>{s.name} — ₱{s.price} ({s.duration})</option>)}
          </select>
        </div>

        {/* Transport */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>🚗 Transport Fee</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {Object.entries(transportFees).map(([range, fee]) => (
              <div key={range} onClick={() => setDistance(range)}
                style={{ padding: "12px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
                  background: distance === range ? "#FFF0F6" : "#f8f8f8",
                  border: distance === range ? "2px solid #E61D72" : "2px solid transparent" }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{range}</p>
                <p style={{ color: "#E61D72", fontWeight: 700, margin: 0 }}>+₱{fee}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voucher */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>🎫 Voucher Code</h3>

          {appliedVoucher ? (
            <div style={{ background: "#F0FDF4", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #86EFAC" }}>
              <div>
                <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px" }}>✅ {appliedVoucher.code}</p>
                <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{appliedVoucher.description} — Save ₱{appliedVoucher.discount}</p>
              </div>
              <button onClick={removeVoucher} style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>Remove</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Enter voucher code e.g. FIRST50"
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", letterSpacing: "1px", fontWeight: 600 }} />
                <button onClick={applyVoucher}
                  style={{ background: "#E61D72", color: "#fff", padding: "12px 20px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>Apply</button>
              </div>
              {voucherMsg && <p style={{ fontSize: "13px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171", margin: 0 }}>{voucherMsg}</p>}

              {/* Available Vouchers */}
              <div style={{ marginTop: "12px" }}>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>Available vouchers — tap to apply:</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.entries(vouchers).map(([code, v]) => (
                    <button key={code} onClick={() => { setVoucherCode(code); }}
                      style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}>
                      {code} — {v.type === "percent" ? `${v.discount}% off` : `₱${v.discount} off`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>💳 Payment Method</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { id: "gcash", label: "📱 GCash", desc: "Pay via GCash" },
              { id: "maya", label: "🏦 Maya", desc: "Pay via Maya" },
              { id: "card", label: "💳 Credit/Debit Card", desc: "Visa, Mastercard" },
              { id: "cod", label: "💵 Cash on Arrival", desc: "Pay when artist arrives" },
            ].map(method => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                  background: paymentMethod === method.id ? "#FFF0F6" : "#f8f8f8",
                  border: paymentMethod === method.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${paymentMethod === method.id ? "#E61D72" : "#ccc"}`, background: paymentMethod === method.id ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {paymentMethod === method.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>{method.label}</p>
                  <p style={{ color: "#888", margin: 0, fontSize: "12px" }}>{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>📋 Order Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#888" }}>Service</span>
              <span style={{ fontWeight: 600 }}>{form.service || "Not selected"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#888" }}>Subtotal</span>
              <span>₱{subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#888" }}>🚗 Transport ({distance})</span>
              <span>₱{transport}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#22c55e" }}>🎫 Voucher ({appliedVoucher?.code})</span>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>-₱{discount}</span>
              </div>
            )}
            <div style={{ borderTop: "2px solid #FFE4F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "18px" }}>
              <span>Total</span>
              <span style={{ color: "#E61D72" }}>₱{total}</span>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center" }}>{error}</p>}

        <button onClick={handlePay} disabled={loading || !form.service || !form.name}
          style={{ background: loading || !form.service || !form.name ? "#ccc" : "#E61D72", color: "#fff", padding: "16px", borderRadius: "16px", border: "none", fontWeight: 900, cursor: loading || !form.service || !form.name ? "not-allowed" : "pointer", fontSize: "16px" }}>
          {loading ? "Processing..." : `Pay ₱${total} via ${paymentMethod === "gcash" ? "GCash" : paymentMethod === "maya" ? "Maya" : paymentMethod === "card" ? "Card" : "Cash"} 🌸`}
        </button>

        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", margin: 0 }}>🔒 Secured by PayMongo • All transactions are encrypted</p>
      </div>
    </div>
  );
}
