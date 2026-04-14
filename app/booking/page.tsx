"use client";
import { useState } from "react";

const artists = [
  { id: 1, name: "Maria Santos", role: "Massage Therapist", image: "💆", rating: 4.9, reviews: 128, location: "Quezon City", available: true, services: [
    { name: "Full Body Massage", price: 800, duration: 60 },
    { name: "Hot Stone Massage", price: 1000, duration: 90 },
    { name: "Foot Massage", price: 400, duration: 30 },
  ]},
  { id: 2, name: "Ana Reyes", role: "Hair Specialist", image: "✂️", rating: 4.8, reviews: 95, location: "Makati", available: true, services: [
    { name: "Haircut & Styling", price: 500, duration: 45 },
    { name: "Hair Coloring", price: 1200, duration: 120 },
    { name: "Hair Treatment", price: 800, duration: 60 },
  ]},
  { id: 3, name: "Joy Dela Cruz", role: "Nail Technician", image: "💅", rating: 4.7, reviews: 82, location: "Pasig", available: true, services: [
    { name: "Manicure", price: 250, duration: 30 },
    { name: "Pedicure", price: 300, duration: 30 },
    { name: "Manicure & Pedicure", price: 450, duration: 60 },
    { name: "Gel Nails", price: 600, duration: 75 },
  ]},
  { id: 4, name: "Grace Tan", role: "Skin Care Expert", image: "🧖", rating: 4.8, reviews: 73, location: "Taguig", available: true, services: [
    { name: "Facial Treatment", price: 650, duration: 60 },
    { name: "Whitening Facial", price: 850, duration: 75 },
    { name: "Anti-aging Facial", price: 950, duration: 90 },
  ]},
];

const transportFees: Record<string, number> = {
  "0-3 km": 50,
  "3-7 km": 100,
  "7-15 km": 150,
  "15+ km": 200,
};

type FamilyMember = { name: string; services: { name: string; price: number; duration: number }[] };
type SelectedArtist = typeof artists[0] | null;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ name: "Myself", services: [] }]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("0-3 km");
  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [notes, setNotes] = useState("");
  const [voucher, setVoucher] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [booked, setBooked] = useState(false);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: `Member ${familyMembers.length + 1}`, services: [] }]);
  };

  const removeMember = (idx: number) => {
    if (familyMembers.length === 1) return;
    setFamilyMembers(familyMembers.filter((_, i) => i !== idx));
  };

  const updateMemberName = (idx: number, name: string) => {
    const updated = [...familyMembers];
    updated[idx].name = name;
    setFamilyMembers(updated);
  };

  const toggleService = (memberIdx: number, service: { name: string; price: number; duration: number }) => {
    const updated = [...familyMembers];
    const member = updated[memberIdx];
    const exists = member.services.find(s => s.name === service.name);
    if (exists) {
      member.services = member.services.filter(s => s.name !== service.name);
    } else {
      member.services = [...member.services, service];
    }
    setFamilyMembers(updated);
  };

  const applyVoucher = () => {
    const codes: Record<string, number> = { "FIRST50": 50, "REFER100": 100, "SUMMER20": 0.2 };
    const val = codes[voucher.toUpperCase()];
    if (!val) { setVoucherMsg("❌ Invalid voucher code."); setVoucherDiscount(0); return; }
    if (voucher.toUpperCase() === "SUMMER20") {
      setVoucherDiscount(Math.round(subtotal * 0.2));
      setVoucherMsg("✅ 20% off applied!");
    } else {
      setVoucherDiscount(val);
      setVoucherMsg(`✅ ₱${val} off applied!`);
    }
  };

  const allServices = familyMembers.flatMap(m => m.services);
  const subtotal = allServices.reduce((sum, s) => sum + s.price, 0);
  const transport = transportFees[distance];
  const total = subtotal + transport - voucherDiscount;
  const totalDuration = allServices.reduce((sum, s) => sum + s.duration, 0);

  if (booked) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "80px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontWeight: 900, color: "#22c55e", margin: "0 0 8px" }}>Booking Confirmed!</h1>
          <p style={{ color: "#888", margin: "0 0 24px" }}>Your artist is on the way!</p>
          <div style={{ background: "#F0FDF4", borderRadius: "16px", padding: "20px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ fontWeight: 700, margin: "0 0 12px" }}>Booking Summary</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>🎨 Artist: <strong>{selectedArtist?.name}</strong></p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>📅 {date} at {time}</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>📍 {address}</p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 6px" }}>👥 {familyMembers.length} member(s)</p>
            <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "18px", margin: "12px 0 0" }}>Total Paid: ₱{total}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a href="/checkout" style={{ flex: 1, background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>?? Proceed to Payment</a>
            <a href="/" style={{ flex: 1, background: "#f0f0f0", color: "#555", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>Go Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "24px 32px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Back to Home</a>
        <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "8px 0 4px" }}>Book a Service</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Book for yourself or the whole family 👨‍👩‍👧‍👦</p>
      </div>

      {/* Progress Steps */}
      <div style={{ background: "#fff", padding: "16px 32px", display: "flex", gap: "0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {[
          { n: 1, label: "Choose Artist" },
          { n: 2, label: "Select Services" },
          { n: 3, label: "Schedule & Location" },
          { n: 4, label: "Payment" },
        ].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px",
                background: step >= s.n ? "#E61D72" : "#eee", color: step >= s.n ? "#fff" : "#888" }}>{s.n}</div>
              <span style={{ fontSize: "12px", fontWeight: step === s.n ? 700 : 400, color: step === s.n ? "#E61D72" : "#888", display: "none" }}>{s.label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: "2px", background: step > s.n ? "#E61D72" : "#eee", margin: "0 8px" }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
        
        {/* Main Content */}
        <div>

          {/* STEP 1: Choose Artist */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Choose Your Artist</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {artists.map(artist => (
                  <div key={artist.id} onClick={() => setSelectedArtist(artist)}
                    style={{ background: "#fff", borderRadius: "20px", padding: "20px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>{artist.image}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{artist.name}</p>
                            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 6px" }}>{artist.role} • {artist.location}</p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {artist.services.map(s => (
                                <span key={s.name} style={{ background: "#FFF0F6", color: "#E61D72", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>{s.name}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#FFD700", fontSize: "14px" }}>★ {artist.rating}</div>
                            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>({artist.reviews})</p>
                            {selectedArtist?.id === artist.id && <span style={{ color: "#E61D72", fontSize: "20px" }}>✓</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => selectedArtist && setStep(2)} disabled={!selectedArtist}
                style={{ width: "100%", marginTop: "20px", background: selectedArtist ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: selectedArtist ? "pointer" : "not-allowed", fontSize: "15px" }}>
                Continue with {selectedArtist?.name || "Artist"} →
              </button>
            </div>
          )}

          {/* STEP 2: Family Members + Services */}
          {step === 2 && selectedArtist && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 4px" }}>Select Services</h2>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Add family members and choose services for each</p>

              {familyMembers.map((member, mIdx) => (
                <div key={mIdx} style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{mIdx + 1}</div>
                      <input value={member.name} onChange={e => updateMemberName(mIdx, e.target.value)}
                        style={{ border: "none", fontWeight: 700, fontSize: "16px", outline: "none", background: "transparent", borderBottom: "2px solid #FFD6E7" }} />
                    </div>
                    {mIdx > 0 && (
                      <button onClick={() => removeMember(mIdx)}
                        style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "12px" }}>
                        Remove
                      </button>
                    )}
                  </div>
                  <p style={{ color: "#888", fontSize: "12px", margin: "0 0 12px" }}>Select services for {member.name}:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedArtist.services.map(service => {
                      const selected = member.services.find(s => s.name === service.name);
                      return (
                        <div key={service.name} onClick={() => toggleService(mIdx, service)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                            background: selected ? "#FFF0F6" : "#f8f8f8", border: selected ? "1px solid #E61D72" : "1px solid transparent" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${selected ? "#E61D72" : "#ccc"}`, background: selected ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {selected && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: "14px" }}>{service.name}</p>
                              <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>⏱ {service.duration} mins</p>
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, color: "#E61D72" }}>₱{service.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button onClick={addFamilyMember}
                style={{ width: "100%", background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px dashed #E61D72", fontWeight: 700, cursor: "pointer", marginBottom: "16px" }}>
                + Add Family Member
              </button>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => allServices.length > 0 && setStep(3)} disabled={allServices.length === 0}
                  style={{ flex: 2, background: allServices.length > 0 ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: allServices.length > 0 ? "pointer" : "not-allowed" }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule & Location */}
          {step === 3 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Schedule & Location</h2>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                      {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📍 Your Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Rizal St, Quezon City"
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", boxSizing: "border-box" }} />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>🚗 Distance from Artist</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {Object.entries(transportFees).map(([range, fee]) => (
                      <div key={range} onClick={() => setDistance(range)}
                        style={{ padding: "12px 16px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
                          background: distance === range ? "#FFF0F6" : "#f8f8f8", border: distance === range ? "2px solid #E61D72" : "2px solid transparent" }}>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{range}</p>
                        <p style={{ color: "#E61D72", fontWeight: 700, margin: 0 }}>+₱{fee} transport</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>📝 Special Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any special requests or instructions for your artist..."
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => date && time && address && setStep(4)} disabled={!date || !time || !address}
                    style={{ flex: 2, background: date && time && address ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: date && time && address ? "pointer" : "not-allowed" }}>
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div>
              <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>Payment</h2>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Voucher */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>🎫 Voucher Code</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input value={voucher} onChange={e => setVoucher(e.target.value.toUpperCase())} placeholder="Enter voucher code"
                      style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
                    <button onClick={applyVoucher} style={{ background: "#E61D72", color: "#fff", padding: "12px 20px", borderRadius: "12px", border: "none", fontWeight: 600, cursor: "pointer" }}>Apply</button>
                  </div>
                  {voucherMsg && <p style={{ fontSize: "13px", marginTop: "6px", color: voucherMsg.startsWith("✅") ? "#22c55e" : "#f87171" }}>{voucherMsg}</p>}
                </div>

                {/* Payment Method */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "10px" }}>💳 Payment Method</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { id: "gcash", label: "📱 GCash", desc: "Pay via GCash" },
                      { id: "maya", label: "🏦 Maya", desc: "Pay via Maya" },
                      { id: "card", label: "💳 Credit/Debit Card", desc: "Visa, Mastercard" },
                      { id: "cod", label: "💵 Cash on Arrival", desc: "Pay when artist arrives" },
                    ].map(method => (
                      <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                          background: paymentMethod === method.id ? "#FFF0F6" : "#f8f8f8", border: paymentMethod === method.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${paymentMethod === method.id ? "#E61D72" : "#ccc"}`, background: paymentMethod === method.id ? "#E61D72" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {paymentMethod === method.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>{method.label}</p>
                          <p style={{ color: "#888", margin: 0, fontSize: "12px" }}>{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => setBooked(true)}
                    style={{ flex: 2, background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                    Confirm & Book ₱{total} 🎉
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Booking Summary</h3>

            {selectedArtist && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#FFF0F6", borderRadius: "12px", marginBottom: "16px" }}>
                <div style={{ fontSize: "24px" }}>{selectedArtist.image}</div>
                <div>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: "14px" }}>{selectedArtist.name}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{selectedArtist.role}</p>
                </div>
              </div>
            )}

            {/* Members & Services */}
            {familyMembers.map((member, i) => member.services.length > 0 && (
              <div key={i} style={{ marginBottom: "12px" }}>
                <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 6px", color: "#E61D72" }}>👤 {member.name}</p>
                {member.services.map(s => (
                  <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px", paddingLeft: "12px" }}>
                    <span style={{ color: "#555" }}>{s.name}</span>
                    <span style={{ fontWeight: 600 }}>₱{s.price}</span>
                  </div>
                ))}
              </div>
            ))}

            {allServices.length > 0 && (
              <div style={{ borderTop: "1px solid #FFE4F0", paddingTop: "12px", marginTop: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span>
                  <span>₱{subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ color: "#888" }}>🚗 Transport ({distance})</span>
                  <span>₱{transport}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "#22c55e" }}>🎫 Voucher</span>
                    <span style={{ color: "#22c55e" }}>-₱{voucherDiscount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "16px", borderTop: "1px solid #FFE4F0", paddingTop: "10px", marginTop: "6px" }}>
                  <span>Total</span>
                  <span style={{ color: "#E61D72" }}>₱{total}</span>
                </div>
                <p style={{ color: "#888", fontSize: "12px", margin: "8px 0 0", textAlign: "center" }}>⏱ Est. duration: {totalDuration} mins</p>
              </div>
            )}

            {date && time && (
              <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px", marginTop: "12px", fontSize: "13px" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600 }}>📅 {date}</p>
                <p style={{ margin: "0 0 4px", color: "#888" }}>🕐 {time}</p>
                {address && <p style={{ margin: 0, color: "#888" }}>📍 {address}</p>}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}





