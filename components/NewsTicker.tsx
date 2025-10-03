
import React from 'react';

const NewsTicker: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="flex h-3 w-3 relative mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-blue-600 font-bold mr-4">AI NEWS</span>
        <span className="text-gray-700">루마 Ray 3 가 출시 되었습니다.</span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-gray-300 rounded-full"></span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NewsTicker;
