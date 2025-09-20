import React from 'react';
import { useSelector } from 'react-redux';
import InstructorDashboard from '../components/Instructor/InstructorDashboard';
import StudentDashboard from '../components/Student/StudentDashboard';

export default function Dashboard() {

  const { currentUser } = useSelector((state) => state.user);

  if(!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'Instructor' ? (
        <InstructorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}
