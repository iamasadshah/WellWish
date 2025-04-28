import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Care Seeker",
    image: "/images/testimonials/sarah.jpg",
    text: "WellWish made it so easy to find a reliable caregiver for my elderly mother. The platform is intuitive and the caregivers are professional.",
  },
  {
    name: "Michael Chen",
    role: "Caregiver",
    image: "/images/testimonials/michael.jpg",
    text: "As a caregiver, I love how WellWish connects me with families who need my help. The payment system is secure and the support team is always helpful.",
  },
  {
    name: "Emily Rodriguez",
    role: "Care Seeker",
    image: "/images/testimonials/emily.jpg",
    text: "The real-time chat feature and push notifications keep me updated about my care schedule. It's like having a personal care coordinator!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
