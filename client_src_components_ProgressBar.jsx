// client/src/components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ progress }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-3">処理進捗</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div 
          className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-center mt-2 text-sm font-medium text-gray-700">{percentage.toFixed(0)}% 完了</p>
    </div>
  );
};

export default ProgressBar;
