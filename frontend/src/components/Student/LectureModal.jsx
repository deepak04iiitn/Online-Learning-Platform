import React from 'react';

const LectureModal = ({ currentLecture, setCurrentLecture, quizAnswers, setQuizAnswers, markLectureCompleted, handleQuizSubmit, error, setError }) => {

  if(!currentLecture) return null;

  // Checking if this is a retake (quiz that was previously failed)
  const isRetake = currentLecture.status === 'failed' || currentLecture.previousAttempts > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
            {currentLecture.type === 'Quiz' && isRetake && (
              <p className="text-orange-600 font-medium mt-1">
                Retake Quiz - Answer all questions correctly to pass
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setCurrentLecture(null);
              setError(null); // Clear error when closing modal
            }}
            className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
          >
            ✕
          </button>

        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="ml-2 text-red-900 hover:text-red-700 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {currentLecture.type === 'Reading' ? (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {currentLecture.content}
              </div>
            </div>
            
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => markLectureCompleted(currentLecture._id, currentLecture.courseId)}
                className="bg-green-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Quiz Requirements Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">

                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Quiz Requirements
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You must answer <strong>all questions correctly</strong> to pass this quiz and unlock the next lecture. You can retake this quiz unlimited times if you don't pass.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">

              {(currentLecture.questions || []).map((question, index) => (

                <div key={index} className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3 text-gray-800">
                    Question {index + 1}: {question.questionText}
                  </h3>
                  
                  <div className="space-y-2">
                    {(question.options || []).map((option, optionIndex) => (
                        
                      <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-white transition-colors duration-150">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={quizAnswers[`${currentLecture._id}-${index}`] === optionIndex}
                          onChange={(e) => setQuizAnswers({
                            ...quizAnswers,
                            [`${currentLecture._id}-${index}`]: parseInt(e.target.value)
                          })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress indicator */}
            <div className="text-sm text-gray-600 text-center">
              Questions answered: {Object.keys(quizAnswers).length} / {(currentLecture.questions || []).length}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setError(null);
                }}
                className="text-gray-600 hover:text-gray-800 cursor-pointer font-medium underline"
              >
                Clear All Answers
              </button>
              
              <button
                onClick={() => handleQuizSubmit(currentLecture, currentLecture.courseId)}
                disabled={Object.keys(quizAnswers).length !== (currentLecture.questions || []).length}
                className={`px-6 py-2 rounded-lg font-medium transition duration-200 cursor-pointer ${
                  Object.keys(quizAnswers).length === (currentLecture.questions || []).length
                    ? isRetake 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRetake ? 'Retry Quiz' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureModal;