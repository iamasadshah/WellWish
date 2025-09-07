"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaCamera, 
  FaFileAlt, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";

// Define care types
const careTypes = [
  { id: "elderly", label: "Elderly Care" },
  { id: "child", label: "Child Care" },
  { id: "special_needs", label: "Special Needs Care" },
  { id: "medical", label: "Medical Care" },
  { id: "companion", label: "Companionship" },
  { id: "other", label: "Other" }
];

// Define experience levels
const experienceLevels = [
  { id: "0-1", label: "Less than 1 year" },
  { id: "1-3", label: "1-3 years" },
  { id: "3-5", label: "3-5 years" },
  { id: "5-10", label: "5-10 years" },
  { id: "10+", label: "10+ years" }
];

// Define days of the week
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function CaregiverOnboarding() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    image_url: "",
    bio: "",
    care_type: [] as string[],
    experience: "",
    rate: "",
    availability: {} as Record<string, boolean>,
    timing: "",
    location: ""
  });
  
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }
    
    // Initialize availability with all days set to false
    if (Object.keys(formData.availability).length === 0) {
      const initialAvailability = daysOfWeek.reduce((acc, day) => {
        acc[day] = false;
        return acc;
      }, {} as Record<string, boolean>);
      
      setFormData(prev => ({
        ...prev,
        availability: initialAvailability
      }));
    }
    
    // Fetch existing profile data if available
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setFormData({
          full_name: data.full_name || user.user_metadata.full_name || "",
          image_url: data.image_url || user.user_metadata.avatar_url || "",
          bio: data.bio || "",
          care_type: data.care_type ? JSON.parse(data.care_type) : [],
          experience: data.experience || "",
          rate: data.rate ? data.rate.toString() : "",
          availability: data.availability || formData.availability,
          timing: data.timing || "",
          location: data.location || ""
        });
        
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    };
    
    fetchProfile();
  }, [user, loading, router, formData.availability]);
  
  // Update progress bar based on current step
  useEffect(() => {
    const totalSteps = 5;
    setProgress((step / totalSteps) * 100);
  }, [step]);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profile_images")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from("profile_images")
        .getPublicUrl(filePath);
      
      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCareTypeToggle = (typeId: string) => {
    setFormData(prev => {
      const updatedCareTypes = prev.care_type.includes(typeId)
        ? prev.care_type.filter(id => id !== typeId)
        : [...prev.care_type, typeId];
      
      return {
        ...prev,
        care_type: updatedCareTypes
      };
    });
  };
  
  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Save all profile data to Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: "caregiver",
          full_name: formData.full_name,
          image_url: formData.image_url,
          bio: formData.bio,
          care_type: JSON.stringify(formData.care_type),
          experience: formData.experience,
          rate: parseFloat(formData.rate) || 0,
          availability: formData.availability,
          timing: formData.timing,
          location: formData.location,
          profile_completed: true,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Redirect to dashboard
      router.push("/profile/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Complete Your Caregiver Profile
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Tell us about yourself and the care services you provide
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Step indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div 
              key={stepNumber}
              className={`flex flex-col items-center ${stepNumber <= step ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  stepNumber < step 
                    ? 'bg-blue-600 text-white' 
                    : stepNumber === step 
                      ? 'bg-white border-2 border-blue-600 text-blue-600' 
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {stepNumber < step ? (
                  <FaCheck className="w-5 h-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span className="text-xs font-medium">
                {stepNumber === 1 && "Basic Info"}
                {stepNumber === 2 && "About You"}
                {stepNumber === 3 && "Experience"}
                {stepNumber === 4 && "Availability"}
                {stepNumber === 5 && "Location"}
              </span>
            </div>
          ))}
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Basic Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Profile Photo
                        </label>
                        <div className="mt-1 flex items-center space-x-5">
                          <div className="flex-shrink-0">
                            {imagePreview ? (
                              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                <Image 
                                  src={imagePreview} 
                                  alt="Profile preview" 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <FaUser className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="profile_image"
                              className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center"
                            >
                              <FaCamera className="mr-2" />
                              {isUploading ? "Uploading..." : "Upload photo"}
                              <input
                                id="profile_image"
                                name="profile_image"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                            <p className="mt-1 text-xs text-gray-500">
                              JPG, PNG or GIF. Max 5MB.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Bio */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-500" />
                      About You
                    </h3>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Tell potential care seekers about yourself, your approach to caregiving, and why you&apos;re passionate about it.
                      </p>
                      <textarea
                        id="bio"
                        rows={6}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="I'm a compassionate caregiver with a background in..."
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Experience */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center">
                      <FaBriefcase className="mr-2 text-blue-500" />
                      Experience & Services
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type of care you offer
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {careTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={() => handleCareTypeToggle(type.id)}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                formData.care_type.includes(type.id)
                                  ? "bg-blue-50 border-blue-500"
                                  : "border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.care_type.includes(type.id)}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                  {type.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                          Years of Experience
                        </label>
                        <select
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level.id} value={level.id}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                          Hourly Rate (USD)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="rate"
                            value={formData.rate}
                            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                            className="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Availability */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      Availability
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days Available
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {daysOfWeek.map((day) => (
                            <div
                              key={day}
                              onClick={() => handleAvailabilityToggle(day)}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                formData.availability[day]
                                  ? "bg-blue-50 border-blue-500"
                                  : "border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.availability[day]}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                  {day}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="timing" className="block text-sm font-medium text-gray-700">
                          Preferred Hours
                        </label>
                        <select
                          id="timing"
                          value={formData.timing}
                          onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select preferred hours</option>
                          <option value="morning">Morning (6am - 12pm)</option>
                          <option value="afternoon">Afternoon (12pm - 5pm)</option>
                          <option value="evening">Evening (5pm - 10pm)</option>
                          <option value="night">Night (10pm - 6am)</option>
                          <option value="full_day">Full Day</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 5: Location */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      Location
                    </h3>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Your Location
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Enter your city and state or zip code to help care seekers find you.
                      </p>
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. New York, NY or 10001"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <div className="rounded-md bg-blue-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-blue-700">
                              Your exact address will not be shown publicly. Only your general location will be visible to potential care seekers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                  step === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
                Previous
              </button>
              
              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <FaArrowRight className="ml-2 -mr-1 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <FaCheck className="ml-2 -mr-1 h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
