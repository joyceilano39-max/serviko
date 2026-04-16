"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  "haircut": 500, "boys haircut": 150, "men": 200, "hair color": 1200,
  "rebond": 1800, "keratin": 1500, "full body massage": 800,
  "hot stone": 1000, "foot": 400, "facial": 650, "whitening": 900,
  "manicure": 250, "pedicure": 300, "gel nails": 600, "lash": 800,
  "eyebrow": 150, "makeup": 800, "cleaning": 800, "deep clean": 2500,
  "garden": 500, "painting": 1500, "waxing": 200,
};

const getServicePrice = (service: string) => {
  const lower = service.toLowerCase();
  for (const [key, price] of Object.entries(servicePrices)) {
    if (lower.includes(key)) return price;
  }
  return 300;
};

const getToday = () => new Date().toISOString().split("T")[0];

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:00 ${ampm}`;
};

const savedAddresses = [
  { id: 1, icon: "ðŸ ", label: "Home", address: "FCM North Fairview, Quezon City", isDefault: true },
  { id: 2, icon: "ðŸ’¼", label: "Work", address: "Ayala Ave, Makati City", isDefault: false },
  { id: 3, icon: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§", label: "Parents", address: "San Antonio, Quezon City", isDefault: false },
];

type Artist = {
  id: number; name: string; services: string[];
  location: string; is_available: boolean; rating: string;
};

type FamilyMember = { name: string; services: { name: string; price: number }[] };

function BookingContent() {
  const searchParams = useSearchParams();
  const artistIdParam = searchParams.get("artistId");
  const artistNameParam = searchParams.get("artistName");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(artistIdParam ? 2 : 1);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ name: "Myself", services: [] }]);

  // Schedule - defaults set automatically
  const [date, setDate] = useState(getToday());
  const [time, setTime] = useState(getCurrentTime());
  const [distance, setDistance] = useState("0-3 km");
  const [notes, setNotes] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

  // Payment
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchArtist, setSearchArtist] = useState("");

  useEffect(() => {
    fetch("/api/artists")
      .then(res => res.json())
      .then(data => {
        const list = data.artists || [];
        setArtists(list);
        setLoading(false);
        // Auto-select artist if coming from homepage
        if (artistIdParam) {
          const found = list.find((a: Artist) => a.id === parseInt(artistIdParam));
          if (found) setSelectedArtist(found);
          else if (artistNameParam) {
            setSelectedArtist({ id: parseInt(artistIdParam), name: decodeURIComponent(artistNameParam), services: [], location: "", is_available: true, rating: "5.00" });
          }
        }
      })
      .catch(() => setLoading(false));
  }, [artistIdParam, artistNameParam]);

  const getArtistEmoji = (services: string[]) => {
    if (!services?.length) return "ðŸŒ¸";
    if (services.some(s => s.toLowerCase().includes("hair"))) return "âœ‚ï¸";
    if (services.some(s => s.toLowerCase().includes("massage"))) return "ðŸ’†";
    if (services.some(s => s.toLowerCase().includes("nail") || s.toLowerCase().includes("manicure"))) return "ðŸ’…";
    if (services.some(s => s.toLowerCase().includes("facial"))) return "ðŸ§–";
    if (services.some(s => s.toLowerCase().includes("clean"))) return "ðŸ§¹";
    return "ðŸŒ¸";
  };

  const addFamilyMember = () => setFamilyMembers([...familyMembers, { name: `Member ${familyMembers.length + 1}`, services: [] }]);
  const removeMember = (idx: number) => { if (familyMembers.length > 1) setFamilyMembers(familyMembers.filter((_, i) => i !== idx)); };
  const updateMemberName = (idx: number, n: string) => { const u = [...familyMembers]; u[idx].name = n; setFamilyMembers(u); };

  const toggleService = (mIdx: number, serviceName: string) => {
    const price = getServicePrice(serviceName);
    const u = [...familyMembers];
    const exists = u[mIdx].services.find(s => s.name === serviceName);
    u[mIdx].services = exists ? u[mIdx].services.filter(s => s.name !== serviceName) : [...u[mIdx].services, { name: serviceName, price }];
    setFamilyMembers(u);
  };

  const applyVoucher = () => {
    const code = voucherCode.toUpperCase().trim();
    const v = vouchers[code];
    if (!v) { setVoucherMsg("âŒ Invalid code."); setAppliedVoucher(null); return; }
    if (subtotal < v.minOrder) { setVoucherMsg(`âŒ Min. order â‚±${v.minOrder}`); return; }
    const d = v.type === "percent" ? Math.round(subtotal * v.discount / 100) : v.discount;
    setAppliedVoucher({ code, discount: d });
    setVoucherMsg(`âœ… Saved â‚±${d}!`);
  };

  const allServices = familyMembers.flatMap(m => m.services);
  const subtotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const transport = transportFees[distance];
  const discount = appliedVoucher?.discount || 0;
  const total = Math.max(0, subtotal + transport - discount);

  const handlePay = async () => {
    if (!name || !email) { setError("Please fill in your name and email."); return; }
    setPayLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `Serviko - ${allServices.map(s => s.name).join(", ")}`,
          name, email,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setPayLoading(false); return; }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Payment failed. Please try again.");
      setPayLoading(false);
    }
  };

  const filteredArtists = artists.filter(a =>
    searchArtist === "" ||
    a.name.toLowerCase().includes(searchArtist.toLowerCase()) ||
    (a.services || []).some(s => s.toLowerCase().includes(searchArtist.toLowerCase()))
  );

  const steps = artistIdParam
    ? [{ n: 1, label: "Services" }, { n: 2, label: "Schedule" }, { n: 3, label: "Pay" }]
    : [{ n: 1, label: "Artist" }, { n: 2, label: "Services" }, { n: 3, label: "Schedule" }, { n: 4, label: "Pay" }];

  const actualStep = artistIdParam ? step - 1 : step;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>â† Home</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>
          {selectedArtist ? `Book ${selectedArtist.name}` : "Book a Service"}
        </h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Book for yourself or the whole family ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦</p>
      </div>

      {/* Steps */}
      <div style={{ background: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {(artistIdParam ? [{ n: 2, label: "Services" }, { n: 3, label: "Schedule" }, { n: 4, label: "Pay" }] : [{ n: 1, label: "Artist" }, { n: 2, label: "Services" }, { n: 3, label: "Schedule" }, { n: 4, label: "Pay" }]).map((s, i, arr) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px",
                background: step >= s.n ? "#E61D72" : "#eee", color: step >= s.n ? "#fff" : "#888" }}>{i + 1}</div>
              <span style={{ fontSize: "11px", fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#E61D72" : "#888", whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: "2px", background: step > s.n ? "#E61D72" : "#eee", margin: "0 4px" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        <div>

          {/* STEP 1: Artist (only if not pre-selected) */}
          {step === 1 && !artistIdParam && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Choose Your Artist</h2>
              <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: "12px", padding: "10px 16px", gap: "8px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <span>ðŸ”</span>
                <input value={searchArtist} onChange={e => setSearchArtist(e.target.value)} placeholder="Search by name or service..."
                  style={{ border: "none", background: "transparent", flex: 1, fontSize: "14px", outline: "none" }} />
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "48px" }}>
                  <div style={{ fontSize: "40px" }}>ðŸŒ¸</div>
                  <p style={{ color: "#888" }}>Loading artists...</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filteredArtists.map(artist => (
                    <div key={artist.id} onClick={() => setSelectedArtist(artist)}
                      style={{ background: "#fff", borderRadius: "16px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                          {getArtistEmoji(artist.services)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{artist.name}</p>
                              <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>ðŸ“ {artist.location}</p>
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {(artist.services || []).slice(0, 3).map(s => (
                                  <span key={s} style={{ background: "#FFF0F6", color: "#E61D72", padding: "2px 6px", borderRadius: "10px", fontSize: "10px" }}>{s}</span>
                                ))}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ background: artist.is_available ? "#F0FDF4" : "#FEF2F2", color: artist.is_available ? "#22c55e" : "#f87171", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600 }}>
                                {artist.is_available ? "ðŸŸ¢ Available" : "ðŸ”´ Busy"}
                              </span>
                              {selectedArtist?.id === artist.id && <p style={{ color: "#E61D72", fontSize: "18px", margin: "4px 0 0" }}>âœ“</p>}
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
                Continue with {selectedArtist?.name || "Artist"} â†’
              </button>
            </div>
          )}

          {/* STEP 2: Services */}
          {step === 2 && selectedArtist && (
            <div>
              <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{getArtistEmoji(selectedArtist.services)}</span>
                <div>
                  <p style={{ fontWeight: 700, margin: 0 }}>{selectedArtist.name}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>ðŸ“ {selectedArtist.location}</p>
                </div>
                {!artistIdParam && <button onClick={() => setStep(1)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#E61D72", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>Change</button>}
              </div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Select Services</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Pick services for each family member</p>
              {familyMembers.map((member, mIdx) => (
                <div key={mIdx} style={{ background: "#fff", borderRadius: "18px", padding: "16px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" }}>{mIdx + 1}</div>
                      <input value={member.name} onChange={e => updateMemberName(mIdx, e.target.value)}
                        style={{ border: "none", fontWeight: 700, fontSize: "14px", outline: "none", background: "transparent", borderBottom: "2px solid #FFD6E7" }} />
                    </div>
                    {mIdx > 0 && <button onClick={() => removeMember(mIdx)} style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>}
                  </div>
                  {(selectedArtist.services || []).map(serviceName => {
                    const price = getServicePrice(serviceName);
                    const sel = member.services.find(s => s.name === serviceName);
                    return (
                      <div key={serviceName} onClick={() => toggleService(mIdx, serviceName)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                          background: sel ? "#FFF0F6" : "#f8f8f8", border: sel ? "1px solid #E61D72" : "1px solid transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${sel ? "#E61D72" : "#ccc"}`, background: sel ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {sel && <span style={{ color: "#fff", fontSize: "9px" }}>âœ“</span>}
                          </div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "13px" }}>{serviceName}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: "#E61D72", fontSize: "13px" }}>â‚±{price}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              <button onClick={addFamilyMember} style={{ width: "100%", background: "#fff", color: "#E61D72", padding: "10px", borderRadius: "12px", border: "2px dashed #E61D72", fontWeight: 700, cursor: "pointer", marginBottom: "12px", fontSize: "13px" }}>
                + Add Family Member
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                {!artistIdParam && <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>â† Back</button>}
                <button onClick={() => allServices.length > 0 && setStep(3)} disabled={allServices.length === 0}
                  style={{ flex: 2, background: allServices.length > 0 ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: allServices.length > 0 ? "pointer" : "not-allowed" }}>
                  Continue â†’
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
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>ðŸ“… Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} min={getToday()}
                      style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                    <p style={{ color: "#888", fontSize: "10px", margin: "4px 0 0" }}>Default: Today</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>ðŸ• Time</label>
                    <select value={time} onChange={e => setTime(e.target.value)}
                      style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px" }}>
                      {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address - Auto loaded */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px" }}>ðŸ“ Service Address</label>
                    <button onClick={() => setShowAddressModal(true)}
                      style={{ background: "none", border: "none", color: "#E61D72", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>
                      Change â†’
                    </button>
                  </div>
                  <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "14px 16px", border: "2px solid #E61D72" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{selectedAddress.icon}</span>
                      <div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <p style={{ fontWeight: 700, margin: 0, fontSize: "14px" }}>{selectedAddress.label}</p>
                          {selectedAddress.isDefault && <span style={{ background: "#E61D72", color: "#fff", padding: "1px 6px", borderRadius: "8px", fontSize: "9px", fontWeight: 700 }}>DEFAULT</span>}
                        </div>
                        <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{selectedAddress.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transport */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>ðŸš— Distance from Artist</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {Object.entries(transportFees).map(([range, fee]) => (
                      <div key={range} onClick={() => setDistance(range)}
                        style={{ padding: "10px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                          background: distance === range ? "#FFF0F6" : "#f8f8f8", border: distance === range ? "2px solid #E61D72" : "2px solid transparent" }}>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "12px" }}>{range}</p>
                        <p style={{ color: "#E61D72", fontWeight: 700, margin: 0, fontSize: "12px" }}>+â‚±{fee}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>ðŸ“ Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                    placeholder="Condo unit, gate code, special requests..."
                    style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>â† Back</button>
                  <button onClick={() => setStep(4)}
                    style={{ flex: 2, background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                    Continue to Payment â†’
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment - All in one, direct to PayMongo */}
          {step === 4 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>ðŸ’³ Payment</h2>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Contact */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>ðŸ‘¤ Your Contact Info</h3>
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

                {/* Voucher */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>ðŸŽ« Voucher (Optional)</h3>
                  {appliedVoucher ? (
                    <div style={{ background: "#F0FDF4", borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #86EFAC" }}>
                      <p style={{ fontWeight: 700, color: "#22c55e", margin: 0, fontSize: "13px" }}>âœ… {appliedVoucher.code} â€” Save â‚±{appliedVoucher.discount}</p>
                      <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); setVoucherMsg(""); }}
                        style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "4px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <input value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code"
                          style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "13px" }} />
                        <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", padding: "10px 14px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: "pointer" }}>Apply</button>
                      </div>
                      {voucherMsg && <p style={{ fontSize: "12px", color: voucherMsg.startsWith("âœ…") ? "#22c55e" : "#f87171", margin: "0 0 6px" }}>{voucherMsg}</p>}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {["FIRST50", "SUMMER20", "REFER100"].map(code => (
                          <button key={code} onClick={() => setVoucherCode(code)}
                            style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "4px 8px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            {code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <h3 style={{ fontWeight: 700, margin: "0 0 10px", fontSize: "15px" }}>ðŸ’³ Payment Method</h3>
                  {[
                    { id: "gcash", label: "ðŸ“± GCash", desc: "Pay via GCash" },
                    { id: "maya", label: "ðŸ¦ Maya", desc: "Pay via Maya" },
                    { id: "card", label: "ðŸ’³ Credit/Debit Card", desc: "Visa, Mastercard" },
                    { id: "cod", label: "ðŸ’µ Cash on Arrival", desc: "Pay when artist arrives" },
                  ].map(m => (
                    <div key={m.id} onClick={() => setPaymentMethod(m.id)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                        background: paymentMethod === m.id ? "#FFF0F6" : "#f8f8f8", border: paymentMethod === m.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${paymentMethod === m.id ? "#E61D72" : "#ccc"}`, background: paymentMethod === m.id ? "#E61D72" : "transparent", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, margin: 0, fontSize: "13px" }}>{m.label}</p>
                        <p style={{ color: "#888", margin: 0, fontSize: "11px" }}>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>â† Back</button>
                  <button onClick={handlePay} disabled={payLoading || !name || !email}
                    style={{ flex: 2, background: payLoading || !name || !email ? "#ccc" : "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 900, cursor: payLoading || !name || !email ? "not-allowed" : "pointer", fontSize: "15px" }}>
                    {payLoading ? "Processing..." : `Pay â‚±${total} ðŸŒ¸`}
                  </button>
                </div>
                <p style={{ textAlign: "center", color: "#888", fontSize: "11px", margin: 0 }}>ðŸ”’ Secured by PayMongo</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "18px", padding: "18px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 12px", fontSize: "14px" }}>ðŸ“‹ Summary</h3>
            {selectedArtist && (
              <div style={{ background: "#FFF0F6", borderRadius: "8px", padding: "8px 10px", marginBottom: "10px" }}>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "12px", color: "#E61D72" }}>{getArtistEmoji(selectedArtist.services)} {selectedArtist.name}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>ðŸ“ {selectedArtist.location}</p>
              </div>
            )}
            {familyMembers.map((member, i) => member.services.length > 0 && (
              <div key={i} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: 600, fontSize: "11px", margin: "0 0 3px", color: "#E61D72" }}>ðŸ‘¤ {member.name}</p>
                {member.services.map(s => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", paddingLeft: "8px", marginBottom: "2px" }}>
                    <span style={{ color: "#555" }}>â€¢ {s.name}</span>
                    <span style={{ fontWeight: 600 }}>â‚±{s.price}</span>
                  </div>
                ))}
              </div>
            ))}
            {allServices.length > 0 && (
              <div style={{ borderTop: "1px solid #FFE4F0", paddingTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span><span>â‚±{subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                  <span style={{ color: "#888" }}>ðŸš— Transport</span><span>â‚±{transport}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                    <span style={{ color: "#22c55e" }}>ðŸŽ« Voucher</span><span style={{ color: "#22c55e" }}>-â‚±{discount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "16px", borderTop: "1px solid #FFE4F0", paddingTop: "8px", marginTop: "4px" }}>
                  <span>Total</span><span style={{ color: "#E61D72" }}>â‚±{total}</span>
                </div>
              </div>
            )}
            {date && (
              <div style={{ background: "#FFF0F6", borderRadius: "8px", padding: "8px", marginTop: "8px", fontSize: "11px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 600 }}>ðŸ“… {date} at {time}</p>
                <p style={{ margin: 0, color: "#888" }}>ðŸ“ {selectedAddress.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Select Address</h3>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>âœ•</button>
            </div>
            {savedAddresses.map(addr => (
              <div key={addr.id} onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "14px", cursor: "pointer", marginBottom: "8px",
                  background: selectedAddress.id === addr.id ? "#FFF0F6" : "#f8f8f8", border: selectedAddress.id === addr.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                <span style={{ fontSize: "22px" }}>{addr.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: "14px" }}>{addr.label}</p>
                    {addr.isDefault && <span style={{ background: "#E61D72", color: "#fff", padding: "1px 5px", borderRadius: "8px", fontSize: "9px", fontWeight: 700 }}>DEFAULT</span>}
                  </div>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{addr.address}</p>
                </div>
                {selectedAddress.id === addr.id && <span style={{ color: "#E61D72", fontSize: "18px" }}>âœ“</span>}
              </div>
            ))}
            <a href="/addresses" style={{ display: "block", textAlign: "center", color: "#888", fontSize: "13px", marginTop: "8px" }}>
              + Manage saved addresses â†’
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#FFF0F6"}}><p style={{color:"#E61D72",fontWeight:700}}>🌸 Loading...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}
