"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Olivia Wilson",
    text: "Finding a reliable caregiver for my elderly father was always a challenge until I discovered this platform. It connected me with a compassionate and experienced caregiver within my local area. The entire process was smooth, and I finally have peace of mind knowing my father is in good hands!",
    image: "/assets/olivia.png",
  },
  {
    name: "Michael Chen",
    text: "The platform's user-friendly interface and thorough vetting process made it easy to find the perfect caregiver. The communication tools and scheduling features are excellent, making coordination effortless.",
    image: "/assets/michael.png",
  },
  {
    name: "Sarah Johnson",
    text: "I'm impressed by the quality of care and professionalism. The caregivers are well-trained, compassionate, and truly care about their clients. It's been a game-changer for our family.",
    image: "/assets/sarah.png",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 8000); // Auto-advance every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className=" py-24 min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Quote Icon */}
        <div className="absolute top-0 right-8 text-[#2C1B4B] opacity-50">
          <FaQuoteRight size={120} />
        </div>

        {/* Testimonial Content */}
        <div className="relative min-h-[400px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute w-full transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 translate-x-0"
                  : index < currentIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="max-w-4xl mx-auto">
                <p className="text-white text-2xl md:text-3xl leading-relaxed mb-12">
                  {testimonial.text}
                </p>

                <div className="flex items-center justify-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-white text-xl font-semibold ml-4">
                    {testimonial.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-4">
          <button
            onClick={handlePrevious}
            className="text-white/50 hover:text-white transition-colors"
            disabled={isAnimating}
          >
            <FaChevronLeft size={40} />
          </button>
          <button
            onClick={handleNext}
            className="text-white/50 hover:text-white transition-colors"
            disabled={isAnimating}
          >
            <FaChevronRight size={40} />
          </button>
        </div>
      </div>
    </section>
  );
}
