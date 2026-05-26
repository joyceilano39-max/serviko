"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Artist = {
  id: number;
  name: string;
  profile_photo: string;
};

function BookingContent() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const artistId = searchParams?.get("artistId");
  const artistName = searchParams?.get("artistName");
  const serviceName = searchParams?.get("service");
  const servicePrice = searchParams?.get("price");

  const [artist, setArtist] = useState<Artist | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState(1);

  useEffect(() => {
    if (!artistId) return;
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/artists/${artistId});
        const data = await res.json();
        if (data.artist) setArtist(data.artist);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!mapRef.current || mapInstanceRef.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const defaultLat = 14.6760;
      const defaultLng = 121.0437;
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 14);
      mapInstanceRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "OpenStreetMap" }).addTo(map);
      const pinkIcon = L.divIcon({
        html: <div style="background:#E61D72;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>,
        className: "", iconSize: [32, 32], iconAnchor: [16, 32],
      });
      const marker = L.marker([defaultLat, defaultLng], { draggable: true, icon: pinkIcon }).addTo(map);
      markerRef.current = marker;
      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        await reverseGeocode(pos.lat, pos.lng);
      });
      map.on("click", async (e: any) => {
        marker.setLatLng(e.latlng);
        await reverseGeocode(e.latlng.lat, e.latlng.lng);
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 16);
            marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
            await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          },
          () => reverseGeocode(defaultLat, defaultLng)
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
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json, { headers: { "User-Agent": "Serviko App" } });
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(addr);
      setLocation({ lat, lng, address: addr });
    } catch {
      const addr = ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(addr);
      setLocation({ lat, lng, address: addr });
    }
  };

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + " Philippines")}&format=json&limit=5, { headers: { "User-Agent": "Serviko App" } });
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
    }
    setAddress(result.display_name);
    setLocation({ lat, lng, address: result.display_name });
    setSearchResults([]);
    setSearchQuery("");
  };

  const confirmTime = () => {
    setTime(tempTime);
    setShowTimePicker(false);
  };

  const applyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await fetch("/api/voucher-validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: voucherCode }) });
      const data = await res.json();
      if (data.valid) {
        setAppliedVoucher(data.voucher);
        setError("");
      } else {
        setError("Invalid voucher code");
        setAppliedVoucher(null);
      }
    } catch {
      setError("Error validating voucher");
      setAppliedVoucher(null);
    }
    setVoucherLoading(false);
  };

  const handleSubmit = async () => {
    const selectedDateTime = new Date(${date}T${time});
    const now = new Date();
    if (selectedDateTime <= now) {
      setError("Please select a future date and time");
      return;
    }
    
    if (!date || !time || !location || !contactName || !contactPhone) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bookingData = {
        artistId, artistName, service: (serviceName || "Service"), price: Number(servicePrice), date, time, members,
        location: { lat: location.lat, lng: location.lng, address: location.address },
        landmark,
        contactName, contactPhone, voucherCode: appliedVoucher?.code || null,
        discount: appliedVoucher?.discount || 0, notes, transportFee: 50, total: getTotal(),
      };
      const paymentRes = await fetch("/api/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingData) });
      const paymentData = await paymentRes.json();
      if (paymentData.checkout_url) {
        window.location.href = /work-permit?bookingId=${paymentData.booking_id};
      } else {
        setError("Payment initialization failed");
        setLoading(false);
      }
    } catch {
      setError("Error creating booking");
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return ${today.getFullYear()}`-${String(today.getMonth() + 1).padStart(2, '0')}`-${String(today.getDate()).padStart(2, '0')}`;
  };

  const getTotal = () => {
    const base = Number(servicePrice) + 50;
    return Math.max(base - (appliedVoucher?.discount || 0), 0);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", padding: "24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#E61D72", textDecoration: "none", fontSize: "14px" }}>? Back</Link>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "16px 0 8px", color: "#E61D72" }}>Book Service</h1>
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
          {artist && (
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0" }}>
              <img src={artist.profile_photo} alt={artist.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px" }}>{artist.name}</h2>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Professional Service Provider</p>
              </div>
            </div>
          )}
          <div style={{ background: "#F5F3FF", padding: "16px", borderRadius: "12px" }}>
            <p style={{ fontSize: "14px", color: "#7C3AED", fontWeight: 600, margin: "0 0 4px" }}>Service</p>
            <p style={{ fontSize: "18px", fontWeight: 900, margin: 0 }}>{(serviceName || "Service")}</p>
            <p style={{ fontSize: "16px", color: "#E61D72", fontWeight: 700, marginTop: "8px" }}>?{servicePrice}</p>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>When do you need this service?</h3>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Date *</label>
          <input type="date" value={date} min={getTodayDate()} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "16px" }} />
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Time *</label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <input type="text" value={time} onClick={() => setShowTimePicker(true)} readOnly placeholder="Select time" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", cursor: "pointer" }} />
            {showTimePicker && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", marginTop: "4px", padding: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 10 }}>
                <input type="time" value={tempTime} onChange={(e) => setTempTime(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "12px" }} />
                <button onClick={confirmTime} style={{ width: "100%", background: "#E61D72", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>OK</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>How many people? *</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type='button'
                onClick={() => setMembers(num)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: members === num ? '2px solid #E61D72' : '1px solid #e5e7eb',
                  background: members === num ? '#FFF0F6' : '#fff',
                  color: members === num ? '#E61D72' : '#000',
                  fontWeight: members === num ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Where should we go? *</h3>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && searchAddress()} placeholder="Search address..." style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "8px" }} />
          <button onClick={searchAddress} style={{ width: "100%", background: "#7C3AED", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", marginBottom: "12px" }}>Search</button>
          {searchResults.length > 0 && (
            <div style={{ background: "#f8f8f8", borderRadius: "8px", padding: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "12px" }}>
              {searchResults.map((result, idx) => (
                <div key={idx} onClick={() => selectSearchResult(result)} style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #e5e7eb", fontSize: "13px" }}>{result.display_name}</div>
              ))}
            </div>
          )}
          <div ref={mapRef} style={{ height: "300px", borderRadius: "12px", marginBottom: "12px" }} />
          {address && <div style={{ background: "#f8f8f8", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#666", marginBottom: "12px" }}>?? {address}</div>}
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Landmark (optional)</label>
          <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g., Near 7-Eleven" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px" }} />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Contact Information *</h3>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Name *</label>
          <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", marginBottom: "16px" }} />
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Phone *</label>
          <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="09XX XXX XXXX" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px" }} />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Voucher (Optional)</h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} placeholder="Code" disabled={!!appliedVoucher} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px" }} />
            {!appliedVoucher ? (
              <button onClick={applyVoucher} disabled={voucherLoading} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 600 }}>{voucherLoading ? "..." : "Apply"}</button>
            ) : (
              <button onClick={() => { setAppliedVoucher(null); setVoucherCode(""); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 600 }}>Remove</button>
            )}
          </div>
          {appliedVoucher && <div style={{ background: "#dcfce7", padding: "12px", borderRadius: "8px", marginTop: "12px", fontSize: "13px", color: "#16a34a" }}>? Applied: {appliedVoucher.code} (-?{appliedVoucher.discount})</div>}
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Notes (Optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions?" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "14px", minHeight: "80px" }} />
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Payment Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span>{(serviceName || "Service")}</span>
            <span style={{ fontWeight: 600 }}>?{servicePrice}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#888" }}>
            <span>Transport</span>
            <span style={{ fontWeight: 600 }}>?50</span>
          </div>
          {appliedVoucher && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#22c55e" }}>
              <span>Discount</span>
              <span style={{ fontWeight: 600 }}>-?{appliedVoucher.discount}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #f0f0f0", marginTop: "8px" }}>
            <span style={{ fontWeight: 900, fontSize: "16px" }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: "18px", color: "#E61D72" }}>?{getTotal()}</span>
          </div>
        </div>
        {error && <div style={{ background: "#FEF2F2", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#ccc" : "linear-gradient(135deg, #E61D72, #7C3AED)", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontWeight: 700, fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Processing..." : Pay Now - ?${getTotal()}}
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#E61D72" }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
