import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-background pt-[70px]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
              Connecting Hearts,{" "}
              <span className="text-primary">Delivering Care.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Find trusted caregivers or become one. We make caregiving simple,
              safe, and meaningful for everyone involved. Join our community
              today and experience the difference of personalized, professional
              care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/find-caregiver"
                className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Find Caregiver
              </Link>
              <Link
                href="/become-caregiver"
                className="px-8 py-3 bg-secondary text-text rounded-full font-semibold hover:bg-secondary/90 transition-colors"
              >
                Become a Caregiver
              </Link>
            </div>
          </div>

          {/* Right Content - Circular Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full shadow-xl overflow-hidden">
                <Image
                  src="/assets/hero-image.jpg"
                  alt="Caregiving"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
