"use client";
import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  artist_id: number;
  date: string;
  time: string;
  address: string;
  total: number;
  transport_fee: number;
  status: string;
  notes: string;
  payment_method: string;
  created_at: string;
  artist_name?: string;
};

type TabType = "bookings" | "profile" | "addresses" | "vouchers";

export default function CustomerDashboardPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { fetchBookings(); }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!email) { setLoading(false); return; }
      const res = await fetch(`/api/customer/bookings?email=${email}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch { setBookings([]); }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return { bg: "#FFF9E6", color: "#D97706", label: "Pending" };
      case "accepted": return { bg: "#EFF6FF", color: "#3b82f6", label: "Confirmed" };
      case "completed": return { bg: "#F0FDF4", color: "#22c55e", label: "Completed" };
      case "declined": return { bg: "#FEF2F2", color: "#f87171", label: "Declined" };
      default: return { bg: "#f8f8f8", color: "#888", label: status };
    }
  };

  const pending = bookings.filter(b => b.status === "pending");
  const upcoming = bookings.filter(b => b.status === "accepted");
  const completed = bookings.filter(b => b.status === "completed");
  const filteredBookings = filterStatus === "all" ? bookings : bookings.filter(b => b.status === filterStatus);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>`n      {/* Logout Bar */}`n      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>`n        <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>My Dashboard</h1>`n        <UserButton afterSignOutUrl="/login" />`n      </div>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: "0 0 4px" }}>My Account</p>
            <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "0 0 4px" }}>Hi, {user?.firstName || "Customer"}!</h1>
            <p style={{ opacity: 0.8, fontSize: "13px", margin: 0 }}>{upcoming.length > 0 ? `${upcoming.length} upcoming booking(s)` : "No upcoming bookings"}</p>
          </div>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px", color: "#fff" }}>
            {user?.firstName?.[0] || "C"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", padding: "16px 20px" }}>
        {[
          { label: "Pending", value: pending.length, color: "#D97706", bg: "#FFF9E6" },
          { label: "Upcoming", value: upcoming.length, color: "#3b82f6", bg: "#EFF6FF" },
          { label: "Completed", value: completed.length, color: "#22c55e", bg: "#F0FDF4" },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: "14px", padding: "14px", textAlign: "center" }}>
            <p style={{ fontWeight: 900, fontSize: "24px", color: stat.color, margin: "0 0 2px" }}>{stat.value}</p>
            <p style={{ color: "#555", fontSize: "11px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", display: "flex", gap: "4px", padding: "12px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[{ id: "bookings", label: "My Bookings" }, { id: "profile", label: "Profile" }, { id: "addresses", label: "Addresses" }, { id: "vouchers", label: "Vouchers" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap", background: activeTab === tab.id ? "#E61D72" : "#f0f0f0", color: activeTab === tab.id ? "#fff" : "#555" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        {activeTab === "bookings" && (
          <div>
            <Link href="/booking" style={{ display: "block", background: "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", padding: "16px 20px", borderRadius: "16px", textDecoration: "none", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 900, fontSize: "16px", margin: "0 0 4px" }}>Book a Service</p>
                  <p style={{ opacity: 0.8, fontSize: "12px", margin: 0 }}>Find available artists near you</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px 16px", borderRadius: "20px", fontWeight: 700, fontSize: "13px" }}>Book Now</div>
              </div>
            </Link>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto" }}>
              {["all", "pending", "accepted", "completed", "declined"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)}
                  style={{ padding: "7px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", textTransform: "capitalize", whiteSpace: "nowrap", background: filterStatus === f ? "#E61D72" : "#fff", color: filterStatus === f ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {f === "accepted" ? "confirmed" : f} {f !== "all" && `(${bookings.filter(b => b.status === f).length})`}
                </button>
              ))}
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "48px" }}><p style={{ color: "#888" }}>Loading your bookings...</p></div>
            ) : filteredBookings.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No bookings yet</p>
                <p style={{ color: "#888", fontSize: "13px", margin: "0 0 20px" }}>Book your first service today!</p>
                <Link href="/booking" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>Book Now</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredBookings.map(booking => {
                  const sc = getStatusColor(booking.status);
                  return (
                    <div key={booking.id} onClick={() => setSelectedBooking(booking)}
                      style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", border: booking.status === "accepted" ? "2px solid #3b82f6" : "2px solid transparent" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{booking.artist_name || `Artist #${booking.artist_id}`}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{booking.date} at {booking.time}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.address}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "4px" }}>{sc.label}</span>
                          <p style={{ fontWeight: 900, color: "#E61D72", margin: 0, fontSize: "16px" }}>P{booking.total}</p>
                        </div>
                      </div>
                      {booking.status === "accepted" && (
                        <Link href="/tracking" onClick={e => e.stopPropagation()} style={{ display: "block", background: "#EFF6FF", color: "#3b82f6", padding: "8px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "12px", textAlign: "center", marginTop: "8px" }}>Track Artist</Link>
                      )}
                      {booking.status === "completed" && (
                        <Link href="/reviews" onClick={e => e.stopPropagation()} style={{ display: "block", background: "#FFF0F6", color: "#E61D72", padding: "8px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "12px", textAlign: "center", marginTop: "8px" }}>Leave a Review</Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "28px", fontWeight: 700 }}>{user?.firstName?.[0] || "C"}</div>
              <p style={{ fontWeight: 700, fontSize: "18px", margin: "0 0 4px" }}>{user?.fullName || "Customer"}</p>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[{ href: "/addresses", label: "Manage Addresses" }, { href: "/reviews", label: "My Reviews" }, { href: "/vouchers", label: "My Vouchers" }, { href: "/", label: "Back to Home" }].map(item => (
                <Link key={item.href} href={item.href} style={{ display: "block", background: "#FFF0F6", color: "#E61D72", padding: "12px 16px", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>{item.label}</Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === "vouchers" && (
          <div>
            <h2 style={{ fontWeight: 900, margin: "0 0 16px" }}>My Vouchers</h2>
            {[
              { code: "FIRST50", desc: "P50 off first booking", min: "No minimum", color: "#E61D72" },
              { code: "SUMMER20", desc: "20% off massage services", min: "Min. P200", color: "#7C3AED" },
              { code: "REFER100", desc: "P100 referral reward", min: "Min. P500", color: "#22c55e" },
              { code: "WELCOME50", desc: "Welcome gift P50 off", min: "No minimum", color: "#F59E0B" },
            ].map(v => (
              <div key={v.code} style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${v.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: "16px", color: v.color, margin: "0 0 4px" }}>{v.code}</p>
                    <p style={{ color: "#555", fontSize: "13px", margin: "0 0 2px" }}>{v.desc}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{v.min}</p>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(v.code)} style={{ background: v.color, color: "#fff", border: "none", padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>Copy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>X</button>
            </div>
            {[
              { label: "Artist", val: selectedBooking.artist_name || `Artist #${selectedBooking.artist_id}` },
              { label: "Date", val: selectedBooking.date },
              { label: "Time", val: selectedBooking.time },
              { label: "Address", val: selectedBooking.address },
              { label: "Total", val: `P${selectedBooking.total}` },
              { label: "Status", val: getStatusColor(selectedBooking.status).label },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#888", fontSize: "13px" }}>{item.label}</span>
                <span style={{ fontWeight: 600, fontSize: "13px" }}>{item.val}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {selectedBooking.status === "accepted" && <Link href="/tracking" style={{ flex: 1, background: "#3b82f6", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>Track Artist</Link>}
              {selectedBooking.status === "completed" && <Link href="/reviews" style={{ flex: 1, background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center" }}>Leave Review</Link>}
              <button onClick={() => setSelectedBooking(null)} style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ height: "70px" }} />
    </div>
  );
}
