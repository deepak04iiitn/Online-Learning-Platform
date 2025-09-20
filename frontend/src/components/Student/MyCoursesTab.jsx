import React from 'react';

const MyCoursesTab = ({ enrolledCourses, lectures, progress, handleUnenrollFromCourse, setActiveTab, displayCount, loadMore }) => {
  
  const coursesToShow = enrolledCourses.slice(0, displayCount);
  const hasMoreCourses = enrolledCourses.length > displayCount;

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <button
            onClick={() => setActiveTab('browse')}
            className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToShow.map(course => {

              const courseLectures = lectures[course._id] || [];
              const courseProgress = progress[course._id];
              const completedCount = courseProgress 
                ? (courseProgress.completedLectures || []).filter(cl => cl && cl.isCompleted).length 
                : 0;
              const progressPercentage = courseLectures.length > 0 
                ? Math.round((completedCount / courseLectures.length) * 100) 
                : 0;

              return (
                
                <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  <div className="space-y-3 mb-4 flex-grow">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">{completedCount}/{courseLectures.length} lectures</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-600">
                      {progressPercentage}% complete
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('lectures')}
                      className="flex-1 cursor-pointer bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition duration-200"
                    >
                      View Lectures
                    </button>
                    <button
                      onClick={() => handleUnenrollFromCourse(course._id)}
                      className="bg-red-600 text-white cursor-pointer px-3 py-2 rounded text-sm hover:bg-red-700 transition duration-200"
                    >
                      Unenroll
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
          
          {hasMoreCourses && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Load More Courses ({enrolledCourses.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default MyCoursesTab;