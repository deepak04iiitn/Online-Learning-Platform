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

    if(!window.confirm('Are you sure you want to unenroll from this course?')) return;
    
    setLoading(true);

    try {
      const response = await fetch(`/backend/students/unenroll/${courseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if(response.ok) 
      {
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
        await fetchProgressForCourse(courseId);
        setCurrentLecture(null);
        setQuizAnswers({});
        setError(null);
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
    
    if(!courseProgress) return lectureIndex === 0;
    if(lectureIndex === 0) return true;
    if(lectureIndex > 0 && courseLectures[lectureIndex - 1]) 
    {
      const previousLecture = courseLectures[lectureIndex - 1];
      const completedLecture = courseProgress.completedLectures?.find(cl => {
        const lectureId = typeof cl.lecture === 'object' && cl.lecture._id ? cl.lecture._id : cl.lecture;
        return lectureId.toString() === previousLecture._id.toString();
      });

      return completedLecture?.isCompleted === true;
    }

    return false;
  };


  const getLectureStatus = (lecture, courseId) => {
    const courseProgress = progress[courseId];

    if(!courseProgress) return 'not-started';

    const completedLecture = courseProgress.completedLectures.find(
      cl => cl && cl.lecture && (cl.lecture === lecture._id || cl.lecture.toString() === lecture._id.toString())
    );

    return completedLecture?.isCompleted ? 'completed' : 'not-started';
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
            {activeTab === 'my-courses' && <MyCoursesTab enrolledCourses={enrolledCourses} lectures={lectures} progress={progress} handleUnenrollFromCourse={handleUnenrollFromCourse} />}
            {activeTab === 'lectures' && <LecturesTab enrolledCourses={enrolledCourses} lectures={lectures} progress={progress} isLectureAccessible={isLectureAccessible} getLectureStatus={getLectureStatus} setCurrentLecture={setCurrentLecture} />}
            {activeTab === 'browse' && <BrowseCoursesTab allCourses={allCourses} enrolledCourses={enrolledCourses} handleEnrollInCourse={handleEnrollInCourse} loading={loading} />}
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