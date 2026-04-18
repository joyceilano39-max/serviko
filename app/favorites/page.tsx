"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type Favorite = { id: number; artist_id: number; artist_name: string; profile_photo: string; location: string; services: string[]; rating: string; };

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchFavorites(); }, [user]);

  const fetchFavorites = async () => {
    const email = user?.emailAddresses[0]?.emailAddress;
    try {
      const res = await fetch(`/api/favorites?customerEmail=${email}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch {}
    setLoading(false);
  };

  const removeFavorite = async (artistId: number) => {
    const email = user?.emailAddresses[0]?.emailAddress;
    try {
      await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_email: email, artist_id: artistId }) });
      setFavorites(prev => prev.filter(f => f.artist_id !== artistId));
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Dashboard</Link>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>My Favorite Artists</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Your saved artists for quick booking</p>
      </div>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {loading ? <p style={{ textAlign: "center", color: "#888", padding: "48px 0" }}>Loading...</p> : favorites.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px", fontSize: "18px" }}>No favorites yet</p>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Save your favorite artists for quick rebooking!</p>
            <Link href="/" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700 }}>Find Artists</Link>
          </div>
        ) : favorites.map(fav => (
          <div key={fav.id} style={{ background: "#fff", borderRadius: "20px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", overflow: "hidden", background: "#E61D72", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "20px", flexShrink: 0 }}>
                {fav.profile_photo ? <img src={fav.profile_photo} alt={fav.artist_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : fav.artist_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{fav.artist_name}</p>
                <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>{fav.location}</p>
                <p style={{ color: "#FFD700", fontSize: "12px", margin: 0 }}>★ {fav.rating || "New"}</p>
              </div>
              <button onClick={() => removeFavorite(fav.artist_id)} style={{ background: "#FEF2F2", color: "#f87171", border: "none", padding: "8px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "16px", fontWeight: 700 }}>♥</button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <Link href={`/artist/${fav.artist_id}`} style={{ flex: 1, background: "#FFF0F6", color: "#E61D72", padding: "10px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "13px", textAlign: "center" }}>View Profile</Link>
              <Link href={`/booking?artistId=${fav.artist_id}&artistName=${encodeURIComponent(fav.artist_name)}`} style={{ flex: 2, background: "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", padding: "10px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "13px", textAlign: "center" }}>Book Again</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
