import React from 'react';

const CourseModal = ({ show, editMode, courseForm, setCourseForm, handleCreateCourse, resetModals, loading }) => {

  if(!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">

        <h2 className="text-2xl font-bold mb-6">
          {editMode ? 'Edit Course' : 'Create New Course'}
        </h2>
        
        <form onSubmit={handleCreateCourse}>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
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
              className="cursor-pointer flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Course' : 'Create Course')}
            </button>
          </div>

        </form>
        
      </div>
    </div>
  );
};

export default CourseModal;