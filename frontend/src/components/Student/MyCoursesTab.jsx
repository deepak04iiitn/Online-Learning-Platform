import React, { useState } from 'react';
import ConfirmationModal from '../ConfirmationModal';

const MyCoursesTab = ({ enrolledCourses, lectures, progress, handleUnenrollFromCourse, setActiveTab, displayCount, loadMore }) => {
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Unenroll confirmation state
  const [unenrollConfirmation, setUnenrollConfirmation] = useState({
    isOpen: false,
    courseId: null,
    courseName: ''
  });

  // Search functionality 
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  // Unenroll confirmation functions
  const openUnenrollConfirmation = (courseId, courseName) => {
    setUnenrollConfirmation({
      isOpen: true,
      courseId,
      courseName
    });
  };

  const closeUnenrollConfirmation = () => {
    setUnenrollConfirmation({
      isOpen: false,
      courseId: null,
      courseName: ''
    });
  };

  const confirmUnenroll = () => {
    if (unenrollConfirmation.courseId && handleUnenrollFromCourse) {
      handleUnenrollFromCourse(unenrollConfirmation.courseId);
      closeUnenrollConfirmation();
    }
  };

  // Filtering courses based on search
  const getFilteredCourses = () => {
    if(!hasSearched || !searchQuery.trim()) {
      return enrolledCourses;
    }
    
    return enrolledCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // calculation of progress data
  const getProgressData = (course) => {
    const courseLectures = lectures?.[course._id] || [];
    const courseProgress = progress?.[course._id];
    
    // counting of completed lectures
    const completedCount = courseProgress?.completedLectures 
      ? courseProgress.completedLectures.filter(cl => {
          return cl && cl.isCompleted === true;
        }).length 
      : 0;
    
    const totalLectures = courseLectures.length;
    const progressPercentage = totalLectures > 0 
      ? Math.round((completedCount / totalLectures) * 100) 
      : 0;

    return {
      completedCount,
      totalLectures,
      progressPercentage
    };
  };

  const filteredCourses = getFilteredCourses();
  const coursesToShow = filteredCourses.slice(0, displayCount);
  const hasMoreCourses = filteredCourses.length > displayCount;
  const showingSearchResults = hasSearched && searchQuery.trim();

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your courses..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results Info */}
      {showingSearchResults && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div>
            <p className="text-blue-800">
              {filteredCourses.length === 0 
                ? `No courses found for "${searchQuery}"`
                : `Found ${filteredCourses.length} course${filteredCourses.length === 1 ? '' : 's'} for "${searchQuery}"`
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
      
      {!enrolledCourses || enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <button
            onClick={() => setActiveTab && setActiveTab('browse')}
            className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Courses
          </button>
        </div>
      ) : filteredCourses.length === 0 && showingSearchResults ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses match your search for "{searchQuery}".</p>
          <button
            onClick={clearSearch}
            className="mt-4 cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
          >
            View all courses
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToShow.map(course => {
              // FIXED: Use the safe progress calculation function
              const { completedCount, totalLectures, progressPercentage } = getProgressData(course);
              
              return (
                <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col hover:shadow-lg transition-shadow duration-200">

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      {/* Lecture Count Display */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Lectures:</span>
                        <span className="font-medium">{totalLectures}</span>
                      </div>

                      {/* Progress Display */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress:</span>
                        <span className="font-medium">{completedCount}/{totalLectures} lectures</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Completed</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              progressPercentage === 100 
                                ? 'bg-green-600' 
                                : progressPercentage > 0 
                                  ? 'bg-blue-600' 
                                  : 'bg-gray-400'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          progressPercentage === 100 
                            ? 'bg-green-100 text-green-800' 
                            : progressPercentage > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {progressPercentage === 100 
                            ? 'Completed' 
                            : progressPercentage > 0 
                              ? 'In Progress' 
                              : 'Not Started'}
                        </span>
                      </div>

                      {/* Additional Course Info */}
                      <div className="pt-2 border-t border-gray-100 space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Instructor:</span>
                          <span>{course.instructor?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Students:</span>
                          <span>{course.studentsEnrolled?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => setActiveTab && setActiveTab('lectures')}
                      className="flex-1 cursor-pointer bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition duration-200 font-medium"
                    >
                      View Lectures
                    </button>
                    <button
                      onClick={() => openUnenrollConfirmation(course._id, course.title)}
                      className="bg-red-600 text-white cursor-pointer px-3 py-2 rounded text-sm hover:bg-red-700 transition duration-200 font-medium"
                      title="Unenroll from course"
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
                Load More Courses ({filteredCourses.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Unenroll Confirmation Modal */}
      <ConfirmationModal
        isOpen={unenrollConfirmation.isOpen}
        onClose={closeUnenrollConfirmation}
        onConfirm={confirmUnenroll}
        title="Unenroll from Course"
        message={`Are you sure you want to unenroll from "${unenrollConfirmation.courseName}"? You will lose access to all course materials and your progress will be saved but not accessible unless you re-enroll.`}
        confirmText="Unenroll"
        cancelText="Cancel"
        type="warning"
      />

    </div>
  );
};

export default MyCoursesTab;