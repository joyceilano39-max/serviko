"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ArtistProfilePage() {
  const params = useParams();
  const artistId = params.id;
  const [artist, setArtist] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    if (artistId) fetchAll();
  }, [artistId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [artistRes, svcRes, portRes, revRes] = await Promise.all([
        fetch("/api/artists/" + artistId),
        fetch("/api/artist/services?artistId=" + artistId),
        fetch("/api/portfolio?artistId=" + artistId),
        fetch("/api/reviews?artistId=" + artistId),
      ]);
      const artistData = await artistRes.json();
      const svcData = await svcRes.json();
      const portData = await portRes.json();
      const revData = await revRes.json();
      setArtist(artistData.artist);
      setServices(svcData.services || []);
      setPortfolio(portData.photos || []);
      setReviews(revData.reviews || []);
    } catch {}
    setLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <p style={{ color: "#888" }}>Loading profile...</p>
    </div>
  );

  if (!artist) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial" }}>
      <p style={{ color: "#888" }}>Artist not found.</p>
    </div>
  );

  const isSuperhost = artist.total_reviews >= 10 && parseFloat(artist.rating) >= 4.8;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif", paddingBottom: "80px" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #C01660)", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>back</Link>
        <p style={{ color: "#fff", fontWeight: 700, margin: 0, fontSize: "16px" }}>Artist Profile</p>
      </div>

      <div style={{ background: "#fff", padding: "24px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
          {artist.profile_photo ? (
            <img src={artist.profile_photo} alt={artist.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #E61D72", flexShrink: 0 }} />
          ) : (
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, flexShrink: 0 }}>
              {artist.name?.[0]}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h1 style={{ fontWeight: 900, margin: 0, fontSize: "20px" }}>{artist.name}</h1>
              {isSuperhost && <span style={{ background: "#FFD700", color: "#333", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>SUPERHOST</span>}
            </div>
            <p style={{ color: "#888", fontSize: "13px", margin: "4px 0" }}>{artist.location}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: artist.is_available ? "#F0FDF4" : "#FEF2F2", color: artist.is_available ? "#22c55e" : "#f87171", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
                {artist.is_available ? "Available Now" : "Busy"}
              </span>
              <span style={{ fontSize: "13px", color: "#555" }}>stars {parseFloat(artist.rating || 0).toFixed(1)} ({artist.total_reviews || 0} reviews)</span>
            </div>
          </div>
        </div>
        {artist.experience && (
          <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "10px 14px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px", fontWeight: 600 }}>EXPERIENCE</p>
            <p style={{ fontSize: "13px", color: "#333", margin: 0 }}>{artist.experience}</p>
          </div>
        )}
        {artist.bio && <p style={{ fontSize: "13px", color: "#555", margin: "0 0 16px", lineHeight: 1.6 }}>{artist.bio}</p>}
      </div>

      <div style={{ background: "#fff", display: "flex", borderBottom: "2px solid #f0f0f0", overflowX: "auto" }}>
        {[
          { id: "services", label: "Services" },
          { id: "portfolio", label: "Portfolio (" + portfolio.length + ")" },
          { id: "reviews", label: "Reviews (" + reviews.length + ")" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap",
              color: activeTab === tab.id ? "#E61D72" : "#888", borderBottom: activeTab === tab.id ? "2px solid #E61D72" : "2px solid transparent", marginBottom: "-2px" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        {activeTab === "services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {services.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#888" }}>No services listed yet.</p>
              </div>
            ) : services.map(svc => (
              <div key={svc.id} style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {svc.photo_url && <img src={svc.photo_url} alt={svc.name} style={{ width: "100%", height: "160px", objectFit: "cover" }} />}
                <div style={{ padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "15px" }}>{svc.name}</p>
                    {svc.description && <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>{svc.description}</p>}
                    {svc.duration && <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{svc.duration}</p>}
                  </div>
                  <div style={{ textAlign: "right", marginLeft: "12px" }}>
                    <p style={{ fontWeight: 900, fontSize: "20px", color: "#E61D72", margin: "0 0 8px" }}>P{svc.price}</p>
                    <Link href={"/booking?artistId=" + artist.id + "&artistName=" + encodeURIComponent(artist.name) + "&service=" + encodeURIComponent(svc.name) + "&price=" + svc.price}
                      style={{ background: "#E61D72", color: "#fff", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div>
            {portfolio.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#888" }}>No portfolio photos yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {portfolio.map(photo => (
                  <div key={photo.id} style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
                    <img src={photo.image_url} alt={photo.caption || "Work"} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                    {photo.caption && <p style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "11px", padding: "6px 8px", margin: 0 }}>{photo.caption}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", textAlign: "center" }}>
                <p style={{ color: "#888" }}>No reviews yet. Be the first to book!</p>
              </div>
            ) : (
              <>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight: 900, fontSize: "48px", color: "#E61D72", margin: "0 0 4px" }}>{parseFloat(artist.rating || 0).toFixed(1)}</p>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Based on {reviews.length} reviews</p>
                </div>
                {reviews.map(review => (
                  <div key={review.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{review.customer_name}</p>
                        <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <span style={{ color: "#F59E0B", fontSize: "16px" }}>{"★".repeat(review.rating)}</span>
                    </div>
                    {review.comment && <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{review.comment}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "16px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 900, color: "#E61D72", margin: 0, fontSize: "16px" }}>
            {services.length > 0 ? "From P" + Math.min(...services.map(s => s.price)) : "Contact for price"}
          </p>
          <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Starting price</p>
        </div>
        <Link href={"/booking?artistId=" + artist.id + "&artistName=" + encodeURIComponent(artist.name)}
          style={{ background: "#E61D72", color: "#fff", padding: "14px 28px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}>
          Book Now
        </Link>
      </div>
    </div>
  );
}