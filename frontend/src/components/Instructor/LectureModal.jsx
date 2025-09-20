import React from 'react';

const LectureModal = ({
  show,
  editMode,
  lectureForm,
  setLectureForm,
  selectedCourse,
  handleCreateLecture,
  resetModals,
  loading
}) => {

  if(!show) return null;

  const addQuestion = () => {
    setLectureForm({
      ...lectureForm,
      questions: [
        ...lectureForm.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    });
  };


  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...lectureForm.questions];

    if(field === 'questionText' || field === 'correctAnswer') 
    {
      updatedQuestions[index][field] = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('-')[1]);
      updatedQuestions[index].options[optionIndex] = value;
    }

    setLectureForm({ ...lectureForm, questions: updatedQuestions });
  };


  const removeQuestion = (index) => {
    setLectureForm({
      ...lectureForm,
      questions: lectureForm.questions.filter((_, i) => i !== index)
    });
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {editMode ? `Edit Lecture in "${selectedCourse?.title}"` : `Create New Lecture for "${selectedCourse?.title}"`}
        </h2>
        
        <form onSubmit={handleCreateLecture}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title
            </label>
            <input
              type="text"
              value={lectureForm.title}
              onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={lectureForm.type}
              onChange={(e) => setLectureForm({ ...lectureForm, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Reading">Reading</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          
          {lectureForm.type === 'Reading' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={lectureForm.content}
                onChange={(e) => setLectureForm({ ...lectureForm, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          {lectureForm.type === 'Quiz' && (
            <div className="mb-4">

              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Questions
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                >
                  Add Question
                </button>
              </div>
              
              {lectureForm.questions.map((question, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4">
                    
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800 cursor-pointer text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={question.questionText}
                    onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                        className="mr-2 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuestion(index, `option-${optionIndex}`, e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={resetModals}
              className="cursor-pointer flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white cursor-pointer py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Lecture' : 'Create Lecture')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LectureModal;