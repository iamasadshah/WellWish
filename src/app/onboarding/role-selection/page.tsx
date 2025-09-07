"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = async () => {
    if (!user || !selectedRole) return;

    setIsSubmitting(true);
    try {
      // Update the user's profile with the selected role
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: selectedRole,
          onboarding_completed: false,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Redirect to the appropriate onboarding flow based on the selected role
      router.push(`/onboarding/${selectedRole.toLowerCase()}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to WellWish
          </h1>
          <p className="text-xl text-gray-600">
            Please select your role to continue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl ${
              selectedRole === "Caregiver"
                ? "ring-4 ring-blue-500 scale-105"
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedRole("Caregiver")}
          >
            <div className="relative h-48 w-full">
              <Image
                src="/caregiver.jpg"
                alt="Caregiver"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400?text=Caregiver";
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                I'm a Caregiver
              </h2>
              <p className="text-gray-600 mb-4">
                I want to offer my caregiving services to those in need. I have
                experience and skills to provide quality care.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Create a professional profile
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Showcase your experience & skills
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Receive care requests & bookings
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl ${
              selectedRole === "CareSeeker"
                ? "ring-4 ring-blue-500 scale-105"
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedRole("CareSeeker")}
          >
            <div className="relative h-48 w-full">
              <Image
                src="/careseeker.jpg"
                alt="Care Seeker"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x400?text=Care+Seeker";
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                I'm a Care Seeker
              </h2>
              <p className="text-gray-600 mb-4">
                I'm looking for qualified caregivers to provide care for myself
                or a loved one. I need reliable and compassionate support.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Describe your care needs
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Browse qualified caregivers
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Schedule and book care services
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            className={`px-8 py-3 rounded-full text-white font-medium text-lg shadow-lg transform transition-all duration-300 ${
              !selectedRole
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Continue as ${selectedRole || "..."}`
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
