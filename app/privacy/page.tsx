"use client";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72, #7C3AED)", padding: "32px 24px", color: "#fff", textAlign: "center" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px", display: "block", marginBottom: "12px" }}>← Back to Home</a>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 8px" }}>🔒 Privacy Policy</h1>
        <p style={{ opacity: 0.8, margin: 0, fontSize: "14px" }}>Last updated: April 15, 2026</p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>

        {/* RA 10173 Notice */}
        <div style={{ background: "#F5F3FF", borderRadius: "16px", padding: "20px", marginBottom: "32px", border: "2px solid #7C3AED" }}>
          <p style={{ fontWeight: 900, color: "#7C3AED", margin: "0 0 8px", fontSize: "16px" }}>🇵🇭 Philippine Data Privacy Act (RA 10173)</p>
          <p style={{ color: "#555", fontSize: "14px", margin: 0, lineHeight: 1.7 }}>
            Serviko is fully compliant with the <strong>Republic Act No. 10173</strong>, also known as the Data Privacy Act of 2012, and its Implementing Rules and Regulations. We are registered with the <strong>National Privacy Commission (NPC)</strong> and follow all guidelines for the lawful collection, processing, and protection of personal data.
          </p>
        </div>

        {[
          {
            title: "1. Who We Are",
            content: `Serviko (serviko.dev) is an online platform connecting customers with verified service providers (artists) for beauty, wellness, and home services across the Philippines. We act as a data controller for the personal information collected through our platform.

Contact our Data Protection Officer:
📧 privacy@serviko.dev
📞 +63 XXX XXX XXXX
📍 Quezon City, Philippines`,
          },
          {
            title: "2. What Information We Collect",
            content: `We collect the following personal data:

FOR CUSTOMERS:
• Full name, email address, phone number
• Home address and service location
• Payment information (processed securely by PayMongo — we do not store card details)
• Booking history and service preferences
• Device information and IP address

FOR ARTISTS/SERVICE PROVIDERS:
• Full name, email, phone number, address
• Government-issued ID (type and number only)
• Selfie/profile photo
• Professional certificates and licenses (optional)
• GCash number for payouts
• Service history and ratings

FOR ALL USERS:
• Usage data and app activity logs
• Location data (only when booking services)`,
          },
          {
            title: "3. Why We Collect Your Data",
            content: `Under Section 13 of RA 10173, we process your data for the following legitimate purposes:

✅ Identity verification and account creation
✅ Booking management and service fulfillment
✅ Payment processing via PayMongo
✅ Generating digital work permits for building access
✅ Sending booking confirmations and notifications
✅ Customer support and dispute resolution
✅ Fraud prevention and platform security
✅ Improving our services and user experience
✅ Compliance with legal obligations`,
          },
          {
            title: "4. How We Protect Your Data",
            content: `We implement strict security measures to protect your personal data:

🔒 SSL/TLS encryption for all data transmission
🔒 Encrypted database storage (Neon PostgreSQL)
🔒 Secure payment processing via PayMongo (PCI-DSS compliant)
🔒 Limited access — only authorized personnel can view your data
🔒 Regular security audits and vulnerability assessments
🔒 Two-factor authentication for admin access
🔒 Automatic data backup with encryption`,
          },
          {
            title: "5. How Long We Keep Your Data",
            content: `We retain your personal data only as long as necessary:

• Active account data: As long as your account is active
• Booking records: 3 years (for legal and tax purposes)
• Payment records: 5 years (as required by BIR)
• Government ID copies: Deleted after account verification (within 30 days)
• Inactive accounts: Data deleted after 2 years of inactivity
• Upon account deletion: Most data deleted within 30 days`,
          },
          {
            title: "6. Your Rights Under RA 10173",
            content: `As a data subject, you have the following rights:

📋 RIGHT TO BE INFORMED — Know what data we collect and why
👁️ RIGHT TO ACCESS — Request a copy of your personal data
✏️ RIGHT TO RECTIFICATION — Correct inaccurate data
🗑️ RIGHT TO ERASURE — Request deletion of your data
🚫 RIGHT TO OBJECT — Opt out of certain data processing
📦 RIGHT TO DATA PORTABILITY — Receive your data in readable format
⚖️ RIGHT TO FILE COMPLAINT — Lodge a complaint with the NPC

To exercise your rights, email: privacy@serviko.dev`,
          },
          {
            title: "7. Sharing Your Data",
            content: `We do NOT sell your personal data. We only share data with:

• PayMongo — for secure payment processing
• Building management/security — only your name and booking details via work permit QR code (with your consent)
• Law enforcement — only when required by law or court order
• Service providers — who help us operate the platform (under strict data processing agreements)

We will never share your data with advertisers or third-party marketing companies.`,
          },
          {
            title: "8. Cookies and Tracking",
            content: `We use minimal cookies strictly necessary for platform operation:

• Session cookies — to keep you logged in
• Security cookies — to prevent fraud and CSRF attacks
• Analytics — anonymous usage statistics only (no personal identification)

We do NOT use advertising cookies or sell your browsing data.`,
          },
          {
            title: "9. Children's Privacy",
            content: `Serviko is not intended for children under 18 years old. We do not knowingly collect personal data from minors. If you believe a minor has registered on our platform, please contact us immediately at privacy@serviko.dev and we will promptly delete the account.`,
          },
          {
            title: "10. Changes to This Policy",
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via:
• Email notification to your registered email address
• In-app notification when you next log in
• Notice on our website at serviko.dev/privacy

Continued use of Serviko after policy updates constitutes acceptance of the new terms.`,
          },
          {
            title: "11. Contact Us",
            content: `For privacy concerns, data requests, or complaints:

📧 Email: privacy@serviko.dev
📞 Phone: +63 XXX XXX XXXX
📍 Address: Quezon City, Philippines
🌐 Website: serviko.dev

For complaints not resolved by us, you may contact the:
National Privacy Commission (NPC)
📧 info@privacy.gov.ph
🌐 privacy.gov.ph`,
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: 900, color: "#E61D72", fontSize: "18px", margin: "0 0 12px", borderBottom: "2px solid #FFE4F0", paddingBottom: "8px" }}>{section.title}</h2>
            <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        ))}

        <div style={{ background: "#FFF0F6", borderRadius: "16px", padding: "20px", textAlign: "center", border: "1px solid #FFD6E7" }}>
          <p style={{ fontWeight: 700, color: "#E61D72", margin: "0 0 8px" }}>🌸 Serviko — Para sa Pilipino</p>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>We are committed to protecting your privacy and complying with Philippine law.</p>
        </div>
      </div>
    </div>
  );
}
