"use client";
import { useState, useRef } from "react";
import { useSignUp, useClerk } from "@clerk/nextjs";
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
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
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
    if (!form.password || form.password.length < 8) { 
      setError("Password must be at least 8 characters."); 
      return; 
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Step 1: Create Clerk account
      const clerkResult = await signUp?.create({
        emailAddress: form.email,
        password: form.password,
      });
      
      if (!clerkResult) { 
        setError("Failed to create account"); 
        setLoading(false); 
        return; 
      }
      
      const clerkId = (clerkResult as any).createdUserId || (clerkResult as any).id || "";
      if ((clerkResult as any).createdSessionId) { await setActive?.({ session: (clerkResult as any).createdSessionId }); }

      // Step 2: Upload photos
      let profilePhotoUrl = "";
      let validIdUrl = "";
      
      try { 
        if (profilePhoto?.file) { 
          profilePhotoUrl = await uploadToCloudinary(profilePhoto.file, "selfies"); 
        } 
      } catch {}
      
      try { 
        if (validId?.file) { 
          validIdUrl = await uploadToCloudinary(validId.file, "ids"); 
        } 
      } catch {}

      // Step 3: Register in database
      const res = await fetch("/api/register/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.city,
          bio: form.bio,
          experience: form.experience,
          services: selectedServices,
          gcash: form.gcash,
          clerkId: clerkId,
          profilePhoto: profilePhotoUrl,
          validId: validIdUrl,
        }),
      });
      
      const data = await res.json();
      if (data.error) { 
        setError(data.error); 
        setLoading(false); 
        return; 
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px", fontWeight: 900 }}>OK</div>
          <h1 style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px" }}>Application Submitted!</h1>
          <p style={{ color: "#888", margin: "0 0 20px" }}>We will verify your account within 24 hours.</p>
          <Link href="/artist-login" style={{ display: "inline-block", background: "#7C3AED", color: "#fff", padding: "12px 32px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F5F3FF 0%, #fff 100%)", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#7C3AED", fontWeight: 900, fontSize: "28px", textDecoration: "none" }}>Serviko</Link>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "4px" }}>Artist Registration</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ flex: 1, height: "4px", borderRadius: "2px", background: step >= s ? "#7C3AED" : "#E5E7EB" }} />
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontWeight: 900, marginBottom: "20px" }}>Personal Information</h2>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password (min 8 characters)" type="password" style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number" style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City/Address" style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.password || !form.phone} style={{ width: "100%", background: "#7C3AED", color: "#fff", padding: "16px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "16px" }}>Next</button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontWeight: 900, marginBottom: "20px" }}>Professional Details</h2>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." rows={4} style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px", resize: "vertical" }} />
              <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={{ width: "100%", padding: "14px", marginBottom: "12px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }}>
                <option value="">Select Experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
              <input value={form.gcash} onChange={e => setForm({ ...form, gcash: e.target.value })} placeholder="GCash Number" style={{ width: "100%", padding: "14px", marginBottom: "20px", border: "2px solid #E5E7EB", borderRadius: "10px", fontSize: "15px" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>Back</button>
                <button onClick={() => setStep(3)} disabled={!form.bio || !form.experience || !form.gcash} style={{ flex: 2, background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>Next</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontWeight: 900, marginBottom: "12px" }}>Select Your Services</h2>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>Choose all that apply</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {allServices.map(s => (
                  <button key={s} onClick={() => toggleService(s)} style={{ padding: "10px 16px", borderRadius: "20px", border: "2px solid", borderColor: selectedServices.includes(s) ? "#7C3AED" : "#E5E7EB", background: selectedServices.includes(s) ? "#F5F3FF" : "#fff", color: selectedServices.includes(s) ? "#7C3AED" : "#6B7280", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>{s}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>Back</button>
                <button onClick={() => setStep(4)} disabled={selectedServices.length === 0} style={{ flex: 2, background: "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>Next</button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 style={{ fontWeight: 900, marginBottom: "12px" }}>Upload Documents</h2>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>Profile photo & Valid ID required</p>
              
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Profile Photo</p>
                <input ref={profileRef} type="file" accept="image/*" onChange={e => handleFile(e, setProfilePhoto)} style={{ display: "none" }} />
                <button onClick={() => profileRef.current?.click()} style={{ width: "100%", padding: "14px", border: "2px dashed #E5E7EB", borderRadius: "12px", background: "#F9FAFB", cursor: "pointer", fontWeight: 600, color: "#6B7280" }}>
                  {profilePhoto ? "Change Photo" : "Upload Photo"}
                </button>
                {profilePhoto && <img src={profilePhoto.preview} style={{ width: "100%", marginTop: "10px", borderRadius: "12px", maxHeight: "200px", objectFit: "cover" }} alt="Preview" />}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>Valid ID</p>
                <input ref={idRef} type="file" accept="image/*" onChange={e => handleFile(e, setValidId)} style={{ display: "none" }} />
                <button onClick={() => idRef.current?.click()} style={{ width: "100%", padding: "14px", border: "2px dashed #E5E7EB", borderRadius: "12px", background: "#F9FAFB", cursor: "pointer", fontWeight: 600, color: "#6B7280" }}>
                  {validId ? "Change ID" : "Upload Valid ID"}
                </button>
                {validId && <img src={validId.preview} style={{ width: "100%", marginTop: "10px", borderRadius: "12px", maxHeight: "200px", objectFit: "cover" }} alt="Preview" />}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "16px" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#7C3AED" }} />
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#555" }}>I agree to all terms and conditions</span>
              </label>

              {error && <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, background: "#fff", color: "#7C3AED", padding: "14px", borderRadius: "12px", border: "2px solid #7C3AED", fontWeight: 700, cursor: "pointer" }}>Back</button>
                <button onClick={handleSubmit} disabled={loading || !agreed || !profilePhoto || !validId} style={{ flex: 2, background: loading || !agreed ? "#ccc" : "#7C3AED", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: loading || !agreed ? "not-allowed" : "pointer", fontSize: "15px" }}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}