"use client";
import { useState, useEffect } from "react";

type Artist = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  services: string[];
  bio: string;
  profile_photo: string;
  valid_id: string;
  verification_status: string;
  created_at: string;
  gcash_number: string;
};

export default function AdminVerificationPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [filter, setFilter] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/artists");
      const data = await res.json();
      setArtists(data.artists || []);
    } catch {
      setArtists([]);
    }
    setLoading(false);
  };

  const handleVerify = async (artistId: number, status: string, reason?: string) => {
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId, status, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(status === "approved" ? "Artist approved!" : "Artist rejected!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchArtists();
        setSelectedArtist(null);
        setShowRejectModal(false);
        setRejectionReason("");
      }
    } catch {
      alert("Action failed. Try again.");
    }
    setProcessing(false);
  };

  const filteredArtists = artists.filter(a =>
    filter === "all" ? true : a.verification_status === filter
  );

  const counts = {
    pending: artists.filter(a => a.verification_status === "pending").length,
    approved: artists.filter(a => a.verification_status === "approved").length,
    rejected: artists.filter(a => a.verification_status === "rejected").length,
  };

  const checklist = [
    "Selfie is clear and recent",
    "ID photo is readable",
    "Face in selfie matches ID",
    "ID is not expired",
    "ID number is visible",
    "No signs of editing/tampering",
  ];

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const toggleCheck = (item: string) => setChecks(prev => ({ ...prev, [item]: !prev[item] }));
  const allChecked = checklist.every(item => checks[item]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "20px 24px", color: "#fff" }}>
        <a href="/admin" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>Back to Admin</a>
        <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0 4px" }}>ID Verification Dashboard</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "13px" }}>Review and verify artist applications</p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{ background: "#22c55e", color: "#fff", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", padding: "20px 24px" }}>
        {[
          { label: "Pending", count: counts.pending, color: "#F59E0B", bg: "#FFF9E6" },
          { label: "Approved", count: counts.approved, color: "#22c55e", bg: "#F0FDF4" },
          { label: "Rejected", count: counts.rejected, color: "#f87171", bg: "#FEF2F2" },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: "16px", padding: "16px", textAlign: "center", border: `2px solid ${stat.color}20` }}>
            <p style={{ fontWeight: 900, fontSize: "28px", color: stat.color, margin: "0 0 4px" }}>{stat.count}</p>
            <p style={{ color: "#555", fontSize: "13px", margin: 0, fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", padding: "0 24px 16px" }}>
        {["pending", "approved", "rejected", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px", textTransform: "capitalize",
              background: filter === f ? "#E61D72" : "#fff", color: filter === f ? "#fff" : "#555", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            {f} {f !== "all" && `(${counts[f as keyof typeof counts] || 0})`}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 24px", display: "grid", gridTemplateColumns: selectedArtist ? "1fr 1fr" : "1fr", gap: "20px" }}>

        {/* Artists List */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px" }}>
              <p style={{ color: "#888" }}>Loading artists...</p>
            </div>
          ) : filteredArtists.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
              <p style={{ fontWeight: 700, margin: "0 0 8px" }}>No {filter} artists</p>
              <p style={{ color: "#888", fontSize: "13px" }}>All caught up!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredArtists.map(artist => (
                <div key={artist.id}
                  onClick={() => { setSelectedArtist(artist); setChecks({}); }}
                  style={{ background: "#fff", borderRadius: "16px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    border: selectedArtist?.id === artist.id ? "2px solid #E61D72" : "2px solid transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Selfie thumbnail */}
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                      {artist.profile_photo ? (
                        <img src={artist.profile_photo} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#888", fontSize: "12px" }}>No Photo</div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "15px" }}>{artist.name}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{artist.email}</p>
                          <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{artist.location} - {artist.experience}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{
                            background: artist.verification_status === "approved" ? "#F0FDF4" : artist.verification_status === "rejected" ? "#FEF2F2" : "#FFF9E6",
                            color: artist.verification_status === "approved" ? "#22c55e" : artist.verification_status === "rejected" ? "#f87171" : "#F59E0B",
                            padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, textTransform: "capitalize"
                          }}>
                            {artist.verification_status || "pending"}
                          </span>
                          <p style={{ color: "#888", fontSize: "10px", margin: "4px 0 0" }}>
                            {new Date(artist.created_at).toLocaleDateString("en-PH")}
                          </p>
                        </div>
                      </div>

                      {/* Services */}
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "8px" }}>
                        {(artist.services || []).slice(0, 3).map(s => (
                          <span key={s} style={{ background: "#FFF0F6", color: "#E61D72", padding: "2px 6px", borderRadius: "10px", fontSize: "10px" }}>{s}</span>
                        ))}
                      </div>

                      {/* Has ID indicator */}
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <span style={{ fontSize: "10px", color: artist.profile_photo ? "#22c55e" : "#f87171", fontWeight: 600 }}>
                          {artist.profile_photo ? "Selfie: OK" : "Selfie: Missing"}
                        </span>
                        <span style={{ fontSize: "10px", color: artist.valid_id ? "#22c55e" : "#f87171", fontWeight: 600 }}>
                          {artist.valid_id ? "ID: OK" : "ID: Missing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Artist Detail Panel */}
        {selectedArtist && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", height: "fit-content", position: "sticky", top: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, margin: 0 }}>Review: {selectedArtist.name}</h3>
              <button onClick={() => setSelectedArtist(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>X</button>
            </div>

            {/* Photos Side by Side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "12px", margin: "0 0 6px", color: "#E61D72" }}>SELFIE PHOTO</p>
                <div style={{ borderRadius: "12px", overflow: "hidden", background: "#f0f0f0", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selectedArtist.profile_photo ? (
                    <img src={selectedArtist.profile_photo} alt="Selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <p style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>No selfie uploaded</p>
                  )}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "12px", margin: "0 0 6px", color: "#7C3AED" }}>VALID ID</p>
                <div style={{ borderRadius: "12px", overflow: "hidden", background: "#f0f0f0", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selectedArtist.valid_id ? (
                    <img src={selectedArtist.valid_id} alt="Valid ID" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <p style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>No ID uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Artist Info */}
            <div style={{ background: "#f8f8f8", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                {[
                  { label: "Phone", val: selectedArtist.phone },
                  { label: "GCash", val: selectedArtist.gcash_number },
                  { label: "Experience", val: selectedArtist.experience },
                  { label: "Location", val: selectedArtist.location },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ color: "#888", margin: "0 0 2px", fontSize: "11px" }}>{item.label}</p>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: "12px" }}>{item.val || "N/A"}</p>
                  </div>
                ))}
              </div>
              {selectedArtist.bio && (
                <div style={{ marginTop: "10px" }}>
                  <p style={{ color: "#888", margin: "0 0 2px", fontSize: "11px" }}>Bio</p>
                  <p style={{ fontWeight: 500, margin: 0, fontSize: "12px" }}>{selectedArtist.bio}</p>
                </div>
              )}
            </div>

            {/* Verification Checklist */}
            {selectedArtist.verification_status === "pending" && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontWeight: 700, fontSize: "13px", margin: "0 0 10px" }}>Verification Checklist</p>
                {checklist.map(item => (
                  <div key={item} onClick={() => toggleCheck(item)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", marginBottom: "4px",
                      background: checks[item] ? "#F0FDF4" : "#f8f8f8" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${checks[item] ? "#22c55e" : "#ccc"}`, background: checks[item] ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checks[item] && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: checks[item] ? 600 : 400 }}>{item}</p>
                  </div>
                ))}
                {!allChecked && (
                  <p style={{ color: "#F59E0B", fontSize: "11px", margin: "8px 0 0" }}>Please complete all checks before approving</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {selectedArtist.verification_status === "pending" && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowRejectModal(true)} disabled={processing}
                  style={{ flex: 1, background: "#FEF2F2", color: "#f87171", border: "1px solid #FCA5A5", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                  Reject
                </button>
                <button onClick={() => handleVerify(selectedArtist.id, "approved")} disabled={processing || !allChecked}
                  style={{ flex: 2, background: allChecked ? "#22c55e" : "#ccc", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: allChecked ? "pointer" : "not-allowed", fontSize: "13px" }}>
                  {processing ? "Processing..." : "Approve Artist"}
                </button>
              </div>
            )}

            {selectedArtist.verification_status === "approved" && (
              <div style={{ background: "#F0FDF4", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "#22c55e", margin: "0 0 4px" }}>Artist Approved</p>
                <p style={{ color: "#555", fontSize: "12px", margin: "0 0 10px" }}>This artist is active and visible to customers</p>
                <button onClick={() => handleVerify(selectedArtist.id, "rejected", "Re-verification required")} disabled={processing}
                  style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                  Revoke Approval
                </button>
              </div>
            )}

            {selectedArtist.verification_status === "rejected" && (
              <div style={{ background: "#FEF2F2", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "#f87171", margin: "0 0 4px" }}>Artist Rejected</p>
                <p style={{ color: "#555", fontSize: "12px", margin: "0 0 10px" }}>This artist cannot accept bookings</p>
                <button onClick={() => handleVerify(selectedArtist.id, "approved")} disabled={processing}
                  style={{ background: "#F0FDF4", color: "#22c55e", border: "none", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                  Approve Instead
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "28px", maxWidth: "400px", width: "100%" }}>
            <h3 style={{ fontWeight: 900, margin: "0 0 8px" }}>Reject Artist</h3>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 16px" }}>Please provide a reason for rejection. The artist will be notified.</p>
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontWeight: 600, fontSize: "12px", margin: "0 0 8px" }}>Quick reasons:</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {[
                  "ID photo is blurry",
                  "Selfie does not match ID",
                  "ID is expired",
                  "ID looks edited",
                  "Incomplete documents",
                ].map(reason => (
                  <button key={reason} onClick={() => setRejectionReason(reason)}
                    style={{ background: rejectionReason === reason ? "#E61D72" : "#FFF0F6", color: rejectionReason === reason ? "#fff" : "#E61D72",
                      border: "1px solid #FFD6E7", padding: "5px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px" }}>
                    {reason}
                  </button>
                ))}
              </div>
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3}
                placeholder="Or type a custom reason..."
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #FFD6E7", fontSize: "13px", resize: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowRejectModal(false)}
                style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => selectedArtist && handleVerify(selectedArtist.id, "rejected", rejectionReason)} disabled={!rejectionReason || processing}
                style={{ flex: 2, background: rejectionReason ? "#f87171" : "#ccc", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: rejectionReason ? "pointer" : "not-allowed" }}>
                {processing ? "Processing..." : "Reject Artist"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
