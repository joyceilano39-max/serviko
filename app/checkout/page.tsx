"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const artistId = searchParams.get("artistId") || "";
  const artistName = searchParams.get("artistName") || "";
  const service = searchParams.get("service") || "";
  const price = parseInt(searchParams.get("price") || "0");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const transportFee = 50;
  const total = price + transportFee - voucherDiscount;

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
    }
    fetch("/api/vouchers")
      .then(r => r.json())
      .then(d => setAvailableVouchers((d.vouchers || []).slice(0, 4)))
      .catch(() => {});
  }, [user]);

  const applyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplyingVoucher(true);
    setVoucherMsg("");
    try {
      const res = await fetch("/api/voucher-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode, total: price }),
      });
      const data = await res.json();
      if (data.valid) {
        setVoucherDiscount(data.discount || 0);
        setVoucherMsg(`Voucher applied! -\u20B1${data.discount}`);
      } else {
        setVoucherDiscount(0);
        setVoucherMsg(data.message || "Invalid voucher code.");
      }
    } catch {
      setVoucherMsg("Failed to validate voucher.");
    }
    setApplyingVoucher(false);
  };

  const handlePay = async () => {
    if (!name || !email || !phone || !date || !time || !address) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId: parseInt(artistId),
          artistName,
          service,
          price,
          date,
          time,
          location: { lat: 14.5995, lng: 120.9842, address, landmark: "" },
          contactName: name,
          contactPhone: phone,
          contactEmail: email,
          voucherCode: voucherDiscount > 0 ? voucherCode : "",
          discount: voucherDiscount,
          transportFee,
          total,
          notes,
          payment_method: paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success && data.checkout_url) {
        router.push(data.checkout_url);
      } else {
        setError(data.error || "Booking failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (!artistId || !service) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#888", fontSize: "16px" }}>No booking data found</p>
        <button onClick={() => router.push("/")} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
          â† Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Checkout</h1>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#E61D72", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
          â† Back
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Booking Summary */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "16px" }}>Booking Summary</h3>
          {[
            { label: "Artist", val: artistName },
            { label: "Service", val: service },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ color: "#888", fontSize: "14px" }}>{item.label}</span>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Schedule *</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
          </div>
        </div>

        {/* Address */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Service Address *</h3>
          <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full address" rows={3}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
        </div>

        {/* Contact Info */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Your Contact Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name *"
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" type="email"
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number *" type="tel"
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special notes (optional)" rows={2}
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", resize: "none" }} />
          </div>
        </div>

        {/* Voucher */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Voucher / Promo Code</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} placeholder="ENTER CODE"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }} />
            <button onClick={applyVoucher} disabled={applyingVoucher}
              style={{ background: "#E61D72", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              {applyingVoucher ? "..." : "Apply"}
            </button>
          </div>
          {voucherMsg && <p style={{ fontSize: "13px", margin: "0 0 10px", color: voucherDiscount > 0 ? "#22c55e" : "#f87171", fontWeight: 600 }}>{voucherMsg}</p>}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {availableVouchers.map(v => (
              <button key={v.code} onClick={() => setVoucherCode(v.code)}
                style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #E61D72", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                {v.code}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Payment Method</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["gcash", "paymaya", "cash"].map(method => (
              <div key={method} onClick={() => setPaymentMethod(method)}
                style={{ padding: "14px 16px", borderRadius: "12px", border: `2px solid ${paymentMethod === method ? "#E61D72" : "#e0e0e0"}`, background: paymentMethod === method ? "#FFF0F6" : "#fff", cursor: "pointer", fontWeight: 600, fontSize: "14px", textTransform: "capitalize" }}>
                {method === "gcash" ? "GCash" : method === "paymaya" ? "PayMaya" : "Cash"}
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 14px", fontSize: "16px" }}>Price Breakdown</h3>
          {[
            { label: `${service}`, val: `\u20B1${price}` },
            { label: "Transport Fee", val: `\u20B1${transportFee}` },
            ...(voucherDiscount > 0 ? [{ label: "Voucher Discount", val: `-\u20B1${voucherDiscount}` }] : []),
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ color: "#888", fontSize: "14px" }}>{item.label}</span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: item.label.includes("Discount") ? "#22c55e" : "#333" }}>{item.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
            <span style={{ fontWeight: 900, fontSize: "18px" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: "22px", color: "#E61D72" }}>{`\u20B1${total}`}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 16px" }}>
            <p style={{ color: "#f87171", margin: 0, fontSize: "14px", fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <button onClick={handlePay} disabled={loading}
          style={{ width: "100%", background: loading ? "#ccc" : "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", border: "none", padding: "18px", borderRadius: "16px", fontWeight: 700, fontSize: "18px", cursor: loading ? "not-allowed" : "pointer", marginBottom: "32px" }}>
          {loading ? "Processing..." : `Pay \u20B1${total}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><p>Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}



