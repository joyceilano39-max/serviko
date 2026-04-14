"use client";
import { useState, useEffect } from "react";

const statusSteps = [
  { id: "confirmed", label: "Booking Confirmed", icon: "✅", desc: "Your booking has been confirmed!", color: "#22c55e" },
  { id: "preparing", label: "Artist Preparing", icon: "🎨", desc: "Your artist is getting ready", color: "#3b82f6" },
  { id: "ontheway", label: "Artist On The Way", icon: "🚗", desc: "Your artist is heading to you", color: "#F59E0B" },
  { id: "arrived", label: "Artist Arrived", icon: "📍", desc: "Your artist has arrived!", color: "#E61D72" },
  { id: "inprogress", label: "Service In Progress", icon: "💆", desc: "Sit back and relax!", color: "#7C3AED" },
  { id: "done", label: "Service Complete", icon: "🌸", desc: "Hope you enjoyed your service!", color: "#22c55e" },
];

const chatMessages = [
  { from: "artist", text: "Hi! I'm Maria, your artist today. I'm on my way! 😊", time: "2:05 PM" },
  { from: "customer", text: "Great! Our address is 123 Rizal St. Gate is on the left.", time: "2:06 PM" },
  { from: "artist", text: "Got it! I'll be there in about 10 minutes 🙏", time: "2:07 PM" },
];

export default function TrackingPage() {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [eta, setEta] = useState(12);
  const [messages, setMessages] = useState(chatMessages);
  const [newMsg, setNewMsg] = useState("");
  const [tab, setTab] = useState<"track" | "chat">("track");
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  // Auto-progress simulation
  useEffect(() => {
    if (currentStatus >= statusSteps.length - 1) {
      setTimeout(() => setShowRating(true), 1000);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStatus(prev => prev + 1);
      if (eta > 0) setEta(prev => Math.max(0, prev - 3));
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentStatus]);

  useEffect(() => {
    if (eta > 0 && currentStatus === 2) {
      const t = setInterval(() => setEta(prev => Math.max(0, prev - 1)), 6000);
      return () => clearInterval(t);
    }
  }, [currentStatus, eta]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { from: "customer", text: newMsg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "artist", text: "Got it! See you soon 😊", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1500);
  };

  const activeStatus = statusSteps[currentStatus];

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← My Bookings</a>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px" }}>Booking #SRV-2026-001</h1>
            <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>April 15, 2026 • 2:00 PM</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}>
            {activeStatus.icon} {activeStatus.label}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", display: "flex", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {[{ id: "track", label: "📍 Track" }, { id: "chat", label: "💬 Chat" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as "track" | "chat")}
            style={{ flex: 1, padding: "14px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px",
              background: tab === t.id ? "#fff" : "#f8f8f8",
              color: tab === t.id ? "#E61D72" : "#888",
              borderBottom: tab === t.id ? "3px solid #E61D72" : "3px solid transparent" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>

        {tab === "track" && (
          <div>
            {/* Map Placeholder */}
            <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", marginBottom: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ height: "220px", background: "linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Fake map grid */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ position: "absolute", left: `${i*25}%`, top: 0, bottom: 0, width: "1px", background: "#88c" }} />
                  ))}
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ position: "absolute", top: `${i*33}%`, left: 0, right: 0, height: "1px", background: "#88c" }} />
                  ))}
                </div>
                {/* Roads */}
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "3px", background: "#fff", opacity: 0.6 }} />
                <div style={{ position: "absolute", left: "40%", top: 0, bottom: 0, width: "3px", background: "#fff", opacity: 0.6 }} />

                {/* Artist marker - animated */}
                <div style={{ position: "absolute", left: currentStatus >= 2 ? "55%" : "20%", top: "40%", transition: "left 2s ease", zIndex: 2 }}>
                  <div style={{ background: "#E61D72", color: "#fff", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 12px rgba(230,29,114,0.4)", animation: currentStatus === 2 ? "pulse 1s infinite" : "none" }}>
                    🚗
                  </div>
                  <div style={{ background: "#E61D72", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", textAlign: "center", marginTop: "4px", fontWeight: 600 }}>Artist</div>
                </div>

                {/* Destination marker */}
                <div style={{ position: "absolute", right: "20%", top: "35%", zIndex: 2 }}>
                  <div style={{ background: "#7C3AED", color: "#fff", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 12px rgba(124,58,237,0.4)" }}>
                    🏠
                  </div>
                  <div style={{ background: "#7C3AED", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", textAlign: "center", marginTop: "4px", fontWeight: 600 }}>You</div>
                </div>

                {/* ETA Badge */}
                {currentStatus === 2 && eta > 0 && (
                  <div style={{ position: "absolute", top: "12px", right: "12px", background: "#fff", borderRadius: "16px", padding: "8px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <p style={{ fontWeight: 900, color: "#E61D72", margin: 0, fontSize: "16px" }}>{eta} min</p>
                    <p style={{ color: "#888", margin: 0, fontSize: "10px" }}>ETA</p>
                  </div>
                )}
              </div>

              {/* Artist Info Bar */}
              <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>💆</div>
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 2px" }}>Maria Santos</p>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <span style={{ color: "#FFD700" }}>★</span>
                      <span style={{ fontSize: "13px" }}>4.9 • Massage Therapist</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setTab("chat")}
                    style={{ background: "#FFF0F6", color: "#E61D72", border: "none", padding: "10px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                    💬 Chat
                  </button>
                  <a href="tel:09123456789"
                    style={{ background: "#E61D72", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>
                    📞 Call
                  </a>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 20px" }}>Booking Status</h3>
              {statusSteps.map((status, i) => {
                const isDone = i < currentStatus;
                const isActive = i === currentStatus;
                const isPending = i > currentStatus;
                return (
                  <div key={status.id} style={{ display: "flex", gap: "16px", marginBottom: i < statusSteps.length - 1 ? "0" : "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0,
                        background: isDone ? "#F0FDF4" : isActive ? status.color : "#f0f0f0",
                        border: isActive ? `3px solid ${status.color}` : "3px solid transparent",
                        boxShadow: isActive ? `0 0 0 4px ${status.color}30` : "none" }}>
                        {isDone ? "✓" : isPending ? "○" : status.icon}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div style={{ width: "2px", height: "32px", background: isDone ? "#22c55e" : "#eee", marginTop: "4px" }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: "24px", flex: 1 }}>
                      <p style={{ fontWeight: isActive ? 700 : 600, margin: "8px 0 2px", color: isPending ? "#aaa" : "#333", fontSize: "14px" }}>{status.label}</p>
                      {isActive && <p style={{ color: status.color, fontSize: "12px", margin: 0, fontWeight: 600 }}>{status.desc}</p>}
                      {isDone && <p style={{ color: "#22c55e", fontSize: "12px", margin: 0 }}>Completed ✓</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Booking Details */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 16px" }}>Booking Details</h3>
              {[
                ["👥 Members", "Joyce (Full Body Massage), Maria (Hot Stone)"],
                ["📍 Location", "123 Rizal St, Quezon City"],
                ["🚗 Transport", "₱100 (3-7 km)"],
                ["💳 Payment", "GCash • ₱1,900"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                  <span style={{ color: "#888" }}>{label}</span>
                  <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "200px" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            {/* Chat Header */}
            <div style={{ background: "#FFF0F6", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #FFE4F0" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E61D72", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💆</div>
              <div>
                <p style={{ fontWeight: 700, margin: 0 }}>Maria Santos</p>
                <p style={{ color: "#22c55e", fontSize: "12px", margin: 0 }}>🟢 Online</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: "20px", minHeight: "300px", maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.from === "customer" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "customer" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.from === "customer" ? "#E61D72" : "#f0f0f0",
                    color: msg.from === "customer" ? "#fff" : "#333" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "14px" }}>{msg.text}</p>
                    <p style={{ margin: 0, fontSize: "10px", opacity: 0.7, textAlign: "right" }}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "16px", borderTop: "1px solid #FFE4F0", display: "flex", gap: "8px" }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "12px 16px", borderRadius: "25px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none" }} />
              <button onClick={sendMessage}
                style={{ background: "#E61D72", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "25px", cursor: "pointer", fontWeight: 700 }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && !rated && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🌸</div>
            <h2 style={{ fontWeight: 900, margin: "0 0 8px" }}>Service Complete!</h2>
            <p style={{ color: "#888", margin: "0 0 24px" }}>How was your experience with Maria Santos?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)}
                  style={{ fontSize: "36px", background: "none", border: "none", cursor: "pointer", color: star <= rating ? "#FFD700" : "#ddd" }}>★</button>
              ))}
            </div>
            <button onClick={() => { setRated(true); setShowRating(false); }}
              style={{ width: "100%", background: "#E61D72", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
              Submit Rating 🌸
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
