import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/blog", label: "Blog" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/safety", label: "Safety" },
    { href: "/community", label: "Community" },
    { href: "/contact", label: "Contact Us" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/accessibility", label: "Accessibility" },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com/wellwish" },
  { icon: FaTwitter, href: "https://twitter.com/wellwish" },
  { icon: FaInstagram, href: "https://instagram.com/wellwish" },
  { icon: FaLinkedin, href: "https://linkedin.com/company/wellwish" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">WellWish</h3>
            <p className="text-gray-400">
              Connecting hearts, delivering care. Making caregiving simple,
              safe, and meaningful.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} WellWish. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
