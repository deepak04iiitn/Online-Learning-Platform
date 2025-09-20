import React, { useState } from 'react';

const MyCoursesTab = ({ enrolledCourses, lectures, progress, handleUnenrollFromCourse, setActiveTab, displayCount, loadMore }) => {
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Search functionality 
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  // Filtering courses based on search
  const getFilteredCourses = () => {
    if(!hasSearched || !searchQuery.trim()) 
    {
      return enrolledCourses;
    }
    
    return enrolledCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
                Load More Courses ({filteredCourses.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default MyCoursesTab;