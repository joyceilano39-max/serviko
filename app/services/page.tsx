"use client";
import { useState } from "react";

const categories = [
  {
    id: "hair",
    icon: "💇",
    name: "Hair Services",
    color: "#E61D72",
    bg: "#FFF0F6",
    services: [
      {
        name: "Haircut & Styling (Women)",
        desc: "Professional cut and blow dry for women",
        variants: [
          { name: "Basic Haircut", price: 350, duration: "30 mins" },
          { name: "Haircut + Blow Dry", price: 500, duration: "45 mins" },
          { name: "Haircut + Styling", price: 650, duration: "60 mins" },
        ],
      },
      {
        name: "Haircut (Men & Boys)",
        desc: "Classic and modern cuts for men and boys",
        variants: [
          { name: "Boys Haircut (below 12)", price: 150, duration: "20 mins" },
          { name: "Men's Basic Cut", price: 200, duration: "20 mins" },
          { name: "Men's Cut + Style", price: 350, duration: "30 mins" },
          { name: "Men's Fade Cut", price: 300, duration: "30 mins" },
          { name: "Men's Undercut", price: 350, duration: "35 mins" },
          { name: "Beard Trim", price: 150, duration: "15 mins" },
          { name: "Haircut + Beard Trim", price: 400, duration: "45 mins" },
        ],
      },
      {
        name: "Hair Color",
        desc: "Professional coloring with premium brands",
        variants: [
          { name: "Loreal Red", price: 1200, duration: "2 hrs" },
          { name: "Loreal Blonde", price: 1500, duration: "2.5 hrs" },
          { name: "Loreal Brown/Black", price: 1000, duration: "1.5 hrs" },
          { name: "Wella Highlights", price: 1800, duration: "3 hrs" },
          { name: "Wella Balayage", price: 2500, duration: "3.5 hrs" },
          { name: "Schwarzkopf Full Color", price: 1300, duration: "2 hrs" },
          { name: "Roots Touch-up", price: 700, duration: "1 hr" },
        ],
      },
      {
        name: "Hair Treatment",
        desc: "Deep conditioning and repair",
        variants: [
          { name: "Keratin Treatment", price: 1500, duration: "2 hrs" },
          { name: "Rebond", price: 1800, duration: "3 hrs" },
          { name: "Relaxer", price: 1200, duration: "2 hrs" },
          { name: "Perming", price: 1500, duration: "2.5 hrs" },
          { name: "Deep Conditioning", price: 600, duration: "1 hr" },
          { name: "Hot Oil Treatment", price: 400, duration: "45 mins" },
          { name: "Protein Treatment", price: 800, duration: "1 hr" },
        ],
      },
    ],
  },
  {
    id: "nails",
    icon: "💅",
    name: "Nail Services",
    color: "#7C3AED",
    bg: "#F5F3FF",
    services: [
      {
        name: "Manicure",
        desc: "Hand and nail care",
        variants: [
          { name: "Basic Manicure", price: 200, duration: "30 mins" },
          { name: "Gel Manicure", price: 450, duration: "45 mins" },
          { name: "French Manicure", price: 350, duration: "40 mins" },
          { name: "Ombre Nails", price: 500, duration: "60 mins" },
          { name: "Nail Art (per nail)", price: 50, duration: "5 mins" },
          { name: "Acrylic Extensions", price: 800, duration: "90 mins" },
        ],
      },
      {
        name: "Pedicure",
        desc: "Foot and nail care — includes special care options",
        variants: [
          { name: "Basic Pedicure", price: 250, duration: "30 mins" },
          { name: "Gel Pedicure", price: 500, duration: "45 mins" },
          { name: "Spa Pedicure", price: 650, duration: "60 mins" },
          { name: "Foot Scrub + Pedicure", price: 750, duration: "75 mins" },
          { name: "🩺 Senior Citizen Pedicure (60+)", price: 400, duration: "60 mins", warning: "senior" },
          { name: "🩺 Diabetic-Safe Pedicure", price: 500, duration: "75 mins", warning: "diabetic" },
          { name: "🩺 Medical Pedicure (Special Needs)", price: 600, duration: "90 mins", warning: "medical" },
        ],
      },
      {
        name: "Mani + Pedi Combo",
        desc: "Full hands and feet treatment",
        variants: [
          { name: "Basic Mani + Pedi", price: 400, duration: "60 mins" },
          { name: "Gel Mani + Pedi", price: 850, duration: "90 mins" },
          { name: "Spa Mani + Pedi", price: 1100, duration: "2 hrs" },
          { name: "🩺 Senior Citizen Mani + Pedi", price: 700, duration: "2 hrs", warning: "senior" },
        ],
      },
    ],
  },
  {
    id: "massage",
    icon: "💆",
    name: "Massage & Wellness",
    color: "#22c55e",
    bg: "#F0FDF4",
    services: [
      {
        name: "Body Massage",
        desc: "Relaxation and therapeutic massage",
        variants: [
          { name: "Swedish Massage (1 hr)", price: 700, duration: "60 mins" },
          { name: "Swedish Massage (1.5 hr)", price: 900, duration: "90 mins" },
          { name: "Deep Tissue Massage", price: 900, duration: "60 mins" },
          { name: "Hot Stone Massage", price: 1000, duration: "90 mins" },
          { name: "Aromatherapy Massage", price: 850, duration: "60 mins" },
          { name: "Couples Massage (2 pax)", price: 1600, duration: "60 mins" },
          { name: "🩺 Senior Citizen Massage", price: 700, duration: "60 mins", warning: "senior" },
          { name: "🩺 Prenatal Massage", price: 900, duration: "60 mins", warning: "prenatal" },
        ],
      },
      {
        name: "Foot & Back",
        desc: "Targeted relief massage",
        variants: [
          { name: "Foot Reflexology", price: 400, duration: "45 mins" },
          { name: "Back & Shoulder", price: 500, duration: "45 mins" },
          { name: "Head & Scalp", price: 350, duration: "30 mins" },
        ],
      },
    ],
  },
  {
    id: "skin",
    icon: "🧖",
    name: "Skin Care",
    color: "#F59E0B",
    bg: "#FFFBEB",
    services: [
      {
        name: "Facial Treatment",
        desc: "Deep cleansing and skin care",
        variants: [
          { name: "Basic Facial", price: 500, duration: "45 mins" },
          { name: "Deep Cleansing Facial", price: 700, duration: "60 mins" },
          { name: "Whitening Facial", price: 900, duration: "75 mins" },
          { name: "Anti-aging Facial", price: 1000, duration: "90 mins" },
          { name: "Acne Treatment Facial", price: 850, duration: "75 mins" },
        ],
      },
      {
        name: "Waxing",
        desc: "Hair removal waxing",
        variants: [
          { name: "Underarm Wax", price: 200, duration: "15 mins" },
          { name: "Leg Wax (half)", price: 400, duration: "30 mins" },
          { name: "Leg Wax (full)", price: 700, duration: "45 mins" },
          { name: "Brazilian Wax", price: 800, duration: "45 mins" },
        ],
      },
    ],
  },
  {
    id: "lash",
    icon: "👁️",
    name: "Lash & Brow",
    color: "#3b82f6",
    bg: "#EFF6FF",
    services: [
      {
        name: "Eyelash Extensions",
        desc: "Beautiful lash enhancements",
        variants: [
          { name: "Classic Lash Set", price: 800, duration: "90 mins" },
          { name: "Volume Lash Set", price: 1200, duration: "2 hrs" },
          { name: "Mega Volume Lash", price: 1800, duration: "2.5 hrs" },
          { name: "Lash Refill (2 weeks)", price: 500, duration: "60 mins" },
        ],
      },
      {
        name: "Eyebrow Services",
        desc: "Brow shaping and enhancement",
        variants: [
          { name: "Eyebrow Threading", price: 150, duration: "15 mins" },
          { name: "Eyebrow Tinting", price: 300, duration: "20 mins" },
          { name: "Eyebrow Lamination", price: 800, duration: "60 mins" },
          { name: "Microblading", price: 3500, duration: "2 hrs" },
        ],
      },
    ],
  },
  {
    id: "makeup",
    icon: "💄",
    name: "Makeup",
    color: "#EC4899",
    bg: "#FDF2F8",
    services: [
      {
        name: "Makeup Application",
        desc: "Professional makeup for any occasion",
        variants: [
          { name: "Everyday Makeup", price: 800, duration: "45 mins" },
          { name: "Party/Event Makeup", price: 1200, duration: "60 mins" },
          { name: "Bridal Makeup", price: 3500, duration: "2 hrs" },
          { name: "Debut Makeup", price: 2500, duration: "90 mins" },
          { name: "Airbrush Makeup", price: 2500, duration: "90 mins" },
        ],
      },
    ],
  },
  {
    id: "cleaning",
    icon: "🧹",
    name: "Home Cleaning",
    color: "#06B6D4",
    bg: "#ECFEFF",
    services: [
      {
        name: "House Cleaning",
        desc: "General home cleaning services",
        variants: [
          { name: "Studio / 1BR Cleaning", price: 800, duration: "2 hrs" },
          { name: "2BR House Cleaning", price: 1200, duration: "3 hrs" },
          { name: "3BR House Cleaning", price: 1600, duration: "4 hrs" },
          { name: "4BR+ House Cleaning", price: 2000, duration: "5 hrs" },
          { name: "Deep Cleaning (Studio)", price: 1500, duration: "3 hrs" },
          { name: "Deep Cleaning (House)", price: 2500, duration: "5 hrs" },
          { name: "Post-renovation Cleaning", price: 3000, duration: "6 hrs" },
          { name: "Move-in / Move-out Cleaning", price: 2500, duration: "5 hrs" },
        ],
      },
      {
        name: "Specific Area Cleaning",
        desc: "Targeted cleaning for specific areas",
        variants: [
          { name: "Kitchen Deep Clean", price: 800, duration: "2 hrs" },
          { name: "Bathroom Deep Clean", price: 600, duration: "1.5 hrs" },
          { name: "Living Room Clean", price: 500, duration: "1 hr" },
          { name: "Bedroom Clean", price: 400, duration: "1 hr" },
          { name: "Window Cleaning (per room)", price: 150, duration: "30 mins" },
          { name: "Carpet Cleaning", price: 500, duration: "1 hr" },
        ],
      },
      {
        name: "Laundry Services",
        desc: "Washing and ironing",
        variants: [
          { name: "Wash + Dry (per load)", price: 150, duration: "1 hr" },
          { name: "Wash + Dry + Fold", price: 200, duration: "1.5 hrs" },
          { name: "Ironing (per load)", price: 150, duration: "1 hr" },
          { name: "Full Laundry Service", price: 350, duration: "2 hrs" },
        ],
      },
    ],
  },
  {
    id: "gardening",
    icon: "🌿",
    name: "Gardening",
    color: "#16A34A",
    bg: "#F0FDF4",
    services: [
      {
        name: "Garden Maintenance",
        desc: "Regular garden upkeep",
        variants: [
          { name: "Grass Cutting (small yard)", price: 500, duration: "1 hr" },
          { name: "Grass Cutting (medium yard)", price: 800, duration: "2 hrs" },
          { name: "Grass Cutting (large yard)", price: 1200, duration: "3 hrs" },
          { name: "Plant Trimming", price: 400, duration: "1 hr" },
          { name: "Hedge Trimming", price: 600, duration: "1.5 hrs" },
          { name: "Weeding", price: 500, duration: "1 hr" },
          { name: "Full Garden Maintenance", price: 1500, duration: "4 hrs" },
        ],
      },
      {
        name: "Garden Setup",
        desc: "New garden installation",
        variants: [
          { name: "Plant Potting (5 pots)", price: 500, duration: "1 hr" },
          { name: "Garden Bed Setup", price: 1200, duration: "3 hrs" },
          { name: "Soil Preparation", price: 800, duration: "2 hrs" },
          { name: "Fertilizing", price: 400, duration: "1 hr" },
        ],
      },
    ],
  },
  {
    id: "painting",
    icon: "🎨",
    name: "Painting",
    color: "#D97706",
    bg: "#FFFBEB",
    services: [
      {
        name: "Interior Painting",
        desc: "Indoor wall painting",
        variants: [
          { name: "1 Room Painting", price: 1500, duration: "1 day" },
          { name: "2 Rooms Painting", price: 2500, duration: "1.5 days" },
          { name: "3 Rooms Painting", price: 3500, duration: "2 days" },
          { name: "Full House Interior", price: 6000, duration: "3-4 days" },
          { name: "Ceiling Painting (per room)", price: 800, duration: "3 hrs" },
          { name: "Accent Wall Painting", price: 1200, duration: "4 hrs" },
        ],
      },
      {
        name: "Exterior Painting",
        desc: "Outdoor wall painting",
        variants: [
          { name: "Gate / Fence Painting", price: 800, duration: "4 hrs" },
          { name: "Exterior Wall (small)", price: 2000, duration: "1 day" },
          { name: "Exterior Wall (medium)", price: 3500, duration: "2 days" },
          { name: "Full House Exterior", price: 8000, duration: "4-5 days" },
        ],
      },
      {
        name: "Furniture Painting",
        desc: "Furniture refinishing",
        variants: [
          { name: "Chair Painting", price: 300, duration: "2 hrs" },
          { name: "Table Painting", price: 500, duration: "3 hrs" },
          { name: "Cabinet Painting", price: 800, duration: "4 hrs" },
          { name: "Bed Frame Painting", price: 700, duration: "3 hrs" },
        ],
      },
    ],
  },
  {
    id: "repair",
    icon: "🔧",
    name: "Home Repair",
    color: "#64748B",
    bg: "#F8FAFC",
    services: [
      {
        name: "Plumbing",
        desc: "Pipe and water repair",
        variants: [
          { name: "Faucet Repair/Replace", price: 400, duration: "1 hr" },
          { name: "Toilet Repair", price: 500, duration: "1 hr" },
          { name: "Pipe Leak Fix", price: 600, duration: "1.5 hrs" },
          { name: "Drain Unclogging", price: 400, duration: "1 hr" },
        ],
      },
      {
        name: "Electrical",
        desc: "Basic electrical work",
        variants: [
          { name: "Outlet Installation", price: 400, duration: "1 hr" },
          { name: "Light Fixture Install", price: 350, duration: "45 mins" },
          { name: "Fan Installation", price: 500, duration: "1 hr" },
          { name: "Circuit Breaker Check", price: 600, duration: "1 hr" },
        ],
      },
      {
        name: "Carpentry",
        desc: "Wood and furniture repair",
        variants: [
          { name: "Door Repair", price: 500, duration: "1.5 hrs" },
          { name: "Cabinet Repair", price: 600, duration: "2 hrs" },
          { name: "Shelf Installation", price: 400, duration: "1 hr" },
          { name: "Furniture Assembly", price: 500, duration: "1.5 hrs" },
        ],
      },
    ],
  },
];

const warningMessages: Record<string, { title: string; message: string; color: string; bg: string }> = {
  diabetic: {
    title: "⚠️ Diabetic Foot Care Notice",
    message: "This service is performed by a trained nail technician with special care for diabetic patients. We use sterilized tools, avoid cutting cuticles deeply, and monitor for any skin issues. Please inform your artist of your condition before the service. Consult your doctor if you have open wounds or active infections.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  senior: {
    title: "👴 Senior Citizen Special Care",
    message: "This service is specially designed for senior citizens (60+). Our artists are trained to handle fragile skin and nails with extra gentleness. We use softer tools and techniques. Please inform us of any medical conditions, blood thinners, or medications you are taking.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  medical: {
    title: "🩺 Medical Pedicure Notice",
    message: "This service is for customers with special health conditions (diabetes, arthritis, poor circulation, etc.). Performed with medical-grade sterilized tools. Please bring a doctor's note if available. We strongly recommend consulting your physician before booking if you have severe conditions.",
    color: "#E61D72",
    bg: "#FFF0F6",
  },
  prenatal: {
    title: "🤰 Prenatal Massage Safety Notice",
    message: "This massage is safe for pregnant women after the 1st trimester (12+ weeks). Our artists are trained in prenatal massage techniques. We avoid pressure points that may cause complications. Please consult your OB-GYN before booking. Not recommended for high-risk pregnancies.",
    color: "#22c55e",
    bg: "#F0FDF4",
  },
};

type CartItem = { category: string; service: string; variant: string; price: number; duration: string };

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("hair");
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [warningModal, setWarningModal] = useState<{ key: string; variant: string; categoryName: string; serviceName: string; price: number; duration: string } | null>(null);

  const currentCategory = categories.find(c => c.id === activeCategory)!;

  const addToCart = (categoryName: string, serviceName: string, variant: { name: string; price: number; duration: string; warning?: string }) => {
    if (variant.warning) {
      setWarningModal({ key: variant.warning, variant: variant.name, categoryName, serviceName, price: variant.price, duration: variant.duration });
      return;
    }
    const exists = cart.find(c => c.variant === variant.name);
    if (exists) return;
    setCart(prev => [...prev, { category: categoryName, service: serviceName, variant: variant.name, price: variant.price, duration: variant.duration }]);
  };

  const confirmAddToCart = () => {
    if (!warningModal) return;
    setCart(prev => [...prev, { category: warningModal.categoryName, service: warningModal.serviceName, variant: warningModal.variant, price: warningModal.price, duration: warningModal.duration }]);
    setWarningModal(null);
  };

  const removeFromCart = (variantName: string) => {
    setCart(cart.filter(c => c.variant !== variantName));
  };

  const total = cart.reduce((sum, c) => sum + c.price, 0);

  const filteredServices = search
    ? categories.flatMap(cat => cat.services.flatMap(svc => (svc.variants as any[]).filter((v: any) => v.name.toLowerCase().includes(search.toLowerCase())).map((v: any) => ({ ...v, categoryName: cat.name, serviceName: svc.name, color: cat.color, bg: cat.bg }))))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "Arial, sans-serif" }}>
      {/* Warning Modal */}
      {warningModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", maxWidth: "480px", width: "100%" }}>
            <div style={{ background: warningMessages[warningModal.key].bg, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 900, color: warningMessages[warningModal.key].color, margin: "0 0 12px", fontSize: "16px" }}>{warningMessages[warningModal.key].title}</h3>
              <p style={{ color: "#555", fontSize: "13px", margin: 0, lineHeight: 1.7 }}>{warningMessages[warningModal.key].message}</p>
            </div>
            <p style={{ fontWeight: 700, margin: "0 0 20px", fontSize: "14px" }}>Do you still want to book <strong>{warningModal.variant}</strong>?</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setWarningModal(null)}
                style={{ flex: 1, background: "#f0f0f0", color: "#555", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={confirmAddToCart}
                style={{ flex: 2, background: warningMessages[warningModal.key].color, color: "#fff", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
                I Understand, Book Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #E61D72 0%, #7C3AED 100%)", padding: "24px 24px 40px", color: "#fff" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "13px" }}>← Home</a>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "8px 0 4px" }}>All Services</h1>
        <p style={{ opacity: 0.8, margin: "0 0 16px", fontSize: "14px" }}>Beauty, wellness, cleaning, gardening & more!</p>
        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.2)", borderRadius: "25px", padding: "10px 16px", gap: "8px" }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search e.g. Loreal Red, Rebond, Deep Clean, Diabetic..."
            style={{ border: "none", background: "transparent", flex: 1, fontSize: "14px", color: "#fff", outline: "none" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}>✕</button>}
        </div>
      </div>

      {/* Search Results */}
      {search && (
        <div style={{ maxWidth: "900px", margin: "-20px auto 0", padding: "0 24px 100px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <p style={{ fontWeight: 700, margin: "0 0 12px" }}>{filteredServices.length} result(s) for "{search}"</p>
            {filteredServices.length === 0 ? (
              <p style={{ color: "#888", fontSize: "14px" }}>No services found. Try different keywords.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredServices.map((v: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: v.bg, borderRadius: "12px" }}>
                    <div>
                      <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{v.name}</p>
                      <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{v.categoryName} • {v.serviceName} • ⏱ {v.duration}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontWeight: 900, color: v.color, fontSize: "16px" }}>₱{v.price}</span>
                      <button onClick={() => addToCart(v.categoryName, v.serviceName, v)}
                        style={{ background: cart.find(c => c.variant === v.name) ? "#f0f0f0" : v.color, color: cart.find(c => c.variant === v.name) ? "#888" : "#fff", border: "none", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                        {cart.find(c => c.variant === v.name) ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!search && (
        <div style={{ maxWidth: "900px", margin: "-20px auto 0", padding: "0 16px 120px" }}>
          {/* Category Pills */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setExpandedService(null); }}
                style={{ padding: "10px 16px", borderRadius: "25px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "12px", whiteSpace: "nowrap", flexShrink: 0,
                  background: activeCategory === cat.id ? cat.color : "#fff",
                  color: activeCategory === cat.id ? "#fff" : "#555",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {currentCategory.services.map(service => (
              <div key={service.name} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div onClick={() => setExpandedService(expandedService === service.name ? null : service.name)}
                  style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "16px" }}>{service.name}</p>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{service.desc} • {service.variants.length} options</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: currentCategory.color, fontWeight: 700, fontSize: "14px" }}>from ₱{Math.min(...service.variants.map((v: any) => v.price))}</span>
                    <span style={{ color: "#888", fontSize: "18px" }}>{expandedService === service.name ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expandedService === service.name && (
                  <div style={{ borderTop: `2px solid ${currentCategory.bg}`, padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(service.variants as any[]).map((variant: any) => {
                      const inCart = cart.find(c => c.variant === variant.name);
                      return (
                        <div key={variant.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: inCart ? currentCategory.bg : variant.warning ? "#FFFBEB" : "#f8f8f8", borderRadius: "12px", border: inCart ? `1px solid ${currentCategory.color}` : variant.warning ? "1px solid #FDE68A" : "1px solid transparent" }}>
                          <div>
                            <p style={{ fontWeight: 600, margin: "0 0 2px", fontSize: "14px" }}>{variant.name}</p>
                            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>⏱ {variant.duration}{variant.warning ? " • ⚠️ Special care required" : ""}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontWeight: 900, color: currentCategory.color, fontSize: "16px" }}>₱{variant.price}</span>
                            <button onClick={() => inCart ? removeFromCart(variant.name) : addToCart(currentCategory.name, service.name, variant)}
                              style={{ background: inCart ? "#f0f0f0" : currentCategory.color, color: inCart ? "#888" : "#fff", border: "none", padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                              {inCart ? "✓ Remove" : "+ Add"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Bottom Bar */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "16px 24px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", zIndex: 50 }}>
          {showCart && (
            <div style={{ marginBottom: "16px", maxHeight: "180px", overflowY: "auto", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
              {cart.map(item => (
                <div key={item.variant} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: "13px" }}>
                  <span style={{ color: "#555" }}>{item.variant}</span>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#E61D72" }}>₱{item.price}</span>
                    <button onClick={() => removeFromCart(item.variant)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "16px" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={() => setShowCart(!showCart)} style={{ cursor: "pointer" }}>
              <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: "14px" }}>{cart.length} service(s) selected {showCart ? "▼" : "▲"}</p>
              <p style={{ color: "#E61D72", fontWeight: 900, fontSize: "20px", margin: 0 }}>Total: ₱{total.toLocaleString()}</p>
            </div>
            <a href="/booking" style={{ background: "#E61D72", color: "#fff", padding: "14px 28px", borderRadius: "25px", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}>
              Book Now →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
