import React from 'react';

const LecturesTab = ({ enrolledCourses, lectures, progress, isLectureAccessible, getLectureStatus, setCurrentLecture }) => (

  <div className="space-y-6">

    <h2 className="text-2xl font-bold text-gray-800">Course Lectures</h2>
    
    {enrolledCourses.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-600">Enroll in courses to access lectures.</p>
      </div>
    ) : (
      enrolledCourses.map(course => {
        const courseLectures = lectures[course._id] || [];
        
        return (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow-md">

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {course.title} ({courseLectures.length} lectures)
            </h3>
            
            {courseLectures.length === 0 ? (
              <p className="text-gray-600">No lectures available in this course yet.</p>
            ) : (
              <div className="space-y-3">
                {courseLectures.map((lecture, index) => {
                    
                  const isAccessible = isLectureAccessible(lecture, course._id, index);
                  const status = getLectureStatus(lecture, course._id);
                  const courseProgress = progress[course._id];
                  const completedLecture = courseProgress?.completedLectures?.find(
                    cl => cl && cl.lecture && (cl.lecture === lecture._id || cl.lecture.toString() === lecture._id.toString())
                  );

                  return (
                    <div 
                      key={lecture._id} 
                      className={`border p-4 rounded-lg ${
                        isAccessible 
                          ? 'border-gray-200 bg-white' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            isAccessible ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {lecture.title}
                          </h4>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              lecture.type === 'Reading' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {lecture.type}
                            </span>
                            
                            <span className={`px-2 py-1 rounded text-xs ${
                              status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {status === 'completed' ? 'Completed' : 'Not Started'}
                            </span>
                            
                            {!isAccessible && (
                              <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                Locked
                              </span>
                            )}
                            
                            {completedLecture && completedLecture.score !== null && completedLecture.score !== undefined && (
                              <span className="text-gray-600">
                                Score: {completedLecture.score}%
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setCurrentLecture({ ...lecture, courseId: course._id })}
                          disabled={!isAccessible}
                          className={`px-4 py-2 rounded text-sm transition duration-200 ${
                            isAccessible
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {status === 'completed' ? 'Review' : 'Start'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })
    )}
  </div>
);

export default LecturesTab;