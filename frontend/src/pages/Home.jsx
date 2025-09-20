import React from 'react';
import { useSelector } from 'react-redux';
import WelcomeSection from '../components/Home/WelcomeSection';
import InstructorFeatures from '../components/Home/InstructorFeatures';
import StudentFeatures from '../components/Home/StudentFeatures';
import QuickActions from '../components/Home/QuickActions';

export default function Home() {

  const { currentUser } = useSelector((state) => state.user);

  if(!currentUser) 
  {
    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="text-center">

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">EduPlatform</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your gateway to online learning. Create courses, enroll as a student, and track your educational journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                onClick={() => window.location.href = '/sign-up'}
              >
                Get Started
              </button>
              <button
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                onClick={() => window.location.href = '/sign-in'}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <WelcomeSection currentUser={currentUser} />
        {currentUser.role === 'Instructor' ? <InstructorFeatures /> : <StudentFeatures />}
        <QuickActions />

      </div>
    </div>
  );
}