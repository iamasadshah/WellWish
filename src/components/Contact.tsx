"use client";
import { useState } from "react";
import Link from "next/link";

const topics = [
  "General Inquiry",
  "Become a Caregiver",
  "Find a Caregiver",
  "Technical Support",
  "Billing Question",
  "Other",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <section className=" min-h-screen py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Content */}
          <div className="lg:w-1/3">
            <h1 className="text-5xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-gray-400 text-lg mb-8">
              Want to get in touch? Contact us using the form on the side or
              click below to read FAQ section.
            </p>
            <Link
              href="#faq"
              className="inline-flex items-center text-buttons hover:text-shadoww transition-colors group"
            >
              <span className="border-b border-current">Jump to FAQ</span>
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </Link>
          </div>

          {/* Right Content - Contact Form */}
          <div className="lg:w-2/3">
            <form
              onSubmit={handleSubmit}
              className="bg-[#2C1B4B] rounded-3xl p-8 space-y-6"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-white text-lg"
                  >
                    First name<span className="text-buttons">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Name"
                    className="w-full bg-transparent border-b border-gray-600 text-white px-0 py-2 placeholder-gray-500 focus:border-buttons focus:outline-none transition-colors"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-white text-lg"
                  >
                    Last name<span className="text-buttons">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Surname"
                    className="w-full bg-transparent border-b border-gray-600 text-white px-0 py-2 placeholder-gray-500 focus:border-buttons focus:outline-none transition-colors"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white text-lg">
                  Email<span className="text-buttons">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address here"
                  className="w-full bg-transparent border-b border-gray-600 text-white px-0 py-2 placeholder-gray-500 focus:border-buttons focus:outline-none transition-colors"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-white text-lg">
                  What is your message about?
                </label>
                <div className="relative">
                  <select
                    id="topic"
                    className="w-full bg-transparent border-b border-gray-600 text-white px-0 py-2 focus:border-buttons focus:outline-none appearance-none cursor-pointer"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                  >
                    <option value="" disabled className="bg-[#2C1B4B]">
                      Please select a topic below
                    </option>
                    {topics.map((topic) => (
                      <option
                        key={topic}
                        value={topic}
                        className="bg-[#2C1B4B]"
                      >
                        {topic}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-white text-lg">
                  Your message<span className="text-buttons">*</span>
                </label>
                <textarea
                  id="message"
                  placeholder="Write your message here..."
                  rows={4}
                  className="w-full bg-transparent border-b border-gray-600 text-white px-0 py-2 placeholder-gray-500 focus:border-buttons focus:outline-none transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group inline-flex items-center bg-buttons text-white px-8 py-3 rounded-full hover:bg-shadoww transition-colors"
              >
                <span className="font-medium">Submit</span>
                <svg
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
