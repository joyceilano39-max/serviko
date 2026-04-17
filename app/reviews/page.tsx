"use client";
import { useState, useEffect } from "react";

type Review = {
  id: number;
  customer: string;
  artist: string;
  service: string;
  rating: number;
  comment: string;
  photo?: string;
  created_at: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer: "", artist: "", service: "", rating: 5, comment: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch { setReviews([]); }
    setLoading(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.customer || !form.artist || !form.comment) return;
    setSubmitting(true);
    let photoUrl = "";
    if (photo) {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("folder", "reviews");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      photoUrl = uploadData.url || "";
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: photoUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Review submitted! Thank you!");
        setTimeout(() => setSuccessMsg(""), 3000);
        setForm({ customer: "", artist: "", service: "", rating: 5, comment: "" });
        setPhoto(null); setPhotoPreview(""); setShowForm(false);
        fetchReviews();
      }
    } catch { alert("Failed to submit review."); }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const ratingCounts = [5,4,3,2,1].map(r => ({ rating: r, count: reviews.filter(rev => rev.rating === r).length, percent: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0 }));
  const filteredReviews = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Customer Reviews</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Real reviews from real customers</p>
      </div>
      {successMsg && <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>{successMsg}</div>}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: "48px", color: "#E61D72", margin: "0 0 4px" }}>{avgRating}</p>
              <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "4px" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: parseFloat(avgRating) >= s ? "#FFD700" : "#ddd", fontSize: "16px" }}>★</span>)}
              </div>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{reviews.length} reviews</p>
            </div>
            <div>
              {ratingCounts.map(({ rating, count, percent }) => (
                <div key={rating} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, minWidth: "8px" }}>{rating}</span>
                  <span style={{ color: "#FFD700", fontSize: "12px" }}>★</span>
                  <div style={{ flex: 1, height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#E61D72", borderRadius: "4px", width: `${percent}%` }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#888", minWidth: "20px" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => setFilterRating(0)} style={{ padding: "6px 12px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", background: filterRating === 0 ? "#E61D72" : "#fff", color: filterRating === 0 ? "#fff" : "#555" }}>All</button>
            {[5,4,3,2,1].map(r => <button key={r} onClick={() => setFilterRating(filterRating === r ? 0 : r)} style={{ padding: "6px 12px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", background: filterRating === r ? "#E61D72" : "#fff", color: filterRating === r ? "#fff" : "#555" }}>{r}★</button>)}
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "13px" }}>Write Review</button>
        </div>

        {showForm && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Write a Review</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[{ label: "Your Name", key: "customer", ph: "e.g. Maria Santos" }, { label: "Artist Name", key: "artist", ph: "e.g. Lance Arnold Penas" }, { label: "Service", key: "service", ph: "e.g. Haircut & Styling" }].map(f => (
                <div key={f.key}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>{f.label}</label>
                  <input type="text" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>Rating</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1,2,3,4,5].map(s => <button key={s} onClick={() => setForm({ ...form, rating: s })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "28px", color: form.rating >= s ? "#FFD700" : "#ddd" }}>★</button>)}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Your Review</label>
                <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={3} placeholder="Share your experience..."
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>Add Photo (Optional)</label>
                {photoPreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={photoPreview} alt="Preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px" }} />
                    <button onClick={() => { setPhoto(null); setPhotoPreview(""); }} style={{ position: "absolute", top: "4px", right: "4px", background: "#f87171", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "12px" }}>X</button>
                  </div>
                ) : (
                  <label style={{ display: "inline-block", background: "#FFF0F6", border: "2px dashed #FFD6E7", borderRadius: "12px", padding: "16px 24px", cursor: "pointer", fontSize: "13px", color: "#E61D72", fontWeight: 600 }}>
                    + Add Photo
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                  </label>
                )}
              </div>
              <button onClick={handleSubmit} disabled={submitting || !form.customer || !form.artist || !form.comment}
                style={{ background: submitting || !form.customer || !form.artist || !form.comment ? "#ccc" : "#E61D72", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px" }}><p style={{ color: "#888" }}>Loading reviews...</p></div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No reviews yet</p>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Be the first to leave a review!</p>
            <button onClick={() => setShowForm(true)} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "20px", cursor: "pointer", fontWeight: 700 }}>Write First Review</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredReviews.map(review => (
              <div key={review.id} style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>
                      {review.customer[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{review.customer}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Booked: {review.artist}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "1px", justifyContent: "flex-end", marginBottom: "2px" }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: review.rating >= s ? "#FFD700" : "#ddd", fontSize: "14px" }}>★</span>)}
                    </div>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{new Date(review.created_at).toLocaleDateString("en-PH")}</p>
                  </div>
                </div>
                {review.service && <span style={{ background: "#FFF0F6", color: "#E61D72", padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, display: "inline-block", marginBottom: "10px" }}>{review.service}</span>}
                <p style={{ color: "#555", fontSize: "13px", margin: "0 0 12px", lineHeight: 1.6 }}>{review.comment}</p>
                {review.photo && <img src={review.photo} alt="Review" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px" }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
