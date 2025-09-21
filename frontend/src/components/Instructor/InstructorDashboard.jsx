import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CourseOverview from './CourseOverview';
import CoursesTab from './CoursesTab';
import LecturesTab from './LecturesTab';
import CourseModal from './CourseModal';
import LectureModal from './LectureModal';

export default function InstructorDashboard() {

  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '' });
  const [lectureForm, setLectureForm] = useState({
    title: '',
    type: 'Reading',
    content: '',
    courseId: '',
    questions: []
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses = async () => {

    setLoading(true);

    try {
      const response = await fetch('/backend/courses/all', {
        credentials: 'include'
      });

      const data = await response.json();
      
      if(response.ok) 
      {
        const coursesWithDefaults = data.map(course => ({
          ...course,
          studentsEnrolled: course.studentsEnrolled || []
        }));

        const instructorCourses = coursesWithDefaults.filter(course => 
          course.instructor._id === currentUser._id
        );

        setCourses(instructorCourses);

        for(const course of instructorCourses) 
        {
          await fetchLecturesForCourse(course._id);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
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
          [courseId]: Array.isArray(data.lectures) ? data.lectures : []
        }));
      } else {
        setLectures(prev => ({
          ...prev,
          [courseId]: []
        }));
      }
    } catch (err) {
      console.error('Failed to fetch lectures for course:', courseId);
      setLectures(prev => ({
        ...prev,
        [courseId]: []
      }));
    }
  };


  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editMode ? `/backend/courses/${selectedCourse._id}/update` : '/backend/courses/create';
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(courseForm)
      });

      const data = await response.json();
      
      if(response.ok) 
      {
        const updatedCourse = data.course || data;
        
        if(editMode) 
        {
          setCourses(courses.map(course => 
            course._id === selectedCourse._id ? updatedCourse : course
          ));
        } else {
          setCourses([...courses, updatedCourse]);
          setLectures(prev => ({
            ...prev,
            [updatedCourse._id]: []
          }));
        }
        
        resetModals();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(editMode ? 'Failed to update course' : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };


  const handleCreateLecture = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const transformedQuestions = lectureForm.questions.map(q => ({
        questionText: q.questionText,
        options: q.options.map((optionText, index) => ({
          text: optionText,
          isCorrect: q.correctAnswer === index
        }))
      }));

      const requestBody = {
        ...lectureForm,
        questions: lectureForm.type === 'Quiz' ? transformedQuestions : []
      };

      const url = editMode ? `/backend/lectures/${selectedLecture._id}/update` : '/backend/lectures/create';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if(response.ok) 
      {
        const updatedLecture = data.lecture || data;
        
        if(editMode) 
        {
          setLectures(prev => ({
            ...prev,
            [lectureForm.courseId]: Array.isArray(prev[lectureForm.courseId])
              ? prev[lectureForm.courseId].map(lecture =>
                  lecture._id === selectedLecture._id ? updatedLecture : lecture
                )
              : [updatedLecture]
          }));
        } else {
          setLectures(prev => ({
            ...prev,
            [lectureForm.courseId]: Array.isArray(prev[lectureForm.courseId]) 
              ? [...prev[lectureForm.courseId], updatedLecture]
              : [updatedLecture]
          }));
        }
        
        resetModals();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(editMode ? 'Failed to update lecture' : 'Failed to create lecture');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteCourse = async (courseId) => {
    
    try {
      const response = await fetch(`/backend/courses/${courseId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if(response.ok) 
      {
        setCourses(courses.filter(course => course._id !== courseId));
        const updatedLectures = { ...lectures };
        delete updatedLectures[courseId];
        setLectures(updatedLectures);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete course');
    }
  };


  const handleDeleteLecture = async (lectureId, courseId) => {
    
    try {
      const response = await fetch(`/backend/lectures/${lectureId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if(response.ok) 
      {
        setLectures(prev => ({
          ...prev,
          [courseId]: Array.isArray(prev[courseId]) 
            ? prev[courseId].filter(lecture => lecture._id !== lectureId)
            : []
        }));
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete lecture');
    }
  };

  const resetModals = () => {
    setCourseForm({ title: '', description: '' });
    setLectureForm({
      title: '',
      type: 'Reading',
      content: '',
      courseId: '',
      questions: []
    });
    setSelectedCourse(null);
    setSelectedLecture(null);
    setEditMode(false);
    setShowCourseModal(false);
    setShowLectureModal(false);
    setError(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
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
              { id: 'courses', label: 'Courses' },
              { id: 'lectures', label: 'Lectures' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 cursor-pointer font-medium text-sm transition duration-200 ${
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
            {activeTab === 'overview' && <CourseOverview courses={courses} lectures={lectures} />}

            {activeTab === 'courses' && (
              <CoursesTab
                courses={courses}
                lectures={lectures}
                setShowCourseModal={setShowCourseModal}
                setShowLectureModal={setShowLectureModal}
                setLectureForm={setLectureForm}
                lectureForm={lectureForm}
                setSelectedCourse={setSelectedCourse}
                handleEditCourse={course => {
                  setCourseForm({ title: course.title, description: course.description });
                  setSelectedCourse(course);
                  setEditMode(true);
                  setShowCourseModal(true);
                }}
                handleDeleteCourse={handleDeleteCourse}
              />
            )}

            {activeTab === 'lectures' && (
              <LecturesTab
                courses={courses}
                lectures={lectures}
                handleEditLecture={(lecture, courseId) => {
                  const transformedQuestions = lecture.questions ? lecture.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options ? q.options.map(opt => opt.text) : ['', '', '', ''],
                    correctAnswer: q.options ? q.options.findIndex(opt => opt.isCorrect) : 0
                  })) : [];
                  setLectureForm({
                    title: lecture.title,
                    type: lecture.type,
                    content: lecture.content || '',
                    courseId: courseId,
                    questions: transformedQuestions
                  });
                  setSelectedLecture(lecture);
                  setSelectedCourse(courses.find(c => c._id === courseId));
                  setEditMode(true);
                  setShowLectureModal(true);
                }}
                handleDeleteLecture={handleDeleteLecture}
              />
            )}

          </>
        )}

        <CourseModal
          show={showCourseModal}
          editMode={editMode}
          courseForm={courseForm}
          setCourseForm={setCourseForm}
          handleCreateCourse={handleCreateCourse}
          resetModals={resetModals}
          loading={loading}
        />

        <LectureModal
          show={showLectureModal}
          editMode={editMode}
          lectureForm={lectureForm}
          setLectureForm={setLectureForm}
          selectedCourse={selectedCourse}
          handleCreateLecture={handleCreateLecture}
          resetModals={resetModals}
          loading={loading}
        />
        
      </div>
    </div>
  );
}