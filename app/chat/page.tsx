"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Message = { id: number; booking_id: number; sender_email: string; sender_name: string; sender_role: string; message: string; is_read: boolean; created_at: string; };

function ChatContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const artistName = searchParams.get("artistName") || "Artist";
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const userName = user?.fullName || user?.firstName || "User";

  useEffect(() => {
    if (bookingId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?bookingId=${bookingId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !bookingId) return;
    setSending(true);
    try {
      await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: parseInt(bookingId), sender_email: userEmail, sender_name: userName, sender_role: "customer", message: newMessage.trim() }) });
      setNewMessage("");
      fetchMessages();
    } catch {}
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "16px 20px", color: "#fff", display: "flex", gap: "12px", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>{artistName[0]}</div>
        <div><p style={{ fontWeight: 700, margin: 0, fontSize: "15px" }}>{artistName}</p><p style={{ opacity: 0.8, margin: 0, fontSize: "11px" }}>Booking #{bookingId}</p></div>
      </div>
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "80px" }}>
        {loading ? <p style={{ textAlign: "center", color: "#888" }}>Loading...</p> : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}><p style={{ fontWeight: 700 }}>No messages yet</p><p style={{ color: "#888", fontSize: "13px" }}>Send a message to your artist!</p></div>
        ) : messages.map(msg => {
          const isMe = msg.sender_email === userEmail;
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", background: isMe ? "linear-gradient(135deg, #E61D72, #7C3AED)" : "#fff", color: isMe ? "#fff" : "#333", padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                {!isMe && <p style={{ fontWeight: 700, fontSize: "11px", margin: "0 0 4px", opacity: 0.7 }}>{msg.sender_name}</p>}
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>{msg.message}</p>
                <p style={{ margin: "4px 0 0", fontSize: "10px", opacity: 0.7, textAlign: "right" }}>{new Date(msg.created_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "12px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", display: "flex", gap: "10px" }}>
        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." style={{ flex: 1, padding: "12px 16px", borderRadius: "24px", border: "1px solid #FFD6E7", fontSize: "14px", outline: "none" }} />
        <button onClick={sendMessage} disabled={sending || !newMessage.trim()} style={{ background: newMessage.trim() ? "#E61D72" : "#f0f0f0", color: newMessage.trim() ? "#fff" : "#888", border: "none", width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer", fontWeight: 700, fontSize: "18px" }}>→</button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}><ChatContent /></Suspense>;
}
