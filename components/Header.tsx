import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton'; // Google 로그인 기능을 가진 컴포넌트

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    // 전체적인 구조와 디자인은 보내주신 코드를 그대로 유지합니다.
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 5L11 9.5L6.5 14" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 5L17 9.5L12.5 14" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-2xl font-bold text-blue-600">Quick AI Bookmarks</span>
            </Link>
             {user && user.isAdmin && (
               <nav className="hidden md:flex space-x-8">
                 <Link to="/admin" className="text-gray-600 hover:text-gray-900 font-semibold">관리자</Link>
               </nav>
             )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              {/* <span>피드백</span> */}
            </button>
            
            {/* --- 이 부분이 수정되었습니다 --- */}
            {user ? (
              // 로그인했을 때 보여줄 UI (보내주신 코드와 동일)
              <div className="flex items-center space-x-3">
                 {/* user.avatarUrl은 나중에 백엔드에서 사용자 정보를 받아올 때 추가될 예정입니다. */}
                 <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
                 <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-gray-900">Logout</button>
              </div>
            ) : (
              // 로그인하지 않았을 때, Google 공식 버튼 컴포넌트를 사용합니다.
              <GoogleLoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

