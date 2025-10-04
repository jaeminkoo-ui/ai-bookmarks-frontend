import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-50 text-green-800 rounded-lg p-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-bold bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
              RELEASE
            </span>
            <span className="font-bold">v1.1</span>
            <a href="#" className="font-semibold text-gray-800 hover:underline">
               251004 Test Version 0.1 (베타)
            </a>
          </div>
          <span className="text-gray-500">2025. 10. 4</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
