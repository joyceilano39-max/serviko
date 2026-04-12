"use client";
import { useState } from "react";

const reviews = [
  { id: 1, customer: "Joyce Ilano", laborer: "Maria Santos", service: "Full Body Massage", rating: 5, comment: "Amazing service! Very professional and skilled. Will definitely book again!", date: "April 12, 2026", avatar: "J", verified: true },
  { id: 2, customer: "Maria Reyes", laborer: "Ana Reyes", service: "Haircut & Styling", rating: 5, comment: "Best haircut I've ever had! Very attentive to what I wanted.", date: "April 11, 2026", avatar: "M", verified: true },
  { id: 3, customer: "Liza Santos", laborer: "Joy Dela Cruz", service: "Manicure & Pedicure", rating: 4, comment: "Great job! Very thorough and gentle. Nails look perfect.", date: "April 10, 2026", avatar: "L", verified: true },
  { id: 4, customer: "Ana Cruz", laborer: "Maria Santos", service: "Hot Stone Massage", rating: 5, comment: "Absolutely relaxing! The best massage I've had in years.", date: "April 9, 2026", avatar: "A", verified: true },
  { id: 5, customer: "Rose Dela Cruz", laborer: "Liza Cruz", service: "Facial Treatment", rating: 4, comment: "My skin feels so much better! Will come back for sure.", date: "April 8, 2026", avatar: "R", verified: false },
  { id: 6, customer: "Joy Santos", laborer: "Ana Reyes", service: "Hair Coloring", rating: 3, comment: "Good job overall but took a bit longer than expected.", date: "April 7, 2026", avatar: "J", verified: true },
];

const ratingColors: Record<number, string> = { 5: "#22c55e", 4: "#3b82f6", 3: "#D97706", 2: "#f87171", 1: "#ef4444" };

export default function ReviewsPage() {
  const [filter, setFilter] = useState(0);
  const [sortBy, setSortBy] = useState("latest");
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ service: "", laborer: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const filtered = reviews
    .filter(r => filter === 0 || r.rating === filter)
    .sort((a, b) => sortBy === "highest" ? b.rating - a.rating : sortBy === "lowest" ? a.rating - b.rating : b.id - a.id);

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rv => rv.rating === r).length }));

  const handleSubmit = () => {
    if (!newReview.service || !newReview.comment) { alert("Please fill in all fields."); return; }
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #C01660 100%)", padding: "48px 32px", color: "#fff", textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 8px" }}>Reviews & Ratings</h1>
        <p style={{ opacity: 0.8, margin: "0 0 24px" }}>What our customers say about Serviko</p>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "48px", fontWeight: 900, margin: 0 }}>{avgRating}</p>
            <div style={{ fontSize: "24px" }}>{"★".repeat(Math.round(Number(avgRating)))}</div>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>Average Rating</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "48px", fontWeight: 900, margin: 0 }}>{reviews.length}</p>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>Total Reviews</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "48px", fontWeight: 900, margin: 0 }}>{reviews.filter(r => r.verified).length}</p>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>Verified Reviews</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

        {/* Rating Breakdown */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Rating Breakdown</h3>
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, minWidth: "30px" }}>{rating}★</span>
              <div style={{ flex: 1, background: "#FFE4F0", borderRadius: "10px", height: "10px" }}>
                <div style={{ background: ratingColors[rating], borderRadius: "10px", height: "10px", width: `${(count / reviews.length) * 100}%` }} />
              </div>
              <span style={{ fontSize: "13px", color: "#888", minWidth: "20px" }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[0, 5, 4, 3, 2, 1].map((r) => (
              <button key={r} onClick={() => setFilter(r)}
                style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px",
                  background: filter === r ? "#E61D72" : "#fff", color: filter === r ? "#fff" : "#888", boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }}>
                {r === 0 ? "All" : `${r}★`}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #FFD6E7", fontSize: "13px", background: "#fff" }}>
              <option value="latest">Latest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <button onClick={() => setShowForm(!showForm)}
              style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: "#E61D72", color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
              + Write Review
            </button>
          </div>
        </div>

        {/* Write Review Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Write a Review</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Service</label>
                <select value={newReview.service} onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
                  <option value="">-- Select service --</option>
                  {["Haircut & Styling", "Full Body Massage", "Facial Treatment", "Manicure & Pedicure", "Hair Coloring", "Hot Stone Massage"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Rating</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{ fontSize: "28px", background: "none", border: "none", cursor: "pointer", color: star <= newReview.rating ? "#FFD700" : "#ddd" }}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Your Review</label>
                <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..." rows={3}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none" }} />
              </div>
              <button onClick={handleSubmit}
                style={{ background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                Submit Review
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "16px", marginBottom: "24px", border: "1px solid #86EFAC", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>✅</span>
            <p style={{ fontWeight: 600, color: "#22c55e", margin: 0 }}>Review submitted successfully! Thank you for your feedback.</p>
          </div>
        )}

        {/* Reviews List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((review) => (
            <div key={review.id} style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px" }}>{review.avatar}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{review.customer}</p>
                      {review.verified && <span style={{ background: "#F0FDF4", color: "#22c55e", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>✓ Verified</span>}
                    </div>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{review.service} • {review.laborer}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#FFD700", fontSize: "18px" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{review.date}</p>
                </div>
              </div>
              <p style={{ color: "#555", fontSize: "14px", margin: "0 0 12px", lineHeight: 1.6 }}>{review.comment}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{ background: "#FFF0F6", color: "#E61D72", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>👍 Helpful</button>
                <button style={{ background: "#f8f8f8", color: "#888", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
