"use client";
import { useState } from "react";

const services = [
  "Haircut & Styling",
  "Full Body Massage",
  "Facial Treatment",
  "Manicure & Pedicure",
  "Hair Coloring",
  "Hot Stone Massage",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    preferredServices: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      preferredServices: prev.preferredServices.includes(service)
        ? prev.preferredServices.filter((s) => s !== service)
        : [...prev.preferredServices, service],
    }));
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", maxWidth: "400px" }}>
          <div style={{ fontSize: "64px" }}>🌸</div>
          <h2 style={{ color: "#E61D72", fontSize: "24px", fontWeight: 700 }}>Welcome to Serviko!</h2>
          <p style={{ color: "#888" }}>Your registration was successful, {form.firstName}!</p>
          <a href="/dashboard" style={{ display: "inline-block", marginTop: "16px", background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "32px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#E61D72", fontSize: "28px", fontWeight: 900, marginBottom: "8px" }}>Customer Registration</h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>Fill in your details to get started</p>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>First Name *</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Joyce" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Last Name *</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Ilano" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="joyce@email.com" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="09XX XXX XXXX" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          {/* Address */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street, Barangay, City" rows={2}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", resize: "none" }} />
          </div>

          {/* Birthday */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Birthday</label>
            <input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px" }} />
          </div>

          {/* Preferred Services */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Preferred Services</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {services.map((service) => (
                <button key={service} onClick={() => toggleService(service)}
                  style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #FFD6E7", textAlign: "left",
                    background: form.preferredServices.includes(service) ? "#E61D72" : "#fff",
                    color: form.preferredServices.includes(service) ? "#fff" : "#555",
                    fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit}
            style={{ background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
            Register Now
          </button>

          <p style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>
            Already have an account? <a href="/sign-in" style={{ color: "#E61D72", textDecoration: "none", fontWeight: 600 }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}