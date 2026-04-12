"use client";
import { useEffect, useRef } from "react";

const locations = [
  { name: "Serviko - Quezon City", address: "Quezon City, Metro Manila", lat: 14.676, lng: 121.0437 },
  { name: "Serviko - Makati", address: "Makati City, Metro Manila", lat: 14.5547, lng: 121.0244 },
  { name: "Serviko - Pasig", address: "Pasig City, Metro Manila", lat: 14.5764, lng: 121.0851 },
  { name: "Serviko - Mandaluyong", address: "Mandaluyong City, Metro Manila", lat: 14.5794, lng: 121.0359 },
];

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const L = require("leaflet");
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([14.5995, 120.9842], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:#E61D72;color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🌸</div>`,
      className: "",
      iconSize: [36, 36],
    });

    locations.forEach((loc) => {
      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>${loc.address}`);
    });

    return () => { map.remove(); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6" }}>
      <div style={{ padding: "32px 32px 16px" }}>
        <h1 style={{ color: "#E61D72", fontSize: "28px", fontWeight: 900, margin: 0 }}>Find Us Near You</h1>
        <p style={{ color: "#888", marginTop: "8px" }}>Serviko locations across Metro Manila</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "0", height: "600px", margin: "0 32px 32px" }}>
        {/* Sidebar */}
        <div style={{ background: "#fff", borderRadius: "20px 0 0 20px", padding: "24px", overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "16px" }}>Our Locations</h3>
          {locations.map((loc) => (
            <div key={loc.name} style={{ padding: "16px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #FFD6E7", cursor: "pointer", background: "#FFF8FC" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>🌸</div>
              <p style={{ fontWeight: 600, margin: "0 0 4px", fontSize: "14px" }}>{loc.name}</p>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{loc.address}</p>
              <a href="/booking" style={{ display: "inline-block", marginTop: "8px", background: "#E61D72", color: "#fff", padding: "6px 14px", borderRadius: "20px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}>
                Book Here
              </a>
            </div>
          ))}
        </div>

        {/* Map */}
        <div ref={mapRef} style={{ borderRadius: "0 20px 20px 0", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
      </div>
    </div>
  );
}