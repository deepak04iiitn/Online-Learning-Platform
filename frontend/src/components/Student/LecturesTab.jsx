import React, { useState } from 'react';

const LecturesTab = ({ enrolledCourses, lectures, progress, isLectureAccessible, getLectureStatus, setCurrentLecture, displayCount, resetDisplayCount, loadMore }) => {
  
  // State to track which courses are collapsed (by courseId)
  const [collapsedCourses, setCollapsedCourses] = useState(() => 
    new Set(enrolledCourses.map(course => course._id))
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Function to toggle course collapse state
  const toggleCourseCollapse = (courseId) => {
    setCollapsedCourses(prev => {
      const newSet = new Set(prev);
      if(newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  // Search functionality 
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if(!searchQuery.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(false);

    try {
      const response = await fetch(`/backend/courses/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        credentials: 'include'
      });

      const data = await response.json();
      
      if(response.ok) {
        // Filterinng search results to only show enrolled courses
        const allSearchResults = data.courses || [];
        const enrolledCourseIds = enrolledCourses.map(course => course._id);
        const filteredResults = allSearchResults.filter(course => 
          enrolledCourseIds.includes(course._id)
        );
        
        setSearchResults(filteredResults);
        setHasSearched(true);
        setSearchError(null);
        resetDisplayCount(); 
      } else {
        setSearchError(data.message || 'Search failed');
        setSearchResults([]);
        setHasSearched(false);
      }
    } catch (error) {
      setSearchError('Failed to search courses');
      setSearchResults([]);
      setHasSearched(false);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setHasSearched(false);
    resetDisplayCount(); 
  };

  // Determining which courses to display
  const coursesToDisplay = hasSearched ? searchResults : enrolledCourses;
  const coursesToShow = coursesToDisplay.slice(0, displayCount);
  const hasMoreCourses = coursesToDisplay.length > displayCount;
  const showingSearchResults = hasSearched && searchQuery.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Lectures</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your courses..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSearching}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results Info */}
      {showingSearchResults && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div>
            <p className="text-blue-800">
              {searchResults.length === 0 
                ? `No courses found for "${searchQuery}"`
                : `Found ${searchResults.length} course${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
              }
            </p>
          </div>
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
          >
            Show All Courses
          </button>
        </div>
      )}

      {/* Error Display */}
      {searchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {searchError}
        </div>
      )}
      
      {!enrolledCourses || enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Enroll in courses to access lectures.</p>
        </div>
      ) : coursesToShow.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {showingSearchResults 
              ? `No courses match your search for "${searchQuery}".`
              : 'No courses available.'
            }
          </p>
          {showingSearchResults && (
            <button
              onClick={clearSearch}
              className="mt-4 cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
            >
              View all courses
            </button>
          )}
        </div>
      ) : (
        <>
          {coursesToShow.map(course => {
            // FIXED: Safe access to lectures data
            const courseLectures = lectures?.[course._id] || [];
            const isCollapsed = collapsedCourses.has(course._id);
            
            // Debug logging for each course
            console.log(`Course ${course._id} (${course.title}):`, {
              lectures: courseLectures.length,
              hasProgress: !!progress?.[course._id],
              progressData: progress?.[course._id]
            });
            
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
                
                {/* Course Content */}
                {!isCollapsed && (
                  <>
                    {courseLectures.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No lectures available in this course yet.</p>
                        <p className="text-sm text-gray-500 mt-1">Check back later for course content.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {courseLectures.map((lecture, index) => {
                          // FIXED: Safe access to progress and lecture data
                          const courseProgress = progress?.[course._id];
                          
                          // Find completed lecture with safe navigation
                          const completedLecture = courseProgress?.completedLectures?.find(
                            cl => {
                              if(!cl || !cl.lecture) return false;
                              const lectureId = typeof cl.lecture === 'object' && cl.lecture._id 
                                ? cl.lecture._id.toString() 
                                : cl.lecture.toString();
                              return lectureId === lecture._id.toString();
                            }
                          );

                          const isAccessible = isLectureAccessible ? isLectureAccessible(lecture, course._id, index) : true;
                          const status = getLectureStatus ? getLectureStatus(lecture, course._id) : 'not-started';

                          // FIXED: Enhanced status display logic
                          const getStatusDisplay = () => {
                            if(completedLecture?.isCompleted && completedLecture?.isPassed !== false) {
                              return {
                                text: 'Completed',
                                className: 'bg-green-100 text-green-800'
                              };
                            } else if (completedLecture && lecture.type === 'Quiz' && completedLecture.isPassed === false) {
                              return {
                                text: 'Failed',
                                className: 'bg-red-100 text-red-800'
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
                            if(completedLecture?.isCompleted && completedLecture?.isPassed !== false) {
                              return 'Review';
                            } else if (completedLecture && lecture.type === 'Quiz' && completedLecture.isPassed === false) {
                              return 'Retry';
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
                                    Lecture {index + 1}: {lecture.title}
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
                                    
                                    {/* Pass/Fail Status for Quiz lectures */}
                                    {lecture.type === 'Quiz' && completedLecture && (
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        completedLecture.isPassed === false 
                                          ? 'bg-red-100 text-red-800' 
                                          : completedLecture.isCompleted 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {completedLecture.isPassed === false 
                                          ? 'Failed' 
                                          : completedLecture.isCompleted 
                                            ? 'Passed'
                                            : 'In Progress'
                                        }
                                      </span>
                                    )}
                                    
                                    {/* Score Display for quiz lectures with scores */}
                                    {lecture.type === 'Quiz' && completedLecture && 
                                        (completedLecture.correctAnswers !== null && completedLecture.totalQuestions !== null) && (
                                        <span className="text-gray-600 font-medium">
                                          Score: {completedLecture.correctAnswers}/{completedLecture.totalQuestions}
                                        </span>
                                    )}
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => setCurrentLecture && setCurrentLecture({ ...lecture, courseId: course._id })}
                                  disabled={!isAccessible}
                                  className={`px-4 cursor-pointer py-2 rounded text-sm transition duration-200 ${
                                    isAccessible
                                      ? completedLecture && lecture.type === 'Quiz' && completedLecture.isPassed === false
                                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
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
                Load More Courses ({coursesToDisplay.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LecturesTab;