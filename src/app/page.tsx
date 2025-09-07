import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-[#caf0f8]">
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
