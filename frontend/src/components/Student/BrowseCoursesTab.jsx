import React from 'react';

const BrowseCoursesTab = ({ allCourses, enrolledCourses, handleEnrollInCourse, loading }) => {
  const availableCourses = allCourses.filter(course => 
    !enrolledCourses.some(enrolled => enrolled._id === course._id)
  );

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-gray-800">Browse Available Courses</h2>
      
      {availableCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No available courses to enroll in.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map(course => (

            <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="font-medium">{course.instructor?.name || 'N/A'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{course.studentsEnrolled?.length || 0}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lectures:</span>
                  <span className="font-medium">{course.lectures?.length || 0}</span>
                </div>
                
              </div>
              
              <button
                onClick={() => handleEnrollInCourse(course._id)}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCoursesTab;