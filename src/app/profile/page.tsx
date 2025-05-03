"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { FaUserCircle, FaEdit, FaCamera } from "react-icons/fa";

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
      // Load profile data from Supabase
      const loadProfile = async () => {
        const { data, error } = await supabase
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

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setProfileData((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white"
                  />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-white" />
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
                >
                  <FaCamera className="w-5 h-5 text-gray-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
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
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    profileData.full_name
                  )}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
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
                      className="w-full border rounded px-3 py-2"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.bio || "No bio yet"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.work || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.location || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
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
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profileData.phone || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border rounded px-3 py-2"
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
