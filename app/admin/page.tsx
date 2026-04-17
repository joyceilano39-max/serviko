"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Artist = {
  id: number; name: string; email: string; phone: string;
  location: string; experience: string; services: string[];
  is_available: boolean; rating: string; total_reviews: number;
  verification_status: string; created_at: string;
};

type Customer = {
  id: number; name: string; email: string; phone: string;
  address: string; created_at: string; is_banned?: boolean;
};

type Booking = {
  id: number; customer_name: string; customer_email: string;
  artist_name: string; date: string; time: string;
  address: string; total: number; status: string; created_at: string;
};

type TabType = "overview" | "artists" | "customers" | "bookings" | "earnings";

export default function AdminDashboardPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchArtist, setSearchArtist] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const allServices = [
    "Haircut & Styling", "Men's / Boys Haircut", "Hair Coloring", "Rebond / Keratin",
    "Full Body Massage", "Hot Stone Massage", "Foot Reflexology",
    "Facial Treatment", "Whitening Facial", "Manicure", "Pedicure", "Gel Nails",
    "Lash Extensions", "Eyebrow Threading", "Bridal / Event Makeup",
    "House Cleaning", "Deep Cleaning", "Grass Cutting / Gardening",
    "Painting", "Plumbing", "Electrical", "Carpentry",
  ];

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setArtists(data.artists || []);
      setCustomers(data.customers || []);
      setBookings(data.bookings || []);
    } catch {}
    setLoading(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const toggleArtistAvailability = async (artist: Artist) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_availability", artistId: artist.id, value: !artist.is_available }),
      });
      showSuccess(`${artist.name} is now ${!artist.is_available ? "Active" : "Inactive"}`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const updateArtistServices = async (artistId: number) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_services", artistId, services: editServices }),
      });
      showSuccess("Services updated!");
      setSelectedArtist(null);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const banCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to ban ${customer.name}?`)) return;
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ban_customer", customerId: customer.id }),
      });
      showSuccess(`${customer.name} has been banned`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const removeArtist = async (artist: Artist) => {
    if (!confirm(`Are you sure you want to remove ${artist.name}?`)) return;
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_artist", artistId: artist.id }),
      });
      showSuccess(`${artist.name} has been removed`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.total, 0);
  const totalEarnings = Math.round(totalRevenue * 0.1);
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;

  const filteredArtists = artists.filter(a =>
    searchArtist === "" || a.name.toLowerCase().includes(searchArtist.toLowerCase()) ||
    a.email.toLowerCase().includes(searchArtist.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    searchCustomer === "" || c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.email.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ opacity: 0.7, fontSize: "13px", margin: "0 0 4px" }}>Admin Panel</p>
            <h1 style={{ fontSize: "22px", fontWeight: 900, margin: 0 }}>Serviko Dashboard</h1>
          </div>
          <Link href="/admin/verification" style={{ background: "#E61D72", color: "#fff", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontWeight: 600, fontSize: "13px" }}>
            ID Verification
          </Link>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "#fff", display: "flex", gap: "4px", padding: "12px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "artists", label: `Artists (${artists.length})` },
          { id: "customers", label: `Customers (${customers.length})` },
          { id: "bookings", label: `Bookings (${bookings.length})` },
          { id: "earnings", label: "Earnings" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap",
              background: activeTab === tab.id ? "#E61D72" : "#f0f0f0", color: activeTab === tab.id ? "#fff" : "#555" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {[
                { label: "Total Artists", value: artists.length, color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Total Customers", value: customers.length, color: "#3b82f6", bg: "#EFF6FF" },
                { label: "Total Bookings", value: bookings.length, color: "#E61D72", bg: "#FFF0F6" },
                { label: "Pending", value: pendingBookings, color: "#D97706", bg: "#FFF9E6" },
                { label: "Completed", value: completedBookings, color: "#22c55e", bg: "#F0FDF4" },
                { label: "Revenue (10%)", value: `P${totalEarnings}`, color: "#E61D72", bg: "#FFF0F6" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontWeight: 900, fontSize: "24px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Alerts */}
            {pendingBookings > 0 && (
              <div style={{ background: "#FFF9E6", borderLeft: "4px solid #F59E0B", padding: "14px 20px", borderRadius: "12px" }}>
                <p style={{ fontWeight: 700, color: "#D97706", margin: "0 0 4px" }}>{pendingBookings} booking(s) waiting for artist approval</p>
                <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#D97706", cursor: "pointer", fontWeight: 600, fontSize: "13px", padding: 0 }}>View Bookings</button>
              </div>
            )}

            {/* Pending Verifications */}
            {artists.filter(a => a.verification_status === "pending").length > 0 && (
              <div style={{ background: "#FEF2F2", borderLeft: "4px solid #f87171", padding: "14px 20px", borderRadius: "12px" }}>
                <p style={{ fontWeight: 700, color: "#f87171", margin: "0 0 4px" }}>{artists.filter(a => a.verification_status === "pending").length} artist(s) waiting for ID verification</p>
                <Link href="/admin/verification" style={{ color: "#f87171", fontWeight: 600, fontSize: "13px" }}>Verify Now</Link>
              </div>
            )}

            {/* Recent Bookings */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Recent Bookings</h3>
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{booking.customer_name}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date} at {booking.time}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ background: booking.status === "completed" ? "#F0FDF4" : booking.status === "accepted" ? "#EFF6FF" : "#FFF9E6",
                      color: booking.status === "completed" ? "#22c55e" : booking.status === "accepted" ? "#3b82f6" : "#D97706",
                      padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                      {booking.status}
                    </span>
                    <p style={{ fontWeight: 700, color: "#E61D72", margin: 0, fontSize: "13px" }}>P{booking.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARTISTS */}
        {activeTab === "artists" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              <input value={searchArtist} onChange={e => setSearchArtist(e.target.value)}
                placeholder="Search artists..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", minWidth: "200px" }} />
            </div>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredArtists.map(artist => (
                  <div key={artist.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>
                          {artist.name[0]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{artist.name}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{artist.email}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{artist.location} - {artist.experience}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                        <span style={{ background: artist.verification_status === "approved" ? "#F0FDF4" : artist.verification_status === "rejected" ? "#FEF2F2" : "#FFF9E6",
                          color: artist.verification_status === "approved" ? "#22c55e" : artist.verification_status === "rejected" ? "#f87171" : "#D97706",
                          padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                          {artist.verification_status || "pending"}
                        </span>
                        <span style={{ background: artist.is_available ? "#F0FDF4" : "#FEF2F2", color: artist.is_available ? "#22c55e" : "#f87171", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                          {artist.is_available ? "Active" : "Inactive"}
                        </span>
                        <p style={{ color: "#FFD700", fontSize: "11px", margin: 0 }}>★ {parseFloat(artist.rating).toFixed(1)} ({artist.total_reviews})</p>
                      </div>
                    </div>

                    {/* Services */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                      {(artist.services || []).slice(0, 4).map(s => (
                        <span key={s} style={{ background: "#F5F3FF", color: "#7C3AED", padding: "2px 8px", borderRadius: "20px", fontSize: "10px" }}>{s}</span>
                      ))}
                      {(artist.services || []).length > 4 && <span style={{ background: "#f0f0f0", color: "#888", padding: "2px 8px", borderRadius: "20px", fontSize: "10px" }}>+{artist.services.length - 4}</span>}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => toggleArtistAvailability(artist)} disabled={processing}
                        style={{ background: artist.is_available ? "#FEF2F2" : "#F0FDF4", color: artist.is_available ? "#f87171" : "#22c55e", border: "none", padding: "7px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                        {artist.is_available ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => { setSelectedArtist(artist); setEditServices(artist.services || []); }}
                        style={{ background: "#F5F3FF", color: "#7C3AED", border: "none", padding: "7px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                        Manage Services
                      </button>
                      <Link href="/admin/verification" style={{ background: "#EFF6FF", color: "#3b82f6", padding: "7px 14px", borderRadius: "20px", textDecoration: "none", fontWeight: 600, fontSize: "12px" }}>
                        View ID
                      </Link>
                      <button onClick={() => removeArtist(artist)} disabled={processing}
                        style={{ background: "#FEF2F2", color: "#f87171", border: "none", padding: "7px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <input value={searchCustomer} onChange={e => setSearchCustomer(e.target.value)}
                placeholder="Search customers..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> : filteredCustomers.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No customers yet</p>
                <p style={{ color: "#888", fontSize: "13px" }}>Customers will appear here after they register</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredCustomers.map(customer => (
                  <div key={customer.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>
                          {customer.name?.[0] || "C"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{customer.name}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{customer.email}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{customer.phone} - {customer.address}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ background: "#F0FDF4", color: "#22c55e", padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                          {bookings.filter(b => b.customer_email === customer.email).length} bookings
                        </span>
                        <button onClick={() => banCustomer(customer)} disabled={processing}
                          style={{ background: "#FEF2F2", color: "#f87171", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}>
                          Ban
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> : bookings.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>No bookings yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {bookings.map(booking => (
                  <div key={booking.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{booking.customer_name}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>Artist: {booking.artist_name || "Unassigned"}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{booking.date} at {booking.time}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.address}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: booking.status === "completed" ? "#F0FDF4" : booking.status === "accepted" ? "#EFF6FF" : booking.status === "declined" ? "#FEF2F2" : "#FFF9E6",
                          color: booking.status === "completed" ? "#22c55e" : booking.status === "accepted" ? "#3b82f6" : booking.status === "declined" ? "#f87171" : "#D97706",
                          padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "capitalize" }}>
                          {booking.status}
                        </span>
                        <p style={{ fontWeight: 900, color: "#E61D72", margin: 0, fontSize: "16px" }}>P{booking.total}</p>
                        <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>Platform: P{Math.round(booking.total * 0.1)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EARNINGS */}
        {activeTab === "earnings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", borderRadius: "20px", padding: "28px", color: "#fff", textAlign: "center" }}>
              <p style={{ opacity: 0.8, margin: "0 0 8px", fontSize: "14px" }}>Total Platform Revenue (10%)</p>
              <p style={{ fontWeight: 900, fontSize: "40px", margin: "0 0 4px" }}>P{totalEarnings}</p>
              <p style={{ opacity: 0.7, fontSize: "12px", margin: 0 }}>From P{totalRevenue} total bookings</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {[
                { label: "Total Bookings", value: bookings.length, color: "#E61D72" },
                { label: "Completed", value: completedBookings, color: "#22c55e" },
                { label: "Pending", value: pendingBookings, color: "#D97706" },
                { label: "Gross Revenue", value: `P${totalRevenue}`, color: "#7C3AED" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "#fff", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontWeight: 900, fontSize: "22px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Completed Bookings</h3>
              {bookings.filter(b => b.status === "completed").map(booking => (
                <div key={booking.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{booking.customer_name}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 2px" }}>+P{Math.round(booking.total * 0.1)}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Total: P{booking.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manage Services Modal */}
      {selectedArtist && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Manage Services - {selectedArtist.name}</h3>
              <button onClick={() => setSelectedArtist(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>X</button>
            </div>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Select which services this artist can offer</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {allServices.map(s => (
                <button key={s} onClick={() => setEditServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  style={{ padding: "7px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px",
                    background: editServices.includes(s) ? "#7C3AED" : "#EDE9FE", color: editServices.includes(s) ? "#fff" : "#7C3AED" }}>
                  {editServices.includes(s) ? "✓ " : ""}{s}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setSelectedArtist(null)} style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => updateArtistServices(selectedArtist.id)} disabled={processing}
                style={{ flex: 2, background: "#7C3AED", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                {processing ? "Saving..." : "Save Services"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
