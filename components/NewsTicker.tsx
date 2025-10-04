import React, { useState, useEffect } from 'react';

const NewsTicker: React.FC = () => {
  const newsItems = [
    "Sora 2.0 베타 서비스가 시작되었습니다.",
    "ChatGPT-5 서비스가 시작되었습니다.",
    "Google Gemini 2.5 서비스가 시작되었습니다."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 3초마다 자동으로 다음 뉴스로 이동
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="flex h-3 w-3 relative mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-blue-600 font-bold mr-4">AI NEWS</span>
        <span className="text-gray-700">{newsItems[currentIndex]}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={handlePrevious}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Previous news"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-1.5">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="focus:outline-none"
              aria-label={`Go to news ${index + 1}`}
            >
              <span 
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              ></span>
            </button>
          ))}
        </div>
        <button 
          onClick={handleNext}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Next news"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NewsTicker;