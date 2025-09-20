import React from 'react';

const LectureModal = ({ currentLecture, setCurrentLecture, quizAnswers, setQuizAnswers, markLectureCompleted, handleQuizSubmit, error, setError }) => {

  if(!currentLecture) return null;

  return (
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
  );
};

export default LectureModal;