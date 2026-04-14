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
  ],
  "Massage & Wellness": [
    { id: 4, name: "Maria Santos", role: "Massage Therapist", image: "💆", rating: 4.9, reviews: 128, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "Full Body Massage", price: 800, duration: "60 mins" }, { name: "Hot Stone Massage", price: 1000, duration: "90 mins" }, { name: "Foot Reflexology", price: 400, duration: "45 mins" }] },
    { id: 5, name: "Grace Tan", role: "Wellness Expert", image: "🌿", rating: 4.8, reviews: 73, location: "Taguig", available: true, superHost: true,
      services: [{ name: "Swedish Massage", price: 700, duration: "60 mins" }, { name: "Prenatal Massage", price: 900, duration: "60 mins" }] },
  ],
  "Skin Care": [
    { id: 6, name: "Grace Tan", role: "Skin Care Expert", image: "🧖", rating: 4.8, reviews: 73, location: "Taguig", available: true, superHost: true,
      services: [{ name: "Basic Facial", price: 500, duration: "45 mins" }, { name: "Whitening Facial", price: 900, duration: "75 mins" }] },
  ],
  "Lash & Brow": [
    { id: 7, name: "Kim Santos", role: "Lash Artist", image: "👁️", rating: 4.7, reviews: 38, location: "BGC", available: true, superHost: false,
      services: [{ name: "Classic Lash Set", price: 800, duration: "90 mins" }, { name: "Eyebrow Threading", price: 150, duration: "15 mins" }] },
  ],
  "Makeup": [
    { id: 8, name: "Belle Reyes", role: "Makeup Artist", image: "💄", rating: 4.9, reviews: 61, location: "Makati", available: true, superHost: true,
      services: [{ name: "Everyday Makeup", price: 800, duration: "45 mins" }, { name: "Bridal Makeup", price: 3500, duration: "2 hrs" }] },
  ],
  "Home Cleaning": [
    { id: 9, name: "Carlos Mendoza", role: "Home Cleaner", image: "🧹", rating: 4.8, reviews: 92, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "1BR Cleaning", price: 800, duration: "2 hrs" }, { name: "2BR Cleaning", price: 1200, duration: "3 hrs" }, { name: "Deep Cleaning", price: 2500, duration: "5 hrs" }, { name: "Kitchen Deep Clean", price: 800, duration: "2 hrs" }] },
    { id: 10, name: "Jenny Cruz", role: "Cleaning Specialist", image: "🧹", rating: 4.6, reviews: 44, location: "Pasig", available: true, superHost: false,
      services: [{ name: "Bathroom Clean", price: 600, duration: "1.5 hrs" }, { name: "Full House Clean", price: 2000, duration: "5 hrs" }, { name: "Laundry Service", price: 350, duration: "2 hrs" }] },
  ],
  "Gardening": [
    { id: 11, name: "Juan Dela Cruz", role: "Gardener", image: "🌿", rating: 4.7, reviews: 55, location: "Quezon City", available: true, superHost: false,
      services: [{ name: "Grass Cutting (small)", price: 500, duration: "1 hr" }, { name: "Full Garden Maintenance", price: 1500, duration: "4 hrs" }, { name: "Plant Trimming", price: 400, duration: "1 hr" }] },
  ],
  "Painting": [
    { id: 12, name: "Pedro Santos", role: "Painter", image: "🎨", rating: 4.8, reviews: 67, location: "Manila", available: true, superHost: true,
      services: [{ name: "1 Room Painting", price: 1500, duration: "1 day" }, { name: "Full House Interior", price: 6000, duration: "3-4 days" }, { name: "Gate Painting", price: 800, duration: "4 hrs" }] },
  ],
  "Home Repair": [
    { id: 13, name: "Rico Villanueva", role: "Handyman", image: "🔧", rating: 4.9, reviews: 88, location: "Quezon City", available: true, superHost: true,
      services: [{ name: "Faucet Repair", price: 400, duration: "1 hr" }, { name: "Electrical Outlet Install", price: 400, duration: "1 hr" }, { name: "Door Repair", price: 500, duration: "1.5 hrs" }] },
  ],
};

const serviceCategories = Object.keys(artistsByCategory);

const transportFees: Record<string, number> = {
  "0-3 km": 50, "3-7 km": 100, "7-15 km": 150, "15+ km": 200,
};

const vouchers: Record<string, { discount: number; type: "fixed" | "percent"; minOrder: number; description: string }> = {
  "FIRST50": { discount: 50, type: "fixed", minOrder: 0, description: "₱50 off first booking" },
  "REFER100": { discount: 100, type: "fixed", minOrder: 500, description: "₱100 referral reward" },
  "SUMMER20": { discount: 20, type: "percent", minOrder: 200, description: "20% summer promo" },
  "LOYAL200": { discount: 200, type: "fixed", minOrder: 800, description: "₱200 loyalty reward" },
  "WELCOME50": { discount: 50, type: "fixed", minOrder: 0, description: "Welcome gift" },
};

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableArtists = selectedCategory ? artistsByCategory[selectedCategory] || [] : [];
  const allServices = familyMembers.flatMap(m => m.services);
  const subtotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const transport = transportFees[distance];
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal + transport - discount);

  const addFamilyMember = () => setFamilyMembers([...familyMembers, { name: `Member ${familyMembers.length + 1}`, services: [] }]);
  const removeMember = (idx: number) => { if (familyMembers.length > 1) setFamilyMembers(familyMembers.filter((_, i) => i !== idx)); };
  const updateMemberName = (idx: number, name: string) => { const u = [...familyMembers]; u[idx].name = name; setFamilyMembers(u); };
  const toggleService = (mIdx: number, service: { name: string; price: number; duration: string }) => {
    const u = [...familyMembers];
    const exists = u[mIdx].services.find(s => s.name === service.name);
    u[mIdx].services = exists ? u[mIdx].services.filter(s => s.name !== service.name) : [...u[mIdx].services, service];
    setFamilyMembers(u);
  };

  const applyVoucher = () => {
    const code = voucherCode.toUpperCase().trim();
    const v = vouchers[code];
    if (!v) { setVoucherMsg("❌ Invalid voucher code."); setAppliedVoucher(null); return; }
    if (subtotal < v.minOrder) { setVoucherMsg(`❌ Minimum order ₱${v.minOrder} required.`); return; }
    const d = v.type === "percent" ? Math.round(subtotal * v.discount / 100) : v.discount;
    setAppliedVoucher({ code, discount: d, description: v.description });
    setVoucherMsg(`✅ Saved ₱${d}!`);
  };

  const handlePay = async () => {
    if (!name || !email) { setError("Please fill in your name and email."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `${selectedCategory} - ${allServices.map(s => s.name).join(", ")}`,
          name, email,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const categoryIcons: Record<string, string> = {
    "Hair Services": "💇", "Nail Services": "💅", "Massage & Wellness": "💆",
    "Skin Care": "🧖", "Lash & Brow": "👁️", "Makeup": "💄",
    "Home Cleaning": "🧹", "Gardening": "🌿", "Painting": "🎨", "Home Repair": "🔧"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Book a Service</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Choose • Schedule • Pay — all in one place!</p>
      </div>

      {/* Steps */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto", gap: "0" }}>
        {[
          { n: 1, label: "Category" },
          { n: 2, label: "Artist" },
          { n: 3, label: "Services" },
          { n: 4, label: "Schedule" },
          { n: 5, label: "Pay" },
        ].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0,
                background: step >= s.n ? "#E61D72" : "#eee", color: step >= s.n ? "#fff" : "#888" }}>{s.n}</div>
              <span style={{ fontSize: "10px", fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#E61D72" : "#888", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < 4 && <div style={{ flex: 1, height: "2px", background: step > s.n ? "#E61D72" : "#eee", margin: "0 4px" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        <div>

          {/* STEP 1: Category */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>What service do you need?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                {serviceCategories.map(cat => (
                  <div key={cat} onClick={() => { setSelectedCategory(cat); setSelectedArtist(null); }}
                    style={{ background: "#fff", borderRadius: "14px", padding: "18px 12px", textAlign: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: selectedCategory === cat ? "2px solid #E61D72" : "2px solid transparent" }}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>{categoryIcons[cat]}</div>
                    <p style={{ fontWeight: 600, fontSize: "12px", margin: 0, color: selectedCategory === cat ? "#E61D72" : "#333" }}>{cat}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => selectedCategory && setStep(2)} disabled={!selectedCategory}
                style={{ width: "100%", marginTop: "16px", background: selectedCategory ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedCategory ? "pointer" : "not-allowed", fontSize: "15px" }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Artist */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Choose Your Artist</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>{selectedCategory}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {availableArtists.map(artist => (
                  <div key={artist.id} onClick={() => setSelectedArtist(artist)}
                    style={{ background: "#fff", borderRadius: "16px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{artist.image}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <p style={{ fontWeight: 700, margin: 0, fontSize: "15px" }}>{artist.name}</p>
                              {artist.superHost && <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "1px 6px", borderRadius: "8px", fontSize: "10px", fontWeight: 700 }}>⭐ SUPER</span>}
                            </div>
                            <p style={{ color: "#888", fontSize: "12px", margin: "2px 0" }}>{artist.role} • {artist.location}</p>
                            <p style={{ fontSize: "12px", margin: 0 }}>⭐ {artist.rating} ({artist.reviews} reviews)</p>
                          </div>
                          {selectedArtist?.id === artist.id && <span style={{ color: "#E61D72", fontSize: "22px" }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => selectedArtist && setStep(3)} disabled={!selectedArtist}
                  style={{ flex: 2, background: selectedArtist ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedArtist ? "pointer" : "not-allowed" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Services */}
          {step === 3 && selectedArtist && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Select Services</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Add family members and pick services</p>
              {familyMembers.map((member, mIdx) => (
                <div key={mIdx} style={{ background: "#fff", borderRadius: "18px", padding: "18px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>{mIdx + 1}</div>
                      <input value={member.name} onChange={e => updateMemberName(mIdx, e.target.value)}
                        style={{ border: "none", fontWeight: 700, fontSize: "14px", outline: "none", background: "transparent", borderBottom: "2px solid #FFD6E7" }} />
                    </div>
                    {mIdx > 0 && <button onClick={() => removeMember(mIdx)} style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>}
                  </div>
                  {selectedArtist.services.map(service => {
                    const sel = member.services.find(s => s.name === service.name);
                    return (
                      <div key={service.name} onClick={() => toggleService(mIdx, service)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                          background: sel ? "#FFF0F6" : "#f8f8f8", border: sel ? "1px solid #E61D72" : "1px solid transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${sel ? "#E61D72" : "#ccc"}`, background: sel ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {sel && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{service.name}</p>
                            <p style={{ margin: 0, color: "#888", fontSize: "11px" }}>⏱ {service.duration}</p>
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, color: "#E61D72" }}>₱{service.price}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              <button onClick={addFamilyMember} style={{ width: "100%", background: "#fff", color: "#E61D72", padding: "12px", borderRadius: "12px", border: "2px dashed #E61D72", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
                + Add Family Member
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
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
              <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📅 Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                      style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>🕐 Time</label>
                    <select value={time} onChange={e => setTime(e.target.value)}
                      style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
                      <option value="">Select time</option>
                      {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📍 Your Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Rizal St, Quezon City"
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>🚗 Distance from Artist</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {Object.entries(transportFees).map(([range, fee]) => (
                      <div key={range} onClick={() => setDistance(range)}
                        style={{ padding: "10px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                          background: distance === range ? "#FFF0F6" : "#f8f8f8", border: distance === range ? "2px solid #E61D72" : "2px solid transparent" }}>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "12px" }}>{range}</p>
                        <p style={{ color: "#E61D72", fontWeight: 700, margin: 0, fontSize: "12px" }}>+₱{fee}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📝 Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Special requests..."
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => date && time && address && setStep(5)} disabled={!date || !time || !address}
                    style={{ flex: 2, background: date && time && address ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: date && time && address ? "pointer" : "not-allowed" }}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Payment */}
          {step === 5 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>💳 Payment</h2>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Contact Info */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 12px", fontSize: "15px" }}>👤 Your Contact Info</h3>
                  {[
                    { label: "Full Name", val: name, set: setName, type: "text", ph: "Joyce Ilano" },
                    { label: "Email", val: email, set: setEmail, type: "email", ph: "joyce@email.com" },
                    { label: "Phone", val: phone, set: setPhone, type: "tel", ph: "09XX XXX XXXX" },
                  ].map(f => (
                    <div key={f.label} style={{ marginBottom: "10px" }}>
                      <label style={{ fontWeight: 600, fontSize: "12px", display: "block", marginBottom: "4px" }}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>

                {/* Voucher */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>🎫 Voucher</h3>
                  {appliedVoucher ? (
                    <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #86EFAC" }}>
                      <div>
                        <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px", fontSize: "13px" }}>✅ {appliedVoucher.code}</p>
                        <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>Save ₱{appliedVoucher.discount}</p>
                      </div>
                      <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); setVoucherMsg(""); }}
                        style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code"
                          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "13px", fontWeight: 600 }} />
                        <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", padding: "10px 16px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>Apply</button>
                      </div>
                      {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171", margin: "0 0 6px" }}>{voucherMsg}</p>}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {Object.entries(vouchers).map(([code, v]) => (
                          <button key={code} onClick={() => setVoucherCode(code)}
                            style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            {code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>💳 Payment Method</h3>
                  {[
                    { id: "gcash", label: "📱 GCash / QR Ph", desc: "Pay via QR code" },
                    { id: "maya", label: "🏦 Maya", desc: "Pay via Maya" },
                    { id: "card", label: "💳 Credit/Debit Card", desc: "Visa, Mastercard" },
                    { id: "cod", label: "💵 Cash on Arrival", desc: "Pay when artist arrives" },
                  ].map(m => (
                    <div key={m.id} onClick={() => setPaymentMethod(m.id)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                        background: paymentMethod === m.id ? "#FFF0F6" : "#f8f8f8", border: paymentMethod === m.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${paymentMethod === m.id ? "#E61D72" : "#ccc"}`, background: paymentMethod === m.id ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {paymentMethod === m.id && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: "13px" }}>{m.label}</p>
                        <p style={{ color: "#888", margin: 0, fontSize: "11px" }}>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setStep(4)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={handlePay} disabled={loading}
                    style={{ flex: 2, background: loading ? "#ccc" : "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                    {loading ? "Processing..." : `Pay ₱${total} 🌸`}
                  </button>
                </div>
                <p style={{ textAlign: "center", color: "#888", fontSize: "11px", margin: 0 }}>🔒 Secured by PayMongo</p>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Summary */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "18px", padding: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "14px" }}>📋 Summary</h3>
            {selectedCategory && (
              <div style={{ background: "#FFF0F6", borderRadius: "8px", padding: "8px 10px", marginBottom: "10px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "12px", color: "#E61D72" }}>{categoryIcons[selectedCategory]} {selectedCategory}</p>
                {selectedArtist && <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>🎨 {selectedArtist.name}</p>}
              </div>
            )}
            {familyMembers.map((member, i) => member.services.length > 0 && (
              <div key={i} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: 600, fontSize: "11px", margin: "0 0 3px", color: "#E61D72" }}>👤 {member.name}</p>
                {member.services.map(s => (
                  <div key={s.name} style={{ fontSize: "11px", marginBottom: "2px", paddingLeft: "8px" }}>
                    <span style={{ color: "#555" }}>• {s.name}</span>
                  </div>
                ))}
              </div>
            ))}
            {allServices.length > 0 && (
              <div style={{ borderTop: "1px solid #FFE4F0", paddingTop: "8px", marginTop: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span><span>₱{subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span style={{ color: "#888" }}>🚗 Transport</span><span>₱{transport}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                    <span style={{ color: "#22c55e" }}>🎫 Voucher</span><span style={{ color: "#22c55e" }}>-₱{discount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "16px", borderTop: "1px solid #FFE4F0", paddingTop: "8px", marginTop: "4px" }}>
                  <span>Total</span><span style={{ color: "#E61D72" }}>₱{total}</span>
                </div>
              </div>
            )}
            {date && time && (
              <div style={{ background: "#FFF0F6", borderRadius: "8px", padding: "8px", marginTop: "8px", fontSize: "11px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 600 }}>📅 {date} at {time}</p>
                {address && <p style={{ margin: 0, color: "#888" }}>📍 {address}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
