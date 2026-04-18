"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  time: string;
  address: string;
  services: string;
  total: number;
  transport_fee: number;
  status: string;
  notes: string;
  created_at: string;
  members: any;
};

type TabType = "overview" | "bookings" | "earnings" | "profile";

export default function ArtistDashboardPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const res = await fetch(`/api/artist/bookings${email ? `?email=${email}` : ""}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  const handleBookingAction = async (bookingId: number, status: string) => {
    setProcessing(true);
    try {
      const res = await fetch("/api/artist/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(status === "accepted" ? "Booking accepted!" : "Booking declined!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchBookings();
        setSelectedBooking(null);
      }
    } catch {
      alert("Action failed. Try again.");
    }
    setProcessing(false);
  };

  const toggleAvailability = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    try {
      await fetch("/api/artist/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.emailAddresses[0]?.emailAddress, isAvailable: newStatus }),
      });
    } catch {}
  };

  const pending = bookings.filter(b => b.status === "pending");
  const accepted = bookings.filter(b => b.status === "accepted");
  const completed = bookings.filter(b => b.status === "completed");
  const totalEarnings = completed.reduce((sum, b) => sum + (b.total * 0.9), 0);
  const todayBookings = accepted.filter(b => b.date === new Date().toISOString().split("T")[0]);

  const filteredBookings = filterStatus === "all" ? bookings : bookings.filter(b => b.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return { bg: "#FFF9E6", color: "#D97706" };
      case "accepted": return { bg: "#EFF6FF", color: "#3b82f6" };
      case "completed": return { bg: "#F0FDF4", color: "#22c55e" };
      case "declined": return { bg: "#FEF2F2", color: "#f87171" };
      default: return { bg: "#f8f8f8", color: "#888" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: "0 0 4px" }}>Artist Dashboard</p>
            <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 4px" }}>
              Welcome, {artist?.name?.split(" ")[0] || user?.firstName || "Artist"}!
            </h1>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>
              {pending.length > 0 ? `${pending.length} pending booking(s)!` : "No pending bookings"}
            </p>
          </div>
          {/* Availability Toggle */}
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", opacity: 0.8, margin: "0 0 4px" }}>Status</p>
            <button onClick={toggleAvailability}
              style={{ background: isAvailable ? "#22c55e" : "#f87171", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
              {isAvailable ? "Available" : "Busy"}
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>
          {successMsg}
        </div>
      )}

      {/* Pending Alert */}
      {pending.length > 0 && (
        <div style={{ background: "#FFF9E6", borderLeft: "4px solid #F59E0B", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontWeight: 700, color: "#D97706", margin: 0, fontSize: "14px" }}>
            {pending.length} new booking request{pending.length > 1 ? "s" : ""} waiting!
          </p>
          <button onClick={() => { setActiveTab("bookings"); setFilterStatus("pending"); }}
            style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            Review Now
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "#fff", display: "flex", gap: "4px", padding: "12px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "bookings", label: `Bookings ${pending.length > 0 ? `(${pending.length})` : ""}` },
          { id: "earnings", label: "Earnings" },
          { id: "profile", label: "Profile" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap",
              background: activeTab === tab.id ? "#7C3AED" : "#f0f0f0", color: activeTab === tab.id ? "#fff" : "#555" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {[
                { label: "Pending", value: pending.length, color: "#D97706", bg: "#FFF9E6" },
                { label: "Today", value: todayBookings.length, color: "#3b82f6", bg: "#EFF6FF" },
                { label: "Completed", value: completed.length, color: "#22c55e", bg: "#F0FDF4" },
                { label: "Earnings", value: `P${Math.round(totalEarnings)}`, color: "#7C3AED", bg: "#F5F3FF" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontWeight: 900, fontSize: "24px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontWeight: 900, margin: 0 }}>Recent Bookings</h3>
                <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#7C3AED", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>See All</button>
              </div>
              {loading ? (
                <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
              ) : bookings.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>No bookings yet</p>
              ) : (
                bookings.slice(0, 3).map(booking => {
                  const sc = getStatusColor(booking.status);
                  return (
                    <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{booking.customer_name}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date} at {booking.time}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, textTransform: "capitalize", display: "block", marginBottom: "4px" }}>
                          {booking.status}
                        </span>
                        <p style={{ fontWeight: 700, color: "#7C3AED", margin: 0, fontSize: "13px" }}>P{booking.total}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>
            {/* Filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
              {["all", "pending", "accepted", "completed", "declined"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)}
                  style={{ padding: "7px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", textTransform: "capitalize", whiteSpace: "nowrap",
                    background: filterStatus === f ? "#7C3AED" : "#fff", color: filterStatus === f ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {f} {f !== "all" && `(${bookings.filter(b => b.status === f).length})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <p style={{ color: "#888" }}>Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No {filterStatus} bookings</p>
                <p style={{ color: "#888", fontSize: "13px" }}>New bookings will appear here!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredBookings.map(booking => {
                  const sc = getStatusColor(booking.status);
                  return (
                    <div key={booking.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer",
                      border: booking.status === "pending" ? "2px solid #F59E0B" : "2px solid transparent" }}
                      onClick={() => setSelectedBooking(booking)}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{booking.customer_name}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{booking.customer_phone}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date} at {booking.time}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, textTransform: "capitalize", display: "block", marginBottom: "4px" }}>
                            {booking.status}
                          </span>
                          <p style={{ fontWeight: 900, color: "#7C3AED", margin: 0, fontSize: "16px" }}>P{booking.total}</p>
                          <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>Your cut: P{Math.round(booking.total * 0.9)}</p>
                        </div>
                      </div>
                      <p style={{ color: "#555", fontSize: "12px", margin: "0 0 8px" }}>Address: {booking.address}</p>
                      {booking.notes && <p style={{ color: "#888", fontSize: "11px", margin: "0 0 8px", fontStyle: "italic" }}>Note: {booking.notes}</p>}
                      {booking.status === "pending" && (
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <button onClick={e => { e.stopPropagation(); handleBookingAction(booking.id, "declined"); }} disabled={processing}
                            style={{ flex: 1, background: "#FEF2F2", color: "#f87171", border: "1px solid #FCA5A5", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                            Decline
                          </button>
                          <button onClick={e => { e.stopPropagation(); handleBookingAction(booking.id, "accepted"); }} disabled={processing}
                            style={{ flex: 2, background: "#22c55e", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                            {processing ? "Processing..." : "Accept Booking"}
                          </button>
                        </div>
                      )}
                      {booking.status === "accepted" && (
                        <button onClick={e => { e.stopPropagation(); handleBookingAction(booking.id, "completed"); }} disabled={processing}
                          style={{ width: "100%", background: "#7C3AED", color: "#fff", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px", marginTop: "10px" }}>
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* EARNINGS TAB */}
        {activeTab === "earnings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: "20px", padding: "28px", color: "#fff", textAlign: "center" }}>
              <p style={{ opacity: 0.8, margin: "0 0 8px", fontSize: "14px" }}>Total Earnings (90%)</p>
              <p style={{ fontWeight: 900, fontSize: "40px", margin: "0 0 4px" }}>P{Math.round(totalEarnings)}</p>
              <p style={{ opacity: 0.7, fontSize: "12px", margin: 0 }}>From {completed.length} completed bookings</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Completed Bookings</h3>
              {completed.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>No completed bookings yet</p>
              ) : (
                completed.map(booking => (
                  <div key={booking.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{booking.customer_name}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px" }}>+P{Math.round(booking.total * 0.9)}</p>
                      <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Total: P{booking.total}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 20px" }}>Your Profile</h3>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "28px", fontWeight: 700 }}>
                {user?.firstName?.[0] || "A"}
              </div>
              <p style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 4px" }}>{user?.fullName || "Artist"}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div style={{ background: "#F5F3FF", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Total Bookings", val: bookings.length },
                  { label: "Completed", val: completed.length },
                  { label: "Total Earnings", val: `P${Math.round(totalEarnings)}` },
                  { label: "Pending", val: pending.length },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 900, fontSize: "20px", color: "#7C3AED", margin: "0 0 2px" }}>{item.val}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/register/artist" style={{ display: "block", background: "#F5F3FF", color: "#7C3AED", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px", textAlign: "center" }}>
                Edit Profile
              </a>
              <a href="/" style={{ display: "block", background: "#f0f0f0", color: "#555", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px", textAlign: "center" }}>
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>X</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Customer", val: selectedBooking.customer_name },
                { label: "Phone", val: selectedBooking.customer_phone },
                { label: "Email", val: selectedBooking.customer_email },
                { label: "Date", val: selectedBooking.date },
                { label: "Time", val: selectedBooking.time },
                { label: "Address", val: selectedBooking.address },
                { label: "Total", val: `P${selectedBooking.total}` },
                { label: "Your Cut (90%)", val: `P${Math.round(selectedBooking.total * 0.9)}` },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ color: "#888", fontSize: "13px" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: "13px" }}>{item.val}</span>
                </div>
              ))}
              {selectedBooking.notes && (
                <div style={{ background: "#FFF9E6", borderRadius: "10px", padding: "10px" }}>
                  <p style={{ fontWeight: 600, margin: "0 0 4px", fontSize: "12px" }}>Customer Notes:</p>
                  <p style={{ color: "#555", margin: 0, fontSize: "13px" }}>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            {selectedBooking.status === "pending" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleBookingAction(selectedBooking.id, "declined")} disabled={processing}
                  style={{ flex: 1, background: "#FEF2F2", color: "#f87171", border: "1px solid #FCA5A5", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  Decline
                </button>
                <button onClick={() => handleBookingAction(selectedBooking.id, "accepted")} disabled={processing}
                  style={{ flex: 2, background: "#22c55e", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  {processing ? "Processing..." : "Accept Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


