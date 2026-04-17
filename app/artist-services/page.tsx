"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const SERVICE_CATEGORIES = [
  {
    category: "Hair Services",
    services: [
      { name: "Haircut & Styling (Women)", suggested_price: 250, duration: "1 hr" },
      { name: "Haircut (Men / Boys)", suggested_price: 150, duration: "30 mins" },
      { name: "Hair Coloring (Full)", suggested_price: 800, duration: "2-3 hrs" },
      { name: "Hair Coloring (Roots only)", suggested_price: 400, duration: "1.5 hrs" },
      { name: "Highlights / Balayage", suggested_price: 1500, duration: "3-4 hrs" },
      { name: "Rebonding", suggested_price: 1500, duration: "4-5 hrs" },
      { name: "Keratin Treatment", suggested_price: 2000, duration: "3-4 hrs" },
      { name: "Hair Treatment / Mask", suggested_price: 350, duration: "45 mins" },
      { name: "Blowdry & Styling", suggested_price: 200, duration: "30-45 mins" },
    ]
  },
  {
    category: "Nail Services",
    services: [
      { name: "Basic Manicure", suggested_price: 150, duration: "45 mins" },
      { name: "Basic Pedicure", suggested_price: 180, duration: "1 hr" },
      { name: "Mani + Pedi Combo", suggested_price: 300, duration: "1.5 hrs" },
      { name: "Gel Manicure", suggested_price: 350, duration: "1 hr" },
      { name: "Gel Pedicure", suggested_price: 380, duration: "1.5 hrs" },
      { name: "Gel Mani + Pedi", suggested_price: 680, duration: "2 hrs" },
      { name: "Acrylic Full Set", suggested_price: 800, duration: "2 hrs" },
      { name: "Acrylic Refill", suggested_price: 500, duration: "1.5 hrs" },
      { name: "Polygel Full Set", suggested_price: 900, duration: "2 hrs" },
      { name: "Polygel Refill", suggested_price: 600, duration: "1.5 hrs" },
      { name: "Builder Gel (BIAB)", suggested_price: 850, duration: "2 hrs" },
      { name: "Dip Powder Nails", suggested_price: 750, duration: "1.5 hrs" },
      { name: "Amber Nails", suggested_price: 950, duration: "2 hrs" },
      { name: "Chrome / Mirror Nails", suggested_price: 500, duration: "1.5 hrs" },
      { name: "Cat Eye Nails", suggested_price: 500, duration: "1.5 hrs" },
      { name: "Nail Art (Simple)", suggested_price: 50, duration: "15 mins per nail" },
      { name: "Nail Art (Complex)", suggested_price: 150, duration: "30 mins per nail" },
      { name: "Russian Manicure", suggested_price: 600, duration: "2 hrs" },
      { name: "Nail Extension (Tips)", suggested_price: 700, duration: "1.5 hrs" },
      { name: "Soft Gel Extensions", suggested_price: 800, duration: "2 hrs" },
      { name: "Nail Removal", suggested_price: 200, duration: "30-45 mins" },
      { name: "French Tips", suggested_price: 400, duration: "1 hr" },
      { name: "Ombre / Gradient Nails", suggested_price: 550, duration: "1.5 hrs" },
      { name: "Glitter / Foil Nails", suggested_price: 450, duration: "1 hr" },
    ]
  },
  {
    category: "Massage & Wellness",
    services: [
      { name: "Full Body Massage (60 mins)", suggested_price: 500, duration: "1 hr" },
      { name: "Full Body Massage (90 mins)", suggested_price: 700, duration: "1.5 hrs" },
      { name: "Hot Stone Massage", suggested_price: 800, duration: "1.5 hrs" },
      { name: "Deep Tissue Massage", suggested_price: 700, duration: "1 hr" },
      { name: "Shiatsu Massage", suggested_price: 600, duration: "1 hr" },
      { name: "Hilot (Traditional Filipino)", suggested_price: 450, duration: "1 hr" },
      { name: "Foot Reflexology", suggested_price: 350, duration: "45 mins" },
      { name: "Head & Shoulder Massage", suggested_price: 300, duration: "30-45 mins" },
      { name: "Prenatal Massage", suggested_price: 700, duration: "1 hr" },
      { name: "Ventosa / Cupping", suggested_price: 400, duration: "45 mins" },
    ]
  },
  {
    category: "Facial & Skin Care",
    services: [
      { name: "Basic Facial", suggested_price: 450, duration: "1 hr" },
      { name: "Whitening Facial", suggested_price: 600, duration: "1 hr" },
      { name: "Anti-Aging Facial", suggested_price: 700, duration: "1 hr" },
      { name: "Acne Treatment Facial", suggested_price: 650, duration: "1 hr" },
      { name: "Hydrating / Glow Facial", suggested_price: 600, duration: "1 hr" },
      { name: "Underarm Whitening", suggested_price: 350, duration: "45 mins" },
      { name: "Eyebrow Threading", suggested_price: 100, duration: "15 mins" },
      { name: "Eyebrow Tinting", suggested_price: 200, duration: "20 mins" },
    ]
  },
  {
    category: "Makeup & Lashes",
    services: [
      { name: "Everyday Makeup", suggested_price: 500, duration: "45 mins" },
      { name: "Party / Event Makeup", suggested_price: 800, duration: "1 hr" },
      { name: "Bridal Makeup (Wedding Day)", suggested_price: 3000, duration: "2.5 hrs" },
      { name: "Debutante Makeup", suggested_price: 2000, duration: "2 hrs" },
      { name: "Lash Extensions (Classic)", suggested_price: 800, duration: "2 hrs" },
      { name: "Lash Extensions (Volume)", suggested_price: 1200, duration: "2.5 hrs" },
      { name: "Lash Extensions (Mega Volume)", suggested_price: 1500, duration: "3 hrs" },
      { name: "Lash Lift & Tint", suggested_price: 700, duration: "1 hr" },
      { name: "Lash Refill (2 weeks)", suggested_price: 500, duration: "1 hr" },
      { name: "Lash Removal", suggested_price: 200, duration: "30 mins" },
    ]
  },
  {
    category: "Home Cleaning",
    services: [
      { name: "Studio / Condo Cleaning (up to 25sqm)", suggested_price: 488, duration: "2-3 hrs" },
      { name: "1BR Condo / Apartment Cleaning", suggested_price: 650, duration: "3-4 hrs" },
      { name: "2BR Condo / Apartment Cleaning", suggested_price: 850, duration: "4-5 hrs" },
      { name: "3BR House Cleaning", suggested_price: 1200, duration: "5-6 hrs" },
      { name: "4BR+ House Cleaning", suggested_price: 1500, duration: "6-8 hrs" },
      { name: "Deep Cleaning - Studio", suggested_price: 800, duration: "4-5 hrs" },
      { name: "Deep Cleaning - 1BR", suggested_price: 1000, duration: "5-6 hrs" },
      { name: "Deep Cleaning - 2BR", suggested_price: 1400, duration: "6-7 hrs" },
      { name: "Move-In / Move-Out Cleaning", suggested_price: 1500, duration: "6-8 hrs" },
      { name: "Airbnb / Short-term Rental Cleaning", suggested_price: 600, duration: "2-3 hrs" },
      { name: "Kitchen Deep Clean", suggested_price: 500, duration: "2-3 hrs" },
      { name: "Bathroom Deep Clean", suggested_price: 350, duration: "1-2 hrs" },
      { name: "Laundry (per load)", suggested_price: 150, duration: "1-2 hrs" },
      { name: "Ironing (per hour)", suggested_price: 100, duration: "1 hr" },
    ]
  },
  {
    category: "Home Repairs",
    services: [
      { name: "Plumbing - Basic Repair", suggested_price: 500, duration: "1-2 hrs" },
      { name: "Electrical - Basic Repair", suggested_price: 500, duration: "1-2 hrs" },
      { name: "Carpentry - Basic Repair", suggested_price: 500, duration: "1-2 hrs" },
      { name: "Painting - Per Room", suggested_price: 1500, duration: "1 day" },
      { name: "Aircon Cleaning (window type)", suggested_price: 500, duration: "1 hr" },
      { name: "Aircon Cleaning (split type)", suggested_price: 700, duration: "1.5 hrs" },
      { name: "Grass Cutting / Gardening", suggested_price: 500, duration: "2-3 hrs" },
      { name: "Furniture Assembly", suggested_price: 500, duration: "1-2 hrs" },
    ]
  },
];

type Service = {
  id: number;
  artist_id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  is_active: boolean;
};

export default function ArtistServicesPage() {
  const { user } = useUser();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Hair Services");
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, duration: "" });
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    if (user) fetchArtistData();
  }, [user]);

  const fetchArtistData = async () => {
    setLoading(true);
    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      const res = await fetch(`/api/artist/bookings?email=${email}`);
      const data = await res.json();
      if (data.artistId) {
        setArtistId(data.artistId);
        const svcRes = await fetch(`/api/artist/services?artistId=${data.artistId}`);
        const svcData = await svcRes.json();
        setServices(svcData.services || []);
      }
    } catch {}
    setLoading(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const addService = async () => {
    if (!form.name || !form.price || !artistId) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/artist/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, artist_id: artistId }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Service added!");
        setForm({ name: "", description: "", price: 0, duration: "" });
        setShowForm(false);
        fetchArtistData();
      }
    } catch {}
    setProcessing(false);
  };

  const updateService = async () => {
    if (!editService) return;
    setProcessing(true);
    try {
      await fetch("/api/artist/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editService.id, ...form }),
      });
      showSuccess("Service updated!");
      setEditService(null);
      fetchArtistData();
    } catch {}
    setProcessing(false);
  };

  const deleteService = async (id: number) => {
    if (!confirm("Remove this service?")) return;
    setProcessing(true);
    try {
      await fetch("/api/artist/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      showSuccess("Service removed!");
      fetchArtistData();
    } catch {}
    setProcessing(false);
  };

  const addFromCatalog = (name: string, suggested_price: number, duration: string) => {
    setForm({ name, description: "", price: suggested_price, duration });
    setShowCatalog(false);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", padding: "20px 24px", color: "#fff" }}>
        <Link href="/artist-dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Dashboard</Link>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>My Services & Pricing</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Set your own rates - you keep 90%!</p>
      </div>

      {successMsg && <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>{successMsg}</div>}

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={() => { setShowCatalog(true); setShowForm(false); setEditService(null); }}
            style={{ flex: 1, background: "#7C3AED", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
            + Add from Catalog
          </button>
          <button onClick={() => { setShowForm(true); setShowCatalog(false); setEditService(null); setForm({ name: "", description: "", price: 0, duration: "" }); }}
            style={{ flex: 1, background: "#fff", color: "#7C3AED", border: "2px solid #7C3AED", padding: "14px", borderRadius: "12px", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
            + Custom Service
          </button>
        </div>

        {/* Service Catalog */}
        {showCatalog && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Service Catalog</h3>
              <button onClick={() => setShowCatalog(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>X</button>
            </div>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Select a service and set your own price. Suggested rates are based on Philippine market rates.</p>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "16px", paddingBottom: "4px" }}>
              {SERVICE_CATEGORIES.map(cat => (
                <button key={cat.category} onClick={() => setActiveCategory(cat.category)}
                  style={{ padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "11px", whiteSpace: "nowrap",
                    background: activeCategory === cat.category ? "#7C3AED" : "#EDE9FE", color: activeCategory === cat.category ? "#fff" : "#7C3AED" }}>
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Services list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
              {SERVICE_CATEGORIES.find(c => c.category === activeCategory)?.services.map(svc => (
                <div key={svc.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#F5F3FF", borderRadius: "10px" }}>
                  <div>
                    <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "13px" }}>{svc.name}</p>
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Suggested: P{svc.suggested_price} | {svc.duration}</p>
                  </div>
                  <button onClick={() => addFromCatalog(svc.name, svc.suggested_price, svc.duration)}
                    style={{ background: "#7C3AED", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap" }}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showForm || editService) && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>{editService ? "Edit Service" : "Add Service"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Service Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Gel Manicure"
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Your Price (P)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Duration</label>
                  <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 1 hr, 30 mins"
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "4px" }}>Description (Optional)</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  placeholder="e.g. Includes nail art design, gel polish"
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "13px", resize: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ background: "#F5F3FF", borderRadius: "10px", padding: "10px" }}>
                <p style={{ color: "#7C3AED", fontSize: "12px", margin: 0, fontWeight: 600 }}>
                  Your earnings: P{Math.round((form.price || 0) * 0.9)} (90% of P{form.price || 0})
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { setShowForm(false); setEditService(null); }}
                  style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button onClick={editService ? updateService : addService} disabled={processing || !form.name || !form.price}
                  style={{ flex: 2, background: processing || !form.name || !form.price ? "#ccc" : "#7C3AED", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                  {processing ? "Saving..." : editService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Services List */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>My Services ({services.length})</h3>
          {loading ? (
            <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No services yet</p>
              <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Add your services so customers can book you!</p>
              <button onClick={() => setShowCatalog(true)}
                style={{ background: "#7C3AED", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "20px", cursor: "pointer", fontWeight: 700 }}>
                Add from Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {services.map(svc => (
                <div key={svc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#F5F3FF", borderRadius: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{svc.name}</p>
                    {svc.description && <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{svc.description}</p>}
                    <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{svc.duration}</p>
                  </div>
                  <div style={{ textAlign: "right", marginLeft: "12px" }}>
                    <p style={{ fontWeight: 900, fontSize: "18px", color: "#7C3AED", margin: "0 0 4px" }}>P{svc.price}</p>
                    <p style={{ color: "#22c55e", fontSize: "10px", margin: "0 0 8px" }}>Earn: P{Math.round(svc.price * 0.9)}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => { setEditService(svc); setForm({ name: svc.name, description: svc.description, price: svc.price, duration: svc.duration }); setShowForm(false); setShowCatalog(false); }}
                        style={{ background: "#EDE9FE", color: "#7C3AED", border: "none", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}>
                        Edit
                      </button>
                      <button onClick={() => deleteService(svc.id)} disabled={processing}
                        style={{ background: "#FEF2F2", color: "#f87171", border: "none", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
