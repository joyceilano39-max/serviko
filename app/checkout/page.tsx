"use client";
import { useState, useEffect } from "react";

const vouchers: Record<string, { discount: number; type: "fixed" | "percent"; minOrder: number; description: string }> = {
  "FIRST50": { discount: 50, type: "fixed", minOrder: 0, description: "₱50 off first booking" },
  "REFER100": { discount: 100, type: "fixed", minOrder: 500, description: "₱100 referral reward" },
  "SUMMER20": { discount: 20, type: "percent", minOrder: 200, description: "20% summer promo" },
  "LOYAL200": { discount: 200, type: "fixed", minOrder: 800, description: "₱200 loyalty reward" },
  "WELCOME50": { discount: 50, type: "fixed", minOrder: 0, description: "Welcome gift" },
};

export default function CheckoutPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Read booking data saved from booking page
    const saved = localStorage.getItem("serviko_booking");
    if (saved) {
      const data = JSON.parse(saved);
      setBookingData(data);
    }
  }, []);

  const applyVoucher = () => {
    const code = voucherCode.toUpperCase().trim();
    const v = vouchers[code];
    if (!v) { setVoucherMsg("❌ Invalid voucher code."); setAppliedVoucher(null); return; }
    if (subtotal < v.minOrder) { setVoucherMsg(`❌ Minimum order ₱${v.minOrder} required.`); return; }
    const d = v.type === "percent" ? Math.round(subtotal * v.discount / 100) : v.discount;
    setAppliedVoucher({ code, discount: d, description: v.description });
    setVoucherMsg(`✅ Saved ₱${d}!`);
  };

  const subtotal = bookingData?.subtotal || 0;
  const transport = bookingData?.transport || 0;
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal + transport - discount);

  const handlePay = async () => {
    if (!name || !email) { setError("Please fill in your name and email."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `Serviko - ${bookingData?.services?.join(", ") || "Booking"}`,
          name, email,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      // Save booking with payment info
      localStorage.setItem("serviko_booking", JSON.stringify({ ...bookingData, customerName: name, customerEmail: email, customerPhone: phone, total, voucher: appliedVoucher?.code }));
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
          <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>No booking found!</h2>
          <p style={{ color: "#888", margin: "0 0 24px" }}>Please start a booking first.</p>
          <a href="/booking" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>
            Start Booking →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/booking" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Back to Booking</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 0" }}>💳 Checkout</h1>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Booking Summary */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>📋 Your Booking</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>🎨 Artist</span>
              <span style={{ fontWeight: 600 }}>{bookingData.artistName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>📅 Date & Time</span>
              <span style={{ fontWeight: 600 }}>{bookingData.date} at {bookingData.time}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>📍 Address</span>
              <span style={{ fontWeight: 600, maxWidth: "200px", textAlign: "right" }}>{bookingData.address}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>👥 Members</span>
              <span style={{ fontWeight: 600 }}>{bookingData.memberCount} person(s)</span>
            </div>
            {/* Services */}
            <div style={{ borderTop: "1px solid #FFE4F0", paddingTop: "10px", marginTop: "4px" }}>
              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 6px" }}>Services:</p>
              {bookingData.services?.map((s: string, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span style={{ color: "#555" }}>• {s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>👤 Contact Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Full Name", val: name, set: setName, type: "text", ph: "Your name" },
              { label: "Email", val: email, set: setEmail, type: "email", ph: "your@email.com" },
              { label: "Phone", val: phone, set: setPhone, type: "tel", ph: "09XX XXX XXXX" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontWeight: 600, fontSize: "12px", display: "block", marginBottom: "4px" }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Voucher */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 12px", fontSize: "15px" }}>🎫 Voucher</h3>
          {appliedVoucher ? (
            <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #86EFAC" }}>
              <div>
                <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px", fontSize: "13px" }}>✅ {appliedVoucher.code}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>Save ₱{appliedVoucher.discount}</p>
              </div>
              <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); setVoucherMsg(""); }}
                style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code"
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "13px", fontWeight: 600 }} />
                <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", padding: "10px 16px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer" }}>Apply</button>
              </div>
              {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171", margin: "0 0 6px" }}>{voucherMsg}</p>}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["FIRST50", "SUMMER20", "REFER100"].map(code => (
                  <button key={code} onClick={() => setVoucherCode(code)}
                    style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                    {code}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 12px", fontSize: "15px" }}>💳 Payment Method</h3>
          {[
            { id: "gcash", label: "📱 GCash", desc: "Pay via GCash" },
            { id: "maya", label: "🏦 Maya", desc: "Pay via Maya" },
            { id: "card", label: "💳 Credit/Debit Card", desc: "Visa, Mastercard" },
            { id: "cod", label: "💵 Cash on Arrival", desc: "Pay when artist arrives" },
          ].map(m => (
            <div key={m.id} onClick={() => setPaymentMethod(m.id)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                background: paymentMethod === m.id ? "#FFF0F6" : "#f8f8f8", border: paymentMethod === m.id ? "2px solid #E61D72" : "2px solid transparent" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${paymentMethod === m.id ? "#E61D72" : "#ccc"}`, background: paymentMethod === m.id ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {paymentMethod === m.id && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fff" }} />}
              </div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: "13px" }}>{m.label}</p>
                <p style={{ color: "#888", margin: 0, fontSize: "11px" }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>💰 Order Total</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>Subtotal</span><span>₱{subtotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#888" }}>🚗 Transport ({bookingData.distance})</span><span>₱{transport}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#22c55e" }}>🎫 Voucher</span><span style={{ color: "#22c55e" }}>-₱{discount}</span>
              </div>
            )}
            <div style={{ borderTop: "2px solid #FFE4F0", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "20px" }}>
              <span>Total</span><span style={{ color: "#E61D72" }}>₱{total}</span>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center" }}>{error}</p>}

        <button onClick={handlePay} disabled={loading || !name || !email}
          style={{ background: loading || !name || !email ? "#ccc" : "#E61D72", color: "#fff", padding: "16px", borderRadius: "16px", border: "none", fontWeight: 900, cursor: loading || !name || !email ? "not-allowed" : "pointer", fontSize: "16px" }}>
          {loading ? "Processing..." : `Pay ₱${total} 🌸`}
        </button>
        <p style={{ textAlign: "center", color: "#888", fontSize: "12px", margin: 0 }}>🔒 Secured by PayMongo</p>
      </div>
    </div>
  );
}
