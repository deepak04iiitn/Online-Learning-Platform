import React, { useState } from 'react';

const LecturesTab = ({ enrolledCourses, lectures, progress, isLectureAccessible, getLectureStatus, setCurrentLecture, displayCount, loadMore }) => {
  
  // tracking which courses are collapsed (by courseId)
  const [collapsedCourses, setCollapsedCourses] = useState(() => 
    new Set(enrolledCourses.map(course => course._id))
  );
  
  const coursesToShow = enrolledCourses.slice(0, displayCount);
  const hasMoreCourses = enrolledCourses.length > displayCount;

  // Function to toggle course collapse state
  const toggleCourseCollapse = (courseId) => {
    setCollapsedCourses(prev => {

      const newSet = new Set(prev);
      
      if(newSet.has(courseId)) 
      {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-gray-800">Course Lectures</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Enroll in courses to access lectures.</p>
        </div>
      ) : (
        <>
          {coursesToShow.map(course => {

            const courseLectures = lectures[course._id] || [];
            const isCollapsed = collapsedCourses.has(course._id);
            
            return (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md">

                {/* Course Header with Collapse Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {course.title} ({courseLectures.length} lectures)
                  </h3>
                  
                  <button
                    onClick={() => toggleCourseCollapse(course._id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                    title={isCollapsed ? "Expand course lectures" : "Collapse course lectures"}
                  >
                    <span className="text-sm font-medium">
                      {isCollapsed ? 'Expand' : 'Collapse'}
                    </span>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* Course Content - Conditionally Rendered */}
                {!isCollapsed && (
                  <>
                    {courseLectures.length === 0 ? (
                      <p className="text-gray-600">No lectures available in this course yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {courseLectures.map((lecture, index) => {

                          const isAccessible = isLectureAccessible(lecture, course._id, index);
                          const status = getLectureStatus(lecture, course._id);
                          const courseProgress = progress[course._id];
                          
                          const completedLecture = courseProgress?.completedLectures?.find(
                            cl => {
                              if (!cl || !cl.lecture) return false;
                              const lectureId = typeof cl.lecture === 'object' && cl.lecture._id 
                                ? cl.lecture._id.toString() 
                                : cl.lecture.toString();
                              return lectureId === lecture._id.toString();
                            }
                          );

                          const getStatusDisplay = () => {
                            if(completedLecture?.isCompleted) 
                            {
                              return {
                                text: 'Completed',
                                className: 'bg-green-100 text-green-800'
                              };
                            } else if (completedLecture && !completedLecture.isCompleted) {
                              return {
                                text: 'Started',
                                className: 'bg-blue-100 text-blue-800'
                              };
                            } else {
                              return {
                                text: 'Not Started',
                                className: 'bg-yellow-100 text-yellow-800'
                              };
                            }
                          };

                          const statusDisplay = getStatusDisplay();

                          const getButtonText = () => {
                            if(completedLecture?.isCompleted) 
                            {
                              return 'Review';
                            } else if (completedLecture && !completedLecture.isCompleted) {
                              return 'Continue';
                            } else {
                              return 'Start';
                            }
                          };

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
                                    
                                    <span className={`px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
                                      {statusDisplay.text}
                                    </span>
                                    
                                    {!isAccessible && (
                                      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                        Locked
                                      </span>
                                    )}
                                    
                                    {/* Score Display for quiz lectures with scores */}
                                    {lecture.type === 'Quiz' && completedLecture && 
                                        completedLecture.isCompleted && (
                                        <span className="text-gray-600 font-medium">
                                            {completedLecture.correctAnswers !== null && completedLecture.totalQuestions !== null ? (
                                            `Score: ${completedLecture.correctAnswers}/${completedLecture.totalQuestions}`
                                            ) : completedLecture.score !== null && completedLecture.score !== undefined ? (
                                            `Score: ${completedLecture.score}%`
                                            ) : (
                                            'Score: N/A'
                                            )}
                                        </span>
                                    )}
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => setCurrentLecture({ ...lecture, courseId: course._id })}
                                  disabled={!isAccessible}
                                  className={`px-4 cursor-pointer py-2 rounded text-sm transition duration-200 ${
                                    isAccessible
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {getButtonText()}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* Show collapsed state indicator */}
                {isCollapsed && courseLectures.length > 0 && (
                  <div className="text-gray-500 text-sm italic">
                    {courseLectures.length} lectures hidden - click Expand to view
                  </div>
                )}
              </div>
            );
          })}
          
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

export default LecturesTab;