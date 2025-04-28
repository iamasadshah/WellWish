import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const navLinks = [
  { href: "/find-caregiver", label: "Find Caregiver" },
  { href: "/become-caregiver", label: "Become a Caregiver" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="WellWish Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-xl font-bold text-primary">WellWish</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
            <button className="p-2 text-gray-600 hover:text-primary transition-colors">
              <FaUserCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
