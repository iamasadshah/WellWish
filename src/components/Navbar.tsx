"use client";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import useAuth from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

const navLinks = [
  { href: "/find-caregiver", label: "Find CareGiver" },
  { href: "/find-careseeker", label: "Find CareSeeker" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authModal = useAuthModal();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#caf0f8] fixed w-full top-0 z-50 h-[70px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:px-10 md:px-0 lg:px-12 py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/logo.png"
              alt="WellWish Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-primary-dark">
              Well Wish
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary hover:text-primary-dark transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary hover:text-primary-dark transition-colors text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            {!loading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => {
                      router.push("/auth/signup");
                    }}
                    className="bg-[#00b4d8] text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-colors text-sm font-medium cursor-pointer"
                  >
                    Sign up &rarr;
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-primary-lightest shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#caf0f8]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-primary hover:text-primary-dark transition-colors text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!loading && (
                <>
                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-3 py-2 text-left text-primary hover:text-primary-dark transition-colors text-base font-medium"
                    >
                      Sign out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        authModal.onOpen();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-primary hover:text-primary-dark transition-colors text-base font-medium"
                    >
                      Sign up
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={authModal.isOpen} onClose={authModal.onClose} />
    </nav>
  );
}
