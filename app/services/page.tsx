const services = [
  {
    id: 1,
    name: "Haircut & Styling",
    category: "Salon",
    price: 500,
    duration: "1 hour",
    description: "Professional haircut and styling by our expert stylists.",
    emoji: "✂️",
  },
  {
    id: 2,
    name: "Full Body Massage",
    category: "Massage",
    price: 800,
    duration: "1.5 hours",
    description: "Relaxing full body massage to relieve stress and tension.",
    emoji: "💆",
  },
  {
    id: 3,
    name: "Facial Treatment",
    category: "Skin Care",
    price: 650,
    duration: "1 hour",
    description: "Deep cleansing facial for glowing and healthy skin.",
    emoji: "🧖",
  },
  {
    id: 4,
    name: "Manicure & Pedicure",
    category: "Nail Care",
    price: 450,
    duration: "1 hour",
    description: "Complete nail care and polish for hands and feet.",
    emoji: "💅",
  },
  {
    id: 5,
    name: "Hair Coloring",
    category: "Salon",
    price: 1200,
    duration: "2 hours",
    description: "Professional hair coloring with premium products.",
    emoji: "🎨",
  },
  {
    id: 6,
    name: "Hot Stone Massage",
    category: "Massage",
    price: 1000,
    duration: "1.5 hours",
    description: "Therapeutic hot stone massage for deep muscle relaxation.",
    emoji: "🪨",
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-pink-500 mb-2">Our Services</h1>
      <p className="text-gray-400 mb-8">Book your favorite beauty & wellness service</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition"
          >
            <div className="text-4xl">{service.emoji}</div>
            <div>
              <span className="text-xs bg-pink-100 text-pink-500 px-2 py-1 rounded-full">
                {service.category}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{service.name}</h2>
            <p className="text-gray-400 text-sm">{service.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>⏱ {service.duration}</span>
              <span className="font-bold text-pink-500">₱{service.price}</span>
            </div>
            <button className="mt-2 bg-pink-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-pink-600 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}