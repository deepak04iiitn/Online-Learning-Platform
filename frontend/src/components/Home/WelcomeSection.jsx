import React from 'react';

const WelcomeSection = ({ currentUser }) => (

  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Welcome back, <span className="text-blue-600">{currentUser.name}</span>
    </h1>

    <p className="text-xl text-gray-600 mb-2">
      {currentUser.role === 'Instructor' 
        ? 'Ready to create and manage your courses?' 
        : 'Ready to continue your learning journey?'
      }
    </p>

    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      {currentUser.role}
    </span>
    
  </div>
);

export default WelcomeSection;