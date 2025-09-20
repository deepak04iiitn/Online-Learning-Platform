import React from 'react';

const CoursesTab = ({
  courses,
  lectures,
  setShowCourseModal,
  setShowLectureModal,
  setLectureForm,
  lectureForm,
  setSelectedCourse,
  handleEditCourse,
  handleDeleteCourse
}) => (
  <div className="space-y-6">

    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
      <button
        onClick={() => setShowCourseModal(true)}
        className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Create New Course
      </button>
    </div>
    
    {courses.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-600">No courses created yet. Create your first course!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{course.studentsEnrolled?.length || 0}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lectures:</span>
                  <span className="font-medium">
                    {Array.isArray(lectures[course._id]) ? lectures[course._id].length : 0}
                  </span>
                </div>
              </div>

            </div>
            
            <div className="flex space-x-2 mt-auto">

              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setLectureForm({ ...lectureForm, courseId: course._id });
                  setShowLectureModal(true);
                }}
                className="cursor-pointer flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition duration-200"
              >
                Add Lecture
              </button>

              <button
                onClick={() => handleEditCourse(course)}
                className="bg-blue-600 text-white cursor-pointer px-3 py-2 rounded text-sm hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteCourse(course._id)}
                className="bg-red-600 text-white cursor-pointer px-3 py-2 rounded text-sm hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    )}
    
  </div>
);

export default CoursesTab;