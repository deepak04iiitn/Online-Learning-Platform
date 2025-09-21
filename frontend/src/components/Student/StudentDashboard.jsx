import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OverviewTab from './OverviewTab';
import MyCoursesTab from './MyCoursesTab';
import LecturesTab from './LecturesTab';
import BrowseCoursesTab from './BrowseCoursesTab';
import LectureModal from './LectureModal';

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

  const [displayCounts, setDisplayCounts] = useState({
    myCourses: 6,
    lectures: 6,
    browseCourses: 6
  });

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAllCourses();
  }, []);

  
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/backend/students/enrolled-courses', {
        credentials: 'include'
      });

      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setEnrolledCourses(Array.isArray(data) ? data : []);
      
      // Fetching progress and lectures for all enrolled courses
      if(Array.isArray(data) && data.length > 0) 
      {
        for(const course of data) 
        {
          console.log('Fetching data for course:', course._id, course.title);
          await fetchProgressForCourse(course._id);
          await fetchLecturesForCourse(course._id);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError('Failed to fetch enrolled courses: ' + err.message);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await fetch('/backend/courses/all', {
        credentials: 'include'
      });

      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('All courses data:', data);
      setAllCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch all courses:', err);
      setError('Failed to fetch all courses: ' + err.message);
    }
  };

  // progress fetching with proper error handling
  const fetchProgressForCourse = async (courseId) => {
    try {
      console.log('Fetching progress for course:', courseId);
      const response = await fetch(`/backend/students/progress/${courseId}`, {
        credentials: 'include'
      });

      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
  
      const progressData = data.progress || data;
      
      setProgress(prev => ({
        ...prev,
        [courseId]: progressData
      }));
      
      return progressData;

    } catch (err) {
      setProgress(prev => ({
        ...prev,
        [courseId]: { completedLectures: [] }
      }));
    }
    return null;
  };

  // lecture fetching with proper data extraction
  const fetchLecturesForCourse = async (courseId) => {
    try {
      console.log('Fetching lectures for course:', courseId);
      const response = await fetch(`/backend/lectures/course/${courseId}/lectures`, {
        credentials: 'include'
      });
      
      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const lecturesData = data.lectures || [];
      
      setLectures(prev => ({
        ...prev,
        [courseId]: lecturesData
      }));

    } catch (err) {
      setLectures(prev => ({
        ...prev,
        [courseId]: []
      }));
    }
  };

  const handleEnrollInCourse = async (courseId) => {
    setLoading(true);

    try {
      const response = await fetch(`/backend/students/enroll/${courseId}`, {
        method: 'POST',
        credentials: 'include'
      });

      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
  
      await fetchEnrolledCourses();
      setError(null);
    } catch (err) {
      setError('Failed to enroll in course: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenrollFromCourse = async (courseId) => {
    
    setLoading(true);

    try {
      const response = await fetch(`/backend/students/unenroll/${courseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setEnrolledCourses(enrolledCourses.filter(course => course._id !== courseId));
      
      const updatedProgress = { ...progress };
      delete updatedProgress[courseId];
      setProgress(updatedProgress);
      
      const updatedLectures = { ...lectures };
      delete updatedLectures[courseId];
      setLectures(updatedLectures);
      
      setError(null);
    } catch (err) {
      console.error('Unenrollment error:', err);
      setError('Failed to unenroll from course: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // function to mark lecture as started
  const markLectureStarted = async (lectureId, courseId) => {
    try {
      const response = await fetch(`/backend/students/mark-started/${lectureId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ courseId })
      });
      
      if(response.ok) 
      {
        // Refreshing the progress to update UI immediately
        await fetchProgressForCourse(courseId);
      } else {
        console.error('Failed to mark lecture as started');
      }
    } catch (err) {
      console.error('Failed to mark lecture as started:', err);
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
      
      if(!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Refreshing the progress to update UI immediately
      await fetchProgressForCourse(courseId);
      setCurrentLecture(null);
      setQuizAnswers({});
      setError(null);
      
      // Showing pass/fail message for quizzes
      if(data.isPassed !== undefined && !data.isPassed) {
        setError('Quiz failed! You need to answer all questions correctly to pass and unlock the next lecture. You can retry this quiz.');
      } else if (data.isPassed !== undefined && data.isPassed) {
        console.log('Quiz passed successfully!');
      }
      
    } catch (err) {
      setError('Failed to mark lecture as completed: ' + err.message);
    }
  };

  // Quiz submission with proper scoring
  const handleQuizSubmit = async (lecture, courseId) => {
    try {
      let score = 0;
      const totalQuestions = lecture.questions?.length || 0;
      
      if(totalQuestions === 0) 
      {
        setError('No questions found in this quiz');
        return;
      }

      // Checking the answers
      lecture.questions.forEach((question, index) => {
        const selectedOptionIndex = quizAnswers[`${lecture._id}-${index}`];
        
        if(selectedOptionIndex !== undefined && 
            question.options && 
            question.options[selectedOptionIndex]?.isCorrect) {
          score++;
        }
      });
      
      await markLectureCompleted(lecture._id, courseId, {
        correctAnswers: score,
        totalQuestions: totalQuestions
      });
      
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz: ' + err.message);
    }
  };


  // Function to mark as started
  const handleSetCurrentLecture = async (lectureData) => {
    if(lectureData) 
    {
      // Checking if the lecture is not already completed or started
      const courseProgress = progress[lectureData.courseId];
      const completedLecture = courseProgress?.completedLectures?.find(
        cl => {
          if (!cl || !cl.lecture) return false;
          const lectureId = typeof cl.lecture === 'object' && cl.lecture._id 
            ? cl.lecture._id.toString() 
            : cl.lecture.toString();
          return lectureId === lectureData._id.toString();
        }
      );

      // If lecture is not started yet, marking it as started
      if(!completedLecture) 
      {
        await markLectureStarted(lectureData._id, lectureData.courseId);
      }
    }
    
    setCurrentLecture(lectureData);
  };

  // lecture accessibility check
  const isLectureAccessible = (lecture, courseId, lectureIndex) => {
    const courseProgress = progress[courseId];
    const courseLectures = lectures[courseId] || [];
    
    // First lecture is always accessible
    if(lectureIndex === 0) return true;
    
    // If no progress data, only first lecture is accessible
    if(!courseProgress) return lectureIndex === 0;
    
    // Check if previous lecture is completed
    if(lectureIndex > 0 && courseLectures[lectureIndex - 1]) {
      const previousLecture = courseLectures[lectureIndex - 1];
      const completedLecture = courseProgress.completedLectures?.find(cl => {
        if(!cl || !cl.lecture) return false;
        const lectureId = typeof cl.lecture === 'object' && cl.lecture._id ? cl.lecture._id : cl.lecture;
        return lectureId.toString() === previousLecture._id.toString();
      });

      // For quiz lectures, must be both completed AND passed
      // For reading lectures, just needs to be completed
      if(previousLecture.type === 'Quiz') {
        return completedLecture?.isCompleted === true && completedLecture?.isPassed === true;
      } else {
        return completedLecture?.isCompleted === true;
      }
    }

    return false;
  };

  const getLectureStatus = (lecture, courseId) => {
    const courseProgress = progress[courseId];

    if(!courseProgress) return 'not-started';

    const completedLecture = courseProgress.completedLectures?.find(
      cl => {
        if(!cl || !cl.lecture) return false;
        const lectureId = typeof cl.lecture === 'object' && cl.lecture._id 
          ? cl.lecture._id.toString() 
          : cl.lecture.toString();
        return lectureId === lecture._id.toString();
      }
    );

    if(completedLecture?.isCompleted && completedLecture?.isPassed !== false) {
      return 'completed';
    } else if (completedLecture && lecture.type === 'Quiz' && completedLecture.isPassed === false) {
      return 'failed';
    } else if (completedLecture && !completedLecture.isCompleted) {
      return 'started';
    } else {
      return 'not-started';
    }
  };

  const loadMoreItems = (section) => {
    setDisplayCounts(prev => ({
      ...prev,
      [section]: prev[section] + 6
    }));
  };

  const resetDisplayCount = (section) => {
    setDisplayCounts(prev => ({
      ...prev,
      [section]: 6
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-900 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

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
                className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
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

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab enrolledCourses={enrolledCourses} progress={progress} allCourses={allCourses} />}
            {activeTab === 'my-courses' && <MyCoursesTab enrolledCourses={enrolledCourses} lectures={lectures} progress={progress} handleUnenrollFromCourse={handleUnenrollFromCourse} setActiveTab={setActiveTab} displayCount={displayCounts.myCourses} loadMore={() => loadMoreItems('myCourses')} />}
            {activeTab === 'lectures' && <LecturesTab enrolledCourses={enrolledCourses} lectures={lectures} progress={progress} isLectureAccessible={isLectureAccessible} getLectureStatus={getLectureStatus} setCurrentLecture={handleSetCurrentLecture} displayCount={displayCounts.lectures} loadMore={() => loadMoreItems('lectures')} />}
            {activeTab === 'browse' && <BrowseCoursesTab allCourses={allCourses} enrolledCourses={enrolledCourses} handleEnrollInCourse={handleEnrollInCourse} loading={loading} displayCount={displayCounts.browseCourses} loadMore={() => loadMoreItems('browseCourses')} resetDisplayCount={() => resetDisplayCount('browseCourses')} />}
          </>
        )}

        <LectureModal
          currentLecture={currentLecture}
          setCurrentLecture={setCurrentLecture}
          quizAnswers={quizAnswers}
          setQuizAnswers={setQuizAnswers}
          markLectureCompleted={markLectureCompleted}
          handleQuizSubmit={handleQuizSubmit}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
}
