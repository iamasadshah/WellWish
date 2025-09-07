"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaUserCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserFriends,
  FaComments,
  FaStar,
} from "react-icons/fa";

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

// Stats interface
interface ProfileStats {
  totalBookings: number;
  pendingRequests: number;
  completedServices: number;
  averageRating: number;
  profileViews: number;
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalBookings: 0,
    pendingRequests: 0,
    completedServices: 0,
    averageRating: 0,
    profileViews: 0,
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData(data as ProfileData);
        calculateProfileCompletion(data as ProfileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchProfileStats = useCallback(async () => {
    try {
      // In a real app, you would fetch actual stats from your database
      // For now, we&apos;ll use mock data
      const mockStats: ProfileStats = {
        totalBookings: Math.floor(Math.random() * 20),
        pendingRequests: Math.floor(Math.random() * 5),
        completedServices: Math.floor(Math.random() * 15),
        averageRating: 4 + Math.random(),
        profileViews: 50 + Math.random() * 100,
      };
      
      setProfileStats(mockStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchProfileData();
      fetchProfileStats();
    }
  }, [user, loading, router, fetchProfileData, fetchProfileStats]);

  const calculateProfileCompletion = (profile: ProfileData) => {
    const requiredFields = ["full_name", "avatar_url", "location"];
    let totalFields = requiredFields.length;
    let completedFields = 0;

    // Count common required fields
    requiredFields.forEach(field => {
      if (profile[field as keyof ProfileData]) completedFields++;
    });

    // Add role-specific fields
    if (profile.role === "Caregiver") {
      const caregiverFields = ["care_type", "experience_years", "hourly_rate", "availability", "available_hours", "bio"];
      totalFields += caregiverFields.length;
      
      caregiverFields.forEach(field => {
        const value = profile[field as keyof ProfileData];
        if (value) {
          if (Array.isArray(value) && value.length > 0) completedFields++;
          else if (typeof value === 'object' && Object.values(value).some(v => v)) completedFields++;
          else if (value) completedFields++;
        }
      });
    } else if (profile.role === "CareSeeker") {
      const seekerFields = ["care_needs", "care_details", "schedule", "care_hours", "urgency_level", "budget_range"];
      totalFields += seekerFields.length;
      
      seekerFields.forEach(field => {
        const value = profile[field as keyof ProfileData];
        if (value) {
          if (Array.isArray(value) && value.length > 0) completedFields++;
          else if (typeof value === 'object' && Object.values(value).some(v => v)) completedFields++;
          else if (value) completedFields++;
        }
      });
    }

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  };

  const handleEditProfile = () => {
    if (!profileData) return;
    
    if (!profileData.onboarding_completed) {
      router.push(`/onboarding/${profileData.role.toLowerCase()}`);
    } else {
      router.push(`/profile/edit`);
    }
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FaExclamationCircle className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your profile information. Let&apos;s set up your profile now.</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo with Profile Completion */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800 relative">
            <div className="absolute right-8 top-8 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={completionPercentage >= 75 ? "#10B981" : completionPercentage >= 50 ? "#3B82F6" : "#F59E0B"}
                      strokeWidth="3"
                      strokeDasharray={`${completionPercentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{completionPercentage}%</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Profile Completion</h3>
                  <p className="text-sm text-gray-700">
                    {completionPercentage < 100 ? "Complete your profile" : "Profile complete!"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="relative w-32 h-32">
                  {profileData.avatar_url ? (
                    <Image
                      src={profileData.avatar_url}
                      alt="Profile"
                      fill
                      className="rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                      <FaUserCircle className="text-gray-400 text-6xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.full_name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {profileData.role}
                  </span>
                  {profileData.location && (
                    <span className="ml-4 flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      {profileData.location}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Bio / Description */}
            {(profileData.bio || profileData.care_details) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {profileData.role === "Caregiver" ? "About Me" : "Care Details"}
                </h2>
                <p className="text-gray-600">
                  {profileData.role === "Caregiver" ? profileData.bio : profileData.care_details}
                </p>
              </div>
            )}

            {/* Role-specific information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left column */}
              <div className="space-y-6">
                {profileData.role === "Caregiver" && (
                  <>
                    {/* Care Types */}
                    {profileData.care_type && profileData.care_type.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Care Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.care_type.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience & Rate */}
                    <div className="grid grid-cols-2 gap-4">
                      {profileData.experience_years !== undefined && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaUserFriends className="text-blue-500 text-xl mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Experience</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {profileData.experience_years} {profileData.experience_years === 1 ? "year" : "years"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {profileData.hourly_rate !== undefined && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaDollarSign className="text-green-500 text-xl mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Hourly Rate</p>
                              <p className="text-lg font-semibold text-gray-900">
                                ${profileData.hourly_rate}/hr
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {profileData.role === "CareSeeker" && (
                  <>
                    {/* Care Needs */}
                    {profileData.care_needs && profileData.care_needs.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Care Needs</h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.care_needs.map((need) => (
                            <span
                              key={need}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Urgency & Budget */}
                    <div className="grid grid-cols-2 gap-4">
                      {profileData.urgency_level && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaExclamationCircle className={`text-xl mr-2 ${
                              profileData.urgency_level === "High" || profileData.urgency_level === "Immediate"
                                ? "text-red-500"
                                : profileData.urgency_level === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Urgency</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {profileData.urgency_level}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {profileData.budget_range && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FaDollarSign className="text-green-500 text-xl mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Budget</p>
                              <p className="text-lg font-semibold text-gray-900">
                                ${profileData.budget_range.min} - ${profileData.budget_range.max}/hr
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Availability / Schedule */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {profileData.role === "Caregiver" ? "Availability" : "Care Schedule"}
                  </h3>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                      const isAvailable = profileData.role === "Caregiver"
                        ? profileData.availability?.[day]
                        : profileData.schedule?.[day];
                      
                      return (
                        <div
                          key={day}
                          className={`text-center py-2 rounded-lg ${
                            isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-gray-400" />
                    <span>
                      {profileData.role === "Caregiver"
                        ? `${profileData.available_hours?.start || "09:00"} - ${profileData.available_hours?.end || "17:00"}`
                        : `${profileData.care_hours?.start || "09:00"} - ${profileData.care_hours?.end || "17:00"}`}
                    </span>
                  </div>
                </div>

                {/* Certifications for Caregivers */}
                {profileData.role === "Caregiver" && profileData.certifications && profileData.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Certifications</h3>
                    <ul className="space-y-2">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bookings</p>
                      <p className="text-xl font-semibold text-gray-900">{profileStats.totalBookings}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaComments />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending</p>
                      <p className="text-xl font-semibold text-gray-900">{profileStats.pendingRequests}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <p className="text-xl font-semibold text-gray-900">{profileStats.completedServices}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <FaStar />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rating</p>
                      <p className="text-xl font-semibold text-gray-900">{profileStats.averageRating.toFixed(1)}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.role === "Caregiver" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Care Requests
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Manage Availability
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Upcoming Bookings
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Find Caregivers
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Manage Care Needs
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Upcoming Care
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
