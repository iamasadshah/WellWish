"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Dummy data for care seekers
const careSeekers = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 28,
    image: "/assets/avatars/avatar1.jpg",
    work: "Elderly Care",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 32,
    image: "/assets/avatars/avatar2.jpg",
    work: "Babysitting",
  },
  {
    id: 3,
    name: "Emma Wilson",
    age: 25,
    image: "/assets/avatars/avatar3.jpg",
    work: "Special Needs Care",
  },
  {
    id: 4,
    name: "David Brown",
    age: 45,
    image: "/assets/avatars/avatar4.jpg",
    work: "Elderly Care",
  },
  {
    id: 5,
    name: "Lisa Martinez",
    age: 31,
    image: "/assets/avatars/avatar5.jpg",
    work: "Babysitting",
  },
  {
    id: 6,
    name: "James Wilson",
    age: 29,
    image: "/assets/avatars/avatar6.jpg",
    work: "Special Needs Care",
  },
  {
    id: 7,
    name: "Sophie Anderson",
    age: 27,
    image: "/assets/avatars/avatar7.jpg",
    work: "Pet Care",
  },
  {
    id: 8,
    name: "Raj Patel",
    age: 35,
    image: "/assets/avatars/avatar8.jpg",
    work: "Housekeeping",
  },
  {
    id: 9,
    name: "Maria Garcia",
    age: 33,
    image: "/assets/avatars/avatar9.jpg",
    work: "Child Care",
  },
  {
    id: 10,
    name: "John Smith",
    age: 40,
    image: "/assets/avatars/avatar10.jpg",
    work: "Elderly Care",
  },
  {
    id: 11,
    name: "Yuki Tanaka",
    age: 26,
    image: "/assets/avatars/avatar11.jpg",
    work: "Special Needs Care",
  },
  {
    id: 12,
    name: "Olivia Lee",
    age: 30,
    image: "/assets/avatars/avatar12.jpg",
    work: "Babysitting",
  },
  {
    id: 13,
    name: "Carlos Rodriguez",
    age: 34,
    image: "/assets/avatars/avatar13.jpg",
    work: "Pet Care",
  },
  {
    id: 14,
    name: "Aisha Khan",
    age: 29,
    image: "/assets/avatars/avatar14.jpg",
    work: "Housekeeping",
  },
  {
    id: 15,
    name: "Thomas Müller",
    age: 38,
    image: "/assets/avatars/avatar15.jpg",
    work: "Elderly Care",
  },
  {
    id: 16,
    name: "Priya Sharma",
    age: 31,
    image: "/assets/avatars/avatar16.jpg",
    work: "Child Care",
  },
  {
    id: 17,
    name: "Lucas Silva",
    age: 27,
    image: "/assets/avatars/avatar17.jpg",
    work: "Special Needs Care",
  },
  {
    id: 18,
    name: "Emma Thompson",
    age: 25,
    image: "/assets/avatars/avatar18.jpg",
    work: "Babysitting",
  },
  {
    id: 19,
    name: "Hiroshi Yamamoto",
    age: 33,
    image: "/assets/avatars/avatar19.jpg",
    work: "Pet Care",
  },
  {
    id: 20,
    name: "Fatima Ali",
    age: 36,
    image: "/assets/avatars/avatar20.jpg",
    work: "Housekeeping",
  },
  {
    id: 21,
    name: "William Chen",
    age: 42,
    image: "/assets/avatars/avatar21.jpg",
    work: "Elderly Care",
  },
  {
    id: 22,
    name: "Sophia Martinez",
    age: 28,
    image: "/assets/avatars/avatar22.jpg",
    work: "Child Care",
  },
  {
    id: 23,
    name: "Mohammed Ahmed",
    age: 30,
    image: "/assets/avatars/avatar23.jpg",
    work: "Special Needs Care",
  },
  {
    id: 24,
    name: "Isabella Santos",
    age: 26,
    image: "/assets/avatars/avatar24.jpg",
    work: "Babysitting",
  },
  {
    id: 25,
    name: "Alexander Kim",
    age: 35,
    image: "/assets/avatars/avatar25.jpg",
    work: "Pet Care",
  },
  {
    id: 26,
    name: "Elena Popov",
    age: 29,
    image: "/assets/avatars/avatar26.jpg",
    work: "Housekeeping",
  },
  {
    id: 27,
    name: "Daniel O&apos;Connor",
    age: 45,
    image: "/assets/avatars/avatar27.jpg",
    work: "Elderly Care",
  },
  {
    id: 28,
    name: "Mei Lin",
    age: 32,
    image: "/assets/avatars/avatar28.jpg",
    work: "Child Care",
  },
  {
    id: 29,
    name: "Gabriel Santos",
    age: 27,
    image: "/assets/avatars/avatar29.jpg",
    work: "Special Needs Care",
  },
  {
    id: 30,
    name: "Ava Johnson",
    age: 31,
    image: "/assets/avatars/avatar30.jpg",
    work: "Babysitting",
  },
];

const ITEMS_PER_PAGE = 12;

export default function FindCareSeeker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWork, setSelectedWork] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique work types for the filter dropdown
  const workTypes = [
    "all",
    ...new Set(careSeekers.map((seeker) => seeker.work)),
  ];

  // Filter care seekers based on search term and work type
  const filteredCareSeekers = careSeekers.filter((seeker) => {
    const matchesSearch = seeker.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesWork = selectedWork === "all" || seeker.work === selectedWork;
    return matchesSearch && matchesWork;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCareSeekers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCareSeekers = filteredCareSeekers.slice(
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
            Available Care Seekers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and connect with care seekers in your area. Browse through our
            verified profiles and find the perfect match for your caregiving
            needs.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedWork}
            onChange={(e) => setSelectedWork(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {workTypes.map((work) => (
              <option key={work} value={work}>
                {work === "all" ? "All Work Types" : work}
              </option>
            ))}
          </select>
        </div>

        {/* Care Seekers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCareSeekers.map((seeker) => (
            <div
              key={seeker.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Profile Image */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={seeker.image}
                    alt={seeker.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Care Seeker Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {seeker.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{seeker.age} years old</p>
                  <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {seeker.work}
                  </span>
                </div>

                {/* Chat Button */}
                <Link
                  href={`/chat/${seeker.id}`}
                  className="block w-full px-4 py-3 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium"
                >
                  Let&apos;s Chat
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCareSeekers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No care seekers found matching your criteria.
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
