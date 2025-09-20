import React from 'react';

const OverviewTab = ({ enrolledCourses, progress, allCourses }) => (

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

export default OverviewTab;