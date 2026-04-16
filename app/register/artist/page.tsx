"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const allServices = [
  "Haircut & Styling", "Men's / Boys Haircut", "Hair Coloring", "Rebond / Keratin",
  "Full Body Massage", "Hot Stone Massage", "Foot Reflexology",
  "Facial Treatment", "Whitening Facial",
  "Manicure", "Pedicure", "Gel Nails",
  "Lash Extensions", "Eyebrow Threading",
  "Bridal / Event Makeup",
  "House Cleaning", "Deep Cleaning",
  "Grass Cutting / Gardening",
  "Painting", "Plumbing", "Electrical", "Carpentry",
];

type FilePreview = { file: File; preview: string } | null;

export default function ArtistRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    city: "", bio: "", experience: "", gcash: "",
    idType: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<FilePreview>(null);
  const [validId, setValidId] = useState<FilePreview>(null);

  const profileRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: FilePreview) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter({ file, preview: URL.createObjectURL(file) });
  };

  const toggleService = (s: string) => {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const uploadToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url || "";
  };

  const handleSubmit = async () => {
    if (!agreed) { setError("Please agree to the terms."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          address: form.city, bio: form.bio, experience: form.experience,
          services: selectedServices, gcash: form.gcash, clerkId: null,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setSuccess(true);
    } catch {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>ðŸŽ¨</div>
          <h1 style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px" }}>Application Submitted!</h1>
          <p style={{ color: "#888", margin: "0 0 20px" }}>We'll verify your account within 24 hours.</p>
          <div style={{ background: "#F5F3FF", borderRadius: "16px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
            {["ID verification (24 hrs)", "Background check", "Email confirmation", "Start earning! ðŸŽ‰"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                <span style={{ color: "#7C3AED", fontWeight: 700 }}>{i + 1}.</span>
                <span style={{ color: "#555" }}>{t}</span>
              </div>
            ))}
          </div>
          <Link href="/artist-dashboard" style={{ display: "block", background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>
            Go to Dashboard â†’
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link href="/register" style={{ color: "#888", fontSize: "13px", textDecoration: "none" }}>â† Back</Link>
          <p style={{ color: "#7C3AED", fontWeight: 900, fontSize: "24px", margin: "8px 0 4px" }}>ðŸŽ¨ Serviko</p>
          <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 4px" }}>Become a Serviko Artist</h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Quick & easy â€” takes only 3 minutes!</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: "4px", borderRadius: "4px", background: s <= step ? "#7C3AED" : "#EDE9FE" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          {["Basic Info", "Photo & ID", "Services", "Confirm"].map((label, i) => (
            <span key={label} style={{ fontSize: "10px", color: i + 1 === step ? "#7C3AED" : "#aaa", fontWeight: i + 1 === step ? 700 : 400 }}>{label}</span>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontWeight: 700, margin: 0, fontSize: "16px" }}>ðŸ‘¤ Basic Information</h3>
              {[
                { label: "Full Name", key: "name", type: "text", ph: "Maria Santos" },
                { label: "Email", key: "email", type: "email", ph: "maria@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", ph: "09XX XXX XXXX" },
                { label: "Password", key: "password", type: "password", ph: "Min. 8 characters" },
                { label: "City / Area", key: "city", type: "text", ph: "e.g. Quezon City, Makati" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "5px" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <button onClick={() => {
                if (!form.name || !form.email || !form.phone || !form.password || !form.city) {
                  setError("Please fill in all fields."); return;
                }
                setError(""); setStep(2);
              }} style={{ background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>
                Continue â†’
              </button>
            </div>
          )}

          {/* STEP 2: Photo & ID */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h3 style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "16px" }}>ðŸ“¸ Photo & ID Verification</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>For customer safety and trust â€” takes 30 seconds!</p>
              </div>

              {/* Profile Photo */}
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Selfie Photo <span style={{ color: "#f87171" }}>*</span>
                  <span style={{ color: "#888", fontWeight: 400 }}> â€” Clear face, no filters</span>
                </label>
                <input ref={profileRef} type="file" accept="image/*" capture="user" style={{ display: "none" }} onChange={e => handleFile(e, setProfilePhoto)} />
                <div onClick={() => profileRef.current?.click()}
                  style={{ border: "2px dashed #EDE9FE", borderRadius: "14px", padding: "20px", textAlign: "center", cursor: "pointer", background: profilePhoto ? "#F5F3FF" : "#fafafa" }}>
                  {profilePhoto ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={profilePhoto.preview} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "3px solid #7C3AED" }} />
                      <div style={{ position: "absolute", bottom: 0, right: 0, background: "#22c55e", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>âœ“</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: "40px", marginBottom: "8px" }}>ðŸ¤³</div>
                      <p style={{ fontWeight: 600, color: "#7C3AED", margin: "0 0 4px", fontSize: "14px" }}>Tap to take/upload selfie</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>JPG, PNG â€” Max 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Valid ID */}
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Valid Government ID <span style={{ color: "#f87171" }}>*</span>
                  <span style={{ color: "#888", fontWeight: 400 }}> â€” Any 1 government ID</span>
                </label>
                <select value={form.idType} onChange={e => setForm({ ...form, idType: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", marginBottom: "10px" }}>
                  <option value="">Select ID Type</option>
                  {["PhilSys National ID", "Passport", "Driver's License", "SSS ID", "GSIS ID", "Pag-IBIG ID", "PhilHealth ID", "Voter's ID", "Postal ID"].map(id => (
                    <option key={id}>{id}</option>
                  ))}
                </select>
                <input ref={idRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e, setValidId)} />
                <div onClick={() => idRef.current?.click()}
                  style={{ border: "2px dashed #EDE9FE", borderRadius: "14px", padding: "16px", textAlign: "center", cursor: "pointer", background: validId ? "#F5F3FF" : "#fafafa" }}>
                  {validId ? (
                    <div style={{ position: "relative" }}>
                      <img src={validId.preview} alt="ID" style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                      <div style={{ position: "absolute", top: "8px", right: "8px", background: "#22c55e", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>âœ“</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: "32px", marginBottom: "6px" }}>ðŸªª</div>
                      <p style={{ fontWeight: 600, color: "#7C3AED", margin: "0 0 2px", fontSize: "13px" }}>Upload photo of your ID</p>
                      <p style={{ color: "#888", fontSize: "11px", margin: 0 }}>Front side only â€¢ Clear & readable</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ background: "#FFFBEB", borderRadius: "12px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>ðŸ”’</span>
                <p style={{ color: "#555", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>
                  Your ID is encrypted and used only for identity verification under <strong>RA 10173 (Data Privacy Act)</strong>. It will never be shared publicly.
                </p>
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>â† Back</button>
                <button onClick={() => {
                  if (!profilePhoto || !validId || !form.idType) { setError("Please upload your selfie and valid ID."); return; }
                  setError(""); setStep(3);
                }} style={{ flex: 2, background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
                  Continue â†’
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Services */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <h3 style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "16px" }}>ðŸ› ï¸ Your Services</h3>
                <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Select what you offer (choose all that apply)</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {allServices.map(s => (
                  <button key={s} onClick={() => toggleService(s)}
                    style={{ padding: "7px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px",
                      background: selectedServices.includes(s) ? "#7C3AED" : "#EDE9FE",
                      color: selectedServices.includes(s) ? "#fff" : "#7C3AED" }}>
                    {selectedServices.includes(s) ? "âœ“ " : ""}{s}
                  </button>
                ))}
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Experience</label>
                <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px" }}>
                  <option value="">Select years of experience</option>
                  <option>Less than 1 year</option>
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>Short Bio <span style={{ color: "#888", fontWeight: 400 }}>(optional)</span></label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2}
                  placeholder="e.g. Professional massage therapist with 5 years experience..."
                  style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "13px", resize: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "6px" }}>GCash Number <span style={{ color: "#888", fontWeight: 400 }}>(for payouts)</span></label>
                <input type="tel" placeholder="09XX XXX XXXX" value={form.gcash} onChange={e => setForm({ ...form, gcash: e.target.value })}
                  style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1px solid #EDE9FE", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>â† Back</button>
                <button onClick={() => {
                  if (selectedServices.length === 0 || !form.experience) { setError("Please select services and experience."); return; }
                  setError(""); setStep(4);
                }} style={{ flex: 2, background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>Continue â†’</button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm & Agree */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontWeight: 700, margin: 0, fontSize: "16px" }}>âœ… Almost Done!</h3>

              {/* Summary */}
              <div style={{ background: "#F5F3FF", borderRadius: "14px", padding: "16px" }}>
                <p style={{ fontWeight: 700, color: "#7C3AED", margin: "0 0 10px" }}>Your Application Summary</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#888" }}>Name</span><span style={{ fontWeight: 600 }}>{form.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#888" }}>Location</span><span style={{ fontWeight: 600 }}>{form.city}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#888" }}>ID Type</span><span style={{ fontWeight: 600 }}>{form.idType}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#888" }}>Experience</span><span style={{ fontWeight: 600 }}>{form.experience}</span>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Services: </span>
                    <span style={{ fontWeight: 600 }}>{selectedServices.slice(0, 3).join(", ")}{selectedServices.length > 3 ? ` +${selectedServices.length - 3} more` : ""}</span>
                  </div>
                </div>
              </div>

              {/* Single Agreement */}
              <div style={{ background: "#FFFBEB", borderRadius: "14px", padding: "16px", border: "1px solid #FDE68A" }}>
                <p style={{ fontWeight: 700, color: "#D97706", margin: "0 0 10px" }}>ðŸ“‹ By submitting, you agree to:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#555", marginBottom: "14px" }}>
                  {[
                    "Serviko Terms & Conditions â€” professional conduct & 10% commission",
                    "Data Privacy Act (RA 10173) â€” your data is safe & protected",
                    "Independent Contractor Agreement â€” you work on your own schedule",
                    "Background check consent â€” NBI/PNP verification for customer safety",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>âœ“</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#7C3AED", flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "#555" }}>
                    I agree to all terms and conditions
                  </span>
                </label>
              </div>

              {/* Benefits Reminder */}
              <div style={{ background: "#F5F3FF", borderRadius: "14px", padding: "14px" }}>
                <p style={{ fontWeight: 700, color: "#7C3AED", margin: "0 0 8px", fontSize: "13px" }}>ðŸŽ¨ Artist Benefits</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["Keep 90%", "GCash payout daily", "Set own schedule", "Free profile listing", "Work permit included"].map(b => (
                    <span key={b} style={{ background: "#fff", color: "#7C3AED", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>âœ“ {b}</span>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: "#f87171", fontSize: "13px", margin: 0 }}>{error}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>â† Back</button>
                <button onClick={handleSubmit} disabled={loading || !agreed}
                  style={{ flex: 2, background: loading || !agreed ? "#ccc" : "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading || !agreed ? "not-allowed" : "pointer", fontSize: "15px" }}>
                  {loading ? "Submitting..." : "Submit Application ðŸŽ¨"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


