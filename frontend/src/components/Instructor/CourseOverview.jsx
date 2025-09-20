import React from 'react';

const CourseOverview = ({ courses, lectures }) => {
  const totalLectures = Object.values(lectures).reduce((total, courseLectures) => {
    return total + (Array.isArray(courseLectures) ? courseLectures.length : 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Courses</h3>
        <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Lectures</h3>
        <p className="text-3xl font-bold text-green-600">{totalLectures}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Students</h3>
        <p className="text-3xl font-bold text-purple-600">
          {courses.reduce((total, course) => total + (course.studentsEnrolled?.length || 0), 0)}
        </p>
      </div>
      
    </div>
  );
};

export default CourseOverview;