"use client";
import { useState, useRef } from "react";

type PhotoUploadProps = {
  label: string;
  folder: string;
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
};

export default function PhotoUpload({ label, folder, onUpload, currentUrl, accept = "image/*" }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setError("Upload failed. Try again.");
        setPreview("");
      } else {
        onUpload(data.url);
      }
    } catch {
      setError("Upload failed. Try again.");
      setPreview("");
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontWeight: 600, fontSize: "13px", display: "block", marginBottom: "8px" }}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed #FFD6E7",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          background: preview ? "#fff" : "#FFF0F6",
          position: "relative",
          overflow: "hidden",
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {preview ? (
          <div style={{ position: "relative", width: "100%" }}>
            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "12px", objectFit: "cover" }} />
            {uploading && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#fff", fontWeight: 700 }}>Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
            <p style={{ fontWeight: 600, color: "#E61D72", margin: "0 0 4px", fontSize: "14px" }}>
              {uploading ? "Uploading..." : `Upload ${label}`}
            </p>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>Tap to select photo</p>
          </div>
        )}
      </div>
      {error && <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0 0" }}>{error}</p>}
      {preview && !uploading && (
        <button
          onClick={(e) => { e.stopPropagation(); setPreview(""); onUpload(""); }}
          style={{ background: "#fee2e2", color: "#f87171", border: "none", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", marginTop: "6px" }}
        >
          Remove
        </button>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} style={{ display: "none" }} />
    </div>
  );
}
