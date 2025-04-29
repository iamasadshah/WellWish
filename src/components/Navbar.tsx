"use client";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const navLinks = [
  { href: "/find-caregiver", label: "Find Caregiver" },
  { href: "/become-caregiver", label: "Become a Caregiver" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 h-[70px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center px-6 space-x-2">
            <Image
              src="/assets/logo.png"
              alt="WellWish Logo"
              width={80}
              height={80}
            />
            <span className="text-3xl font-bold text-primary">WellWish</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors text-md font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile Section */}
          <div className="hidden md:block relative px-6">
            <button
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <FaUserCircle className="w-8 h-8" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
