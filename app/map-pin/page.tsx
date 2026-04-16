"use client";
import { useState, useEffect, useRef } from "react";

type Location = {
  lat: number;
  lng: number;
  address: string;
};

export default function MapPinPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Default to Quezon City Philippines
      const defaultLat = 14.6760;
      const defaultLng = 121.0437;

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 14);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap",
      }).addTo(map);

      // Custom pink marker
      const pinkIcon = L.divIcon({
        html: `<div style="background:#E61D72;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Add draggable marker
      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: pinkIcon,
      }).addTo(map);
      markerRef.current = marker;

      // Get address when marker is dragged
      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        await reverseGeocode(pos.lat, pos.lng);
      });

      // Move marker when map is clicked
      map.on("click", async (e: any) => {
        marker.setLatLng(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 16);
            marker.setLatLng([latitude, longitude]);
            await reverseGeocode(latitude, longitude);
          },
          () => {
            reverseGeocode(defaultLat, defaultLng);
          }
        );
      } else {
        reverseGeocode(defaultLat, defaultLng);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "User-Agent": "Serviko App" } }
      );
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(addr);
      setLocation({ lat, lng, address: addr });
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setLocation({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    }
    setLoading(false);
  };

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + " Philippines")}&format=json&limit=5`,
        { headers: { "User-Agent": "Serviko App" } }
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const selectSearchResult = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
    }

    setAddress(result.display_name);
    setLocation({ lat, lng, address: result.display_name });
    setSearchResults([]);
    setSearchQuery(result.display_name.split(",")[0]);
  };

  const confirmLocation = () => {
    if (location) {
      // Save to localStorage for booking page
      localStorage.setItem("serviko_location", JSON.stringify(location));
      setConfirmed(true);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 16);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          await reverseGeocode(latitude, longitude);
        },
        () => setLoading(false)
      );
    }
  };

  if (confirmed && location) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF0F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "40px 32px", textAlign: "center", maxWidth: "480px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>📍</div>
          <h2 style={{ fontWeight: 900, color: "#22c55e", margin: "0 0 8px" }}>Location Confirmed!</h2>
          <p style={{ color: "#888", margin: "0 0 20px", fontSize: "13px" }}>We'll show you artists near this location</p>
          <div style={{ background: "#FFF0F6", borderRadius: "14px", padding: "16px", marginBottom: "24px", textAlign: "left", border: "2px solid #E61D72" }}>
            <p style={{ fontWeight: 700, color: "#E61D72", margin: "0 0 6px", fontSize: "14px" }}>Your Location:</p>
            <p style={{ color: "#555", fontSize: "13px", margin: "0 0 8px", lineHeight: 1.5 }}>{location.address}</p>
            <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setConfirmed(false)}
              style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
              Change
            </button>
            <a href="/booking" style={{ flex: 2, background: "#E61D72", color: "#fff", padding: "12px", borderRadius: "12px", textDecoration: "none", fontWeight: 700, textAlign: "center", display: "block", fontSize: "14px" }}>
              Find Artists Near Me →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "16px 20px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Home</a>
        <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "6px 0 4px" }}>Pin Your Location</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "12px" }}>Drag the pin or tap on the map to set your exact location</p>
      </div>

      {/* Search Bar */}
      <div style={{ background: "#fff", padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: searchResults.length > 0 ? "0" : "0" }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchAddress()}
            placeholder="Search address e.g. Litex, Quezon City"
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "14px" }}
          />
          <button onClick={searchAddress} disabled={searching}
            style={{ background: "#E61D72", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
            {searching ? "..." : "Search"}
          </button>
          <button onClick={useCurrentLocation}
            style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            GPS
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: "8px", overflow: "hidden", border: "1px solid #FFD6E7" }}>
            {searchResults.map((result, i) => (
              <div key={i} onClick={() => selectSearchResult(result)}
                style={{ padding: "12px 16px", cursor: "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid #f0f0f0" : "none", fontSize: "13px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFF0F6")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
                <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{result.display_name.split(",")[0]}</p>
                <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>{result.display_name.split(",").slice(1, 3).join(",")}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1, minHeight: "400px", zIndex: 1 }} />

      {/* Bottom Panel */}
      <div style={{ background: "#fff", padding: "16px 20px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", zIndex: 10 }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", margin: "0 0 12px" }}>Getting address...</p>
        ) : address ? (
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "13px", color: "#E61D72" }}>Selected Location:</p>
            <p style={{ color: "#555", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
              {address.length > 100 ? address.substring(0, 100) + "..." : address}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", margin: "0 0 12px" }}>Tap on map or drag pin to select location</p>
        )}

        {/* Saved Addresses Quick Select */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto" }}>
          {[
            { label: "Home", addr: "FCM North Fairview, Quezon City", lat: 14.7069, lng: 121.0386 },
            { label: "Work", addr: "Ayala Ave, Makati", lat: 14.5547, lng: 121.0244 },
            { label: "Parents", addr: "San Antonio, QC", lat: 14.6422, lng: 121.0456 },
          ].map(saved => (
            <button key={saved.label} onClick={async () => {
              if (mapInstanceRef.current && markerRef.current) {
                mapInstanceRef.current.setView([saved.lat, saved.lng], 15);
                markerRef.current.setLatLng([saved.lat, saved.lng]);
              }
              await reverseGeocode(saved.lat, saved.lng);
            }}
              style={{ background: "#FFF0F6", color: "#E61D72", border: "1px solid #FFD6E7", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
              {saved.label}
            </button>
          ))}
        </div>

        <button onClick={confirmLocation} disabled={!location || loading}
          style={{ width: "100%", background: location && !loading ? "#E61D72" : "#ccc", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: location && !loading ? "pointer" : "not-allowed", fontSize: "15px" }}>
          Confirm This Location →
        </button>
      </div>
    </div>
  );
}
