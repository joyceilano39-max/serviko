"use client";
import { useState, useEffect } from "react";

const transportFees: Record<string, number> = {
  "0-3 km": 50, "3-7 km": 100, "7-15 km": 150, "15+ km": 200,
};

const vouchers: Record<string, { discount: number; type: "fixed" | "percent"; minOrder: number }> = {
  "FIRST50": { discount: 50, type: "fixed", minOrder: 0 },
  "REFER100": { discount: 100, type: "fixed", minOrder: 500 },
  "SUMMER20": { discount: 20, type: "percent", minOrder: 200 },
  "LOYAL200": { discount: 200, type: "fixed", minOrder: 800 },
  "WELCOME50": { discount: 50, type: "fixed", minOrder: 0 },
};

const servicePrices: Record<string, number> = {
  "Haircut & Styling": 500, "Men's / Boys Haircut": 200, "Hair Coloring": 1200,
  "Rebond / Keratin": 1800, "Full Body Massage": 800, "Hot Stone Massage": 1000,
  "Foot Reflexology": 400, "Facial Treatment": 650, "Whitening Facial": 900,
  "Manicure": 250, "Pedicure": 300, "Manicure & Pedicure": 450, "Gel Nails": 600,
  "Lash Extensions": 800, "Eyebrow Threading": 150, "Makeup": 800,
  "House Cleaning": 800, "Deep Cleaning": 2500, "Gardening": 500,
  "Painting": 1500, "Body Waxing": 500,
};

const getServicePrice = (service: string) => {
  for (const [key, price] of Object.entries(servicePrices)) {
    if (service.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(service.toLowerCase())) {
      return price;
    }
  }
  return 300;
};

type Artist = {
  id: number; name: string; bio: string; experience: string;
  services: string[]; location: string; is_available: boolean;
  rating: string; total_reviews: number;
};

type FamilyMember = { name: string; services: { name: string; price: number; duration: string }[] };

export default function BookingPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
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
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchArtist, setSearchArtist] = useState("");

  useEffect(() => {
    fetch("/api/artists")
      .then(res => res.json())
      .then(data => { setArtists(data.artists || []); setLoadingArtists(false); })
      .catch(() => setLoadingArtists(false));
  }, []);

  const filteredArtists = artists.filter(a =>
    searchArtist === "" ||
    a.name.toLowerCase().includes(searchArtist.toLowerCase()) ||
    a.services.some(s => s.toLowerCase().includes(searchArtist.toLowerCase())) ||
    a.location.toLowerCase().includes(searchArtist.toLowerCase())
  );

  const addFamilyMember = () => setFamilyMembers([...familyMembers, { name: `Member ${familyMembers.length + 1}`, services: [] }]);
  const removeMember = (idx: number) => { if (familyMembers.length > 1) setFamilyMembers(familyMembers.filter((_, i) => i !== idx)); };
  const updateMemberName = (idx: number, n: string) => { const u = [...familyMembers]; u[idx].name = n; setFamilyMembers(u); };

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
    setAppliedVoucher({ code, discount: d });
    setVoucherMsg(`✅ Saved ₱${d}!`);
  };

  const allServices = familyMembers.flatMap(m => m.services);
  const subtotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const transport = transportFees[distance];
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal + transport - discount);

  const handlePay = async () => {
    if (!name || !email) { setError("Please fill in your name and email."); return; }
    // Save booking data to localStorage so checkout can read it
    const bookingData = {
      artistName: selectedArtist?.name,
      artistId: selectedArtist?.id,
      date, time, address, distance, notes,
      memberCount: familyMembers.length,
      services: allServices.map(s => s.name),
      subtotal, transport: transportFees[distance], total,
    };
    localStorage.setItem("serviko_booking", JSON.stringify(bookingData));
    window.location.href = "/checkout";
  };

  const getArtistEmoji = (services: string[]) => {
    if (services.some(s => s.toLowerCase().includes("hair"))) return "✂️";
    if (services.some(s => s.toLowerCase().includes("massage"))) return "💆";
    if (services.some(s => s.toLowerCase().includes("nail") || s.toLowerCase().includes("manicure"))) return "💅";
    if (services.some(s => s.toLowerCase().includes("facial"))) return "🧖";
    if (services.some(s => s.toLowerCase().includes("lash"))) return "👁️";
    if (services.some(s => s.toLowerCase().includes("makeup"))) return "💄";
    if (services.some(s => s.toLowerCase().includes("clean"))) return "🧹";
    return "🌸";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>Book a Service</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Book for yourself or the whole family 👨‍👩‍👧‍👦</p>
      </div>

      {/* Steps */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[{ n: 1, label: "Artist" }, { n: 2, label: "Services" }, { n: 3, label: "Schedule" }, { n: 4, label: "Pay" }].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px",
                background: step >= s.n ? "#E61D72" : "#eee", color: step >= s.n ? "#fff" : "#888" }}>{s.n}</div>
              <span style={{ fontSize: "11px", fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#E61D72" : "#888", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: "2px", background: step > s.n ? "#E61D72" : "#eee", margin: "0 6px" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        <div>

          {/* STEP 1: Choose Artist */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Choose Your Artist</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>{artists.length} artists available</p>

              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: "12px", padding: "10px 16px", gap: "8px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <span>🔍</span>
                <input value={searchArtist} onChange={e => setSearchArtist(e.target.value)} placeholder="Search by name, service, location..."
                  style={{ border: "none", background: "transparent", flex: 1, fontSize: "14px", outline: "none" }} />
              </div>

              {loadingArtists ? (
                <div style={{ textAlign: "center", padding: "48px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌸</div>
                  <p style={{ color: "#888" }}>Loading artists...</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredArtists.map(artist => (
                    <div key={artist.id} onClick={() => setSelectedArtist(artist)}
                      style={{ background: "#fff", borderRadius: "16px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent",
                        opacity: artist.is_available ? 1 : 0.6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                          {getArtistEmoji(artist.services)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{artist.name}</p>
                              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>📍 {artist.location} • {artist.experience}</p>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {artist.services.slice(0, 3).map(s => (
                                  <span key={s} style={{ background: "#FFF0F6", color: "#E61D72", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>{s}</span>
                                ))}
                                {artist.services.length > 3 && <span style={{ background: "#f0f0f0", color: "#888", padding: "2px 8px", borderRadius: "20px", fontSize: "10px" }}>+{artist.services.length - 3}</span>}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <span style={{ background: artist.is_available ? "#F0FDF4" : "#FEF2F2", color: artist.is_available ? "#22c55e" : "#f87171", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>
                                {artist.is_available ? "🟢 Available" : "🔴 Busy"}
                              </span>
                              <p style={{ color: "#FFD700", fontSize: "12px", margin: "4px 0 0" }}>★ {parseFloat(artist.rating).toFixed(1)}</p>
                              {selectedArtist?.id === artist.id && <p style={{ color: "#E61D72", fontSize: "18px", margin: "2px 0 0" }}>✓</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => selectedArtist && setStep(2)} disabled={!selectedArtist}
                style={{ width: "100%", marginTop: "16px", background: selectedArtist ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedArtist ? "pointer" : "not-allowed", fontSize: "15px" }}>
                Continue with {selectedArtist?.name || "Artist"} →
              </button>
            </div>
          )}

          {/* STEP 2: Services */}
          {step === 2 && selectedArtist && (
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
                  {selectedArtist.services.map(serviceName => {
                    const price = getServicePrice(serviceName);
                    const service = { name: serviceName, price, duration: "60 mins" };
                    const sel = member.services.find(s => s.name === serviceName);
                    return (
                      <div key={serviceName} onClick={() => toggleService(mIdx, service)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                          background: sel ? "#FFF0F6" : "#f8f8f8", border: sel ? "1px solid #E61D72" : "1px solid transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${sel ? "#E61D72" : "#ccc"}`, background: sel ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {sel && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
                          </div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{serviceName}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: "#E61D72" }}>₱{price}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              <button onClick={addFamilyMember} style={{ width: "100%", background: "#fff", color: "#E61D72", padding: "12px", borderRadius: "12px", border: "2px dashed #E61D72", fontWeight: 700, cursor: "pointer", marginBottom: "12px" }}>
                + Add Family Member
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => allServices.length > 0 && setStep(3)} disabled={allServices.length === 0}
                  style={{ flex: 2, background: allServices.length > 0 ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: allServices.length > 0 ? "pointer" : "not-allowed" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule */}
          {step === 3 && (
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
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>🚗 Transport Fee</label>
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
                  <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => date && time && address && setStep(4)} disabled={!date || !time || !address}
                    style={{ flex: 2, background: date && time && address ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: date && time && address ? "pointer" : "not-allowed" }}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>💳 Payment</h2>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 12px", fontSize: "15px" }}>👤 Contact Info</h3>
                  {[
                    { label: "Full Name", val: name, set: setName, type: "text", ph: "Your name" },
                    { label: "Email", val: email, set: setEmail, type: "email", ph: "your@email.com" },
                    { label: "Phone", val: phone, set: setPhone, type: "tel", ph: "09XX XXX XXXX" },
                  ].map(f => (
                    <div key={f.label} style={{ marginBottom: "10px" }}>
                      <label style={{ fontWeight: 600, fontSize: "12px", display: "block", marginBottom: "4px" }}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>🎫 Voucher</h3>
                  {appliedVoucher ? (
                    <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #86EFAC" }}>
                      <p style={{ fontWeight: 700, color: "#22c55e", margin: 0, fontSize: "13px" }}>✅ {appliedVoucher.code} — Save ₱{appliedVoucher.discount}</p>
                      <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); setVoucherMsg(""); }}
                        style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code"
                          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "13px", fontWeight: 600 }} />
                        <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", padding: "10px 16px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer" }}>Apply</button>
                      </div>
                      {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171", margin: "0 0 6px" }}>{voucherMsg}</p>}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {["FIRST50", "SUMMER20", "REFER100"].map(code => (
                          <button key={code} onClick={() => setVoucherCode(code)}
                            style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            {code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>💳 Payment Method</h3>
                  {[
                    { id: "gcash", label: "📱 GCash", desc: "Pay via GCash" },
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
                  <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
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

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "18px", padding: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "14px" }}>📋 Summary</h3>
            {selectedArtist && (
              <div style={{ background: "#FFF0F6", borderRadius: "8px", padding: "8px 10px", marginBottom: "10px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "12px", color: "#E61D72" }}>{getArtistEmoji(selectedArtist.services)} {selectedArtist.name}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>📍 {selectedArtist.location}</p>
              </div>
            )}
            {familyMembers.map((member, i) => member.services.length > 0 && (
              <div key={i} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: 600, fontSize: "11px", margin: "0 0 3px", color: "#E61D72" }}>👤 {member.name}</p>
                {member.services.map(s => (
                  <div key={s.name} style={{ fontSize: "11px", marginBottom: "2px", paddingLeft: "8px", color: "#555" }}>• {s.name}</div>
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
