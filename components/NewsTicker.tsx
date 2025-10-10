import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

interface News {
  id: number;
  title: string;
  content?: string;
  link?: string;
  publishedAt: string;
}

const NewsTicker: React.FC = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // API에서 뉴스 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiClient.get('/api/news?limit=5');
        setNewsItems(response.data.news);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    };
    fetchNews();
  }, []);

  // 3초마다 자동으로 다음 뉴스로 이동
  useEffect(() => {
    if (newsItems.length === 0) return;
    
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

  const handleNewsClick = () => {
    navigate('/news');
  };

  if (newsItems.length === 0) {
    return null; // 뉴스가 없으면 표시하지 않음
  }

  return (
    <div 
      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleNewsClick}
    >
      <div className="flex items-center">
        <span className="flex h-3 w-3 relative mr-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-blue-600 font-bold mr-4">AI NEWS</span>
        <span className="text-gray-700">{newsItems[currentIndex]?.title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
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
              onClick={(e) => { e.stopPropagation(); handleDotClick(index); }}
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
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
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