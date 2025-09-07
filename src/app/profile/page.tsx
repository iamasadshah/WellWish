"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  FaUserCircle,
  FaEdit,
  FaCamera,
  FaSave,
  FaTimes,
  FaBriefcase,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

interface ProfileData {
  full_name: string;
  bio: string;
  work: string;
  location: string;
  phone: string;
  website: string;
  avatar_url: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    bio: "",
    work: "",
    location: "",
    phone: "",
    website: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfileData({
            full_name: data.full_name || user.user_metadata.full_name || "",
            bio: data.bio || "",
            work: data.work || "",
            location: data.location || "",
            phone: data.phone || "",
            website: data.website || "",
            avatar_url: data.avatar_url || user.user_metadata.avatar_url || "",
          });
        }
      };

      loadProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profileData,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      setIsEditing(false);
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
        setProfileData((prev) => ({ ...prev, avatar_url: data.publicUrl }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                {profileData.avatar_url ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={profileData.avatar_url}
                      alt="Profile"
                      fill
                      className="rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  </div>
                ) : (
                  <FaUserCircle className="w-32 h-32 text-white" />
                )}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-all ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  ) : (
                    <FaCamera className="w-5 h-5 text-gray-600" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      profileData.full_name
                    )}
                  </h1>
                </div>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <FaSave />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.bio || "No bio yet"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <FaBriefcase className="text-gray-400" />
                    Work
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.work}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          work: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your current position"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.work || "Not specified"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.location || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.phone || "Not specified"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <FaGlobe className="text-gray-400" />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your website URL"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.website || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
