import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />

      {/* Call-to-Action Footer */}
      <section className="py-20 bg-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-lightest">
            Join our community of care seekers and caregivers today. Experience
            the difference of personalized, professional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 bg-white text-primary-dark rounded-full font-semibold hover:bg-primary-lightest transition-colors"
            >
              Sign Up Now
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-light hover:text-primary-dark transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
