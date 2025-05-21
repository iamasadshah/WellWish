"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaClock,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";

// Helper function to render star ratings
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return stars;
};

// Dummy data for caregivers
const caregivers = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/assets/avatars/avatar1.jpg",
    bio: "Compassionate caregiver with a passion for helping others. Specialized in elderly care and dementia support.",
    specialization: "Elderly Care",
    experience: "5 years experience in elderly care",
    hourlyRate: 25,
    availability: "Mon–Fri, 9 AM–6 PM",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/assets/avatars/avatar2.jpg",
    bio: "Experienced in pediatric care and special needs support. Certified in first aid and CPR.",
    specialization: "Pediatric Care",
    experience: "3 years experience in pediatric care",
    hourlyRate: 28,
    availability: "Weekends, Flexible Hours",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: 3,
    name: "Emma Wilson",
    image: "/assets/avatars/avatar3.jpg",
    bio: "Dedicated to providing quality care for individuals with disabilities. Trained in physical therapy assistance.",
    specialization: "Disability Care",
    experience: "4 years experience in disability care",
    hourlyRate: 30,
    availability: "Mon–Sat, 8 AM–4 PM",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "David Brown",
    image: "/assets/avatars/avatar4.jpg",
    bio: "Specialized in post-surgery care and rehabilitation. Strong background in medical assistance.",
    specialization: "Post-Surgery Care",
    experience: "6 years experience in medical care",
    hourlyRate: 32,
    availability: "Full Time, Flexible Hours",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    name: "Lisa Martinez",
    image: "/assets/avatars/avatar5.jpg",
    bio: "Expert in dementia care and Alzheimer's support. Certified in memory care techniques.",
    specialization: "Dementia Care",
    experience: "7 years experience in dementia care",
    hourlyRate: 27,
    availability: "Mon–Fri, 7 AM–3 PM",
    rating: 4.8,
    reviews: 178,
  },
  {
    id: 6,
    name: "James Wilson",
    image: "/assets/avatars/avatar6.jpg",
    bio: "Specialized in mental health support and behavioral care. Trained in crisis intervention.",
    specialization: "Mental Health Care",
    experience: "5 years experience in mental health care",
    hourlyRate: 29,
    availability: "Weekdays, Evening Shifts",
    rating: 4.6,
    reviews: 145,
  },
];

const ITEMS_PER_PAGE = 6;

export default function FindCaregiver() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique specializations for the filter dropdown
  const specializations = [
    "all",
    ...new Set(caregivers.map((caregiver) => caregiver.specialization)),
  ];

  // Filter caregivers based on search term and specialization
  const filteredCaregivers = caregivers.filter((caregiver) => {
    const matchesSearch =
      caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      caregiver.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCaregivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCaregivers = filteredCaregivers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Caregivers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find experienced and compassionate caregivers for your loved ones.
            Browse through our verified professionals and find the perfect match
            for your care needs.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization === "all"
                  ? "All Specializations"
                  : specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Caregivers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {paginatedCaregivers.map((caregiver) => (
            <div
              key={caregiver.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="relative w-32 h-32 mx-auto md:mx-0">
                    <Image
                      src={caregiver.image}
                      alt={caregiver.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  {/* Caregiver Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {caregiver.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <div className="flex">
                          {renderStars(caregiver.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({caregiver.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{caregiver.bio}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                          {caregiver.specialization}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-gray-400" />
                        <span>{caregiver.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{caregiver.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaDollarSign className="text-gray-400" />
                        <span>${caregiver.hourlyRate}/hr</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/chat/${caregiver.id}`}
                        className="flex-1 px-4 py-2 text-center border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                      >
                        Chat
                      </Link>
                      <Link
                        href={`/book/${caregiver.id}`}
                        className="flex-1 px-4 py-2 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCaregivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No caregivers found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
