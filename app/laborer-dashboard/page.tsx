"use client";
import { useState } from "react";

const bookings = [
  {
    id: 1,
    customer: "Dela Cruz Family",
    date: "April 15, 2026",
    time: "10:00 AM",
    address: "123 Quezon Ave, QC",
    phone: "09271234567",
    status: "Upcoming",
    isSuperHost: true,
    services: [
      { name: "Manicure & Pedicure", qty: 3, price: 450 },
      { name: "Haircut & Styling", qty: 2, price: 500 },
    ],
  },
  {
    id: 2,
    customer: "Santos Family",
    date: "April 14, 2026",
    time: "2:00 PM",
    address: "456 Makati Ave, Makati",
    phone: "09281234567",
    status: "Completed",
    isSuperHost: false,
    services: [
      { name: "Full Body Massage", qty: 2, price: 800 },
      { name: "Facial Treatment", qty: 1, price: 650 },
    ],
  },
  {
    id: 3,
    customer: "Reyes Household",
    date: "April 13, 2026",
    time: "11:00 AM",
    address: "789 Pasig Blvd, Pasig",
    phone: "09291234567",
    status: "Cancelled",
    isSuperHost: false,
    services: [
      { name: "Haircut & Styling", qty: 4, price: 500 },
    ],
  },
  {
    id: 4,
    customer: "Liza Cruz",
    date: "April 16, 2026",
    time: "3:00 PM",
    address: "321 Mandaluyong St",
    phone: "09301234567",
    status: "Upcoming",
    isSuperHost: true,
    services: [
      { name: "Hot Stone Massage", qty: 1, price: 1000 },
      { name: "Manicure & Pedicure", qty: 2, price: 450 },
    ],
  },
];

const getTotal = (services: { qty: number; price: number }[]) =>
  services.reduce((sum, s) => sum + s.qty * s.price, 0);

const statusColor: Record<string, { bg: string; color: string }> = {
  Upcoming: { bg: "#EFF6FF", color: "#3b82f6" },
  Completed: { bg: "#F0FDF4", color: "#22c55e" },
  Cancelled: { bg: "#FEF2F2", color: "#f87171" },
};

const completedBookings = bookings.filter((b) => b.status === "Completed");
const totalEarnings = completedBookings.reduce((sum, b) => sum + getTotal(b.services), 0);
const commission = Math.round(totalEarnings * 0.1);
const incentive = totalEarnings >= 5000 ? 500 : totalEarnings >= 3000 ? 300 : 100;
const netIncome = totalEarnings - commission + incentive;

export default function LaborerDashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [activeSection, setActiveSection] = useState("bookings");

  const filtered = activeTab === "all" ? bookings : bookings.filter((b) => b.status.toLowerCase() === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>

      {/* Header */}
      <div style={{ background: "#E61D72", padding: "24px 32px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>💆</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Maria Santos</h1>
                <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>⭐ SUPER HOST</span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>Massage Therapist • Member since 2024</p>
              <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: "#FFD700", fontSize: "14px" }}>{s}</span>
                ))}
                <span style={{ fontSize: "13px", marginLeft: "4px" }}>4.9 (128 reviews)</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>Net Income</p>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: 900 }}>₱{netIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #FFD6E7", padding: "0 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", gap: "0" }}>
          {[
            { key: "bookings", label: "📅 Bookings" },
            { key: "income", label: "💰 Income" },
            { key: "rating", label: "⭐ Rating" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              style={{ padding: "16px 24px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                borderBottom: activeSection === tab.key ? "3px solid #E61D72" : "3px solid transparent",
                color: activeSection === tab.key ? "#E61D72" : "#888" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>

        {/* BOOKINGS SECTION */}
        {activeSection === "bookings" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Total Bookings", value: bookings.length, color: "#E61D72" },
                { label: "Upcoming", value: bookings.filter(b => b.status === "Upcoming").length, color: "#3b82f6" },
                { label: "Completed", value: completedBookings.length, color: "#22c55e" },
                { label: "Cancelled", value: bookings.filter(b => b.status === "Cancelled").length, color: "#f87171" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontSize: "28px", fontWeight: 900, color: stat.color, margin: 0 }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {["all", "upcoming", "completed", "cancelled"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "8px 20px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", textTransform: "capitalize",
                    background: activeTab === tab ? "#E61D72" : "#fff",
                    color: activeTab === tab ? "#fff" : "#888",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Booking Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((booking) => {
                const total = getTotal(booking.services);
                return (
                  <div key={booking.id} onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                    style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", border: selectedBooking?.id === booking.id ? "2px solid #E61D72" : "2px solid transparent" }}>

                    {/* Booking Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <p style={{ fontWeight: 700, margin: 0, fontSize: "16px" }}>{booking.customer}</p>
                          {booking.isSuperHost && (
                            <span style={{ background: "#FFF9E6", color: "#D97706", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>⭐ Super Host</span>
                          )}
                        </div>
                        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>📅 {booking.date} at {booking.time}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: statusColor[booking.status].bg, color: statusColor[booking.status].color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                          {booking.status}
                        </span>
                        <p style={{ fontWeight: 900, color: "#E61D72", margin: "8px 0 0", fontSize: "20px" }}>₱{total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Services List */}
                    <div style={{ background: "#FFF8FC", borderRadius: "12px", padding: "12px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: 600, fontSize: "13px", color: "#888", margin: "0 0 8px" }}>Services:</p>
                      {booking.services.map((s) => (
                        <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "4px" }}>
                          <span>{s.name} x{s.qty}</span>
                          <span style={{ fontWeight: 600 }}>₱{(s.qty * s.price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expanded */}
                    {selectedBooking?.id === booking.id && (
                      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #FFE4F0" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                          <div>
                            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>📍 Address</p>
                            <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>{booking.address}</p>
                          </div>
                          <div>
                            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px" }}>📞 Phone</p>
                            <p style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}>{booking.phone}</p>
                          </div>
                        </div>
                        {booking.status === "Upcoming" && (
                          <div style={{ display: "flex", gap: "12px" }}>
                            <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#E61D72", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                            <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", background: "#fff", color: "#E61D72", fontWeight: 600, cursor: "pointer" }}>Decline</button>
                            <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Complete</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* INCOME SECTION */}
        {activeSection === "income" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontWeight: 900, fontSize: "22px", margin: 0 }}>Income & Commission</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>Gross Earnings</p>
                <p style={{ fontSize: "32px", fontWeight: 900, color: "#E61D72", margin: 0 }}>₱{totalEarnings.toLocaleString()}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>Commission (10%)</p>
                <p style={{ fontSize: "32px", fontWeight: 900, color: "#f87171", margin: 0 }}>-₱{commission.toLocaleString()}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>Incentive Bonus</p>
                <p style={{ fontSize: "32px", fontWeight: 900, color: "#22c55e", margin: 0 }}>+₱{incentive.toLocaleString()}</p>
              </div>
            </div>

            <div style={{ background: "#E61D72", borderRadius: "20px", padding: "24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>Net Income This Month</p>
                <p style={{ margin: 0, fontSize: "40px", fontWeight: 900 }}>₱{netIncome.toLocaleString()}</p>
              </div>
              <div style={{ fontSize: "64px" }}>💰</div>
            </div>

            {/* Incentive Tiers */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Incentive Tiers</h3>
              {[
                { label: "Bronze", min: 0, max: 3000, bonus: 100, color: "#CD7F32" },
                { label: "Silver", min: 3000, max: 5000, bonus: 300, color: "#888" },
                { label: "Gold", min: 5000, max: 99999, bonus: 500, color: "#FFD700" },
              ].map((tier) => (
                <div key={tier.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #FFE4F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>🏅</span>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0, color: tier.color }}>{tier.label}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>₱{tier.min.toLocaleString()} - {tier.max === 99999 ? "above" : "₱" + tier.max.toLocaleString()}</p>
                    </div>
                  </div>
                  <span style={{ background: "#FFF0F6", color: "#E61D72", padding: "4px 12px", borderRadius: "20px", fontWeight: 700, fontSize: "13px" }}>+₱{tier.bonus} bonus</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RATING SECTION */}
        {activeSection === "rating" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontWeight: 900, fontSize: "22px", margin: 0 }}>My Rating & Reviews</h2>

            <div style={{ background: "#E61D72", borderRadius: "20px", padding: "32px", color: "#fff", textAlign: "center" }}>
              <p style={{ fontSize: "64px", fontWeight: 900, margin: 0 }}>4.9</p>
              <div style={{ fontSize: "28px", margin: "8px 0" }}>★★★★★</div>
              <p style={{ opacity: 0.8, margin: 0 }}>Based on 128 reviews</p>
              <span style={{ background: "#FFD700", color: "#1a1a1a", padding: "4px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, marginTop: "12px", display: "inline-block" }}>⭐ SUPER HOST</span>
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Recent Reviews</h3>
              {[
                { name: "Joyce I.", rating: 5, comment: "Amazing service! Very professional and skilled.", date: "April 12, 2026" },
                { name: "Maria S.", rating: 5, comment: "Best massage ever! Will definitely book again.", date: "April 10, 2026" },
                { name: "Ana R.", rating: 4, comment: "Great job! Very thorough and gentle.", date: "April 8, 2026" },
              ].map((review, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i < 2 ? "1px solid #FFE4F0" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{review.name}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{review.date}</p>
                  </div>
                  <div style={{ color: "#FFD700", fontSize: "14px", marginBottom: "4px" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                  <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
