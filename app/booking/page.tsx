"use client";
import { useState } from "react";

const services = [
  { id: 1, name: "Haircut & Styling", price: 500, duration: "1 hour" },
  { id: 2, name: "Full Body Massage", price: 800, duration: "1.5 hours" },
  { id: 3, name: "Facial Treatment", price: 650, duration: "1 hour" },
  { id: 4, name: "Manicure & Pedicure", price: 450, duration: "1 hour" },
  { id: 5, name: "Hair Coloring", price: 1200, duration: "2 hours" },
  { id: 6, name: "Hot Stone Massage", price: 1000, duration: "1.5 hours" },
];

const staff = [
  { id: 1, name: "Ana Reyes", role: "Hair Specialist" },
  { id: 2, name: "Maria Santos", role: "Massage Therapist" },
  { id: 3, name: "Liza Cruz", role: "Skin Care Expert" },
  { id: 4, name: "Joy Dela Cruz", role: "Nail Technician" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

export default function BookingPage() {
  const [form, setForm] = useState({
    service: "",
    staff: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.service || !form.staff || !form.date || !form.time) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "64px" }}>🎉</div>
          <h2 style={{ color: "#E61D72", fontSize: "24px", fontWeight: 700 }}>Booking Confirmed!</h2>
          <p style={{ color: "#888" }}>Your appointment has been successfully booked.</p>
          <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "16px", margin: "16px 0", textAlign: "left" }}>
            <p><strong>Service:</strong> {form.service}</p>
            <p><strong>Staff:</strong> {form.staff}</p>
            <p><strong>Date:</strong> {form.date}</p>
            <p><strong>Time:</strong> {form.time}</p>
            {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
          </div>
          <a href="/dashboard" style={{ background: "#E61D72", color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "32px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ color: "#E61D72", fontSize: "28px", fontWeight: 900, marginBottom: "8px" }}>Book an Appointment</h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>Fill in the details below to book your service</p>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Service */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Select Service *</label>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none" }}
            >
              <option value="">-- Choose a service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name} — P{s.price} ({s.duration})</option>
              ))}
            </select>
          </div>

          {/* Staff */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Select Staff *</label>
            <select
              value={form.staff}
              onChange={(e) => setForm({ ...form, staff: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none" }}
            >
              <option value="">-- Choose a staff --</option>
              {staff.map((s) => (
                <option key={s.id} value={s.name}>{s.name} — {s.role}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Select Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none" }}
            />
          </div>

          {/* Time */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Select Time *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setForm({ ...form, time: slot })}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #FFD6E7",
                    background: form.time === slot ? "#E61D72" : "#fff",
                    color: form.time === slot ? "#fff" : "#555",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special requests or notes..."
              rows={3}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none", resize: "none" }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{ background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}