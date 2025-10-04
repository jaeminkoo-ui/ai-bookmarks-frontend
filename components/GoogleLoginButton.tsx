import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// window 객체에 google 속성을 추가하기 위한 타입 선언
declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // 로그인 성공 시 호출될 함수
  const handleLoginSuccess = (response: any) => {
    console.log("✅ Google Login Success");
    const idToken = response.credential;

    fetch('https://ai-bookmarks-backends.onrender.com/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'Unknown server error') });
        }
        return res.json();
    })
    .then(data => {
      if (data && data.user) {
        login(data.user);
      } else {
        throw new Error('User data not found in backend response');
      }
    })
    .catch(error => {
      console.error('Login process error:', error);
      alert(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    });
  };

  useEffect(() => {
    // Google API가 로드될 때까지 반복 체크
    const checkGoogleLoaded = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleLoginSuccess,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' }
        );
      } else {
        // Google API가 아직 로드되지 않았으면 100ms 후 다시 시도
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  // Google API 로딩 중일 때 표시
  if (!isGoogleLoaded) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;