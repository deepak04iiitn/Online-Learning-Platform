import React from 'react';

const LecturesTab = ({ courses, lectures, handleEditLecture, handleDeleteLecture }) => (

  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">All Lectures</h2>
    
    {Object.keys(lectures).length === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-600">No lectures created yet.</p>
      </div>
    ) : (
      Object.entries(lectures).map(([courseId, courseLectures]) => {

        const course = courses.find(c => c._id === courseId);
        const lectureArray = Array.isArray(courseLectures) ? courseLectures : [];
        
        return (
          <div key={courseId} className="bg-white p-6 rounded-lg shadow-md">

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {course?.title || 'Unknown Course'} ({lectureArray.length} lectures)
            </h3>
            
            {lectureArray.length === 0 ? (
              <p className="text-gray-600">No lectures in this course yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lectureArray.map((lecture, index) => (
                  <div key={lecture._id} className="border border-gray-200 p-4 rounded-lg">

                    <div className="flex justify-between items-start mb-2">

                      <h4 className="font-medium text-gray-800">{lecture.title}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditLecture(lecture, courseId)}
                          className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLecture(lecture._id, courseId)}
                          className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">

                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          lecture.type === 'Reading' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {lecture.type}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Order:</span>
                        <span className="font-medium">#{index + 1}</span>
                      </div>

                      {lecture.type === 'Quiz' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Questions:</span>
                          <span className="font-medium">{lecture.questions?.length || 0}</span>
                        </div>
                      )}

                    </div>
                  </div>

                ))}

              </div>
            )}

          </div>
        );

      })
    )}
    
  </div>
);

export default LecturesTab;