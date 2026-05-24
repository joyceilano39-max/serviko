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
  location_address: string;
  landmark: string;
  contact_name: string;
  contact_phone: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

function TrackerContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchBooking, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleSubmitReview = async () => {
    if (!rating || !review.trim()) {
      alert("Please provide both rating and review");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_id: booking?.artist_id,
          booking_id: booking?.id,
          rating,
          review,
        }),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setRating(0);
        setReview("");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { emoji: "⏳", color: "#f59e0b", label: "Pending Confirmation" };
      case "confirmed":
        return { emoji: "✅", color: "#10b981", label: "Confirmed" };
      case "in_progress":
        return { emoji: "🔧", color: "#3b82f6", label: "In Progress" };
      case "completed":
        return { emoji: "🎉", color: "#8b5cf6", label: "Completed" };
      case "cancelled":
        return { emoji: "❌", color: "#ef4444", label: "Cancelled" };
      default:
        return { emoji: "⏳", color: "#f59e0b", label: "Pending" };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <p style={{ color: "#888" }}>Loading tracker...</p>
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

  const statusInfo = getStatusInfo(booking.status);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#E61D72", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "16px 0 8px", color: "#E61D72" }}>Service Tracker</h1>
        </div>

        {/* Status Card */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "64px", marginBottom: "8px" }}>{statusInfo.emoji}</div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, color: statusInfo.color, margin: "0 0 8px" }}>{statusInfo.label}</h2>
            <p style={{ color: "#888", fontSize: "14px" }}>Booking Reference: {booking.booking_reference}</p>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              {["Pending", "Confirmed", "In Progress", "Completed"].map((step, idx) => {
                const steps = ["pending", "confirmed", "in_progress", "completed"];
                const currentIdx = steps.indexOf(booking.status.toLowerCase());
                const isActive = idx <= currentIdx;
                
                return (
                  <div key={step} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: isActive ? statusInfo.color : "#e5e7eb",
                      margin: "0 auto 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "14px"
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ fontSize: "12px", color: isActive ? "#000" : "#888", fontWeight: isActive ? 600 : 400 }}>{step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Details */}
          <div style={{ background: "#f8f8f8", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#E61D72" }}>Service Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
              <div>
                <p style={{ color: "#888", margin: "0 0 4px" }}>Service</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{booking.service}</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 4px" }}>Artist</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{booking.artist_name}</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 4px" }}>Date</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: "#888", margin: "0 0 4px" }}>Time</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{booking.time}</p>
              </div>
            </div>
          </div>

          <Link 
            href={`/work-permit?bookingId=${booking.id}`}
            style={{ 
              display: "block",
              textAlign: "center",
              background: "#7C3AED", 
              color: "#fff", 
              padding: "12px", 
              borderRadius: "12px", 
              textDecoration: "none", 
              fontWeight: 600 
            }}
          >
            📋 View Work Permit
          </Link>
        </div>

        {/* Review Section - Only show when completed */}
        {booking.status.toLowerCase() === "completed" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#E61D72" }}>Rate Your Experience</h3>
            
            {/* Star Rating */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Rating</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "32px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Your Review</p>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={submitting || !rating || !review.trim()}
              style={{
                width: "100%",
                background: submitting || !rating || !review.trim() ? "#ccc" : "linear-gradient(135deg, #E61D72, #7C3AED)",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "16px",
                cursor: submitting || !rating || !review.trim() ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <TrackerContent />
    </Suspense>
  );
}