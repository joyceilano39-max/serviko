"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Voucher = {
  id: number;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "fixed",
    discount_value: "",
    min_order: "0",
    expiry_date: "No expiry",
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vouchers");
      const data = await res.json();
      setVouchers(data.vouchers || []);
    } catch {
      setVouchers([]);
    }
    setLoading(false);
  };

  const createVoucher = async () => {
    if (!form.code || !form.description || !form.discount_value) {
      alert("Please fill in all required fields!");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          description: form.description,
          discount_type: form.discount_type,
          discount_value: parseInt(form.discount_value),
          min_order: parseInt(form.min_order),
          expiry_date: form.expiry_date,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Voucher created successfully!");
        setForm({
          code: "",
          description: "",
          discount_type: "fixed",
          discount_value: "",
          min_order: "0",
          expiry_date: "No expiry",
        });
        setShowForm(false);
        fetchVouchers();
      } else {
        alert("Failed to create voucher. Code might already exist.");
      }
    } catch {
      alert("Error creating voucher");
    }
    setSaving(false);
  };

  const toggleVoucher = async (id: number, is_active: boolean) => {
    try {
      await fetch("/api/vouchers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !is_active }),
      });
      fetchVouchers();
    } catch {
      alert("Failed to update voucher");
    }
  };

  const getVoucherColor = (index: number) => {
    const colors = ["#E61D72", "#7C3AED", "#22c55e", "#F59E0B", "#3b82f6"];
    return colors[index % colors.length];
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 4px" }}>Voucher Management</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Create and manage discount vouchers</p>
        </div>
        <Link href="/admin" style={{ background: "#f0f0f0", color: "#555", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontWeight: 600, fontSize: "13px" }}>
          ← Back to Admin
        </Link>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px", fontWeight: 600 }}>Total Vouchers</p>
            <p style={{ fontWeight: 900, fontSize: "28px", color: "#7C3AED", margin: 0 }}>{vouchers.length}</p>
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px", fontWeight: 600 }}>Active</p>
            <p style={{ fontWeight: 900, fontSize: "28px", color: "#22c55e", margin: 0 }}>
              {vouchers.filter((v) => v.is_active).length}
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: "0 0 4px", fontWeight: 600 }}>Inactive</p>
            <p style={{ fontWeight: 900, fontSize: "28px", color: "#f87171", margin: 0 }}>
              {vouchers.filter((v) => !v.is_active).length}
            </p>
          </div>
        </div>

        <button onClick={() => setShowForm(!showForm)} style={{ width: "100%", background: "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginBottom: "24px" }}>
          {showForm ? "✕ Cancel" : "+ Create New Voucher"}
        </button>

        {showForm && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 20px" }}>Create New Voucher</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Voucher Code *
                </label>
                <input type="text" placeholder="e.g. NEWYEAR50" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box", textTransform: "uppercase" }} />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Description *
                </label>
                <input type="text" placeholder="e.g. ₱50 off New Year promo" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Discount Type *
                </label>
                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }}>
                  <option value="fixed">Fixed Amount (₱)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Discount Value * {form.discount_type === "fixed" ? "(in Pesos)" : "(in %)"}
                </label>
                <input type="number" placeholder={form.discount_type === "fixed" ? "e.g. 50" : "e.g. 20"} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Minimum Order (₱)
                </label>
                <input type="number" placeholder="0 for no minimum" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Expiry Date
                </label>
                <input type="text" placeholder='e.g. "December 31, 2026" or "No expiry"' value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <button onClick={createVoucher} disabled={saving} style={{ background: saving ? "#ccc" : "#E61D72", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: "15px" }}>
                {saving ? "Creating..." : "Create Voucher"}
              </button>
            </div>
          </div>
        )}

        <h3 style={{ fontWeight: 900, margin: "0 0 16px" }}>All Vouchers</h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#888" }}>Loading vouchers...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No vouchers yet</p>
            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Create your first voucher to get started!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {vouchers.map((v, i) => (
              <div key={v.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${getVoucherColor(i)}`, opacity: v.is_active ? 1 : 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontWeight: 900, fontSize: "18px", color: getVoucherColor(i), margin: 0 }}>
                        {v.code}
                      </p>
                      <span style={{ background: v.is_active ? "#F0FDF4" : "#FEF2F2", color: v.is_active ? "#22c55e" : "#f87171", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 700 }}>
                        {v.is_active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <p style={{ color: "#555", fontSize: "14px", margin: "0 0 8px" }}>{v.description}</p>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>Discount</p>
                        <p style={{ fontWeight: 700, fontSize: "13px", margin: 0 }}>
                          {v.discount_type === "fixed" ? `₱${v.discount_value}` : `${v.discount_value}%`}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>Min. Order</p>
                        <p style={{ fontWeight: 700, fontSize: "13px", margin: 0 }}>
                          {v.min_order > 0 ? `₱${v.min_order}` : "No min"}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: "#888", fontSize: "11px", margin: "0 0 2px" }}>Expires</p>
                        <p style={{ fontWeight: 700, fontSize: "13px", margin: 0 }}>{v.expiry_date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button onClick={() => toggleVoucher(v.id, v.is_active)} style={{ flex: 1, background: v.is_active ? "#FEF2F2" : "#F0FDF4", color: v.is_active ? "#f87171" : "#22c55e", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                    {v.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => {
                    navigator.clipboard.writeText(v.code);
                    alert("Code copied!");
                  }} style={{ flex: 1, background: "#F5F3FF", color: "#7C3AED", border: "none", padding: "10px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
