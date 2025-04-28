import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />

      {/* Call-to-Action Footer */}
      <section className="py-20 bg-primary  text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 ">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of care seekers and caregivers today. Experience
            the difference of personalized, professional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 bg-white ring-2 ring-black text-primary rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-primary/30 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
