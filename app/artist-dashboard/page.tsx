"use client";
import { useState } from "react";

const bookings = [
  { id: "SRV-001", customer: "Joyce Ilano", members: 2, services: ["Full Body Massage", "Hot Stone Massage"], date: "April 15, 2026", time: "2:00 PM", address: "123 Rizal St, Quezon City", distance: "3-7 km", transport: 100, total: 1900, status: "pending", payment: "GCash" },
  { id: "SRV-002", customer: "Maria Reyes", members: 1, services: ["Foot Massage"], date: "April 15, 2026", time: "5:00 PM", address: "456 Mabini Ave, Makati", distance: "7-15 km", transport: 150, total: 550, status: "accepted", payment: "Maya" },
  { id: "SRV-003", customer: "Ana Cruz", members: 3, services: ["Full Body Massage", "Hot Stone Massage", "Foot Massage"], date: "April 16, 2026", time: "10:00 AM", address: "789 Burgos St, BGC", distance: "15+ km", transport: 200, total: 2400, status: "completed", payment: "Credit Card" },
  { id: "SRV-004", customer: "Liza Santos", members: 1, services: ["Hot Stone Massage"], date: "April 17, 2026", time: "3:00 PM", address: "321 Aurora Blvd, QC", distance: "0-3 km", transport: 50, total: 1050, status: "pending", payment: "Cash" },
];

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#FFF9E6", color: "#D97706", label: "⏳ Pending" },
  accepted:  { bg: "#EFF6FF", color: "#3b82f6", label: "✅ Accepted" },
  completed: { bg: "#F0FDF4", color: "#22c55e", label: "🌸 Completed" },
  declined:  { bg: "#FEF2F2", color: "#f87171", label: "❌ Declined" },
};

type TabType = "overview" | "bookings" | "schedule" | "earnings" | "profile";

export default function ArtistDashboard() {
  const [tab, setTab] = useState<TabType>("overview");
  const [bookingList, setBookingList] = useState(bookings);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const pending = bookingList.filter(b => b.status === "pending");
  const accepted = bookingList.filter(b => b.status === "accepted");
  const completed = bookingList.filter(b => b.status === "completed");
  const totalEarnings = completed.reduce((sum, b) => sum + (b.total * 0.9), 0);
  const monthEarnings = 12400;

  const handleAccept = (id: string) => {
    setBookingList(bookingList.map(b => b.id === id ? { ...b, status: "accepted" } : b));
    setSelectedBooking(null);
  };

  const handleDecline = (id: string) => {
    setBookingList(bookingList.map(b => b.id === id ? { ...b, status: "declined" } : b));
    setSelectedBooking(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", padding: "24px 32px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>💆</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: "20px", margin: "0 0 2px" }}>Maria Santos</p>
              <p style={{ opacity: 0.8, margin: "0 0 6px", fontSize: "13px" }}>Massage Therapist • Quezon City</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "#FFD700" }}>★★★★★</span>
                <span style={{ fontSize: "13px", opacity: 0.8 }}>4.9 (128 reviews)</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            {/* Availability Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: "20px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{isAvailable ? "🟢 Available" : "🔴 Busy"}</span>
              <div onClick={() => setIsAvailable(!isAvailable)}
                style={{ width: "44px", height: "24px", borderRadius: "12px", background: isAvailable ? "#22c55e" : "#f87171", cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
                <div style={{ position: "absolute", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", top: "3px", left: isAvailable ? "23px" : "3px", transition: "left 0.3s" }} />
              </div>
            </div>
            <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>⭐ SUPER ARTIST</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ background: "#fff", display: "flex", overflowX: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {([
          { id: "overview", label: "🏠 Overview" },
          { id: "bookings", label: `📅 Bookings ${pending.length > 0 ? `(${pending.length})` : ""}` },
          { id: "schedule", label: "🗓️ Schedule" },
          { id: "earnings", label: "💰 Earnings" },
          { id: "profile", label: "👤 Profile" },
        ] as { id: TabType; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "14px 20px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap",
              background: tab === t.id ? "#fff" : "#f8f8f8",
              color: tab === t.id ? "#7C3AED" : "#888",
              borderBottom: tab === t.id ? "3px solid #7C3AED" : "3px solid transparent" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Pending Bookings", value: pending.length, icon: "⏳", color: "#D97706", bg: "#FFF9E6" },
                { label: "Today's Bookings", value: accepted.length, icon: "📅", color: "#3b82f6", bg: "#EFF6FF" },
                { label: "This Month", value: `₱${monthEarnings.toLocaleString()}`, icon: "💰", color: "#22c55e", bg: "#F0FDF4" },
                { label: "Total Rating", value: "4.9 ★", icon: "⭐", color: "#7C3AED", bg: "#F5F3FF" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                  <p style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 4px", color: stat.color }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Bookings Alert */}
            {pending.length > 0 && (
              <div style={{ background: "#FFF9E6", borderRadius: "20px", padding: "20px", marginBottom: "24px", border: "1px solid #FDE68A" }}>
                <p style={{ fontWeight: 700, margin: "0 0 12px", color: "#D97706" }}>⏳ {pending.length} Booking(s) Waiting for Your Response!</p>
                {pending.map(b => (
                  <div key={b.id} style={{ background: "#fff", borderRadius: "12px", padding: "16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{b.customer}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 2px" }}>{b.services.join(", ")}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>📅 {b.date} at {b.time} • 📍 {b.address}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => handleDecline(b.id)}
                        style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                        Decline
                      </button>
                      <button onClick={() => handleAccept(b.id)}
                        style={{ background: "#7C3AED", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                        Accept ₱{b.total}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Today's Schedule */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Today's Schedule</h3>
              {bookingList.filter(b => b.date === "April 15, 2026" && b.status !== "declined").map(b => (
                <div key={b.id} onClick={() => setSelectedBooking(b)}
                  style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #F5F3FF", cursor: "pointer" }}>
                  <div style={{ textAlign: "center", minWidth: "60px" }}>
                    <p style={{ fontWeight: 700, color: "#7C3AED", margin: 0, fontSize: "14px" }}>{b.time}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{b.customer}</p>
                    <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>{b.services.join(", ")}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>📍 {b.address} • 🚗 +₱{b.transport}</p>
                  </div>
                  <div>
                    <span style={{ background: statusColors[b.status].bg, color: statusColors[b.status].color, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                      {statusColors[b.status].label}
                    </span>
                    <p style={{ fontWeight: 700, color: "#7C3AED", margin: "6px 0 0", textAlign: "right" }}>₱{(b.total * 0.9).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === "bookings" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>All Bookings</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {bookingList.map(b => (
                <div key={b.id} style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                        <p style={{ fontWeight: 700, margin: 0 }}>{b.customer}</p>
                        <span style={{ color: "#888", fontSize: "12px" }}>• {b.id}</span>
                      </div>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>📅 {b.date} at {b.time}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>📍 {b.address}</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {b.services.map(s => (
                          <span key={s} style={{ background: "#F5F3FF", color: "#7C3AED", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ background: statusColors[b.status]?.bg || "#f0f0f0", color: statusColors[b.status]?.color || "#888", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                        {statusColors[b.status]?.label || b.status}
                      </span>
                      <p style={{ fontWeight: 900, color: "#7C3AED", fontSize: "18px", margin: "8px 0 0" }}>₱{(b.total * 0.9).toFixed(0)}</p>
                      <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>your earnings</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #F5F3FF" }}>
                    <div style={{ fontSize: "13px", color: "#888" }}>
                      👥 {b.members} member(s) • 🚗 ₱{b.transport} transport • 💳 {b.payment}
                    </div>
                    {b.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleDecline(b.id)}
                          style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                          Decline
                        </button>
                        <button onClick={() => handleAccept(b.id)}
                          style={{ background: "#7C3AED", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                          Accept
                        </button>
                      </div>
                    )}
                    {b.status === "accepted" && (
                      <button style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                        📍 Navigate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {tab === "schedule" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>My Schedule</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Working Hours</h3>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day, i) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F5F3FF" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>{day}</span>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {i < 6 ? (
                      <>
                        <select defaultValue="8:00 AM" style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #EDE9FE", fontSize: "13px" }}>
                          {["8:00 AM","9:00 AM","10:00 AM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <span style={{ color: "#888" }}>to</span>
                        <select defaultValue="6:00 PM" style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #EDE9FE", fontSize: "13px" }}>
                          {["5:00 PM","6:00 PM","7:00 PM","8:00 PM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </>
                    ) : (
                      <span style={{ color: "#f87171", fontSize: "13px", fontWeight: 600 }}>Day Off</span>
                    )}
                  </div>
                </div>
              ))}
              <button style={{ width: "100%", marginTop: "16px", background: "#7C3AED", color: "#fff", padding: "12px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                Save Schedule
              </button>
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Upcoming Bookings</h3>
              {bookingList.filter(b => b.status !== "declined" && b.status !== "completed").map(b => (
                <div key={b.id} style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid #F5F3FF" }}>
                  <div style={{ background: "#F5F3FF", borderRadius: "12px", padding: "10px 14px", textAlign: "center", minWidth: "70px" }}>
                    <p style={{ fontWeight: 700, color: "#7C3AED", margin: 0, fontSize: "12px" }}>{b.date.split(",")[0].replace("April ", "Apr ")}</p>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: "14px" }}>{b.time}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{b.customer}</p>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{b.services.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EARNINGS */}
        {tab === "earnings" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>My Earnings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "This Month", value: "₱12,400", sub: "April 2026", color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Total Earned", value: "₱48,200", sub: "All time", color: "#22c55e", bg: "#F0FDF4" },
                { label: "Pending Payout", value: "₱3,600", sub: "Within 24hrs", color: "#D97706", bg: "#FFF9E6" },
                { label: "Bookings Done", value: "64", sub: "This month", color: "#3b82f6", bg: "#EFF6FF" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "20px", padding: "20px" }}>
                  <p style={{ fontWeight: 900, fontSize: "24px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{stat.label}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 4px" }}>Commission Breakdown</h3>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Serviko takes 10% per booking</p>
              {completed.map(b => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F5F3FF" }}>
                  <div>
                    <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{b.customer}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{b.date} • {b.services.join(", ")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>Total: ₱{b.total}</p>
                    <p style={{ fontWeight: 700, color: "#7C3AED", margin: 0 }}>You: ₱{(b.total * 0.9).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: "20px", padding: "24px", color: "#fff" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 8px" }}>💰 GCash Payout</h3>
              <p style={{ opacity: 0.8, fontSize: "13px", margin: "0 0 16px" }}>Your earnings are sent to your GCash every 24 hours</p>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px" }}>📱 GCash: 09XX XXX XXXX</span>
                <span style={{ fontWeight: 700 }}>₱3,600 pending</span>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>My Profile</h2>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Full Name", value: "Maria Santos", type: "text" },
                { label: "Email", value: "maria@email.com", type: "email" },
                { label: "Phone", value: "09123456789", type: "tel" },
                { label: "Location", value: "Quezon City", type: "text" },
                { label: "GCash Number", value: "09123456789", type: "tel" },
                { label: "Years of Experience", value: "5-10 years", type: "text" },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>{field.label}</label>
                  <input type={field.type} defaultValue={field.value}
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Bio</label>
                <textarea defaultValue="Professional massage therapist with 5+ years of experience specializing in full body and hot stone massage." rows={3}
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #EDE9FE", fontSize: "14px", resize: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "10px" }}>My Services</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Full Body Massage", "Hot Stone Massage", "Foot Massage"].map(s => (
                    <span key={s} style={{ background: "#F5F3FF", color: "#7C3AED", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 600 }}>{s} ✓</span>
                  ))}
                </div>
              </div>
              <button style={{ background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                Save Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", maxWidth: "480px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Booking {selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            {[
              ["👤 Customer", selectedBooking.customer],
              ["📅 Date & Time", `${selectedBooking.date} at ${selectedBooking.time}`],
              ["📍 Address", selectedBooking.address],
              ["🚗 Transport", `₱${selectedBooking.transport} (${selectedBooking.distance})`],
              ["💳 Payment", selectedBooking.payment],
              ["👥 Members", `${selectedBooking.members} member(s)`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F5F3FF", fontSize: "14px" }}>
                <span style={{ color: "#888" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{ padding: "10px 0", borderBottom: "1px solid #F5F3FF" }}>
              <p style={{ color: "#888", fontSize: "14px", margin: "0 0 6px" }}>💆 Services</p>
              {selectedBooking.services.map(s => (
                <span key={s} style={{ background: "#F5F3FF", color: "#7C3AED", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, marginRight: "6px" }}>{s}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontWeight: 900, fontSize: "16px" }}>
              <span>Your Earnings</span>
              <span style={{ color: "#7C3AED" }}>₱{(selectedBooking.total * 0.9).toFixed(0)}</span>
            </div>
            {selectedBooking.status === "pending" && (
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button onClick={() => handleDecline(selectedBooking.id)}
                  style={{ flex: 1, background: "#fee2e2", color: "#f87171", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Decline
                </button>
                <button onClick={() => handleAccept(selectedBooking.id)}
                  style={{ flex: 2, background: "#7C3AED", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Accept Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
