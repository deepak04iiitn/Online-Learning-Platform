import React from 'react';
import { BookOpen, Edit3, Users, HelpCircle, CheckCircle } from 'lucide-react';

const InstructorFeatures = () => {
  const features = [
    {
      title: "Course Management",
      description: "Create, update, and delete your courses with ease",
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      actions: [
        "Create new courses",
        "Edit course details and descriptions",
        "Delete courses permanently",
        "View all your created courses"
      ]
    },
    {
      title: "Lecture & Quiz Creation",
      description: "Add reading materials and interactive quizzes to your courses",
      icon: <HelpCircle className="w-8 h-8 text-green-600" />,
      actions: [
        "Create reading lectures with content",
        "Add interactive quiz lectures",
        "Include multiple questions per quiz",
        "Set correct answers for quiz options"
      ]
    },
    {
      title: "Student Enrollment Tracking",
      description: "Monitor student enrollments and course popularity",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      actions: [
        "View total enrolled students per course",
        "See student enrollment details",
        "Track course popularity metrics",
        "Monitor student engagement"
      ]
    },
    {
      title: "Content Management",
      description: "Edit and manage your course content and structure",
      icon: <Edit3 className="w-8 h-8 text-orange-600" />,
      actions: [
        "Edit existing lectures and content",
        "Delete lectures from courses",
        "Reorder lecture sequences",
        "Update quiz questions and answers"
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
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {action}
              </li>
            ))}
          </ul>

        </div>
      ))}

    </div>
  );
};

export default InstructorFeatures;