import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // AuthContext를 사용하기 위해 import 합니다.

// window 객체에 google 속성을 추가하기 위한 타입 선언
declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  // AuthContext에서 login 함수를 가져옵니다.
  const { login } = useAuth();

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
        if (!res.ok) { // 응답이 성공적이지 않으면 에러를 발생시킵니다.
            return res.json().then(err => { throw new Error(err.message || 'Unknown server error') });
        }
        return res.json();
    })
    .then(data => {
      // --- 이 부분이 최종 수정되었습니다! ---
      // 백엔드로부터 받은 사용자 정보 객체(data.user)로 login 함수를 호출합니다.
      if (data && data.user) {
        login(data.user);
      } else {
        // 백엔드 응답에 user 객체가 없는 경우
        throw new Error('User data not found in backend response');
      }
    })
    .catch(error => {
      console.error('Login process error:', error);
      alert(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    });
  };

  useEffect(() => {
    if (window.google) {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // 환경 변수 사용
            callback: handleLoginSuccess,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' }
      );
    }
  }, []);

  return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;

