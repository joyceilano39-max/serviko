"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Artist = {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profile_photo: string;
  rating: string;
  total_reviews: number;
  real_services: { name: string; price: number; description?: string; duration?: string }[];
};

const categories = [
  { id: "all", label: "All Services", icon: "&#10036;" },
  { id: "cleaning", label: "Cleaning", icon: "&#129529;" },
  { id: "makeup", label: "Makeup", icon: "&#128141;" },
  { id: "hair", label: "Hair", icon: "&#9986;" },
  { id: "nails", label: "Nails", icon: "&#128…;" },
  { id: "massage", label: "Massage", icon: "&#128584;" },
];

export default function ServicesPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/artists")
      .then(r => r.json())
      .then(d => {
        setArtists(d.artists || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = artists.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.real_services || []).some(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: "20px" }}>&#8592;</Link>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: "18px", margin: 0 }}>All Services</h1>
          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Find professional service providers near you</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 20px 0" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search services or artists..."
          style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "8px", padding: "12px 20px", overflowX: "auto" }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "8px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap", background: activeCategory === cat.id ? "#E61D72" : "#fff", color: activeCategory === cat.id ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span dangerouslySetInnerHTML={{ __html: cat.icon }} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Artists & Services */}
      <div style={{ padding: "8px 20px 32px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#888" }}>Loading services...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#888" }}>No services found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(artist => (
              <div key={artist.id} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {/* Artist Info */}
                <div style={{ padding: "16px 16px 12px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F5F3FF", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {artist.profile_photo ? (
                      <img src={artist.profile_photo} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "24px" }}>&#128100;</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: "16px", margin: "0 0 4px" }}>{artist.name}</p>
                    {artist.bio && <p style={{ color: "#888", fontSize: "12px", margin: "0 0 6px", lineHeight: 1.4 }}>{artist.bio}</p>}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#F59E0B", fontSize: "12px" }}>&#9733; {parseFloat(artist.rating || "5").toFixed(2)}</span>
                      <span style={{ color: "#888", fontSize: "11px" }}>({artist.total_reviews || 0} reviews)</span>
                      <Link href={`/artist/${artist.id}`} style={{ color: "#E61D72", fontSize: "11px", fontWeight: 600, textDecoration: "none", marginLeft: "auto" }}>View Profile</Link>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {(artist.real_services || []).length > 0 && (
                  <div style={{ borderTop: "1px solid #f5f5f5" }}>
                    {(artist.real_services || []).map((svc, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: idx < (artist.real_services.length - 1) ? "1px solid #f5f5f5" : "none" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>{svc.name}</p>
                          {svc.description && <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{svc.description}</p>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                          <span style={{ fontWeight: 700, fontSize: "15px", color: "#E61D72" }}>&#8369;{svc.price}</span>
                          <Link href={`/checkout?artistId=${artist.id}&artistName=${encodeURIComponent(artist.name)}&service=${encodeURIComponent(svc.name)}&price=${svc.price}`}
                            style={{ background: "#E61D72", color: "#fff", padding: "8px 14px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "12px", whiteSpace: "nowrap" }}>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
