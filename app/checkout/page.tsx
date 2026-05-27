"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

function CheckoutContent() {
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
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);

  const searchParams = useSearchParams();
  useEffect(() => {
    localStorage.removeItem("serviko_booking");
    const artistId = searchParams.get("artistId");
    if (false) {
      const artistId = searchParams.get("artistId");
      const artistName = searchParams.get("artistName");
      const service = searchParams.get("service");
      const price = searchParams.get("price");
      if (artistId && artistName) {
        setBookingData({ artistId, artistName, service, price, hourlyRate: price, hours: 1 });
      }
    }
    fetchVouchers();
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
        setVoucherMsg(`âœ… ${data.message}`);
      } else {
        setAppliedVoucher(null);
        setVoucherMsg(data.message);
      }
    } catch {
      setVoucherMsg("Error validating voucher");
    }
  };

  const getSubtotal = () => {
    if (!bookingData) return 0;
    return (bookingData.hourlyRate || 0) * (bookingData.hours || 1) + (bookingData.transportFee || 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = appliedVoucher?.discount || 0;
    return Math.max(0, subtotal - discount);
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      setError("Please fill in all contact information");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: name,
          contactEmail: email,
          contactPhone: phone,
          artistId: bookingData.artistId,
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          address: bookingData.address,
          hours: bookingData.hours || 1,
          total: getTotal(),
          transportFee: bookingData.transportFee || 0,
          notes: bookingData.notes || "",
          payment_method: paymentMethod,
          voucher_code: appliedVoucher?.code || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("serviko_booking");
        window.location.href = "/payment-success?id=" + data.bookingId;
      } else {
        setError(data.error || "Failed to create booking");
      }
    } catch {
      setError("Error creating booking. Please try again.");
    }
    setLoading(false);
  };

  if (!bookingData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "20px" }}>
        <p style={{ fontWeight: 700, margin: "0 0 12px" }}>No booking data found</p>
        <Link href="/booking" style={{ color: "#E61D72", textDecoration: "none", fontWeight: 600 }}>
          â† Go to Booking
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif", paddingBottom: "80px" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>Checkout</h1>
        <Link href="/booking" style={{ color: "#888", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
          â† Back
        </Link>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {/* Booking Summary */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Booking Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Service</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>{bookingData.service}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Date & Time</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>{bookingData.date} at {bookingData.time}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Duration</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>{bookingData.hours || 1} hour(s)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Location</span>
            <span style={{ fontWeight: 600, fontSize: "13px", textAlign: "right", maxWidth: "60%" }}>{bookingData.address}</span>
          </div>
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
          {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("âœ…") ? "#22c55e" : "#f87171", margin: "0 0 8px" }}>{voucherMsg}</p>}
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

        {/* Contact Info */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Your Contact Info</h3>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" }} />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
        </div>

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Payment Method</h3>
          {["gcash", "paymaya", "cash"].map((method) => (
            <div key={method} onClick={() => setPaymentMethod(method)} style={{ padding: "12px", borderRadius: "12px", border: paymentMethod === method ? "2px solid #E61D72" : "2px solid #f0f0f0", marginBottom: "8px", cursor: "pointer", background: paymentMethod === method ? "#FFF0F6" : "#fff" }}>
              <p style={{ fontWeight: 600, margin: 0, fontSize: "14px", textTransform: "capitalize" }}>{method}</p>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "16px" }}>Price Breakdown</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Service ({bookingData.hours || 1}hr Ã— â‚±{bookingData.hourlyRate})</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>â‚±{(bookingData.hourlyRate || 0) * (bookingData.hours || 1)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>Transport Fee</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>â‚±{bookingData.transportFee || 0}</span>
          </div>
          {appliedVoucher && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#22c55e" }}>
              <span style={{ fontSize: "13px" }}>Discount ({appliedVoucher.code})</span>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>-â‚±{appliedVoucher.discount}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #f0f0f0", marginTop: "8px" }}>
            <span style={{ fontWeight: 900, fontSize: "16px" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: "18px", color: "#E61D72" }}>â‚±{getTotal()}</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#ccc" : "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Processing..." : `Pay â‚±${getTotal()}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() { return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>; }


