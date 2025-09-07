"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaSave, FaTimes } from "react-icons/fa";

// Define the profile data structure that can handle both roles
interface ProfileData {
  id: string;
  role: "Caregiver" | "CareSeeker";
  full_name: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  
  // Caregiver specific fields
  care_type?: string[];
  experience_years?: number;
  certifications?: string[];
  hourly_rate?: number;
  availability?: Record<string, boolean>;
  available_hours?: { start: string; end: string };
  
  // Care Seeker specific fields
  care_needs?: string[];
  care_details?: string;
  schedule?: Record<string, boolean>;
  care_hours?: { start: string; end: string };
  urgency_level?: string;
  budget_range?: { min: number; max: number };
  
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newCertification, setNewCertification] = useState("");
  
  // Care type/needs options
  const careOptions = [
    "Elder Care",
    "Child Care",
    "Special Needs Care",
    "Medical Care",
    "Companion Care",
    "Respite Care",
  ];

  // Urgency level options
  const urgencyOptions = ["Low", "Medium", "High", "Immediate"];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchProfileData();
    }
  }, [user, loading, router]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData(data as ProfileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        setProfileData((prev) => 
          prev ? { ...prev, avatar_url: data.publicUrl } : null
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCareTypeChange = (type: string) => {
    if (!profileData) return;
    
    if (profileData.role === "Caregiver") {
      const updatedCareType = profileData.care_type?.includes(type)
        ? profileData.care_type.filter((t) => t !== type)
        : [...(profileData.care_type || []), type];
      
      setProfileData({
        ...profileData,
        care_type: updatedCareType,
      });
    } else {
      const updatedCareNeeds = profileData.care_needs?.includes(type)
        ? profileData.care_needs.filter((t) => t !== type)
        : [...(profileData.care_needs || []), type];
      
      setProfileData({
        ...profileData,
        care_needs: updatedCareNeeds,
      });
    }
  };

  const handleAvailabilityChange = (day: string) => {
    if (!profileData) return;
    
    if (profileData.role === "Caregiver" && profileData.availability) {
      setProfileData({
        ...profileData,
        availability: {
          ...profileData.availability,
          [day]: !profileData.availability[day],
        },
      });
    } else if (profileData.role === "CareSeeker" && profileData.schedule) {
      setProfileData({
        ...profileData,
        schedule: {
          ...profileData.schedule,
          [day]: !profileData.schedule[day],
        },
      });
    }
  };

  const handleAddCertification = () => {
    if (!profileData || !newCertification.trim()) return;
    
    setProfileData({
      ...profileData,
      certifications: [...(profileData.certifications || []), newCertification.trim()],
    });
    setNewCertification("");
  };

  const handleRemoveCertification = (index: number) => {
    if (!profileData || !profileData.certifications) return;
    
    setProfileData({
      ...profileData,
      certifications: profileData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!profileData || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        ...profileData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Redirect back to the profile dashboard
      router.push("/profile/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile/dashboard");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your profile information.</p>
          <button
            onClick={() => router.push("/onboarding/role-selection")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Your Profile</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:bg-blue-400"
              >
                <FaSave className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location || ""}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                      {profileData.avatar_url ? (
                        <Image
                          src={profileData.avatar_url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-12 w-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {isUploading ? "Uploading..." : "Change Photo"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {profileData.role === "Caregiver" ? (
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio || ""}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bio: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell clients about yourself and your caregiving approach..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={profileData.experience_years || 0}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            experience_years: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate (USD)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={profileData.hourly_rate || 0}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            hourly_rate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Care Details</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Care Details
                      </label>
                      <textarea
                        value={profileData.care_details || ""}
                        onChange={(e) =>
                          setProfileData({ ...profileData, care_details: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your care needs in detail..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {urgencyOptions.map((level) => (
                          <div
                            key={level}
                            onClick={() =>
                              setProfileData({ ...profileData, urgency_level: level })
                            }
                            className={`cursor-pointer text-center py-2 rounded-lg transition-colors ${
                              profileData.urgency_level === level
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {level}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Range ($/hour)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Min</label>
                          <input
                            type="number"
                            min="0"
                            value={profileData.budget_range?.min || 0}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                budget_range: {
                                  ...(profileData.budget_range || { min: 0, max: 0 }),
                                  min: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max</label>
                          <input
                            type="number"
                            min="0"
                            value={profileData.budget_range?.max || 0}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                budget_range: {
                                  ...(profileData.budget_range || { min: 0, max: 0 }),
                                  max: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Care Types / Needs */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {profileData.role === "Caregiver" ? "Care Services" : "Care Needs"}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {careOptions.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option}
                        checked={
                          profileData.role === "Caregiver"
                            ? profileData.care_type?.includes(option) || false
                            : profileData.care_needs?.includes(option) || false
                        }
                        onChange={() => handleCareTypeChange(option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={option}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability / Schedule */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {profileData.role === "Caregiver" ? "Availability" : "Care Schedule"}
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                    const isAvailable = profileData.role === "Caregiver"
                      ? profileData.availability?.[day]
                      : profileData.schedule?.[day];
                    
                    return (
                      <div
                        key={day}
                        onClick={() => handleAvailabilityChange(day)}
                        className={`cursor-pointer text-center py-2 rounded-lg transition-colors ${
                          isAvailable
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={
                        profileData.role === "Caregiver"
                          ? profileData.available_hours?.start || "09:00"
                          : profileData.care_hours?.start || "09:00"
                      }
                      onChange={(e) => {
                        if (profileData.role === "Caregiver") {
                          setProfileData({
                            ...profileData,
                            available_hours: {
                              ...(profileData.available_hours || { start: "09:00", end: "17:00" }),
                              start: e.target.value,
                            },
                          });
                        } else {
                          setProfileData({
                            ...profileData,
                            care_hours: {
                              ...(profileData.care_hours || { start: "09:00", end: "17:00" }),
                              start: e.target.value,
                            },
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={
                        profileData.role === "Caregiver"
                          ? profileData.available_hours?.end || "17:00"
                          : profileData.care_hours?.end || "17:00"
                      }
                      onChange={(e) => {
                        if (profileData.role === "Caregiver") {
                          setProfileData({
                            ...profileData,
                            available_hours: {
                              ...(profileData.available_hours || { start: "09:00", end: "17:00" }),
                              end: e.target.value,
                            },
                          });
                        } else {
                          setProfileData({
                            ...profileData,
                            care_hours: {
                              ...(profileData.care_hours || { start: "09:00", end: "17:00" }),
                              end: e.target.value,
                            },
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Certifications (Caregiver only) */}
              {profileData.role === "Caregiver" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a certification or qualification"
                    />
                    <button
                      type="button"
                      onClick={handleAddCertification}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {profileData.certifications?.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                      >
                        <span>{cert}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
