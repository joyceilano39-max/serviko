"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const promos = [
  { id: 1, title: "First Booking!", desc: "Get P50 OFF your first service", code: "FIRST50", bg: "linear-gradient(135deg, #E61D72, #C01660)" },
  { id: 2, title: "Summer Special", desc: "20% OFF all massage services", code: "SUMMER20", bg: "linear-gradient(135deg, #7C3AED, #5B21B6)" },
  { id: 3, title: "Refer a Friend", desc: "Earn P100 for every referral", code: "REFER100", bg: "linear-gradient(135deg, #22c55e, #15803d)" },
];

const categories = [
  { name: "Hair", keyword: "Hair" },
  { name: "Nails", keyword: "Manicure" },
  { name: "Massage", keyword: "Massage" },
  { name: "Skin", keyword: "Facial" },
  { name: "Lash", keyword: "Lash" },
  { name: "Makeup", keyword: "Makeup" },
  { name: "Cleaning", keyword: "Cleaning" },
  { name: "Garden", keyword: "Garden" },
  { name: "Painting", keyword: "Painting" },
  { name: "Repair", keyword: "Repair" },
];

const getArtistLabel = (services: string[]) => {
  if (!services?.length) return "Artist";
  if (services.some(s => s.toLowerCase().includes("hair"))) return "Hair";
  if (services.some(s => s.toLowerCase().includes("massage"))) return "Massage";
  if (services.some(s => s.toLowerCase().includes("nail") || s.toLowerCase().includes("manicure"))) return "Nails";
  if (services.some(s => s.toLowerCase().includes("facial"))) return "Skin";
  if (services.some(s => s.toLowerCase().includes("lash"))) return "Lash";
  if (services.some(s => s.toLowerCase().includes("makeup"))) return "Makeup";
  if (services.some(s => s.toLowerCase().includes("clean"))) return "Cleaning";
  return "Service";
};

const getStartingPrice = (services: string[]) => {
  const prices: Record<string, number> = {
    
    "makeup": 800, "clean": 800, "garden": 500, "wax": 200, "eyebrow": 150,
  };
  if (!services) return 300;
  let min = 999999;
  for (const service of services) {
    for (const [key, price] of Object.entries(prices)) {
      if (service.toLowerCase().includes(key) && price < min) min = price;
    }
  }
  return min === 999999 ? 300 : min;
};

type Artist = {
  id: number; name: string; bio: string; experience: string;
  services: string[]; location: string; is_available: boolean;
  rating: string; total_reviews: number;
  distance_text?: string; distance_km?: number; transport_fee?: number; profile_photo?: string;
};

export default function HomePage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(true);
  const [savedAddress, setSavedAddress] = useState("");
  const [address, setAddress] = useState("");
  const [currentPromo, setCurrentPromo] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [notifyArtist, setNotifyArtist] = useState<Artist | null>(null);
  const [similarArtist, setSimilarArtist] = useState<Artist | null>(null);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetch(`/api/artists?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`)
            .then(res => res.json())
            .then(data => { setArtists(data.artists || []); setLoading(false); });
        },
        () => {
          fetch("/api/artists")
            .then(res => res.json())
            .then(data => { setArtists(data.artists || []); setLoading(false); });
        }
      );
    } else {
      fetch("/api/artists")
        .then(res => res.json())
        .then(data => { setArtists(data.artists || []); setLoading(false); });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentPromo(prev => (prev + 1) % promos.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const copyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const getSimilarArtists = (artist: Artist) => {
    return artists.filter(a => a.id !== artist.id && a.is_available &&
      a.services.some(s => artist.services.some(as => s.toLowerCase().includes(as.toLowerCase().split(" ")[0]))));
  };

  const filteredArtists = artists.filter(a => {
    const matchesSearch = search === "" || a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.services || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "" ||
      (a.services || []).some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>

      {/* Address Modal */}
      {showAddressModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "32px 24px", width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontWeight: 700, fontSize: "20px" }}>P</div>
              <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>Where are you?</h2>
              <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>We will show you the nearest artists!</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div onClick={() => {
                navigator.geolocation?.getCurrentPosition(pos => {
                  setSavedAddress("Current Location");
                  setShowAddressModal(false);
                });
              }} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#FFF0F6", borderRadius: "12px", padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>GPS</div>
                <span style={{ fontWeight: 600, color: "#E61D72", fontSize: "14px" }}>Use Current Location</span>
              </div>

              <a href="/map-pin" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#F5F3FF", borderRadius: "12px", padding: "14px 16px", cursor: "pointer", textDecoration: "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px", flexShrink: 0 }}>MAP</div>
                <span style={{ fontWeight: 600, color: "#7C3AED", fontSize: "14px" }}>Pin My Location on Map</span>
              </a>

              <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Type your address..."
                style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />

              <p style={{ fontWeight: 600, fontSize: "12px", color: "#888", margin: 0 }}>SAVED ADDRESSES</p>
              {[
                { label: "Home", addr: "FCM North Fairview, Quezon City" },
                { label: "Work", addr: "Ayala Ave, Makati City" }
              ].map(s => (
                <div key={s.label} onClick={() => { setSavedAddress(s.addr); setShowAddressModal(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF0F6", color: "#E61D72", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px", flexShrink: 0 }}>{s.label[0]}</div>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>{s.label}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{s.addr}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setSavedAddress(address || "Quezon City"); setShowAddressModal(false); }}
              style={{ width: "100%", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Notify Me Modal */}
      {notifyArtist && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
            {!notified ? (
              <>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#FFF9E6", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>!</div>
                <h3 style={{ fontWeight: 900, margin: "0 0 8px" }}>Notify Me</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>We will notify you when <strong>{notifyArtist.name}</strong> becomes available!</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setNotifyArtist(null)}
                    style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => setNotified(true)}
                    style={{ flex: 2, background: "#E61D72", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Notify Me!</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#F0FDF4", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>OK</div>
                <h3 style={{ fontWeight: 900, margin: "0 0 8px", color: "#22c55e" }}>You are on the list!</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>We will notify you when {notifyArtist.name} is available.</p>
                <button onClick={() => { setNotifyArtist(null); setNotified(false); }}
                  style={{ width: "100%", background: "#E61D72", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Done</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Similar Artists Modal */}
      {similarArtist && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontWeight: 900, margin: "0 0 4px" }}>Similar Artists</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Available now with similar services</p>
              </div>
              <button onClick={() => setSimilarArtist(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>X</button>
            </div>
            {getSimilarArtists(similarArtist).length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px" }}>
                <p style={{ color: "#888" }}>No similar artists available right now.</p>
              </div>
            ) : (
              getSimilarArtists(similarArtist).map(artist => (
                <div key={artist.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#E61D72" }}>
                      {getArtistLabel(artist.services)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{artist.name}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{artist.location}</p>
                      <p style={{ color: "#22c55e", fontSize: "11px", margin: 0, fontWeight: 600 }}>Available Now</p>
                    </div>
                  </div>
                  <Link href={`/booking?artistId=${artist.id}&artistName=${encodeURIComponent(artist.name)}`}
                    onClick={() => setSimilarArtist(null)}
                    style={{ background: "#E61D72", color: "#fff", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                    Book
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ color: "#E61D72", fontWeight: 900, fontSize: "20px", textDecoration: "none" }}>Serviko</Link>
        <button onClick={() => setShowAddressModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FFF0F6", border: "none", padding: "8px 12px", borderRadius: "20px", cursor: "pointer", flex: 1, maxWidth: "200px", margin: "0 12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#E61D72", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{savedAddress || "Set Location"}</span>
          <span style={{ color: "#E61D72", fontSize: "10px" }}>â–¼</span>
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/vouchers" style={{ background: "#FFF0F6", color: "#E61D72", padding: "7px 12px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}>Vouchers</Link>
          <Link href="/sign-in" style={{ background: "#E61D72", color: "#fff", padding: "7px 14px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>Login</Link>
        </div>
      </nav>

      {/* Search */}
      <div style={{ background: "#fff", padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", borderRadius: "25px", padding: "10px 16px", gap: "8px" }}>
          <span style={{ color: "#888", fontSize: "13px" }}>Search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services, artists..."
            style={{ border: "none", background: "transparent", flex: 1, fontSize: "14px", outline: "none" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer" }}>X</button>}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px" }}>

        {/* Promo Banner */}
        <div style={{ marginBottom: "20px" }}>
          <div onClick={() => copyPromo(promos[currentPromo].code)}
            style={{ background: promos[currentPromo].bg, borderRadius: "20px", padding: "20px 24px", color: "#fff", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 900, fontSize: "20px", margin: "0 0 4px" }}>{promos[currentPromo].title}</p>
                <p style={{ opacity: 0.9, margin: "0 0 12px", fontSize: "13px" }}>{promos[currentPromo].desc}</p>
                <div style={{ background: "rgba(255,255,255,0.25)", display: "inline-block", padding: "6px 14px", borderRadius: "20px" }}>
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>
                    {copiedCode === promos[currentPromo].code ? "Copied!" : `Code: ${promos[currentPromo].code} - Tap to copy`}
                  </span>
                </div>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px" }}>%</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "10px" }}>
            {promos.map((_, i) => (
              <div key={i} onClick={() => setCurrentPromo(i)}
                style={{ width: i === currentPromo ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === currentPromo ? "#E61D72" : "#ddd", cursor: "pointer", transition: "width 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "18px" }}>What do you need?</h2>
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" }}>
            <button onClick={() => setSelectedCategory("")}
              style={{ flexShrink: 0, padding: "10px 16px", borderRadius: "25px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "12px", background: selectedCategory === "" ? "#E61D72" : "#fff", color: selectedCategory === "" ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat.name} onClick={() => setSelectedCategory(selectedCategory === cat.keyword ? "" : cat.keyword)}
                style={{ flexShrink: 0, padding: "10px 16px", borderRadius: "16px", border: "none", cursor: "pointer", minWidth: "64px",
                  background: selectedCategory === cat.keyword ? "#E61D72" : "#fff", color: selectedCategory === cat.keyword ? "#fff" : "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontWeight: 600, fontSize: "12px" }}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deal */}
        <div style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", borderRadius: "16px", padding: "14px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontWeight: 900, margin: "0 0 2px", fontSize: "15px" }}>Flash Deal Today!</p>
            <p style={{ color: "#333", fontSize: "12px", margin: 0 }}>Massage services 15% off until 6PM</p>
          </div>
          <Link href="/services" style={{ background: "#fff", color: "#D97706", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "12px" }}>Grab Now</Link>
        </div>

        {/* Artists */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px", fontSize: "18px" }}>
                {selectedCategory ? `${selectedCategory} Artists` : "Artists Near You"}
              </h2>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                {savedAddress || "Set location"} - {filteredArtists.filter(a => a.is_available).length} available now
              </p>
            </div>
            <Link href="/services" style={{ color: "#E61D72", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>See All</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ color: "#888" }}>Finding artists near you...</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredArtists.map(artist => (
                <div key={artist.id} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                  <div style={{ background: "linear-gradient(135deg, #FFF0F6, #F5F3FF)", padding: "20px", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {artist.profile_photo ? (
                        <img src={(artist as any).profile_photo} alt={artist.name}
                          style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
                          {getArtistLabel(artist.services)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{artist.name}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{artist.location}</p>
                        {artist.distance_text && (
                          <p style={{ color: "#E61D72", fontSize: "11px", margin: "0 0 2px", fontWeight: 600 }}>{artist.distance_text}</p>
                        )}
                        <p style={{ fontSize: "11px", margin: 0 }}>â˜… {parseFloat(artist.rating).toFixed(1)} ({artist.total_reviews} reviews)</p>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                      <span style={{ background: artist.is_available ? "#22c55e" : "#f87171", color: "#fff", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>
                        {artist.is_available ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {(artist.services || []).slice(0, 3).map(s => (
                        <span key={s} style={{ background: "#FFF0F6", color: "#E61D72", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>{s}</span>
                      ))}
                      {(artist.services || []).length > 3 && (
                        <span style={{ background: "#f0f0f0", color: "#888", padding: "3px 8px", borderRadius: "20px", fontSize: "10px" }}>+{artist.services.length - 3}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>Starting at</p>
                        <p style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px", margin: 0 }}>P{getStartingPrice(artist.services)}</p>
                        {artist.transport_fee && <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>+P{artist.transport_fee} transport</p>}
                      </div>
                      {artist.is_available ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Link href={`/artist/${artist.name.toLowerCase().replace(/ /g, "-")}`}
                            style={{ background: "#FFF0F6", color: "#E61D72", padding: "8px 10px", borderRadius: "20px", textDecoration: "none", fontSize: "11px", fontWeight: 600 }}>
                            Profile
                          </Link>
                          <Link href={`/booking?artistId=${artist.id}&artistName=${encodeURIComponent(artist.name)}`}
                            style={{ background: "#E61D72", color: "#fff", padding: "8px 14px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                            Book
                          </Link>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                          <Link href={`/booking?artistId=${artist.id}&artistName=${encodeURIComponent(artist.name)}&schedule=true`}
                            style={{ background: "#7C3AED", color: "#fff", padding: "6px 12px", borderRadius: "20px", textDecoration: "none", fontSize: "11px", fontWeight: 700 }}>
                            Schedule
                          </Link>
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button onClick={() => setNotifyArtist(artist)}
                              style={{ background: "#FFF9E6", color: "#D97706", border: "none", padding: "5px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>
                              Notify
                            </button>
                            <button onClick={() => setSimilarArtist(artist)}
                              style={{ background: "#F0FDF4", color: "#22c55e", border: "none", padding: "5px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>
                              Similar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginTop: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, margin: "0 0 20px", textAlign: "center", fontSize: "18px" }}>How Serviko Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            {[
              { title: "Set Location", desc: "Tell us where you are" },
              { title: "Browse", desc: "Find artists near you" },
              { title: "Book", desc: "Pick date and time" },
              { title: "Pay", desc: "GCash, Maya or Card" },
              { title: "Enjoy!", desc: "Artist comes to you" },
            ].map(item => (
              <div key={item.title} style={{ textAlign: "center", padding: "16px 12px", background: "#FFF0F6", borderRadius: "16px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "13px" }}>{item.title}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Become Artist */}
        <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: "20px", padding: "24px", marginTop: "20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "80px" }}>
          <div>
            <p style={{ fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>Become a Serviko Artist!</p>
            <p style={{ opacity: 0.8, margin: "0 0 12px", fontSize: "13px" }}>Earn money on your own schedule. Keep 90%!</p>
            <Link href="/register/artist" style={{ background: "#fff", color: "#7C3AED", padding: "10px 20px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "13px" }}>
              Register Now
            </Link>
          </div>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "24px", color: "#fff" }}>P</div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "10px 0", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-around", zIndex: 50 }}>
        {[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Book", href: "/booking" },
          { label: "Map", href: "/map-pin" },
          { label: "Track", href: "/tracking" },
          { label: "Profile", href: "/dashboard" },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", textDecoration: "none", color: "#888", minWidth: "50px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600 }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}




