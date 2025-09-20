import React, { useState, useEffect } from 'react';

const BrowseCoursesTab = ({ allCourses, enrolledCourses, handleEnrollInCourse, loading }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filtering the courses based on enrollment status
  const getAvailableCourses = (courses) => {
    return courses.filter(course => 
      !enrolledCourses.some(enrolled => enrolled._id === course._id)
    );
  };

  const availableCourses = getAvailableCourses(allCourses);
  const availableSearchResults = hasSearched ? getAvailableCourses(searchResults) : [];

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
  };

  // Determining which courses to display
  const coursesToDisplay = hasSearched ? availableSearchResults : availableCourses;
  const showingSearchResults = hasSearched && searchQuery.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <h2 className="text-2xl font-bold text-gray-800">Browse Available Courses</h2>
        
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSearching}
              >
                ✕
              </button>
            )}

          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                ? `No available courses found for "${searchQuery}"`
                : `Found ${availableSearchResults.length} available course${availableSearchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
              }
            </p>

            {searchResults.length > availableSearchResults.length && (
              <p className="text-blue-600 text-sm mt-1">
                ({searchResults.length - availableSearchResults.length} result{searchResults.length - availableSearchResults.length === 1 ? '' : 's'} hidden - already enrolled)
              </p>
            )}

          </div>

          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-800 font-medium"
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
      {coursesToDisplay.length === 0 ? (
        <div className="text-center py-12">

          <p className="text-gray-600">
            {showingSearchResults 
              ? `No available courses match your search for "${searchQuery}".`
              : 'No available courses to enroll in.'
            }
          </p>

          {showingSearchResults && (
            <button
              onClick={clearSearch}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              View all available courses
            </button>
          )}

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesToDisplay.map(course => (
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