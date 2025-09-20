import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-lg font-bold text-blue-600 hover:text-blue-700 mb-4">EduPlatform</h3>
            <p className="text-gray-600 text-sm">
              Empowering education through innovative online learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Quick Links</h4>
            
            <ul className="space-y-2">

              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/sign-in" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Sign In
                </Link>
              </li>

              <li>
                <Link to="/sign-up" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Sign Up
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Contact</h4>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Email: info@eduplatform.com</p>
              <p>Phone: +91 1234567890</p>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">

            <p className="text-gray-500 text-sm">
              © 2024 EduPlatform. All rights reserved.
            </p>

            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Privacy Policy</span>
                Privacy
              </a>

              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Terms of Service</span>
                Terms
              </a>
            </div>

          </div>
        </div>

      </div>

    </footer>
  );
}