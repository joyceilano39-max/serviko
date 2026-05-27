"use client";
import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

type Booking = {
  id: number;
  artist_name: string;
  artist_id: number;
  service: string;
  date: string;
  time: string;
  location_address: string;
  total: number;
  status: string;
  notes: string;
  created_at: string;
};

type TabType = "bookings" | "profile" | "addresses" | "vouchers";

export default function CustomerDashboardPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchVouchers();
      fetchNearbyArtists();
    }
  }, [user]);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/vouchers");
      const data = await res.json();
      setVouchers((data.vouchers || []).slice(0, 3));
    } catch {}
  };

  const fetchNearbyArtists = async () => {
    try {
      const res = await fetch("/api/artists");
      const data = await res.json();
      setArtists((data.artists || []).slice(0, 4));
    } catch {}
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!email) { setLoading(false); return; }
      const res = await fetch(`/api/customer/bookings?email=${email}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return { bg: "#FFF9E6", color: "#D97706", label: "Pending" };
      case "confirmed": return { bg: "#EFF6FF", color: "#3b82f6", label: "Confirmed" };
      case "in_progress": return { bg: "#F5F3FF", color: "#7C3AED", label: "In Progress" };
      case "completed": return { bg: "#F0FDF4", color: "#22c55e", label: "Completed" };
      case "declined": return { bg: "#FEF2F2", color: "#f87171", label: "Declined" };
      default: return { bg: "#f8f8f8", color: "#888", label: status };
    }
  };

  const pending = bookings.filter(b => b.status === "pending");
  const upcoming = bookings.filter(b => b.status === "confirmed" || b.status === "in_progress");
  const completed = bookings.filter(b => b.status === "completed");
  const filteredBookings = filterStatus === "all" ? bookings : bookings.filter(b => b.status === filterStatus);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>My Dashboard</h1>
        <UserButton />
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "24px", color: "#fff" }}>
        <p style={{ opacity: 0.8, fontSize: "12px", margin: "0 0 4px" }}>My Account</p>
        <h2 style={{ fontWeight: 900, fontSize: "22px", margin: "0 0 4px" }}>Hi, {user?.firstName || "Customer"}!</h2>
        <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>
          {upcoming.length > 0 ? `${upcoming.length} upcoming booking(s)` : "No upcoming bookings"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#e0e0e0", margin: "0 0 16px" }}>
        {[
          { label: "Pending", value: pending.length, color: "#D97706", bg: "#FFF9E6" },
          { label: "Upcoming", value: upcoming.length, color: "#3b82f6", bg: "#EFF6FF" },
          { label: "Completed", value: completed.length, color: "#22c55e", bg: "#F0FDF4" },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, padding: "16px", textAlign: "center" }}>
            <p style={{ fontWeight: 900, fontSize: "28px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
            <p style={{ color: "#888", fontSize: "11px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Active Promos */}
        {vouchers.length > 0 && activeTab === "bookings" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ fontWeight: 700, margin: 0, fontSize: "15px" }}>&#127873; Active Promos</h3>
              <Link href="/vouchers" style={{ color: "#E61D72", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>See All</Link>
            </div>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
              {vouchers.map(v => (
                <div key={v.code} style={{ background: "#fff", borderRadius: "12px", padding: "12px 16px", minWidth: "160px", borderLeft: `3px solid #E61D72`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight: 700, color: "#E61D72", margin: "0 0 4px", fontSize: "13px" }}>{v.code}</p>
                  <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Near You */}
        {artists.length > 0 && activeTab === "bookings" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3 style={{ fontWeight: 700, margin: 0, fontSize: "15px" }}>&#10024; Services Near You</h3>
              <Link href="/services" style={{ color: "#E61D72", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>See All</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "12px" }}>
              {artists.map(artist => (
                <Link key={artist.id} href={`/artist/${artist.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ height: "100px", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {artist.profile_photo ? (
                        <img src={artist.profile_photo} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "32px" }}>&#128100;</span>
                      )}
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: "13px", color: "#333" }}>{artist.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/services" style={{ display: "block", background: "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", padding: "14px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "15px", textAlign: "center", marginBottom: "16px" }}>
              Book a Service &#8594;
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
          {[
            { id: "bookings", label: "My Bookings" },
            { id: "profile", label: "Profile" },
            { id: "addresses", label: "Addresses" },
            { id: "vouchers", label: "Vouchers" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
              style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap", background: activeTab === tab.id ? "#E61D72" : "#fff", color: activeTab === tab.id ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
              {["all", "pending", "confirmed", "completed", "declined"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)}
                  style={{ padding: "6px 12px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", textTransform: "capitalize", whiteSpace: "nowrap", background: filterStatus === f ? "#E61D72" : "#fff", color: filterStatus === f ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {f} {f !== "all" && `(${bookings.filter(b => b.status === f).length})`}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: "#888", textAlign: "center", padding: "48px 0" }}>Loading your bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No bookings yet</p>
                <p style={{ color: "#888", fontSize: "13px" }}>Book a service to get started!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {filteredBookings.map(booking => {
                  const sc = getStatusColor(booking.status);
                  return (
                    <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                      style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{booking.artist_name || `Artist #${booking.artist_id}`}</p>
                          {booking.service && <p style={{ color: "#E61D72", fontWeight: 600, fontSize: "12px", margin: "0 0 2px" }}>{booking.service}</p>}
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date} at {booking.time}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                            {sc.label}
                          </span>
                          <p style={{ fontWeight: 900, color: "#E61D72", margin: 0, fontSize: "16px" }}>{'\u20B1'}{booking.total}</p>
                        </div>
                      </div>
                      {(booking.status === "confirmed" || booking.status === "in_progress") && (
                        <Link href="/tracking" onClick={e => e.stopPropagation()} style={{ display: "block", background: "#EFF6FF", color: "#3b82f6", padding: "8px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "12px", textAlign: "center", marginTop: "8px" }}>
                          Track Artist &#8594;
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "32px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "28px", fontWeight: 700, overflow: "hidden" }}>
                {user?.imageUrl ? <img src={user.imageUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{user?.firstName?.[0] || "C"}</span>}
              </div>
              <p style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 4px" }}>{user?.fullName}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { label: "Total", value: bookings.length },
                { label: "Upcoming", value: upcoming.length },
                { label: "Completed", value: completed.length },
              ].map(stat => (
                <div key={stat.label} style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                  <p style={{ fontWeight: 900, fontSize: "22px", color: "#E61D72", margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vouchers Tab */}
        {activeTab === "vouchers" && (
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontWeight: 700, margin: "0 0 16px", fontSize: "16px" }}>My Vouchers</h3>
            {vouchers.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "24px 0" }}>No vouchers available</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {vouchers.map(v => (
                  <div key={v.code} style={{ background: "#fff", borderRadius: "14px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid #E61D72", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "#E61D72", margin: "0 0 4px", fontSize: "15px" }}>{v.code}</p>
                      <p style={{ color: "#555", fontSize: "13px", margin: "0 0 2px" }}>{v.description}</p>
                      <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>
                        {v.min_order > 0 ? `Min. ${'\u20B1'}${v.min_order}` : "No minimum"} &bull; Expires: {v.expiry_date ? new Date(v.expiry_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "No expiry"}
                      </p>
                    </div>
                    <button onClick={() => navigator.clipboard?.writeText(v.code)}
                      style={{ background: "#E61D72", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "20px", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}>
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "32px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "14px" }}>No saved addresses yet.</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>&#10005;</button>
            </div>
            {[
              { label: "Artist", val: selectedBooking.artist_name },
              { label: "Service", val: selectedBooking.service || "Not specified" },
              { label: "Date", val: selectedBooking.date },
              { label: "Time", val: selectedBooking.time },
              { label: "Address", val: selectedBooking.location_address || "No address" },
              { label: "Total", val: `${'\u20B1'}${selectedBooking.total}` },
              { label: "Status", val: getStatusColor(selectedBooking.status).label },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>{item.label}</span>
                <span style={{ fontWeight: 600, fontSize: "13px" }}>{item.val}</span>
              </div>
            ))}
            {(selectedBooking.status === "confirmed" || selectedBooking.status === "in_progress") && (
              <Link href="/tracking" style={{ display: "block", background: "#3b82f6", color: "#fff", padding: "14px", borderRadius: "14px", textDecoration: "none", fontWeight: 700, fontSize: "15px", textAlign: "center", marginTop: "16px" }}>
                Track Your Artist &#8594;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
