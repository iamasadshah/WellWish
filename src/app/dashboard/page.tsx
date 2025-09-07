"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileData {
  id: string;
  role: string;
  full_name: string;
  avatar_url: string | null;
  bio?: string;
  location?: string;
  care_type?: string[];
  experience_years?: number;
  hourly_rate?: number;
  care_needs?: string[];
  urgency_level?: string;
  budget_range?: { min: number; max: number };
  onboarding_completed: boolean;
}

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  totalMessages: number;
  profileViews: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    totalMessages: 0,
    profileViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);

        // Fetch mock stats (in a real app, these would come from your database)
        // This is just for demonstration purposes
        setStats({
          totalBookings: Math.floor(Math.random() * 10),
          upcomingBookings: Math.floor(Math.random() * 5),
          totalMessages: Math.floor(Math.random() * 15),
          profileViews: Math.floor(Math.random() * 50) + 10,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find your profile information.
          </p>
          <button
            onClick={() => router.push("/onboarding/role-selection")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;

    const fields = [
      "full_name",
      "avatar_url",
      "bio",
      "location",
      profile.role === "caregiver" ? "care_type" : "care_needs",
      profile.role === "caregiver" ? "experience_years" : "urgency_level",
      profile.role === "caregiver" ? "hourly_rate" : "budget_range",
    ];

    const completedFields = fields.filter(
      (field) => profile[field as keyof ProfileData]
    );

    return Math.round((completedFields.length / fields.length) * 100);
  };

  // Get role-specific quick actions
  const getQuickActions = () => {
    if (profile.role === "caregiver") {
      return [
        {
          title: "Update Availability",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          action: () => router.push("/profile/availability"),
        },
        {
          title: "View Requests",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
          action: () => router.push("/requests"),
        },
        {
          title: "Edit Profile",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
          action: () => router.push("/profile"),
        },
      ];
    } else {
      return [
        {
          title: "Find Caregivers",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ),
          action: () => router.push("/find-caregiver"),
        },
        {
          title: "Manage Bookings",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          action: () => router.push("/bookings"),
        },
        {
          title: "Edit Profile",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
          action: () => router.push("/profile"),
        },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center">
                  <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
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
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-white">
                      {profile.full_name}
                    </h2>
                    <p className="text-blue-100">
                      {profile.role === "caregiver" ? "Caregiver" : "Care Seeker"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Profile Completion
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProfileCompletion()}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {calculateProfileCompletion()}% Complete
                  </p>
                </div>

                {profile.role === "caregiver" && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Hourly Rate
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        ${profile.hourly_rate}/hr
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Experience
                      </h3>
                      <p className="text-gray-900">
                        {profile.experience_years === 0
                          ? "Less than 1 year"
                          : profile.experience_years === 1
                          ? "1 year"
                          : `${profile.experience_years} years`}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Care Types
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.care_type?.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {profile.role === "careseeker" && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Budget Range
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        ${profile.budget_range?.min} - ${profile.budget_range?.max}/hr
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Urgency
                      </h3>
                      <p className="text-gray-900">
                        {profile.urgency_level === "not-urgent"
                          ? "Not Urgent"
                          : profile.urgency_level === "soon"
                          ? "Soon"
                          : profile.urgency_level === "urgent"
                          ? "Urgent"
                          : "Immediate"}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Care Needs
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.care_needs?.map((need) => (
                          <span
                            key={need}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </h3>
                  <p className="text-gray-900">{profile.location || "Not specified"}</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Full Profile
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="text-blue-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="text-green-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="text-purple-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="text-yellow-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center justify-center sm:justify-start space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-blue-600">{action.icon}</span>
                    <span className="font-medium text-gray-700">{action.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {profile.role === "caregiver" ? (
                  <>
                    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800">
                          You have a new care request from <span className="font-medium">John D.</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800">
                          Your profile was viewed by <span className="font-medium">5 new care seekers</span> this week.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
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
                      <div>
                        <p className="text-gray-800">
                          <span className="font-medium">3 new caregivers</span> match your care needs in your area.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800">
                          You have an unread message from <span className="font-medium">Sarah T.</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </>
                )}
                <div className="text-center mt-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
