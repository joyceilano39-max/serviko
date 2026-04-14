"use client";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "32px 24px", color: "#fff", textAlign: "center" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", display: "block", marginBottom: "12px" }}>← Back to Home</a>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 8px" }}>📋 Terms & Conditions</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "14px" }}>Last updated: April 15, 2026</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ background: "#FFF0F6", borderRadius: "16px", padding: "20px", marginBottom: "32px", border: "2px solid #E61D72" }}>
          <p style={{ fontWeight: 900, color: "#E61D72", margin: "0 0 8px" }}>⚠️ Important Notice</p>
          <p style={{ color: "#555", fontSize: "14px", margin: 0, lineHeight: 1.7 }}>
            By using Serviko, you agree to these Terms & Conditions. Please read carefully. These terms are governed by the laws of the <strong>Republic of the Philippines</strong>, including the Consumer Act (RA 7394), E-Commerce Act (RA 8792), and relevant DOLE regulations.
          </p>
        </div>

        {[
          {
            title: "1. About Serviko",
            content: `Serviko is an online marketplace platform that connects customers with independent service providers (Artists) for beauty, wellness, and home services. Serviko acts as an intermediary and is NOT an employer of the Artists listed on the platform.

Serviko operates under Philippine law and is committed to fair and transparent business practices.`,
          },
          {
            title: "2. User Accounts",
            content: `CUSTOMER ACCOUNTS:
• Must be 18 years old or above
• Must provide accurate personal information
• Responsible for all bookings made under your account
• Must not share account credentials with others

ARTIST ACCOUNTS:
• Must be 18 years old or above
• Must submit valid government ID for verification
• Must complete background check consent
• Must maintain professional conduct at all times
• Account may be suspended for violations`,
          },
          {
            title: "3. Booking & Services",
            content: `• Customers book services through the Serviko platform
• Artists confirm or decline bookings within 2 hours
• Customers must be present or have a representative at the service address
• Services must be conducted in a safe and appropriate environment
• Serviko is not responsible for any property damage during service
• Customers must inform Artists of any health conditions relevant to the service (e.g. diabetes for pedicure, pregnancy for massage)`,
          },
          {
            title: "4. Pricing & Payments",
            content: `• All prices are in Philippine Peso (₱)
• Prices are set by Serviko and displayed clearly before booking
• Payment is processed securely via PayMongo
• Accepted payment methods: GCash, Maya, Credit/Debit Card, QR Ph, Cash on Arrival
• Serviko charges a 10% platform fee per completed booking
• Artists receive 90% of the booking fee within 24 hours via GCash

TRANSPORT FEES:
• 0-3 km: ₱50
• 3-7 km: ₱100
• 7-15 km: ₱150
• 15+ km: ₱200`,
          },
          {
            title: "5. Cancellations & Refunds",
            content: `CUSTOMER CANCELLATIONS:
• Free cancellation up to 2 hours before scheduled service
• 50% charge if cancelled within 2 hours of service
• No refund for no-shows

ARTIST CANCELLATIONS:
• Artists must cancel at least 2 hours before service
• Repeated cancellations may result in account suspension

REFUNDS:
• Full refund if Artist cancels or fails to arrive
• Refunds processed within 3-5 business days
• Dispute resolution available through support@serviko.dev`,
          },
          {
            title: "6. Artist Responsibilities",
            content: `Artists agree to:
✅ Arrive on time for all confirmed bookings
✅ Bring all necessary tools and equipment
✅ Maintain personal hygiene and professional appearance
✅ Treat customers with respect and courtesy
✅ Not solicit customers for services outside Serviko
✅ Report any incidents or accidents immediately
✅ Carry valid ID matching their Serviko profile at all times
✅ Present digital work permit when entering condos/buildings
✅ Not share login credentials or account access

Artists are independent contractors, NOT employees of Serviko.`,
          },
          {
            title: "7. Customer Responsibilities",
            content: `Customers agree to:
✅ Provide accurate service address and contact information
✅ Be present or have a representative during service
✅ Treat Artists with respect and dignity
✅ Not request services outside the platform
✅ Disclose relevant health conditions to Artists
✅ Pay agreed fees promptly
✅ Not harass, threaten, or harm Artists in any way

Customers found violating these terms will be permanently banned.`,
          },
          {
            title: "8. Safety & Health",
            content: `SPECIAL HEALTH CONDITIONS:
Customers with the following conditions must inform their Artist before service:
• Diabetes (especially for pedicure/foot services)
• Pregnancy (for massage services)
• Skin allergies or conditions
• Blood thinners or medical treatments
• Heart conditions or hypertension

Serviko is not liable for adverse reactions due to undisclosed health conditions.

SENIOR CITIZENS:
Senior citizens (60+) booking specialized services will receive extra care. Artists are trained to handle elderly clients with appropriate gentleness.`,
          },
          {
            title: "9. Work Permits for Building Access",
            content: `Serviko generates digital work permits with QR codes for Artists accessing condominiums, offices, and gated communities. These permits:

• Are valid only for the specific booking date, time, and address
• Contain the Artist's name, photo, ID number, and booking details
• Can be verified by building security via QR scan
• Auto-expire after service completion
• Must not be altered or falsified (subject to criminal liability)

Building management may refuse entry at their discretion.`,
          },
          {
            title: "10. Prohibited Activities",
            content: `The following are strictly prohibited on Serviko:

🚫 Providing false information during registration
🚫 Bypassing the platform to arrange off-platform payments
🚫 Harassment, discrimination, or abuse of any user
🚫 Posting fake reviews or ratings
🚫 Using another person's account
🚫 Providing services while under the influence of alcohol/drugs
🚫 Any illegal activities during service delivery
🚫 Recording customers without consent

Violations will result in immediate account suspension and may be reported to authorities.`,
          },
          {
            title: "11. Limitation of Liability",
            content: `Serviko is a platform connecting customers and independent Artists. We are not liable for:

• Quality of services provided by Artists
• Property damage during service delivery
• Personal injury during service (Artists carry their own liability)
• Delays due to traffic or unforeseen circumstances
• Disputes between customers and Artists

However, Serviko will mediate disputes and may compensate in cases of gross negligence by verified Artists.`,
          },
          {
            title: "12. Governing Law",
            content: `These Terms are governed by the laws of the Republic of the Philippines. Any disputes shall be resolved through:

1. Serviko's internal dispute resolution process
2. Philippine mediation/arbitration if unresolved
3. Philippine courts with jurisdiction in Quezon City, Metro Manila

Applicable laws include:
• Consumer Act of the Philippines (RA 7394)
• E-Commerce Act (RA 8792)
• Data Privacy Act (RA 10173)
• Civil Code of the Philippines
• DOLE Department Order No. 174 (Contracting/Subcontracting)`,
          },
          {
            title: "13. Contact Us",
            content: `For questions about these Terms:

📧 Email: legal@serviko.dev
📞 Phone: +63 XXX XXX XXXX
🌐 Website: serviko.dev
📍 Quezon City, Philippines`,
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px", margin: "0 0 12px", borderBottom: "2px solid #FFE4F0", paddingBottom: "8px" }}>{section.title}</h2>
            <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
