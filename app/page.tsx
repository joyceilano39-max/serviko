"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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

type Artist = {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  photo: string;
  hourly_rate: number;
  location: string;
};

const services = [
  { id: "all", name: "All", icon: "⭐" },
  { id: "hair", name: "Hair", icon: "💇" },
  { id: "nails", name: "Nails", icon: "💅" },
  { id: "massage", name: "Massage", icon: "💆" },
  { id: "skin", name: "Skin", icon: "✨" },
  { id: "lash", name: "Lash", icon: "👁️" },
  { id: "makeup", name: "Makeup", icon: "💄" },
  { id: "cleaning", name: "Cleaning", icon: "🧹" },
  { id: "garden", name: "Garden", icon: "🌿" },
  { id: "painting", name: "Painting", icon: "🎨" },
  { id: "repair", name: "Repair", icon: "🔧" },
];

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("all");
  const [currentPromo, setCurrentPromo] = useState(0);

  useEffect(() => {
    fetchVouchers();
    fetchArtists();
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % Math.min(vouchers.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [vouchers]);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/vouchers");
      const data = await res.json();
      setVouchers(data.vouchers || []);
    } catch {
      setVouchers([]);
    }
  };

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/artists");
      const data = await res.json();
      setArtists(data.artists || []);
    } catch {
      setArtists([]);
    }
    setLoading(false);
  };

  const filteredArtists =
    selectedService === "all"
      ? artists
      : artists.filter((a) =>
          a.service?.toLowerCase()?.includes(selectedService.toLowerCase())
        );

  const topVouchers = vouchers.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontSize: "24px", fontWeight: 900, color: "#E61D72", textDecoration: "none" }}>
          Serviko
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/vouchers" style={{ color: "#E61D72", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
            Vouchers
          </Link>
          {isSignedIn ? (
            <Link href="/dashboard" style={{ background: "#E61D72", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/customer-login" style={{ background: "#E61D72", color: "#fff", padding: "8px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "40px 24px", color: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {isSignedIn ? (
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 8px" }}>
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p style={{ opacity: 0.9, fontSize: "16px", margin: "0 0 24px" }}>
                Ready to book your next service?
              </p>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 8px" }}>
                Beauty & Home Services at Your Doorstep
              </h1>
              <p style={{ opacity: 0.9, fontSize: "16px", margin: "0 0 24px" }}>
                Book trusted professionals in Quezon City
              </p>
            </div>
          )}

          {/* Promo Banner Carousel */}
          {topVouchers.length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "16px", padding: "20px 24px", backdropFilter: "blur(10px)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🎟️</span>
                    <p style={{ fontWeight: 900, fontSize: "18px", margin: 0 }}>
                      {topVouchers[currentPromo]?.code}
                    </p>
                  </div>
                  <p style={{ opacity: 0.9, fontSize: "14px", margin: 0 }}>
                    {topVouchers[currentPromo]?.description}
                  </p>
                </div>
                <button onClick={() => {
                  navigator.clipboard.writeText(topVouchers[currentPromo]?.code);
                  alert("Code copied!");
                }} style={{ background: "#fff", color: "#E61D72", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                  Copy Code
                </button>
              </div>
              {/* Carousel Dots */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "12px" }}>
                {topVouchers.map((_, i) => (
                  <div key={i} onClick={() => setCurrentPromo(i)} style={{ width: i === currentPromo ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === currentPromo ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          )}

          {!isSignedIn && (
            <Link href="/register/customer" style={{ display: "inline-block", background: "#fff", color: "#E61D72", padding: "14px 32px", borderRadius: "24px", textDecoration: "none", fontWeight: 700, fontSize: "15px", marginTop: "20px" }}>
              Sign Up & Get ₱50 Off! 🎁
            </Link>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Service Categories */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "20px" }}>What do you need?</h2>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
            {services.map((s) => (
              <button key={s.id} onClick={() => setSelectedService(s.id)} style={{ padding: "10px 18px", borderRadius: "24px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap", background: selectedService === s.id ? "#E61D72" : "#fff", color: selectedService === s.id ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deal Banner */}
        <div style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", borderRadius: "20px", padding: "20px 24px", marginBottom: "32px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>⚡ Flash Deal Today!</p>
            <p style={{ opacity: 0.9, fontSize: "13px", margin: 0 }}>Massage services 15% off until 6PM</p>
          </div>
          <Link href="/services?category=massage" style={{ background: "#fff", color: "#D97706", padding: "10px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "13px" }}>
            Grab Now
          </Link>
        </div>

        {/* Featured Artists */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontWeight: 900, margin: 0, fontSize: "20px" }}>Featured Professionals</h2>
            <Link href="/services" style={{ color: "#E61D72", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
              See All →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ color: "#888" }}>Loading professionals...</p>
            </div>
          ) : filteredArtists.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No professionals found</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Try selecting a different category</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredArtists.slice(0, 8).map((artist) => (
                <Link key={artist.id} href={`/artist/${artist.id}${isSignedIn ? '' : '?action=signup'}`} style={{ background: "#fff", borderRadius: "16px", padding: "16px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s", display: "block" }} onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <div style={{ width: "100%", height: "200px", borderRadius: "12px", background: "#F5F3FF", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", overflow: "hidden" }}>
                    {artist.photo ? (
                      <img src={artist.photo} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: "16px", margin: "0 0 4px", color: "#333" }}>
                    {artist.name}
                  </p>
                  <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>
                    {artist.service}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#F59E0B" }}>⭐</span>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>
                        {artist.rating} ({artist.reviews})
                      </span>
                    </div>
                    <p style={{ fontWeight: 700, color: "#E61D72", margin: 0, fontSize: "15px" }}>
                      ₱{artist.hourly_rate}/hr
                    </p>
                  </div>
                  <p style={{ color: "#888", fontSize: "12px", margin: "8px 0 0" }}>
                    📍 {artist.location}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Referral CTA */}
        {isSignedIn && (
          <Link href="/referral" style={{ display: "block", background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: "20px", padding: "24px", marginBottom: "32px", textDecoration: "none", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>🎁 Refer & Earn ₱100</p>
                <p style={{ opacity: 0.9, fontSize: "13px", margin: 0 }}>Share Serviko with friends and both get rewards!</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: "20px", fontWeight: 700, fontSize: "13px" }}>
                Share Now
              </div>
            </div>
          </Link>
        )}

        {/* All Vouchers Section */}
        {vouchers.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontWeight: 900, margin: 0, fontSize: "20px" }}>Active Promos</h2>
              <Link href="/vouchers" style={{ color: "#E61D72", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
                View All →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
              {vouchers.slice(0, 6).map((v, i) => {
                const colors = ["#E61D72", "#7C3AED", "#22c55e", "#F59E0B", "#3b82f6"];
                const color = colors[i % colors.length];
                return (
                  <div key={v.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontWeight: 900, fontSize: "16px", color, margin: "0 0 4px" }}>
                          {v.code}
                        </p>
                        <p style={{ color: "#555", fontSize: "13px", margin: "0 0 4px" }}>
                          {v.description}
                        </p>
                        <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>
                          {v.min_order > 0 ? `Min. ₱${v.min_order}` : "No minimum"} • {v.expiry_date}
                        </p>
                      </div>
                      <button onClick={() => {
                        navigator.clipboard.writeText(v.code);
                        alert("Code copied!");
                      }} style={{ background: color, color: "#fff", border: "none", padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap" }}>
                        Copy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {!isSignedIn && (
        <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "48px 24px", textAlign: "center", color: "#fff" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 12px" }}>Ready to get started?</h2>
          <p style={{ opacity: 0.9, fontSize: "16px", margin: "0 0 24px" }}>Join thousands of satisfied customers</p>
          <Link href="/register/customer" style={{ background: "#fff", color: "#E61D72", padding: "14px 32px", borderRadius: "24px", textDecoration: "none", fontWeight: 700, fontSize: "15px", display: "inline-block" }}>
            Sign Up Now - Get ₱50 Off
          </Link>
        </div>
      )}
    </div>
  );
}
