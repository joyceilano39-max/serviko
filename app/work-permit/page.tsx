"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Booking = {
  id: number;
  booking_reference: string;
  artist_id: number;
  artist_name: string;
  service: string;
  price: number;
  date: string;
  time: string;
  location_lat: number;
  location_lng: number;
  location_address: string;
  landmark: string;
  contact_name: string;
  contact_phone: string;
  voucher_code: string;
  discount: number;
  transport_fee: number;
  total: number;
  notes: string;
  status: string;
  payment_status: string;
  created_at: string;
};

function WorkPermitContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.booking) {
          setBooking(data.booking);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p style={{ color: "#888" }}>Loading work permit...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Booking Not Found</h2>
          <p style={{ color: "#888", marginBottom: "24px" }}>The booking you're looking for doesn't exist.</p>
          <Link href="/" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header - Hide on print */}
        <div className="no-print" style={{ marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#E61D72", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>

        {/* Work Permit Card */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px", paddingBottom: "24px", borderBottom: "3px solid #E61D72" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🛠️</div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#E61D72", margin: "0 0 8px" }}>WORK PERMIT</h1>
            <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>Service Authorization Document</p>
          </div>

          {/* Booking Reference */}
          <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px", borderRadius: "12px", marginBottom: "32px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#fff", opacity: 0.9, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>Booking Reference</p>
            <p style={{ fontSize: "28px", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "2px" }}>{booking.booking_reference}</p>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            {/* Customer Info */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E61D72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>📋 Customer Details</h3>
              <div style={{ background: "#f8f8f8", padding: "16px", borderRadius: "12px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Name</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{booking.contact_name}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Phone</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{booking.contact_phone}</p>
                </div>
              </div>
            </div>

            {/* Worker Info */}
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#7C3AED", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>👤 Service Provider</h3>
              <div style={{ background: "#F5F3FF", padding: "16px", borderRadius: "12px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Artist</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{booking.artist_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E61D72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>🛠️ Service Information</h3>
            <div style={{ background: "#FFF0F6", padding: "20px", borderRadius: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Service</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{booking.service}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Service Fee</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>₱{booking.price.toFixed(2)}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Date</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Time</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{booking.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E61D72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>📍 Service Location</h3>
            <div style={{ background: "#f8f8f8", padding: "20px", borderRadius: "12px" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" }}>{booking.location_address}</p>
              {booking.landmark && (
                <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px dashed #E61D72" }}>
                  <p style={{ fontSize: "12px", color: "#888", margin: "0 0 4px" }}>Landmark</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{booking.landmark}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E61D72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>💰 Payment Details</h3>
            <div style={{ background: "#f8f8f8", padding: "20px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: "14px" }}>Service Fee</span>
                <span style={{ fontWeight: 600 }}>₱{booking.price.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: "14px" }}>Transport Fee</span>
                <span style={{ fontWeight: 600 }}>₱{booking.transport_fee.toFixed(2)}</span>
              </div>
              {booking.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#22c55e" }}>
                  <span style={{ fontSize: "14px" }}>Discount ({booking.voucher_code})</span>
                  <span style={{ fontWeight: 600 }}>-₱{booking.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #E61D72", marginTop: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: 900 }}>Total Paid</span>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "#E61D72" }}>₱{booking.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#E61D72", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>📝 Special Instructions</h3>
              <div style={{ background: "#FFF9E6", padding: "16px", borderRadius: "12px", border: "1px solid #FFE066" }}>
                <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{booking.notes}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ paddingTop: "24px", borderTop: "2px dashed #e5e7eb", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>Issued on {new Date(booking.created_at).toLocaleString()}</p>
            <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>This is an official work authorization from Serviko</p>
          </div>
        </div>

        {/* Action Buttons - Hide on print */}
        <div className="no-print" style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={handleDownload}
            style={{ background: "#E61D72", color: "#fff", border: "none", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}
          >
            📥 Download / Print
          </button>
          <Link
            href={`/tracker?bookingId=${booking.id}`}
            style={{ background: "#7C3AED", color: "#fff", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", display: "inline-block" }}
          >
            📊 Track Service →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function WorkPermitPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <WorkPermitContent />
    </Suspense>
  );
}