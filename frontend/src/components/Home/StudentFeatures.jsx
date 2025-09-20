import React from 'react';
import { BookOpen, TrendingUp, Lightbulb, FolderOpen } from 'lucide-react';

const StudentFeatures = () => {
  const features = [
    {
      title: "Course Enrollment",
      description: "Discover and enroll in courses that interest you",
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      actions: [
        "Browse available courses",
        "Enroll in interesting courses",
        "View course details and syllabus",
        "Check enrollment status"
      ]
    },
    {
      title: "Learning Progress",
      description: "Track your learning journey and achievements",
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      actions: [
        "View progress for each course",
        "See completion percentages",
        "Track quiz scores",
        "Monitor learning milestones"
      ]
    },
    {
      title: "Interactive Learning",
      description: "Engage with course content and quizzes",
      icon: <Lightbulb className="w-8 h-8 text-purple-600" />,
      actions: [
        "Read lecture materials",
        "Take interactive quizzes",
        "Mark lectures as completed",
        "Review quiz results"
      ]
    },
    {
      title: "Course Management",
      description: "Manage your enrolled courses and learning schedule",
      icon: <FolderOpen className="w-8 h-8 text-orange-600" />,
      actions: [
        "View all enrolled courses",
        "Unenroll from courses",
        "Search for new courses",
        "Access course materials anytime"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, index) => (

        <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">

          <div className="flex items-center mb-4">
            {feature.icon}
            <h3 className="text-xl font-bold text-gray-900 ml-3">{feature.title}</h3>
          </div>

          <p className="text-gray-600 mb-4">{feature.description}</p>

          <ul className="space-y-2">
            {feature.actions.map((action, actionIndex) => (
              <li key={actionIndex} className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {action}
              </li>
            ))}
          </ul>

        </div>
      ))}
      
    </div>
  );
};

export default StudentFeatures;