import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LecturesTab = ({ courses, lectures, handleEditLecture, handleDeleteLecture }) => {
  const [expandedCourses, setExpandedCourses] = useState({});
  const [visibleCourses, setVisibleCourses] = useState(6);

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const loadMoreCourses = () => {
    setVisibleCourses(prev => prev + 6);
  };

  // Getting courses that have lectures
  const coursesWithLectures = Object.entries(lectures).filter(([courseId, courseLectures]) => {
    const lectureArray = Array.isArray(courseLectures) ? courseLectures : [];
    return lectureArray.length > 0;
  });

  const showLoadMoreButton = visibleCourses < coursesWithLectures.length;
  const displayedCoursesWithLectures = coursesWithLectures.slice(0, visibleCourses);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">All Lectures</h2>
      
      {coursesWithLectures.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No lectures created yet.</p>
        </div>
      ) : (
        <>
          {displayedCoursesWithLectures.map(([courseId, courseLectures]) => {
            const course = courses.find(c => c._id === courseId);
            const lectureArray = Array.isArray(courseLectures) ? courseLectures : [];
            const shouldCollapse = lectureArray.length > 3;
            const isExpanded = expandedCourses[courseId];
            const displayedLectures = shouldCollapse && !isExpanded 
              ? lectureArray.slice(0, 3) 
              : lectureArray;
            
            return (
              <div key={courseId} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {course?.title || 'Unknown Course'} ({lectureArray.length} lectures)
                  </h3>
                  
                  {shouldCollapse && (
                    <button
                      onClick={() => toggleCourseExpansion(courseId)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                    >
                      <span className="text-sm font-medium">
                        {isExpanded ? 'Collapse' : `Show ${lectureArray.length - 3} more`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedLectures.map((lecture, index) => (
                    <div key={lecture._id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 flex-1 mr-2">{lecture.title}</h4>
                        <div className="flex space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditLecture(lecture, courseId)}
                            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLecture(lecture._id, courseId)}
                            className="text-red-600 hover:text-red-800 text-sm cursor-pointer transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            lecture.type === 'Reading' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {lecture.type}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-500">Order:</span>
                          <span className="font-medium">#{index + 1}</span>
                        </div>

                        {lecture.type === 'Quiz' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Questions:</span>
                            <span className="font-medium">{lecture.questions?.length || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {shouldCollapse && !isExpanded && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => toggleCourseExpansion(courseId)}
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                    >
                      <span className="text-sm font-medium">
                        Show {lectureArray.length - 3} more lectures
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {showLoadMoreButton && (
            <div className="text-center">
              <button
                onClick={loadMoreCourses}
                className="bg-gray-600 text-white cursor-pointer px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Load More Courses ({coursesWithLectures.length - visibleCourses} remaining)
              </button>
            </div>
          )}

          {!showLoadMoreButton && coursesWithLectures.length > 6 && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">Showing all {coursesWithLectures.length} courses with lectures</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LecturesTab;