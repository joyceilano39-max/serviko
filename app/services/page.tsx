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
  { id: "all", name: "All Services", icon: "⭐" },
  { id: "cleaning", name: "Cleaning", icon: "🧹" },
  { id: "makeup", name: "Makeup", icon: "💄" },
  { id: "hair", name: "Hair", icon: "💇" },
  { id: "nails", name: "Nails", icon: "💅" },
  { id: "massage", name: "Massage", icon: "💆" },
];

export default function ServicesPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    // Get category from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
      const category = params.get('category');
      if (category) {
        setSelectedCategory(category);
      }
    }
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/artists");
      const data = await res.json();
      setArtists(data.artists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
      setArtists([]);
    }
    setLoading(false);
  };

  // Smart category matching - automatically shows artists based on their services
  const getCategoryKeywords = (category: string): string[] => {
    const keywords: Record<string, string[]> = {
      cleaning: ["clean", "grease", "air bnb", "airbnb", "move out", "move in", "pesticide", "disinfect", "sanitize"],
      hair: ["hair", "haircut", "style", "color", "highlight", "balayage", "perm", "rebond", "treatment"],
      nails: ["nail", "manicure", "pedicure", "gel", "polish", "acrylic"],
      makeup: ["makeup", "make up", "foundation", "eyebrow", "lash", "contour"],
      massage: ["massage", "spa", "therapy", "relaxation", "swedish", "deep tissue", "shiatsu"],
      skin: ["facial", "skin", "peel", "treatment", "glow", "whitening"],
      lash: ["lash", "eyelash", "extension", "lift"],
      garden: ["garden", "lawn", "landscape", "plant", "trim", "hedge"],
      painting: ["paint", "repaint", "wall", "ceiling", "interior", "exterior"],
      repair: ["repair", "fix", "plumbing", "electric", "leak", "install", "aircon", "appliance"]
    };
    return keywords[category] || [category];
  };

  const filteredArtists = selectedCategory === "all" 
    ? artists 
    : artists.filter(artist => {
        const keywords = getCategoryKeywords(selectedCategory);
        return artist.real_services?.some(service => {
          const serviceName = service.name.toLowerCase();
          return keywords.some(keyword => serviceName.includes(keyword));
        });
      });

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #7C3AED 100%)", padding: "24px 24px 40px", color: "#fff" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "16px 0 8px" }}>
          {selectedCategory === "all" ? "All Services" : categories.find(c => c.id === selectedCategory)?.name}
        </h1>
        <p style={{ opacity: 0.9, fontSize: "14px", margin: 0 }}>
          Find professional service providers near you
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #E5E7EB", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content" }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? "#E61D72" : "#f0f0f0",
                color: selectedCategory === cat.id ? "#fff" : "#555",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Artists & Services */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#888" }}>
            <p>Loading services...</p>
          </div>
        ) : filteredArtists.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🔍</p>
            <p style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 8px" }}>No services found</p>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 16px" }}>Try selecting a different category</p>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                background: "#E61D72",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "20px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              View All Services
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {filteredArtists.map(artist => (
              <div key={artist.id} style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {/* Artist Header */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" }}>
                  <img 
                    src={artist.profile_photo} 
                    alt={artist.name}
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px" }}>{artist.name}</h2>
                    <p style={{ color: "#888", fontSize: "14px", margin: "0 0 8px" }}>{artist.bio}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#F59E0B", fontSize: "16px" }}>⭐</span>
                      <span style={{ fontWeight: 700, fontSize: "14px" }}>{artist.rating}</span>
                      <span style={{ color: "#888", fontSize: "13px" }}>({artist.total_reviews} reviews)</span>
                    </div>
                  </div>
                  <Link 
                    href={`/artist/${artist.id}`}
                    style={{
                      background: "#F5F3FF",
                      color: "#7C3AED",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "13px",
                      height: "fit-content"
                    }}
                  >
                    View Profile
                  </Link>
                </div>

                {/* Services */}
                <div style={{ display: "grid", gap: "12px" }}>
                  {artist.real_services?.map((service, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: "#f8f8f8",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>{service.name}</h3>
                        {service.description && (
                          <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px", lineHeight: "1.5" }}>
                            {service.description}
                          </p>
                        )}
                        {service.duration && (
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                            ⏱️ {service.duration}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right", minWidth: "120px" }}>
                        <p style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72", margin: "0 0 8px" }}>
                          ₱{service.price}
                        </p>
                        <Link
                          href={`/booking?artistId=${artist.id}&artistName=${encodeURIComponent(artist.name)}&service=${encodeURIComponent(service.name)}&price=${service.price}`}
                          style={{
                            display: "inline-block",
                            background: "#E61D72",
                            color: "#fff",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            textDecoration: "none",
                            fontWeight: 700,
                            fontSize: "13px"
                          }}
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}