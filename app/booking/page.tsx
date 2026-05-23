"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Voucher = {
  id: number;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  expiry_date: string;
  is_active: boolean;
};

export default function BookingPage() {
  const router = useRouter();
  const [artistId, setArtistId] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState(1);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hourlyRate = 500;
  const transportFee = 50;

  useEffect(() => {
    fetchVouchers();
    const params = new URLSearchParams(window.location.search);
    const artist = params.get("artist");
    if (artist) setArtistId(artist);
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/vouchers");
      const data = await res.json();
      setAvailableVouchers((data.vouchers || []).slice(0, 4));
    } catch {}
  };

  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherMsg("Please enter a voucher code");
      return;
    }

    try {
      const res = await fetch("/api/voucher-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: voucherCode.toUpperCase().trim(),
          orderTotal: getSubtotal(),
        }),
      });

      const data = await res.json();
      
      if (data.valid) {
        setAppliedVoucher({
          code: data.voucher.code,
          discount: data.discount,
          description: data.voucher.description,
        });
        setVoucherMsg(`✅ ${data.message}`);
      } else {
        setAppliedVoucher(null);
        setVoucherMsg(data.message);
      }
    } catch {
      setVoucherMsg("Error validating voucher");
    }
  };

  const getSubtotal = () => {
    return hourlyRate * hours + transportFee;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = appliedVoucher?.discount || 0;
    return Math.max(0, subtotal - discount);
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !service || !date || !time || !address) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          artist_id: artistId || 1,
          service,
          date,
          time,
          address,
          hours,
          total: getTotal(),
          transport_fee: transportFee,
          notes,
          payment_method: "gcash",
          voucher_code: appliedVoucher?.code || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/payment-success?id=" + data.bookingId);
      } else {
        setError(data.error || "Failed to create booking");
      }
    } catch {
      setError("Error creating booking. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif", paddingBottom: "80px" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Book a Service</h1>
        <Link href="/" style={{ color: "#888", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
          ← Back
        </Link>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {/* Service Details */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "16px" }}>Service Details</h3>
          
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Service Type *
            </label>
            <select value={service} onChange={(e) => setService(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }}>
              <option value="">Select a service</option>
              <option value="Hair Styling">Hair Styling</option>
              <option value="Makeup">Makeup</option>
              <option value="Nails">Nails</option>
              <option value="Massage">Massage</option>
              <option value="Cleaning">Home Cleaning</option>
              <option value="Gardening">Gardening</option>
              <option value="Painting">House Painting</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Date *
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                Time *
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Duration (hours) *
            </label>
            <input type="number" min="1" max="8" value={hours} onChange={(e) => setHours(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Address *
            </label>
            <input type="text" placeholder="Complete address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
              Special Notes (optional)
            </label>
            <textarea placeholder="Any special requests or instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", minHeight: "80px", resize: "vertical", boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "16px" }}>Your Contact Info</h3>
          <input type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        {/* Voucher Section */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Voucher / Promo Code</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input type="text" placeholder="Enter code" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", textTransform: "uppercase" }} />
            <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              Apply
            </button>
          </div>
          {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171", margin: "0 0 8px" }}>{voucherMsg}</p>}
          {availableVouchers.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {availableVouchers.map(v => (
                <button key={v.code} onClick={() => setVoucherCode(v.code)} style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                  {v.code}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Price Breakdown</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Service ({hours}hr × ₱{hourlyRate})</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>₱{hourlyRate * hours}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Transport Fee</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>₱{transportFee}</span>
          </div>
          {appliedVoucher && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#22c55e" }}>
              <span style={{ fontSize: "13px" }}>Discount ({appliedVoucher.code})</span>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>-₱{appliedVoucher.discount}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #f0f0f0", marginTop: "8px" }}>
            <span style={{ fontWeight: 900, fontSize: "16px" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: "18px", color: "#E61D72" }}>₱{getTotal()}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#ccc" : "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Processing..." : `Book Now - Pay ₱${getTotal()}`}
        </button>
      </div>
    </div>
  );
}
