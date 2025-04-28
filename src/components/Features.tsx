import {
  FaShieldAlt,
  FaUserCheck,
  FaComments,
  FaHeadset,
  FaBell,
} from "react-icons/fa";

const features = [
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    description: "Safe and encrypted payment processing for all transactions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FaUserCheck,
    title: "Verified Caregivers",
    description: "All caregivers undergo thorough background checks.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: FaComments,
    title: "Realtime Chat",
    description: "Instant messaging for seamless communication.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all users.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FaBell,
    title: "Push Notifications",
    description: "Stay updated with real-time notifications.",
    color: "bg-secondary/10 text-secondary",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">
          Why Choose WellWish?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feature.color}`}
              >
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
