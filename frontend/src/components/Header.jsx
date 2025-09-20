import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  

  const handleSignOut = async () => {
    try {
      await fetch('/backend/auth/signout', {
        method: 'POST',
      });
    } catch (error) {
      console.log('Error signing out:', error);
    } finally {
      dispatch(signoutSuccess());
      setIsMobileMenuOpen(false); 
    }
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              EduPlatform
            </Link>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </Link>

              <Link 
                to="/dashboard" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>

              {currentUser.role === 'Instructor' && (
                <Link 
                  to="/courses" 
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === '/courses' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  My Courses
                </Link>
              )}

            </nav>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">

                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Welcome, </span>
                  <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {currentUser.role}
                  </span>
                </div>
                
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {currentUser ? (
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/sign-in"
                  className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {currentUser && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                
              {/* User Info */}
              <div className="px-3 py-2 text-sm">
                <span className="text-gray-700">Welcome, </span>
                <span className="font-medium text-gray-900">{currentUser.name}</span>
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {currentUser.role}
                </span>
              </div>

              {/* Navigation Links */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>

              {currentUser.role === 'Instructor' && (
                <Link
                  to="/courses"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location.pathname === '/courses'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  My Courses
                </Link>
              )}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}