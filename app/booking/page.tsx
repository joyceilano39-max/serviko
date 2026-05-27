"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const artistId = searchParams.get("artistId");
  const artistName = searchParams.get("artistName") || "";
  const service = searchParams.get("service") || "";
  const price = searchParams.get("price") || "0";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [members, setMembers] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const basePrice = parseInt(price) || 0;
  const transportFee = 50;
  const total = Math.max(0, (basePrice * members) + transportFee - voucherDiscount);

  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || "");
    }
  }, [user]);

  const applyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplyingVoucher(true);
    setVoucherMsg("");
    try {
      const res = await fetch("/api/voucher-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode, total: basePrice * members }),
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

  const handleSubmit = async () => {
    if (!date || !time || !address || !customerName || !customerPhone) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!user) {
      router.push("/customer-login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId: parseInt(artistId || "0"),
          customerName,
          customerEmail: user.emailAddresses[0]?.emailAddress || "",
          customerPhone,
          date,
          time,
          address,
          services: service,
          total,
          transportFee,
          notes,
          members,
          voucherCode: voucherDiscount > 0 ? voucherCode : null,
          status: "pending",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Booking failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>&#127881;</div>
          <h2 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 8px", color: "#22c55e" }}>Booking Sent!</h2>
          <p style={{ color: "#888", fontSize: "14px", margin: "0 0 8px" }}>Your booking request has been sent to <strong>{artistName}</strong>.</p>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 24px" }}>You will be notified once they confirm.</p>
          <button onClick={() => router.push("/dashboard")} style={{ width: "100%", background: "#E61D72", color: "#fff", border: "none", padding: "14px", borderRadius: "14px", fontWeight: 700, fontSize: "16px", cursor: "pointer", marginBottom: "12px" }}>
            View My Bookings
          </button>
          <button onClick={() => router.push("/")} style={{ width: "100%", background: "#f0f0f0", color: "#555", border: "none", padding: "14px", borderRadius: "14px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#555" }}>&#8592;</button>
        <h1 style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>Book a Service</h1>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {/* Artist + Service Summary */}
        <div style={{ background: "linear-gradient(135deg, #E61D72, #9333ea)", borderRadius: "20px", padding: "20px", color: "#fff", marginBottom: "20px" }}>
          <p style={{ opacity: 0.85, fontSize: "13px", margin: "0 0 4px" }}>Booking with</p>
          <h2 style={{ fontWeight: 900, fontSize: "20px", margin: "0 0 4px" }}>{artistName}</h2>
          {service && <p style={{ opacity: 0.9, fontSize: "14px", margin: "0 0 4px" }}>Service: {service}</p>}
          <p style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>\u20B1{basePrice} <span style={{ fontWeight: 400, fontSize: "12px", opacity: 0.8 }}>base price</span></p>
        </div>

        {/* Customer Info */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Your Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Full Name *"
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}
            />
            <input
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="Phone Number *"
              type="tel"
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* Schedule */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Schedule</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}
            />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* Address */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Service Address</h3>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your full address *"
            rows={3}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Members */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Number of People</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => setMembers(Math.max(1, members - 1))} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #e0e0e0", background: "#f8f8f8", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
            <span style={{ fontWeight: 700, fontSize: "20px", minWidth: "30px", textAlign: "center" }}>{members}</span>
            <button onClick={() => setMembers(members + 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #e0e0e0", background: "#f8f8f8", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Special Notes <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span></h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special requests or instructions..."
            rows={3}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Voucher */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Voucher Code <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span></h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={voucherCode}
              onChange={e => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="Enter voucher code"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}
            />
            <button onClick={applyVoucher} disabled={applyingVoucher} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "12px 16px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px", whiteSpace: "nowrap" }}>
              {applyingVoucher ? "..." : "Apply"}
            </button>
          </div>
          {voucherMsg && (
            <p style={{ fontSize: "13px", margin: "8px 0 0", color: voucherDiscount > 0 ? "#22c55e" : "#f87171", fontWeight: 600 }}>{voucherMsg}</p>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 14px", fontSize: "15px" }}>Order Summary</h3>
          {[
            { label: `Service (x${members})`, val: `\u20B1${basePrice * members}` },
            { label: "Transport Fee", val: `\u20B1${transportFee}` },
            ...(voucherDiscount > 0 ? [{ label: "Voucher Discount", val: `-\u20B1${voucherDiscount}` }] : []),
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ color: "#888", fontSize: "14px" }}>{item.label}</span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: item.label.includes("Discount") ? "#22c55e" : "#333" }}>{item.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72" }}>\u20B1{total}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "#f87171", margin: 0, fontSize: "14px", fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ width: "100%", background: submitting ? "#ccc" : "#E61D72", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "16px", cursor: submitting ? "not-allowed" : "pointer", marginBottom: "32px" }}
        >
          {submitting ? "Sending Booking..." : `Confirm Booking \u2022 \u20B1${total}`}
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><p>Loading...</p></div>}>
      <BookingForm />
    </Suspense>
  );
}
