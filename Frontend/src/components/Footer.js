import React from "react";

export const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">HappyMeals</h3>
          <p className="text-gray-400">Your favorite food, delivered fast</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">FAQ</li>
            <li className="hover:text-white cursor-pointer">Support</li>
            <li className="hover:text-white cursor-pointer">Terms</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Facebook</li>
            <li className="hover:text-white cursor-pointer">Instagram</li>
            <li className="hover:text-white cursor-pointer">Twitter</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2026 HappyMeals. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
