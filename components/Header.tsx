import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 5L11 9.5L6.5 14" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 5L17 9.5L12.5 14" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-bold text-blue-600">Quick AI Bookmarks</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold">AI 바로가기</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold">AI 구독관리</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              <span>피드백</span>
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                 <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
                 <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-gray-900">Logout</button>
              </div>
            ) : (
              <button onClick={login} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                <span>Google 로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;