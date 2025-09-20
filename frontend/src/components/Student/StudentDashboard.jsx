import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function StudentDashboard() {

  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [lectures, setLectures] = useState({});
  const [currentLecture, setCurrentLecture] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAllCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/backend/students/enrolled-courses', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if(response.ok) 
      {
        setEnrolledCourses(data);
        
        // Fetch progress and lectures for each enrolled course
        for (const course of data) {
          await fetchProgressForCourse(course._id);
          await fetchLecturesForCourse(course._id);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch enrolled courses');
    }
  };


  const fetchAllCourses = async () => {
    try {
      const response = await fetch('/backend/courses/all', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if(response.ok) 
      {
        setAllCourses(data);
      }
    } catch (err) {
      console.error('Failed to fetch all courses');
    }
  };


  const fetchProgressForCourse = async (courseId) => {
    try {
      const response = await fetch(`/backend/students/progress/${courseId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if(response.ok) 
      {
        console.log('Progress data for course', courseId, ':', data);
        setProgress(prev => ({
          ...prev,
          [courseId]: data
        }));
        return data;
      }
    } catch (err) {
      console.error('Failed to fetch progress for course:', courseId);
    }
    return null;
  };


  const fetchLecturesForCourse = async (courseId) => {
    try {
      const response = await fetch(`/backend/lectures/course/${courseId}/lectures`, {
        credentials: 'include'
      });

      const data = await response.json();
      
      if(response.ok) 
      {
        setLectures(prev => ({
          ...prev,
          [courseId]: data
        }));
      }
    } catch (err) {
      console.error('Failed to fetch lectures for course:', courseId);
    }
  };


  const handleEnrollInCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`/backend/students/enroll/${courseId}`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      
      if(response.ok) 
      {
        // Refresh enrolled courses
        await fetchEnrolledCourses();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };


  const handleUnenrollFromCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/backend/students/unenroll/${courseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if(response.ok) 
      {
        // Removing the course from enrolled courses
        setEnrolledCourses(enrolledCourses.filter(course => course._id !== courseId));
        
        const updatedProgress = { ...progress };
        delete updatedProgress[courseId];
        setProgress(updatedProgress);
        
        const updatedLectures = { ...lectures };
        delete updatedLectures[courseId];
        setLectures(updatedLectures);
        
        setError(null);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to unenroll from course');
    } finally {
      setLoading(false);
    }
  };


  const markLectureCompleted = async (lectureId, courseId, score = null) => {
    try {
      const response = await fetch(`/backend/students/mark-completed/${lectureId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ courseId, score })
      });
      
      if(response.ok) 
      {
        // Refreshing progress for the course and wait for it to complete
        const updatedProgress = await fetchProgressForCourse(courseId);
        
        // Close modal and reset quiz answers
        setCurrentLecture(null);
        setQuizAnswers({});
        setError(null);

        // Show success message
        console.log('Lecture completed successfully!');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to mark lecture as completed');
    }
  };


  const handleQuizSubmit = (lecture, courseId) => {
    let score = 0;
    const totalQuestions = lecture.questions.length;
    
    lecture.questions.forEach((question, index) => {
      const selectedOptionIndex = quizAnswers[`${lecture._id}-${index}`];
      
      // Checking if the selected option is correct
      if(selectedOptionIndex !== undefined && question.options && question.options[selectedOptionIndex]?.isCorrect) 
      {
        score++;
      }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    markLectureCompleted(lecture._id, courseId, percentage);
  };

  const isLectureAccessible = (lecture, courseId, lectureIndex) => {
    const courseProgress = progress[courseId];
    const courseLectures = lectures[courseId] || [];
    
    console.log('Checking accessibility for lecture:', lecture.title, 'Index:', lectureIndex);
    console.log('Course progress:', courseProgress);
    console.log('Course lectures:', courseLectures);
    
    if(!courseProgress) 
    {
      console.log('No progress found, only first lecture accessible');
      return lectureIndex === 0;
    }
    
    // First lecture is always accessible
    if(lectureIndex === 0) 
    {
      console.log('First lecture is always accessible');
      return true;
    }
    
    // Checking if previous lecture is completed
    if(lectureIndex > 0 && courseLectures[lectureIndex - 1]) 
    {
      const previousLecture = courseLectures[lectureIndex - 1];
      console.log('Previous lecture:', previousLecture.title, 'ID:', previousLecture._id);
      
      const completedLecture = courseProgress.completedLectures?.find(cl => {
        if (!cl || !cl.lecture) return false;
        
        const lectureId = typeof cl.lecture === 'object' && cl.lecture._id 
          ? cl.lecture._id 
          : cl.lecture;
          
        const match = lectureId.toString() === previousLecture._id.toString();
        console.log('Comparing:', lectureId, 'with', previousLecture._id, 'Match:', match, 'Completed:', cl.isCompleted);
        return match;
      });
      
      const isAccessible = completedLecture?.isCompleted === true;
      console.log('Previous lecture completed?', !!completedLecture, 'Is accessible?', isAccessible);
      return isAccessible;
    }
    
    console.log('Default: not accessible');
    return false;
  };


  const getLectureStatus = (lecture, courseId) => {
    const courseProgress = progress[courseId];
    if(!courseProgress) return 'not-started';
    
    const completedLecture = courseProgress.completedLectures.find(
      cl => cl && cl.lecture && (
        cl.lecture === lecture._id || 
        cl.lecture.toString() === lecture._id.toString()
      )
    );
    
    return completedLecture?.isCompleted ? 'completed' : 'not-started';
  };


  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Enrolled Courses</h3>
        <p className="text-3xl font-bold text-blue-600">{enrolledCourses.length}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed Lectures</h3>
        <p className="text-3xl font-bold text-green-600">
          {Object.values(progress).reduce(
            (total, courseProgress) => 
              total + ((courseProgress?.completedLectures || []).filter(cl => cl && cl.isCompleted).length), 0
          )}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Score</h3>

        <p className="text-3xl font-bold text-purple-600">
          {(() => {
            const allScores = Object.values(progress).flatMap(
              courseProgress => (courseProgress?.completedLectures || [])
                .filter(cl => cl && cl.score !== null && cl.score !== undefined)
                .map(cl => cl.score)
            );
            return allScores.length > 0 
              ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) + '%'
              : '0%';
          })()}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Courses</h3>
        <p className="text-3xl font-bold text-orange-600">
          {allCourses.filter(course => 
            !Array.isArray(enrolledCourses) || !enrolledCourses.some(enrolled => enrolled._id === course._id)
          ).length}
        </p>
      </div>
    </div>
  );


  const MyCoursesTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <button
            onClick={() => setActiveTab('browse')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => {
            const courseLectures = lectures[course._id] || [];
            const courseProgress = progress[course._id];
            const completedCount = courseProgress 
              ? (courseProgress.completedLectures || []).filter(cl => cl && cl.isCompleted).length 
              : 0;
            const progressPercentage = courseLectures.length > 0 
              ? Math.round((completedCount / courseLectures.length) * 100) 
              : 0;

            return (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                
                <div className="space-y-3 mb-4">
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
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition duration-200"
                  >
                    View Lectures
                  </button>
                  <button
                    onClick={() => handleUnenrollFromCourse(course._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition duration-200"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const LecturesTab = () => (
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
                      cl => cl && cl.lecture && (
                        cl.lecture === lecture._id || 
                        cl.lecture.toString() === lecture._id.toString()
                      )
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

  
  const BrowseCoursesTab = () => {
    const availableCourses = allCourses.filter(course => 
      !enrolledCourses.some(enrolled => enrolled._id === course._id)
    );

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Browse Available Courses</h2>
        
        {availableCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No available courses to enroll in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'my-courses', label: 'My Courses' },
              { id: 'lectures', label: 'Lectures' },
              { id: 'browse', label: 'Browse Courses' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'my-courses' && <MyCoursesTab />}
            {activeTab === 'lectures' && <LecturesTab />}
            {activeTab === 'browse' && <BrowseCoursesTab />}
          </>
        )}

        {/* Lecture Modal */}
        {currentLecture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
                <button
                  onClick={() => setCurrentLecture(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {currentLecture.type === 'Reading' ? (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {currentLecture.content}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => markLectureCompleted(currentLecture._id, currentLecture.courseId)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(currentLecture.questions || []).map((question, index) => (
                    <div key={index} className="border border-gray-300 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">
                        Question {index + 1}: {question.questionText}
                      </h3>
                      
                      <div className="space-y-2">
                        {(question.options || []).map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={optionIndex}
                              onChange={(e) => setQuizAnswers({
                                ...quizAnswers,
                                [`${currentLecture._id}-${index}`]: parseInt(e.target.value)
                              })}
                              className="text-blue-600"
                            />
                            <span>{option.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleQuizSubmit(currentLecture, currentLecture.courseId)}
                      disabled={Object.keys(quizAnswers).length !== (currentLecture.questions || []).length}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}