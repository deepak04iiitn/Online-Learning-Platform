import React, { useState, useEffect } from 'react';

const BrowseCoursesTab = ({ allCourses, enrolledCourses, handleEnrollInCourse, loading, displayCount, loadMore, resetDisplayCount }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // function to check if user is enrolled in a course or not
  const isEnrolledInCourse = (courseId) => {
    return enrolledCourses.some(enrolled => enrolled._id === courseId);
  };

  const availableCourses = allCourses;
  const availableSearchResults = hasSearched ? searchResults : [];

  // Search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if(!searchQuery.trim()) 
    {
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
      
      if(response.ok) 
      {
        setSearchResults(data.courses || []);
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
  const coursesToDisplay = hasSearched ? availableSearchResults : availableCourses;
  const coursesToShow = coursesToDisplay.slice(0, displayCount);
  const hasMoreCourses = coursesToDisplay.length > displayCount;
  const showingSearchResults = hasSearched && searchQuery.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <h2 className="text-2xl font-bold text-gray-800">Browse All Courses</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">

          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or description..."
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
              {availableSearchResults.length === 0 
                ? `No courses found for "${searchQuery}"`
                : `Found ${availableSearchResults.length} course${availableSearchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
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
      
      {/* Courses Display */}
      {coursesToShow.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToShow.map(course => (

              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">

                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                
                <div className="space-y-2 mb-4 flex-grow">

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
                  onClick={() => !isEnrolledInCourse(course._id) && handleEnrollInCourse(course._id)}
                  disabled={loading || isEnrolledInCourse(course._id)}
                  className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
                    isEnrolledInCourse(course._id)
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  } ${loading ? 'opacity-50' : ''}`}
                >
                  {isEnrolledInCourse(course._id) 
                    ? 'Already Enrolled' 
                    : loading ? 'Enrolling...' : 'Enroll Now'
                  }
                </button>
              </div>
            ))}

          </div>
          
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

export default BrowseCoursesTab;