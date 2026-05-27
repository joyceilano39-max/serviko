"use client";
import { useState } from "react";

const artistsData: Record<string, {
  name: string; slug: string; role: string; image: string; rating: number;
  reviews: number; location: string; available: boolean; superHost: boolean;
  experience: string; bio: string; services: { name: string; price: number; duration: string }[];
  gallery: string[]; badges: string[];
  reviewList: { customer: string; rating: number; comment: string; date: string; avatar: string }[];
}> = {
  "maria-santos": {
    name: "Maria Santos", slug: "maria-santos", role: "Massage Therapist", image: "💆",
    rating: 4.9, reviews: 128, location: "Quezon City", available: true, superHost: true,
    experience: "5-10 years", bio: "Professional massage therapist with 8 years of experience. Specializing in full body, hot stone, and relaxation massage. I bring all equipment and use premium oils. Your comfort and relaxation is my priority! 🌸",
    services: [
      { name: "Full Body Massage", price: 800, duration: "60 mins" },
      { name: "Hot Stone Massage", price: 1000, duration: "90 mins" },
      { name: "Foot Massage", price: 400, duration: "30 mins" },
      { name: "Back & Shoulder Massage", price: 500, duration: "45 mins" },
    ],
    gallery: ["💆", "🌿", "🪨", "💎"],
    badges: ["⭐ Super Artist", "✅ Verified", "🏆 Top Rated", "❤️ 128 Happy Clients"],
    reviewList: [
      { customer: "Joyce Ilano", rating: 5, comment: "Amazing! Best massage I've ever had. Very professional and skilled!", date: "April 12, 2026", avatar: "J" },
      { customer: "Ana Cruz", rating: 5, comment: "So relaxing! Maria is very gentle and thorough. Will definitely book again!", date: "April 10, 2026", avatar: "A" },
      { customer: "Liza Reyes", rating: 5, comment: "Hot stone massage was heavenly. Highly recommend!", date: "April 8, 2026", avatar: "L" },
    ],
  },
  "ana-reyes": {
    name: "Ana Reyes", slug: "ana-reyes", role: "Hair Specialist", image: "✂️",
    rating: 4.8, reviews: 95, location: "Makati", available: true, superHost: true,
    experience: "3-5 years",
    bio: "Creative hair specialist with 4 years of experience. Expert in cutting, styling, and coloring. I use only premium products to keep your hair healthy and beautiful! ✂️",
    services: [
      { name: "Haircut & Styling", price: 500, duration: "45 mins" },
      { name: "Hair Coloring", price: 1200, duration: "120 mins" },
      { name: "Hair Treatment", price: 800, duration: "60 mins" },
      { name: "Blowout & Styling", price: 400, duration: "30 mins" },
    ],
    gallery: ["✂️", "💇", "🎨", "✨"],
    badges: ["⭐ Super Artist", "✅ Verified", "🎨 Color Expert"],
    reviewList: [
      { customer: "Maria Reyes", rating: 5, comment: "Love my new hair! Ana is so talented and listens to what you want.", date: "April 11, 2026", avatar: "M" },
      { customer: "Joy Santos", rating: 4, comment: "Great haircut! Very precise and professional.", date: "April 9, 2026", avatar: "J" },
    ],
  },
  "joy-dela-cruz": {
    name: "Joy Dela Cruz", slug: "joy-dela-cruz", role: "Nail Technician", image: "💅",
    rating: 4.7, reviews: 82, location: "Pasig", available: true, superHost: false,
    experience: "1-2 years",
    bio: "Passionate nail technician with an eye for detail. I specialize in nail art, gel nails, and classic manicure/pedicure. Let me make your nails gorgeous! 💅",
    services: [
      { name: "Manicure", price: 250, duration: "30 mins" },
      { name: "Pedicure", price: 300, duration: "30 mins" },
      { name: "Manicure & Pedicure", price: 450, duration: "60 mins" },
      { name: "Gel Nails", price: 600, duration: "75 mins" },
    ],
    gallery: ["💅", "✨", "🌸", "💎"],
    badges: ["✅ Verified", "🎨 Nail Artist"],
    reviewList: [
      { customer: "Liza Santos", rating: 5, comment: "My nails look so beautiful! Joy is very careful and creative.", date: "April 10, 2026", avatar: "L" },
    ],
  },
  "grace-tan": {
    name: "Grace Tan", slug: "grace-tan", role: "Skin Care Expert", image: "🧖",
    rating: 4.8, reviews: 73, location: "Taguig", available: true, superHost: true,
    experience: "5-10 years",
    bio: "Licensed esthetician with 6 years of experience in facial treatments and skin care. I help you achieve glowing, healthy skin using premium products! 🌟",
    services: [
      { name: "Facial Treatment", price: 650, duration: "60 mins" },
      { name: "Whitening Facial", price: 850, duration: "75 mins" },
      { name: "Anti-aging Facial", price: 950, duration: "90 mins" },
      { name: "Acne Treatment", price: 700, duration: "60 mins" },
    ],
    gallery: ["🧖", "✨", "💎", "🌿"],
    badges: ["⭐ Super Artist", "✅ Verified", "🌟 Skin Expert"],
    reviewList: [
      { customer: "Rose Cruz", rating: 5, comment: "My skin has never looked better! Grace is amazing!", date: "April 9, 2026", avatar: "R" },
      { customer: "Ana Reyes", rating: 5, comment: "Whitening facial really worked! Highly recommend Grace.", date: "April 7, 2026", avatar: "A" },
    ],
  },
};

export default function ArtistProfilePage({ params }: { params: { slug: string } }) {
  const artist = artistsData[params.slug];
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!artist) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F6" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "64px" }}>😔</p>
          <h1 style={{ fontWeight: 900, color: "#E61D72" }}>Artist Not Found</h1>
          <a href="/" style={{ color: "#E61D72", fontWeight: 600 }}>← Back to Home</a>
        </div>
      </div>
    );
  }

  const profileUrl = `https://serviko.dev/artist/${artist.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}&quote=Book ${artist.name} on Serviko! ${artist.role} in ${artist.location}. Starting at ₱${Math.min(...artist.services.map(s => s.price))}`, "_blank");
  };

  const shareOnMessenger = () => {
    window.open(`https://m.me/?link=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #7C3AED 100%)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 900, fontSize: "18px" }}>🌸 Serviko</a>
        <button onClick={() => setShowShare(!showShare)}
          style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
          📤 Share Profile
        </button>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", maxWidth: "400px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Share {artist.name}'s Profile</h3>
              <button onClick={() => setShowShare(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Share this artist with your friends and family!</p>

            {/* Profile Link */}
            <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{profileUrl}</span>
              <button onClick={copyLink} style={{ background: "#E61D72", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, flexShrink: 0, marginLeft: "8px" }}>
                {copied ? "✅ Copied!" : "Copy"}
              </button>
            </div>

            {/* Share Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={shareOnFacebook}
                style={{ background: "#1877F2", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                📘 Share on Facebook
              </button>
              <button onClick={shareOnMessenger}
                style={{ background: "#0084FF", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                💬 Share on Messenger
              </button>
              <button onClick={() => window.open(`viber://forward?text=Book ${artist.name} on Serviko! ${profileUrl}`)}
                style={{ background: "#7360F2", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                📱 Share on Viber
              </button>
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=Book ${artist.name} on Serviko! ${artist.role} in ${artist.location}&url=${encodeURIComponent(profileUrl)}`)}
                style={{ background: "#1DA1F2", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                🐦 Share on Twitter/X
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>

        {/* Profile Card */}
        <div style={{ background: "#fff", borderRadius: "24px", overflow: "hidden", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ background: "linear-gradient(135deg, #FFF0F6 0%, #F5F3FF 100%)", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", margin: "0 auto 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              {artist.image}
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "24px", margin: "0 0 4px" }}>{artist.name}</h1>
            <p style={{ color: "#888", margin: "0 0 12px" }}>{artist.role} • {artist.location}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {artist.badges.map(b => (
                <span key={b} style={{ background: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }}>{b}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72", margin: 0 }}>{artist.rating}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Rating</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72", margin: 0 }}>{artist.reviews}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Reviews</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72", margin: 0 }}>{artist.experience}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Experience</p>
              </div>
            </div>
          </div>

          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: artist.available ? "#22c55e" : "#f87171" }} />
              <span style={{ fontWeight: 600, color: artist.available ? "#22c55e" : "#f87171", fontSize: "14px" }}>
                {artist.available ? "Available for booking" : "Currently busy"}
              </span>
            </div>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7, margin: "0 0 20px" }}>{artist.bio}</p>

            <div style={{ display: "flex", gap: "12px" }}>
              <a href="/booking" style={{ flex: 2, background: artist.available ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "15px", textAlign: "center", display: "block" }}>
                📅 Book Now
              </a>
              <button onClick={() => setShowShare(true)}
                style={{ flex: 1, background: "#FFF0F6", color: "#E61D72", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                📤 Share
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Services & Pricing</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {artist.services.map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FFF0F6", borderRadius: "12px" }}>
                <div>
                  <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{s.name}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>⏱ {s.duration}</p>
                </div>
                <span style={{ fontWeight: 900, color: "#E61D72", fontSize: "16px" }}>₱{s.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontWeight: 700, margin: 0 }}>Reviews</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#FFD700", fontSize: "18px" }}>★</span>
              <span style={{ fontWeight: 700 }}>{artist.rating}</span>
              <span style={{ color: "#888", fontSize: "13px" }}>({artist.reviews})</span>
            </div>
          </div>
          {artist.reviewList.map((r, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: i < artist.reviewList.length - 1 ? "1px solid #FFE4F0" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{r.avatar}</div>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>{r.customer}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#FFD700" }}>{"★".repeat(r.rating)}</div>
                  <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{r.date}</p>
                </div>
              </div>
              <p style={{ color: "#555", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Book CTA */}
        <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #7C3AED 100%)", borderRadius: "20px", padding: "24px", textAlign: "center", color: "#fff" }}>
          <p style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 8px" }}>Ready to book {artist.name}?</p>
          <p style={{ opacity: 0.8, margin: "0 0 16px", fontSize: "13px" }}>Starting at ₱{Math.min(...artist.services.map(s => s.price))}</p>
          <a href="/booking" style={{ background: "#fff", color: "#E61D72", padding: "12px 32px", borderRadius: "25px", textDecoration: "none", fontWeight: 700, fontSize: "15px", display: "inline-block" }}>
            Book Now 🌸
          </a>
        </div>

      </div>
    </div>
  );
}
