import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
            Connecting Hearts,{" "}
            <span className="text-primary">Delivering Care.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Find trusted caregivers or become one. We make caregiving simple,
            safe, and meaningful for everyone involved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-caregiver"
              className="px-8 py-3 bg-black text-white ring-black ring-2 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Find Caregiver
            </Link>
            <Link
              href="/become-caregiver"
              className="px-8 py-3 bg-secondary text-text ring-black ring-2 rounded-full font-semibold hover:bg-secondary/90 transition-colors"
            >
              Become a Caregiver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
