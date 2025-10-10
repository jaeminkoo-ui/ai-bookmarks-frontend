import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiClient from '../api';

interface News {
  id: number;
  title: string;
  content?: string;
  link?: string;
  publishedAt: string;
}

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiClient.get('/api/news?limit=50');
        setNewsList(response.data.news);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleNewsClick = (news: News) => {
    if (news.link) {
      window.open(news.link, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </button>
          <h1 className="text-4xl font-bold text-gray-900">AI News</h1>
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">뉴스를 불러오는 중...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">아직 등록된 뉴스가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {newsList.map((news) => (
              <article 
                key={news.id} 
                className={`border-b border-gray-200 pb-8 ${news.link ? 'cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors' : ''}`}
                onClick={() => handleNewsClick(news)}
              >
                {/* Date and Category */}
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-sm text-gray-500">
                    {formatDate(news.publishedAt)}
                  </time>
                  <span className="text-sm text-gray-400">{formatTime(news.publishedAt)}</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-red-600">News</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {news.title}
                </h2>

                {/* Content */}
                {news.content && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {news.content}
                  </div>
                )}

                {/* External Link Indicator */}
                {news.link && (
                  <div className="flex items-center text-blue-600 text-sm">
                    <span>자세히 보기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;

