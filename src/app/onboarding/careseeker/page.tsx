"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Form step types
type FormStep = 
  | "basicInfo" 
  | "careNeeds" 
  | "schedule" 
  | "location";

interface FormData {
  fullName: string;
  avatar_url: string | null;
  careNeeds: string[];
  careDetails: string;
  schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  careHours: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  urgencyLevel: string;
  budgetRange: {
    min: number;
    max: number;
  };
  location: string;
  zipCode: string;
}

export default function CareSeekerOnboarding() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<FormStep>("basicInfo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    avatar_url: null,
    careNeeds: [],
    careDetails: "",
    schedule: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    careHours: {
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    },
    urgencyLevel: "not-urgent",
    budgetRange: {
      min: 15,
      max: 30,
    },
    location: "",
    zipCode: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes for care needs
  const handleCareNeedsChange = (need: string) => {
    if (formData.careNeeds.includes(need)) {
      setFormData({
        ...formData,
        careNeeds: formData.careNeeds.filter((n) => n !== need),
      });
    } else {
      setFormData({
        ...formData,
        careNeeds: [...formData.careNeeds, need],
      });
    }
  };

  // Handle checkbox changes for schedule
  const handleScheduleChange = (day: keyof typeof formData.schedule) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: !formData.schedule[day],
      },
    });
  };

  // Handle checkbox changes for care hours
  const handleHoursChange = (time: keyof typeof formData.careHours) => {
    setFormData({
      ...formData,
      careHours: {
        ...formData.careHours,
        [time]: !formData.careHours[time],
      },
    });
  };

  // Handle budget range changes
  const handleBudgetChange = (type: 'min' | 'max', value: number) => {
    setFormData({
      ...formData,
      budgetRange: {
        ...formData.budgetRange,
        [type]: value
      }
    });
  };

  // Navigate to the next step
  const nextStep = () => {
    if (currentStep === "basicInfo") setCurrentStep("careNeeds");
    else if (currentStep === "careNeeds") setCurrentStep("schedule");
    else if (currentStep === "schedule") setCurrentStep("location");
  };

  // Navigate to the previous step
  const prevStep = () => {
    if (currentStep === "location") setCurrentStep("schedule");
    else if (currentStep === "schedule") setCurrentStep("careNeeds");
    else if (currentStep === "careNeeds") setCurrentStep("basicInfo");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update the user's profile with all form data
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: "careseeker",
          full_name: formData.fullName,
          avatar_url: formData.avatar_url,
          care_needs: formData.careNeeds,
          care_details: formData.careDetails,
          schedule: formData.schedule,
          care_hours: formData.careHours,
          urgency_level: formData.urgencyLevel,
          budget_range: formData.budgetRange,
          location: formData.location,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Redirect to dashboard
      router.push("/dashboard");
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

  // Progress percentage calculation
  const getProgressPercentage = () => {
    const steps = ["basicInfo", "careNeeds", "schedule", "location"];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Care Seeker Profile Setup
          </h1>
          <p className="text-lg text-gray-600">
            Complete your profile to find the perfect caregiver
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        {/* Step indicator */}
        <div className="flex justify-between mb-8 px-2">
          <div className="text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                currentStep === "basicInfo" || ["careNeeds", "schedule", "location"].includes(currentStep)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <div className="text-xs mt-1">Basic Info</div>
          </div>
          <div className="text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                currentStep === "careNeeds" || ["schedule", "location"].includes(currentStep)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <div className="text-xs mt-1">Care Needs</div>
          </div>
          <div className="text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                currentStep === "schedule" || ["location"].includes(currentStep)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
            <div className="text-xs mt-1">Schedule</div>
          </div>
          <div className="text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                currentStep === "location"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              4
            </div>
            <div className="text-xs mt-1">Location</div>
          </div>
        </div>

        {/* Form steps */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <AnimatePresence mode="wait">
            {currentStep === "basicInfo" && (
              <motion.div
                key="basicInfo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                      {formData.avatar_url ? (
                        <Image
                          src={formData.avatar_url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "careNeeds" && (
              <motion.div
                key="careNeeds"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Care Needs
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Care Needed
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Elderly Care", "Child Care", "Special Needs", "Medical Care", "Companion Care", "Respite Care"].map(
                      (need) => (
                        <div key={need} className="flex items-center">
                          <input
                            type="checkbox"
                            id={need.replace(/\s+/g, "")}
                            checked={formData.careNeeds.includes(need)}
                            onChange={() => handleCareNeedsChange(need)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={need.replace(/\s+/g, "")}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {need}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="careDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Care Details
                  </label>
                  <textarea
                    id="careDetails"
                    name="careDetails"
                    value={formData.careDetails}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe the specific care needs, any medical conditions, and special requirements..."
                  ></textarea>
                </div>
              </motion.div>
            )}

            {currentStep === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Schedule & Urgency
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Care is Needed
                  </label>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                    {Object.keys(formData.schedule).map((day) => (
                      <div
                        key={day}
                        onClick={() => handleScheduleChange(day as keyof typeof formData.schedule)}
                        className={`cursor-pointer px-3 py-2 rounded-md text-center transition-colors duration-200 ${
                          formData.schedule[day as keyof typeof formData.schedule]
                            ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                            : "bg-gray-100 border border-gray-300 text-gray-700"
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Day Care is Needed
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.keys(formData.careHours).map((time) => (
                      <div
                        key={time}
                        onClick={() => handleHoursChange(time as keyof typeof formData.careHours)}
                        className={`cursor-pointer px-3 py-2 rounded-md text-center transition-colors duration-200 ${
                          formData.careHours[time as keyof typeof formData.careHours]
                            ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                            : "bg-gray-100 border border-gray-300 text-gray-700"
                        }`}
                      >
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="urgencyLevel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Urgency Level
                  </label>
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="not-urgent">Not Urgent (Planning ahead)</option>
                    <option value="soon">Soon (Within a few weeks)</option>
                    <option value="urgent">Urgent (Within days)</option>
                    <option value="immediate">Immediate (As soon as possible)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range ($ per hour)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label htmlFor="budgetMin" className="block text-xs text-gray-500 mb-1">
                        Minimum
                      </label>
                      <input
                        type="number"
                        id="budgetMin"
                        value={formData.budgetRange.min}
                        onChange={(e) => handleBudgetChange('min', parseInt(e.target.value))}
                        min="10"
                        max="100"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div>
                      <label htmlFor="budgetMax" className="block text-xs text-gray-500 mb-1">
                        Maximum
                      </label>
                      <input
                        type="number"
                        id="budgetMax"
                        value={formData.budgetRange.max}
                        onChange={(e) => handleBudgetChange('max', parseInt(e.target.value))}
                        min="10"
                        max="100"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "location" && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Location
                </h2>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City, State
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Boston, MA"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 02108"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === "basicInfo"}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              currentStep === "basicInfo"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-gray-50 border border-blue-600"
            }`}
          >
            Back
          </button>
          {currentStep === "location" ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Saving..." : "Complete Profile"}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
