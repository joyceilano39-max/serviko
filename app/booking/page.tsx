"use client";
import { useState } from "react";

const artistsByCategory: Record<string, {
  id: number; name: string; role: string; image: string; rating: number;
  reviews: number; location: string; available: boolean; superHost: boolean;
  services: { name: string; price: number; duration: string }[];
}[]> = {
  "Hair Services": [
    { id: 1, name: "Ana Reyes", role: "Hair Specialist", image: "✂️", rating: 4.8, reviews: 95, location: "Makati", available: true, superHost: true,
      services: [{ name: "Haircut & Styling", price: 500, duration: "45 mins" }, { name: "Hair Coloring (Loreal)", price: 1200, duration: "2 hrs" }, { name: "Rebond", price: 1800, duration: "3 hrs" }] },
    { id: 2, name: "Rose Santos", role: "Hair Artist", image: "💇", rating: 4.6, reviews: 54, location: "Quezon City", available: true, superHost: false,
      services: [{ name: "Men's Haircut", price: 200, duration: "20 mins" }, { name: "Boys Haircut", price: 150, duration: "20 mins" }, { name: "Haircut + Blow Dry", price: 500, duration: "45 mins" }] },
  ],
  "Nail Services": [
    { id: 3, name: "Joy Dela Cruz", role: "Nail Technician", image: "💅", rating: 4.7, reviews: 82, location: "Pasig", available: true, superHost: false,
      services: [{ name: "Basic Manicure", price: 200, duration: "30 mins" }, { name: "Gel Pedicure", price: 500, duration: "45 mins" }, { name: "Mani + Pedi", price: 450, duration: "60 mins" }] },
    { id: 4, name: "Liza Cruz", role: "Nail Artist", image: "💅", rating: 4.5, reviews: 41, location: "Mandaluyong", available: true, superHost: false,
      services: [{ name: "Gel Manicure", price: 450, duration: "45 mins" }, { name: "Nail Art", price: 50, duration: "5 mins" }, { name: "Diabetic Pedicure", price: 500, duration: "75 mins" }] },
  ],
  "Massage & Wellness": [
    { id: 5, name: "Maria Santos", role: "Massage Therapist", image: "💆", rating: 4.9, reviews: 128, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "Full Body Massage", price: 800, duration: "60 mins" }, { name: "Hot Stone Massage", price: 1000, duration: "90 mins" }, { name: "Foot Reflexology", price: 400, duration: "45 mins" }] },
    { id: 6, name: "Grace Tan", role: "Wellness Expert", image: "🌿", rating: 4.8, reviews: 73, location: "Taguig", available: true, superHost: true,
      services: [{ name: "Swedish Massage", price: 700, duration: "60 mins" }, { name: "Prenatal Massage", price: 900, duration: "60 mins" }, { name: "Aromatherapy", price: 850, duration: "60 mins" }] },
  ],
  "Skin Care": [
    { id: 7, name: "Grace Tan", role: "Skin Care Expert", image: "🧖", rating: 4.8, reviews: 73, location: "Taguig", available: true, superHost: true,
      services: [{ name: "Basic Facial", price: 500, duration: "45 mins" }, { name: "Whitening Facial", price: 900, duration: "75 mins" }, { name: "Acne Treatment", price: 850, duration: "75 mins" }] },
  ],
  "Lash & Brow": [
    { id: 8, name: "Kim Santos", role: "Lash Artist", image: "👁️", rating: 4.7, reviews: 38, location: "BGC", available: true, superHost: false,
      services: [{ name: "Classic Lash Set", price: 800, duration: "90 mins" }, { name: "Eyebrow Threading", price: 150, duration: "15 mins" }, { name: "Lash Refill", price: 500, duration: "60 mins" }] },
  ],
  "Makeup": [
    { id: 9, name: "Belle Reyes", role: "Makeup Artist", image: "💄", rating: 4.9, reviews: 61, location: "Makati", available: true, superHost: true,
      services: [{ name: "Everyday Makeup", price: 800, duration: "45 mins" }, { name: "Bridal Makeup", price: 3500, duration: "2 hrs" }, { name: "Party Makeup", price: 1200, duration: "60 mins" }] },
  ],
  "Home Cleaning": [
    { id: 10, name: "Carlos Mendoza", role: "Home Cleaner", image: "🧹", rating: 4.8, reviews: 92, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "1BR Cleaning", price: 800, duration: "2 hrs" }, { name: "2BR Cleaning", price: 1200, duration: "3 hrs" }, { name: "Deep Cleaning", price: 2500, duration: "5 hrs" }] },
    { id: 11, name: "Jenny Cruz", role: "Cleaning Specialist", image: "🧹", rating: 4.6, reviews: 44, location: "Pasig", available: true, superHost: false,
      services: [{ name: "Kitchen Deep Clean", price: 800, duration: "2 hrs" }, { name: "Bathroom Clean", price: 600, duration: "1.5 hrs" }, { name: "Full House Clean", price: 2000, duration: "5 hrs" }] },
  ],
  "Gardening": [
    { id: 12, name: "Juan Dela Cruz", role: "Gardener", image: "🌿", rating: 4.7, reviews: 55, location: "Quezon City", available: true, superHost: false,
      services: [{ name: "Grass Cutting (small)", price: 500, duration: "1 hr" }, { name: "Full Garden Maintenance", price: 1500, duration: "4 hrs" }, { name: "Plant Trimming", price: 400, duration: "1 hr" }] },
  ],
  "Painting": [
    { id: 13, name: "Pedro Santos", role: "Painter", image: "🎨", rating: 4.8, reviews: 67, location: "Manila", available: true, superHost: true,
      services: [{ name: "1 Room Painting", price: 1500, duration: "1 day" }, { name: "Full House Interior", price: 6000, duration: "3-4 days" }, { name: "Gate Painting", price: 800, duration: "4 hrs" }] },
  ],
  "Home Repair": [
    { id: 14, name: "Rico Villanueva", role: "Handyman", image: "🔧", rating: 4.9, reviews: 88, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "Faucet Repair", price: 400, duration: "1 hr" }, { name: "Electrical Outlet Install", price: 400, duration: "1 hr" }, { name: "Door Repair", price: 500, duration: "1.5 hrs" }] },
  ],
};

const serviceCategories = Object.keys(artistsByCategory);
const transportFees: Record<string, number> = { "0-3 km": 50, "3-7 km": 100, "7-15 km": 150, "15+ km": 200 };

type FamilyMember = { name: string; services: { name: string; price: number; duration: string }[] };

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<typeof artistsByCategory[string][0] | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ name: "Myself", services: [] }]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("0-3 km");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState(false);

  const availableArtists = selectedCategory ? artistsByCategory[selectedCategory] || [] : [];

  const addFamilyMember = () => setFamilyMembers([...familyMembers, { name: `Member ${familyMembers.length + 1}`, services: [] }]);
  const removeMember = (idx: number) => { if (familyMembers.length > 1) setFamilyMembers(familyMembers.filter((_, i) => i !== idx)); };
  const updateMemberName = (idx: number, name: string) => { const u = [...familyMembers]; u[idx].name = name; setFamilyMembers(u); };

  const toggleService = (mIdx: number, service: { name: string; price: number; duration: string }) => {
    const u = [...familyMembers];
    const exists = u[mIdx].services.find(s => s.name === service.name);
    u[mIdx].services = exists ? u[mIdx].services.filter(s => s.name !== service.name) : [...u[mIdx].services, service];
    setFamilyMembers(u);
  };

  const allServices = familyMembers.flatMap(m => m.services);
  const subtotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const transport = transportFees[distance];
  const total = subtotal + transport;
  const totalDuration = allServices.reduce((sum, s) => {
    const mins = parseInt(s.duration) || 0;
    return sum + mins;
  }, 0);

  if (booked) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "40px 32px", textAlign: "center", maxWidth: "480px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontWeight: 900, color: "#22c55e", margin: "0 0 8px" }}>Booking Confirmed!</h1>
          <p style={{ color: "#888", margin: "0 0 24px" }}>Your artist is on the way!</p>
          <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "20px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ fontWeight: 700, margin: "0 0 12px" }}>Booking Summary</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>🎨 {selectedArtist?.name} ({selectedCategory})</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>📅 {date} at {time}</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>📍 {address}</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>👥 {familyMembers.length} member(s)</p>
            <div style={{ borderTop: "1px solid #BBF7D0", marginTop: "12px", paddingTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ color: "#888" }}>Subtotal</span><span>₱{subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                <span style={{ color: "#888" }}>Transport</span><span>₱{transport}</span>
              </div>
              <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "20px", margin: 0, display: "flex", justifyContent: "space-between" }}>
                <span>Total</span><span>₱{total}</span>
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="/checkout" style={{ flex: 2, background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center", fontSize: "15px" }}>
              💳 Proceed to Payment
            </a>
            <a href="/tracking" style={{ flex: 1, background: "#f0f0f0", color: "#555", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>
              📍 Track
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Book a Service</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Book for yourself or the whole family 👨‍👩‍👧‍👦</p>
      </div>

      {/* Steps */}
      <div style={{ background: "#fff", padding: "16px 24px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[{ n: 1, label: "Category" }, { n: 2, label: "Artist" }, { n: 3, label: "Services" }, { n: 4, label: "Schedule" }].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0,
                background: step >= s.n ? "#E61D72" : "#eee", color: step >= s.n ? "#fff" : "#888" }}>{s.n}</div>
              <span style={{ fontSize: "11px", fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#E61D72" : "#888", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: "2px", background: step > s.n ? "#E61D72" : "#eee", margin: "0 6px" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        <div>

          {/* STEP 1: Category */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>What service do you need?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {serviceCategories.map(cat => {
                  const icons: Record<string, string> = {
                    "Hair Services": "💇", "Nail Services": "💅", "Massage & Wellness": "💆",
                    "Skin Care": "🧖", "Lash & Brow": "👁️", "Makeup": "💄",
                    "Home Cleaning": "🧹", "Gardening": "🌿", "Painting": "🎨", "Home Repair": "🔧"
                  };
                  return (
                    <div key={cat} onClick={() => { setSelectedCategory(cat); setSelectedArtist(null); }}
                      style={{ background: "#fff", borderRadius: "16px", padding: "20px 16px", textAlign: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        border: selectedCategory === cat ? "2px solid #E61D72" : "2px solid transparent" }}>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icons[cat] || "🌸"}</div>
                      <p style={{ fontWeight: 600, fontSize: "13px", margin: 0, color: selectedCategory === cat ? "#E61D72" : "#333" }}>{cat}</p>
                      <p style={{ color: "#888", fontSize: "11px", margin: "4px 0 0" }}>{artistsByCategory[cat]?.length || 0} artists</p>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => selectedCategory && setStep(2)} disabled={!selectedCategory}
                style={{ width: "100%", marginTop: "20px", background: selectedCategory ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedCategory ? "pointer" : "not-allowed", fontSize: "15px" }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Artist */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Choose Your Artist</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>{selectedCategory} • {availableArtists.length} available</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {availableArtists.map(artist => (
                  <div key={artist.id} onClick={() => setSelectedArtist(artist)}
                    style={{ background: "#fff", borderRadius: "16px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{artist.image}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <p style={{ fontWeight: 700, margin: 0 }}>{artist.name}</p>
                              {artist.superHost && <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "2px 6px", borderRadius: "8px", fontSize: "10px", fontWeight: 700 }}>⭐ SUPER</span>}
                            </div>
                            <p style={{ color: "#888", fontSize: "12px", margin: "2px 0" }}>{artist.role} • {artist.location}</p>
                            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                              <span style={{ color: "#FFD700", fontSize: "12px" }}>★</span>
                              <span style={{ fontSize: "12px", fontWeight: 600 }}>{artist.rating}</span>
                              <span style={{ color: "#888", fontSize: "11px" }}>({artist.reviews})</span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ background: "#F0FDF4", color: "#22c55e", padding: "3px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>🟢 Available</span>
                            {selectedArtist?.id === artist.id && <p style={{ color: "#E61D72", fontSize: "20px", margin: "4px 0 0" }}>✓</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => selectedArtist && setStep(3)} disabled={!selectedArtist}
                  style={{ flex: 2, background: selectedArtist ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedArtist ? "pointer" : "not-allowed" }}>
                  Continue with {selectedArtist?.name || "Artist"} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Services */}
          {step === 3 && selectedArtist && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Select Services</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Add family members and pick services for each</p>
              {familyMembers.map((member, mIdx) => (
                <div key={mIdx} style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px" }}>{mIdx + 1}</div>
                      <input value={member.name} onChange={e => updateMemberName(mIdx, e.target.value)}
                        style={{ border: "none", fontWeight: 700, fontSize: "15px", outline: "none", background: "transparent", borderBottom: "2px solid #FFD6E7", paddingBottom: "2px" }} />
                    </div>
                    {mIdx > 0 && <button onClick={() => removeMember(mIdx)} style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "12px" }}>Remove</button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedArtist.services.map(service => {
                      const selected = member.services.find(s => s.name === service.name);
                      return (
                        <div key={service.name} onClick={() => toggleService(mIdx, service)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                            background: selected ? "#FFF0F6" : "#f8f8f8", border: selected ? "1px solid #E61D72" : "1px solid transparent" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selected ? "#E61D72" : "#ccc"}`, background: selected ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {selected && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{service.name}</p>
                              <p style={{ margin: 0, color: "#888", fontSize: "11px" }}>⏱ {service.duration}</p>
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, color: "#E61D72", fontSize: "14px" }}>₱{service.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={addFamilyMember} style={{ width: "100%", background: "#fff", color: "#E61D72", padding: "12px", borderRadius: "12px", border: "2px dashed #E61D72", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
                + Add Family Member
              </button>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => allServices.length > 0 && setStep(4)} disabled={allServices.length === 0}
                  style={{ flex: 2, background: allServices.length > 0 ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: allServices.length > 0 ? "pointer" : "not-allowed" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Schedule */}
          {step === 4 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Schedule & Location</h2>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📅 Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>🕐 Time</label>
                    <select value={time} onChange={e => setTime(e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
                      <option value="">Select time</option>
                      {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📍 Your Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Rizal St, Quezon City"
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "10px" }}>🚗 Distance from Artist</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {Object.entries(transportFees).map(([range, fee]) => (
                      <div key={range} onClick={() => setDistance(range)}
                        style={{ padding: "10px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                          background: distance === range ? "#FFF0F6" : "#f8f8f8", border: distance === range ? "2px solid #E61D72" : "2px solid transparent" }}>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "13px" }}>{range}</p>
                        <p style={{ color: "#E61D72", fontWeight: 700, margin: 0, fontSize: "13px" }}>+₱{fee}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📝 Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Special requests or instructions..."
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => date && time && address && setBooked(true)} disabled={!date || !time || !address}
                    style={{ flex: 2, background: date && time && address ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: date && time && address ? "pointer" : "not-allowed" }}>
                    Confirm Booking 🎉
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 16px", fontSize: "15px" }}>Booking Summary</h3>
            {selectedCategory && (
              <div style={{ background: "#FFF0F6", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "13px", color: "#E61D72" }}>{selectedCategory}</p>
                {selectedArtist && <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>🎨 {selectedArtist.name}</p>}
              </div>
            )}
            {familyMembers.map((member, i) => member.services.length > 0 && (
              <div key={i} style={{ marginBottom: "10px" }}>
                <p style={{ fontWeight: 600, fontSize: "12px", margin: "0 0 4px", color: "#E61D72" }}>👤 {member.name}</p>
                {member.services.map(s => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "2px", paddingLeft: "10px" }}>
                    <span style={{ color: "#555" }}>{s.name}</span>
                    <span style={{ fontWeight: 600 }}>₱{s.price}</span>
                  </div>
                ))}
              </div>
            ))}
            {allServices.length > 0 && (
              <div style={{ borderTop: "1px solid #FFE4F0", paddingTop: "10px", marginTop: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span><span>₱{subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
                  <span style={{ color: "#888" }}>🚗 Transport</span><span>₱{transport}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "16px", borderTop: "1px solid #FFE4F0", paddingTop: "8px" }}>
                  <span>Total</span><span style={{ color: "#E61D72" }}>₱{total}</span>
                </div>
                {totalDuration > 0 && <p style={{ color: "#888", fontSize: "11px", margin: "6px 0 0", textAlign: "center" }}>⏱ Est. {totalDuration} mins</p>}
              </div>
            )}
            {date && time && (
              <div style={{ background: "#FFF0F6", borderRadius: "10px", padding: "10px", marginTop: "10px", fontSize: "12px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 600 }}>📅 {date}</p>
                <p style={{ margin: "0 0 2px", color: "#888" }}>🕐 {time}</p>
                {address && <p style={{ margin: 0, color: "#888" }}>📍 {address}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
