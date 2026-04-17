"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const statusSteps = ["Booking Confirmed", "Artist Accepted", "Artist On The Way", "Service Started", "Completed"];

function TrackingContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/customer/bookings?bookingId=${bookingId}`)
        .then(r => r.json())
        .then(d => { setBooking(d.booking || null); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [bookingId]);

  const getStatusIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "accepted": return 1;
      case "on_the_way": return 2;
      case "started": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}><p style={{ color: "#888" }}>Loading...</p></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Dashboard</Link>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Track Your Booking</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Real-time booking status</p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {!booking ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No active booking</p>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Book a service to track your artist!</p>
            <Link href="/booking" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700 }}>Book Now</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Booking Details</h3>
              {[
                { label: "Artist", val: booking.artist_name || "Your Artist" },
                { label: "Date", val: booking.date },
                { label: "Time", val: booking.time },
                { label: "Address", val: booking.address },
                { label: "Total", val: `P${booking.total}` },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ color: "#888", fontSize: "13px" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: "13px" }}>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 900, margin: "0 0 20px" }}>Status</h3>
              {statusSteps.map((step, i) => {
                const currentIndex = getStatusIndex(booking.status);
                const isDone = i < currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={step} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isDone ? "#22c55e" : isCurrent ? "#E61D72" : "#f0f0f0", color: isDone || isCurrent ? "#fff" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    <div style={{ paddingTop: "6px" }}>
                      <p style={{ fontWeight: isCurrent ? 700 : 400, color: isCurrent ? "#E61D72" : isDone ? "#22c55e" : "#888", margin: 0, fontSize: "14px" }}>{step}</p>
                      {isCurrent && <p style={{ color: "#888", fontSize: "12px", margin: "2px 0 0" }}>Current status</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {booking.status === "completed" && (
              <Link href="/reviews" style={{ display: "block", background: "#E61D72", color: "#fff", padding: "16px", borderRadius: "16px", textDecoration: "none", fontWeight: 700, fontSize: "16px", textAlign: "center" }}>
                Leave a Review
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}><TrackingContent /></Suspense>;
}
