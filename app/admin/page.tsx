"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Artist = {
  id: number; name: string; email: string; phone: string;
  location: string; services: string[];
  is_available: boolean; rating: string; total_reviews: number;
  verification_status: string;
};

type Customer = {
  id: number; name: string; email: string; phone: string; address: string;
};

type Booking = {
  id: number; customer_name: string; customer_email: string;
  artist_name: string; date: string; time: string;
  address: string; total: number; status: string;
};

type Voucher = {
  id: number; code: string; description: string;
  discount_type: string; discount_value: number;
  min_order: number; expiry_date: string; is_active: boolean;
};

type TabType = "overview" | "artists" | "customers" | "bookings" | "earnings" | "vouchers";

export default function AdminDashboardPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [successMsg, setSuccessMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [editServices, setEditServices] = useState<string[]>([]);
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: "", description: "", discount_type: "fixed",
    discount_value: 0, min_order: 0, expiry_date: "No expiry"
  });

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
      const [adminRes, voucherRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/vouchers"),
      ]);
      const adminData = await adminRes.json();
      const voucherData = await voucherRes.json();
      setArtists(adminData.artists || []);
      setCustomers(adminData.customers || []);
      setBookings(adminData.bookings || []);
      setVouchers(voucherData.vouchers || []);
    } catch {}
    setLoading(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const toggleArtist = async (artist: Artist) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_availability", artistId: artist.id, value: !artist.is_available }),
      });
      showSuccess(`${artist.name} is now ${!artist.is_available ? "Active" : "Inactive"}`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const updateServices = async (artistId: number) => {
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_services", artistId, services: editServices }),
      });
      showSuccess("Services updated!");
      setSelectedArtist(null);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const banCustomer = async (customer: Customer) => {
    if (!confirm(`Ban ${customer.name}?`)) return;
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ban_customer", customerId: customer.id }),
      });
      showSuccess(`${customer.name} banned`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const removeArtist = async (artist: Artist) => {
    if (!confirm(`Remove ${artist.name}?`)) return;
    setProcessing(true);
    try {
      await fetch("/api/admin/manage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_artist", artistId: artist.id }),
      });
      showSuccess(`${artist.name} removed`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const toggleVoucher = async (voucher: Voucher) => {
    setProcessing(true);
    try {
      await fetch("/api/vouchers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: voucher.id, is_active: !voucher.is_active }),
      });
      showSuccess(`Voucher ${voucher.code} ${!voucher.is_active ? "activated" : "deactivated"}`);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const createVoucher = async () => {
    if (!voucherForm.code || !voucherForm.description) return;
    setProcessing(true);
    try {
      await fetch("/api/vouchers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voucherForm),
      });
      showSuccess(`Voucher ${voucherForm.code} created!`);
      setVoucherForm({ code: "", description: "", discount_type: "fixed", discount_value: 0, min_order: 0, expiry_date: "No expiry" });
      setShowVoucherForm(false);
      fetchAll();
    } catch {}
    setProcessing(false);
  };

  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.total, 0);
  const totalEarnings = Math.round(totalRevenue * 0.1);
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
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

      {successMsg && <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>{successMsg}</div>}

      <div style={{ background: "#fff", display: "flex", gap: "4px", padding: "12px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "artists", label: `Artists (${artists.length})` },
          { id: "customers", label: `Customers (${customers.length})` },
          { id: "bookings", label: `Bookings (${bookings.length})` },
          { id: "earnings", label: "Earnings" },
          { id: "vouchers", label: `Vouchers (${vouchers.length})` },
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
              {[
                { label: "Artists", value: artists.length, color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Customers", value: customers.length, color: "#3b82f6", bg: "#EFF6FF" },
                { label: "Bookings", value: bookings.length, color: "#E61D72", bg: "#FFF0F6" },
                { label: "Pending", value: pendingBookings, color: "#D97706", bg: "#FFF9E6" },
                { label: "Completed", value: completedBookings, color: "#22c55e", bg: "#F0FDF4" },
                { label: "Revenue 10%", value: `P${totalEarnings}`, color: "#E61D72", bg: "#FFF0F6" },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontWeight: 900, fontSize: "22px", color: stat.color, margin: "0 0 4px" }}>{stat.value}</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            {pendingBookings > 0 && (
              <div style={{ background: "#FFF9E6", borderLeft: "4px solid #F59E0B", padding: "14px 20px", borderRadius: "12px" }}>
                <p style={{ fontWeight: 700, color: "#D97706", margin: "0 0 4px" }}>{pendingBookings} booking(s) waiting for artist approval</p>
                <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#D97706", cursor: "pointer", fontWeight: 600, fontSize: "13px", padding: 0 }}>View Bookings</button>
              </div>
            )}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> :
              artists.map(artist => (
                <div key={artist.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {artist.name[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{artist.name}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{artist.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                      <span style={{ background: artist.is_available ? "#F0FDF4" : "#FEF2F2", color: artist.is_available ? "#22c55e" : "#f87171", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                        {artist.is_available ? "Active" : "Inactive"}
                      </span>
                      <span style={{ background: artist.verification_status === "approved" ? "#F0FDF4" : "#FFF9E6",
                        color: artist.verification_status === "approved" ? "#22c55e" : "#D97706",
                        padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                        {artist.verification_status || "pending"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {(artist.services || []).slice(0, 3).map(s => (
                      <span key={s} style={{ background: "#F5F3FF", color: "#7C3AED", padding: "2px 8px", borderRadius: "20px", fontSize: "10px" }}>{s}</span>
                    ))}
                    {(artist.services || []).length > 3 && <span style={{ background: "#f0f0f0", color: "#888", padding: "2px 8px", borderRadius: "20px", fontSize: "10px" }}>+{artist.services.length - 3}</span>}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => toggleArtist(artist)} disabled={processing}
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
              ))
            }
          </div>
        )}

        {/* CUSTOMERS */}
        {activeTab === "customers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> :
              customers.length === 0 ? <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}><p style={{ fontWeight: 700 }}>No customers yet</p></div> :
              customers.map(customer => (
                <div key={customer.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                        {customer.name?.[0] || "C"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{customer.name}</p>
                        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{customer.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
              ))
            }
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> :
              bookings.length === 0 ? <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}><p style={{ fontWeight: 700 }}>No bookings yet</p></div> :
              bookings.map(booking => (
                <div key={booking.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{booking.customer_name}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>Artist: {booking.artist_name || "Unassigned"}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.date} at {booking.time}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ background: booking.status === "completed" ? "#F0FDF4" : booking.status === "accepted" ? "#EFF6FF" : "#FFF9E6",
                        color: booking.status === "completed" ? "#22c55e" : booking.status === "accepted" ? "#3b82f6" : "#D97706",
                        padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, display: "block", marginBottom: "4px", textTransform: "capitalize" }}>
                        {booking.status}
                      </span>
                      <p style={{ fontWeight: 900, color: "#E61D72", margin: 0 }}>P{booking.total}</p>
                      <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>Platform: P{Math.round(booking.total * 0.1)}</p>
                    </div>
                  </div>
                </div>
              ))
            }
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
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
          </div>
        )}

        {/* VOUCHERS */}
        {activeTab === "vouchers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontWeight: 900, margin: 0 }}>Voucher Management</h2>
              <button onClick={() => setShowVoucherForm(!showVoucherForm)}
                style={{ background: "#E61D72", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: 700, fontSize: "13px" }}>
                + Create Voucher
              </button>
            </div>

            {showVoucherForm && (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>Create New Voucher</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Voucher Code</label>
                    <input type="text" placeholder="e.g. SUMMER50" value={voucherForm.code}
                      onChange={e => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Discount Type</label>
                    <select value={voucherForm.discount_type} onChange={e => setVoucherForm({ ...voucherForm, discount_type: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px" }}>
                      <option value="fixed">Fixed Amount (P)</option>
                      <option value="percent">Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>
                      {voucherForm.discount_type === "fixed" ? "Discount Amount (P)" : "Discount Percent (%)"}
                    </label>
                    <input type="number" value={voucherForm.discount_value}
                      onChange={e => setVoucherForm({ ...voucherForm, discount_value: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Minimum Order (P)</label>
                    <input type="number" value={voucherForm.min_order}
                      onChange={e => setVoucherForm({ ...voucherForm, min_order: parseInt(e.target.value) || 0 })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Description</label>
                    <input type="text" placeholder="e.g. P50 off summer promo" value={voucherForm.description}
                      onChange={e => setVoucherForm({ ...voucherForm, description: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Expiry Date</label>
                    <input type="text" placeholder="e.g. June 30, 2026 or No expiry" value={voucherForm.expiry_date}
                      onChange={e => setVoucherForm({ ...voucherForm, expiry_date: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button onClick={() => setShowVoucherForm(false)}
                    style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button onClick={createVoucher} disabled={processing || !voucherForm.code || !voucherForm.description}
                    style={{ flex: 2, background: processing ? "#ccc" : "#E61D72", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                    {processing ? "Creating..." : "Create Voucher"}
                  </button>
                </div>
              </div>
            )}

            {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> :
              vouchers.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                  <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No vouchers yet</p>
                  <p style={{ color: "#888", fontSize: "13px" }}>Create your first voucher code!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {vouchers.map((v, i) => {
                    const colors = ["#E61D72", "#7C3AED", "#22c55e", "#F59E0B", "#3b82f6"];
                    const color = colors[i % colors.length];
                    return (
                      <div key={v.id} style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}`, opacity: v.is_active ? 1 : 0.5 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                              <p style={{ fontWeight: 900, fontSize: "16px", color: color, margin: 0 }}>{v.code}</p>
                              <span style={{ background: v.discount_type === "percent" ? "#EFF6FF" : "#FFF0F6",
                                color: v.discount_type === "percent" ? "#3b82f6" : "#E61D72",
                                padding: "1px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
                                {v.discount_type === "percent" ? `${v.discount_value}%` : `P${v.discount_value}`} OFF
                              </span>
                              <span style={{ background: v.is_active ? "#F0FDF4" : "#FEF2F2", color: v.is_active ? "#22c55e" : "#f87171", padding: "1px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700 }}>
                                {v.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p style={{ color: "#555", fontSize: "13px", margin: "0 0 2px" }}>{v.description}</p>
                            <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Min: P{v.min_order} | Expiry: {v.expiry_date}</p>
                          </div>
                          <button onClick={() => toggleVoucher(v)} disabled={processing}
                            style={{ background: v.is_active ? "#FEF2F2" : "#F0FDF4", color: v.is_active ? "#f87171" : "#22c55e", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                            {v.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Manage Services Modal */}
      {selectedArtist && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px", width: "100%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Services - {selectedArtist.name}</h3>
              <button onClick={() => setSelectedArtist(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>X</button>
            </div>
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
              <button onClick={() => updateServices(selectedArtist.id)} disabled={processing}
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
