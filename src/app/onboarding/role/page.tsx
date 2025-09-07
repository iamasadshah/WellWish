"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { FaUserNurse, FaHandHoldingHeart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function RoleSelection() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create or update the user's profile with the selected role
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: selectedRole,
          full_name: user.user_metadata.full_name || "",
          image_url: user.user_metadata.avatar_url || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Redirect to the appropriate onboarding flow
      const nextRoute = selectedRole === "caregiver" ? "/onboarding/caregiver" : "/onboarding/careseeker";
      router.push(nextRoute);
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/assets/logo.png"
            alt="WellWish Logo"
            width={80}
            height={80}
            className="h-20 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to WellWish
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Let&apos;s get started! Tell us how you&apos;d like to use WellWish
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                I am a...
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                  selectedRole === "caregiver"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedRole("caregiver")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-blue-100 p-4">
                    <FaUserNurse className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Caregiver
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      I want to offer my caregiving services to those in need
                    </p>
                  </div>
                </div>
                {selectedRole === "caregiver" && (
                  <div className="absolute top-3 right-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                  selectedRole === "careseeker"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setSelectedRole("careseeker")}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <FaHandHoldingHeart className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Care Seeker
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      I&apos;m looking for caregiving services for myself or a loved one
                    </p>
                  </div>
                </div>
                {selectedRole === "careseeker" && (
                  <div className="absolute top-3 right-3">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRoleSelection}
                disabled={!selectedRole || isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  !selectedRole
                    ? "bg-gray-300 cursor-not-allowed"
                    : selectedRole === "caregiver"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
