"use client";
import { useState, useRef } from "react";

const bookings = [
  { id: "SRV-2026-001", artist: "Maria Santos", artistId: "QC-12345", service: "Full Body Massage", customer: "Joyce Ilano", address: "Unit 12B, One Rockwell, Makati City", date: "April 15, 2026", timeIn: "2:00 PM", timeOut: "4:00 PM", photo: "💆" },
  { id: "SRV-2026-002", artist: "Carlos Mendoza", artistId: "QC-67890", service: "House Cleaning (2BR)", customer: "Ana Cruz", address: "Unit 5A, The Fort Residences, BGC", date: "April 16, 2026", timeIn: "9:00 AM", timeOut: "12:00 PM", photo: "🧹" },
  { id: "SRV-2026-003", artist: "Ana Reyes", artistId: "MK-11223", service: "Haircut & Styling", customer: "Liza Santos", address: "Unit 3C, Lumiere Residences, Pasig", date: "April 17, 2026", timeIn: "3:00 PM", timeOut: "4:30 PM", photo: "✂️" },
];

export default function WorkPermitPage() {
  const [selectedBooking, setSelectedBooking] = useState(bookings[0]);
  const [showPermit, setShowPermit] = useState(false);
  const permitRef = useRef<HTMLDivElement>(null);

  const permitCode = `SERVIKO-${selectedBooking.id}-${selectedBooking.date.replace(/ /g, "").toUpperCase()}`;

  const printPermit = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/artist-dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Artist Dashboard</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>🏢 Work Permit Generator</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Generate digital work permits for condo & building access</p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>

        {/* Info Banner */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "24px" }}>ℹ️</span>
          <div>
            <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "14px" }}>How Work Permits Work</p>
            <p style={{ color: "#888", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
              Show this permit to building security when entering condos, offices, or gated communities. The QR code contains your booking details and can be scanned to verify your identity and appointment.
            </p>
          </div>
        </div>

        {/* Select Booking */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Select Booking</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {bookings.map(b => (
              <div key={b.id} onClick={() => { setSelectedBooking(b); setShowPermit(false); }}
                style={{ padding: "14px 16px", borderRadius: "12px", cursor: "pointer", border: selectedBooking.id === b.id ? "2px solid #E61D72" : "2px solid #eee", background: selectedBooking.id === b.id ? "#FFF0F6" : "#f8f8f8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "24px" }}>{b.photo}</span>
                    <div>
                      <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{b.service}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>📅 {b.date} • {b.timeIn} - {b.timeOut}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>📍 {b.address}</p>
                    </div>
                  </div>
                  {selectedBooking.id === b.id && <span style={{ color: "#E61D72", fontSize: "20px" }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowPermit(true)}
            style={{ width: "100%", marginTop: "16px", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
            🏢 Generate Work Permit
          </button>
        </div>

        {/* Work Permit */}
        {showPermit && (
          <div>
            <div ref={permitRef} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", marginBottom: "16px" }}>
              
              {/* Permit Header */}
              <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontWeight: 900, fontSize: "18px", margin: 0 }}>🌸 SERVIKO</p>
                    <p style={{ opacity: 0.8, fontSize: "11px", margin: 0 }}>serviko.dev</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: "20px" }}>
                    <p style={{ fontWeight: 700, fontSize: "12px", margin: 0 }}>✅ VERIFIED</p>
                  </div>
                </div>
                <h2 style={{ fontWeight: 900, fontSize: "20px", margin: "0 0 4px", letterSpacing: "2px" }}>WORK PERMIT</h2>
                <p style={{ opacity: 0.8, fontSize: "12px", margin: 0 }}>Digital Service Entry Pass</p>
              </div>

              {/* Permit Body */}
              <div style={{ padding: "24px" }}>
                {/* Artist Info */}
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", padding: "16px", background: "#FFF0F6", borderRadius: "14px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #E61D72, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>
                    {selectedBooking.photo}
                  </div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: "18px", margin: "0 0 4px" }}>{selectedBooking.artist}</p>
                    <p style={{ color: "#E61D72", fontWeight: 600, fontSize: "13px", margin: "0 0 4px" }}>{selectedBooking.service}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>ID: {selectedBooking.artistId}</p>
                  </div>
                </div>

                {/* Permit Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  {[
                    { label: "Booking ID", value: selectedBooking.id },
                    { label: "Customer", value: selectedBooking.customer },
                    { label: "Date", value: selectedBooking.date },
                    { label: "Time In", value: selectedBooking.timeIn },
                    { label: "Time Out", value: selectedBooking.timeOut },
                    { label: "Service", value: selectedBooking.service },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#f8f8f8", borderRadius: "10px", padding: "10px 12px" }}>
                      <p style={{ color: "#888", fontSize: "10px", margin: "0 0 2px", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</p>
                      <p style={{ fontWeight: 700, fontSize: "13px", margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div style={{ background: "#f8f8f8", borderRadius: "10px", padding: "12px", marginBottom: "20px" }}>
                  <p style={{ color: "#888", fontSize: "10px", margin: "0 0 4px", textTransform: "uppercase", fontWeight: 600 }}>📍 Service Address</p>
                  <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>{selectedBooking.address}</p>
                </div>

                {/* QR Code */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontWeight: 700, margin: "0 0 12px", fontSize: "14px" }}>📱 Scan to Verify</p>
                  {/* QR Code using Google Charts API */}
                  <div style={{ display: "inline-block", padding: "12px", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", border: "2px solid #E61D72" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`SERVIKO WORK PERMIT\nBooking: ${selectedBooking.id}\nArtist: ${selectedBooking.artist}\nService: ${selectedBooking.service}\nDate: ${selectedBooking.date}\nTime: ${selectedBooking.timeIn}-${selectedBooking.timeOut}\nAddress: ${selectedBooking.address}\nVerify at: serviko.dev/verify/${selectedBooking.id}`)}`}
                      alt="QR Code"
                      width={160}
                      height={160}
                      style={{ display: "block", borderRadius: "8px" }}
                    />
                  </div>
                  <p style={{ color: "#888", fontSize: "11px", margin: "8px 0 0" }}>Scan with any QR scanner to verify</p>
                </div>

                {/* Permit Code */}
                <div style={{ background: "#FFF0F6", borderRadius: "12px", padding: "12px", textAlign: "center", marginBottom: "16px", border: "2px dashed #E61D72" }}>
                  <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>PERMIT CODE</p>
                  <p style={{ fontWeight: 900, color: "#E61D72", fontSize: "14px", margin: 0, letterSpacing: "1px" }}>{permitCode}</p>
                </div>

                {/* Validity Notice */}
                <div style={{ background: "#FFFBEB", borderRadius: "12px", padding: "12px", border: "1px solid #FDE68A" }}>
                  <p style={{ fontWeight: 700, color: "#D97706", margin: "0 0 6px", fontSize: "13px" }}>⚠️ Validity Notice</p>
                  <p style={{ color: "#555", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>
                    This permit is valid ONLY on {selectedBooking.date} from {selectedBooking.timeIn} to {selectedBooking.timeOut} at the specified address. The artist must carry a valid government ID matching this permit. Any misuse is subject to account suspension and legal action.
                  </p>
                </div>
              </div>

              {/* Permit Footer */}
              <div style={{ background: "#1a1a1a", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Issued by Serviko • serviko.dev</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Verify: serviko.dev/verify/{selectedBooking.id}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={printPermit}
                style={{ flex: 1, background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
                🖨️ Print Permit
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(permitCode);
                alert("Permit code copied!");
              }}
                style={{ flex: 1, background: "#fff", color: "#E61D72", padding: "14px", borderRadius: "12px", border: "2px solid #E61D72", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
                📋 Copy Code
              </button>
              <button onClick={() => {
                const url = `https://wa.me/?text=SERVIKO WORK PERMIT%0ABooking: ${selectedBooking.id}%0AArtist: ${selectedBooking.artist}%0AService: ${selectedBooking.service}%0ADate: ${selectedBooking.date}%0ATime: ${selectedBooking.timeIn}%0AAddress: ${selectedBooking.address}%0AVerify: serviko.dev/verify/${selectedBooking.id}`;
                window.open(url, "_blank");
              }}
                style={{ flex: 1, background: "#25D366", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
                💬 WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #permit-print, #permit-print * { visibility: visible; }
          #permit-print { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
