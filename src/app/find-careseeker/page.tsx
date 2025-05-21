"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Dummy data for care seekers
const careSeekers = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/assets/avatars/avatar1.jpg",
    work: "Elderly Care",
    timing: "9 AM - 5 PM",
    location: "New York, NY",
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/assets/avatars/avatar2.jpg",
    work: "Babysitting",
    timing: "Weekends",
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Emma Wilson",
    image: "/assets/avatars/avatar3.jpg",
    work: "Special Needs Care",
    timing: "Flexible Hours",
    location: "Chicago, IL",
  },
  {
    id: 4,
    name: "David Brown",
    image: "/assets/avatars/avatar4.jpg",
    work: "Elderly Care",
    timing: "Night Shift",
    location: "Miami, FL",
  },
  {
    id: 5,
    name: "Lisa Martinez",
    image: "/assets/avatars/avatar5.jpg",
    work: "Babysitting",
    timing: "After School",
    location: "Seattle, WA",
  },
  {
    id: 6,
    name: "James Wilson",
    image: "/assets/avatars/avatar6.jpg",
    work: "Special Needs Care",
    timing: "Full Time",
    location: "Boston, MA",
  },
  {
    id: 7,
    name: "Sophie Anderson",
    image: "/assets/avatars/avatar7.jpg",
    work: "Pet Care",
    timing: "Weekday Mornings",
    location: "Portland, OR",
  },
  {
    id: 8,
    name: "Raj Patel",
    image: "/assets/avatars/avatar8.jpg",
    work: "Housekeeping",
    timing: "Weekday Evenings",
    location: "Austin, TX",
  },
  {
    id: 9,
    name: "Maria Garcia",
    image: "/assets/avatars/avatar9.jpg",
    work: "Child Care",
    timing: "Full Time",
    location: "Denver, CO",
  },
  {
    id: 10,
    name: "John Smith",
    image: "/assets/avatars/avatar10.jpg",
    work: "Elderly Care",
    timing: "Weekends Only",
    location: "Phoenix, AZ",
  },
  {
    id: 11,
    name: "Yuki Tanaka",
    image: "/assets/avatars/avatar11.jpg",
    work: "Special Needs Care",
    timing: "Part Time",
    location: "San Francisco, CA",
  },
  {
    id: 12,
    name: "Olivia Lee",
    image: "/assets/avatars/avatar12.jpg",
    work: "Babysitting",
    timing: "After School",
    location: "Washington, DC",
  },
  {
    id: 13,
    name: "Carlos Rodriguez",
    image: "/assets/avatars/avatar13.jpg",
    work: "Pet Care",
    timing: "Flexible Hours",
    location: "Houston, TX",
  },
  {
    id: 14,
    name: "Aisha Khan",
    image: "/assets/avatars/avatar14.jpg",
    work: "Housekeeping",
    timing: "Weekday Mornings",
    location: "Atlanta, GA",
  },
  {
    id: 15,
    name: "Thomas Müller",
    image: "/assets/avatars/avatar15.jpg",
    work: "Elderly Care",
    timing: "Night Shift",
    location: "Philadelphia, PA",
  },
  {
    id: 16,
    name: "Priya Sharma",
    image: "/assets/avatars/avatar16.jpg",
    work: "Child Care",
    timing: "Full Time",
    location: "San Diego, CA",
  },
  {
    id: 17,
    name: "Lucas Silva",
    image: "/assets/avatars/avatar17.jpg",
    work: "Special Needs Care",
    timing: "Weekends",
    location: "Dallas, TX",
  },
  {
    id: 18,
    name: "Emma Thompson",
    image: "/assets/avatars/avatar18.jpg",
    work: "Babysitting",
    timing: "After School",
    location: "Minneapolis, MN",
  },
  {
    id: 19,
    name: "Hiroshi Yamamoto",
    image: "/assets/avatars/avatar19.jpg",
    work: "Pet Care",
    timing: "Flexible Hours",
    location: "Portland, OR",
  },
  {
    id: 20,
    name: "Fatima Ali",
    image: "/assets/avatars/avatar20.jpg",
    work: "Housekeeping",
    timing: "Weekday Evenings",
    location: "Detroit, MI",
  },
  {
    id: 21,
    name: "William Chen",
    image: "/assets/avatars/avatar21.jpg",
    work: "Elderly Care",
    timing: "Full Time",
    location: "Las Vegas, NV",
  },
  {
    id: 22,
    name: "Sophia Martinez",
    image: "/assets/avatars/avatar22.jpg",
    work: "Child Care",
    timing: "Weekends Only",
    location: "Orlando, FL",
  },
  {
    id: 23,
    name: "Mohammed Ahmed",
    image: "/assets/avatars/avatar23.jpg",
    work: "Special Needs Care",
    timing: "Part Time",
    location: "San Antonio, TX",
  },
  {
    id: 24,
    name: "Isabella Santos",
    image: "/assets/avatars/avatar24.jpg",
    work: "Babysitting",
    timing: "After School",
    location: "Nashville, TN",
  },
  {
    id: 25,
    name: "Alexander Kim",
    image: "/assets/avatars/avatar25.jpg",
    work: "Pet Care",
    timing: "Flexible Hours",
    location: "Salt Lake City, UT",
  },
  {
    id: 26,
    name: "Elena Popov",
    image: "/assets/avatars/avatar26.jpg",
    work: "Housekeeping",
    timing: "Weekday Mornings",
    location: "Charlotte, NC",
  },
  {
    id: 27,
    name: "Daniel O'Connor",
    image: "/assets/avatars/avatar27.jpg",
    work: "Elderly Care",
    timing: "Night Shift",
    location: "Pittsburgh, PA",
  },
  {
    id: 28,
    name: "Mei Lin",
    image: "/assets/avatars/avatar28.jpg",
    work: "Child Care",
    timing: "Full Time",
    location: "Sacramento, CA",
  },
  {
    id: 29,
    name: "Gabriel Santos",
    image: "/assets/avatars/avatar29.jpg",
    work: "Special Needs Care",
    timing: "Weekends",
    location: "Tampa, FL",
  },
  {
    id: 30,
    name: "Ava Johnson",
    image: "/assets/avatars/avatar30.jpg",
    work: "Babysitting",
    timing: "After School",
    location: "St. Louis, MO",
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
    const matchesSearch =
      seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.location.toLowerCase().includes(searchTerm.toLowerCase());
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
              placeholder="Search by name or location..."
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
                <div className="relative w-24 h-24 mx-auto mb-4">
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
                  <p className="text-gray-600 mb-2">{seeker.location}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {seeker.work}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">
                      {seeker.timing}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href={`/chat/${seeker.id}`}
                    className="flex-1 px-4 py-2 text-center border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                  >
                    Chat
                  </Link>
                  <Link
                    href={`/book/${seeker.id}`}
                    className="flex-1 px-4 py-2 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Book Now
                  </Link>
                </div>
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
