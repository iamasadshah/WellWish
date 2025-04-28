import { FaUserPlus, FaSearch, FaHandshake } from "react-icons/fa";

const steps = [
  {
    icon: FaUserPlus,
    title: "Create Your Profile",
    description:
      "Sign up and create your profile as a care seeker or caregiver.",
  },
  {
    icon: FaSearch,
    title: "Find Your Match",
    description:
      "Browse through verified caregivers or care seekers in your area.",
  },
  {
    icon: FaHandshake,
    title: "Connect & Care",
    description:
      "Connect with your match, schedule care, and start your journey.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center text-text mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
