import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

export const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        {/* Logo and Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/logo192.png"
              alt="HappyMeals Logo"
              className="w-12 h-12 object-contain"
            />
            <h3 className="text-xl font-bold">HappyMeals</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Your favorite food, delivered fast
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>joyontabiswas2022@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+880 1795430142</span>
            </div>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer transition">
              About Us
            </li>
            <li className="hover:text-orange-500 cursor-pointer transition">
              Careers
            </li>
            <li className="hover:text-orange-500 cursor-pointer transition">
              Contact
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Help</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer transition">
              FAQ
            </li>
            <li className="hover:text-orange-500 cursor-pointer transition">
              Support
            </li>
            <li className="hover:text-orange-500 cursor-pointer transition">
              Terms
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/joyonto.biswas111111000000#"
              className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/joyonto.biswas111111000000#"
              className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/joyonta-biswas-a6525a1b2/"
              className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 pt-8">
        <div className="text-center text-gray-400">
          <p>&copy; 2026 HappyMeals. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);
