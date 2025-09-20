import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const QuickActions = () => (
  <div className="mt-16 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center justify-center"
        onClick={() => window.location.href = '/dashboard'}
      >
        <LayoutDashboard className="w-5 h-5 mr-2" />
        Go to Dashboard
      </button>
    </div>
  </div>
);

export default QuickActions;