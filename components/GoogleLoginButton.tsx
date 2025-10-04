import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  const { login } = useAuth(); // AuthContext의 login 함수를 계속 사용합니다.
  const buttonRef = useRef<HTMLDivElement>(null);
  const initAttempted = useRef(false);

  const handleLoginSuccess = (response: any) => {
    console.log("✅ Google Login Success");
    const idToken = response.credential;

    // 백엔드의 주소는 .env 파일에서 관리하는 것이 좋습니다.
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://ai-bookmarks-backends.onrender.com';

    fetch(`${backendUrl}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    })
    .then(res => {
        if (!res.ok) {
            // 서버에서 에러 응답이 오면 처리
            return res.json().then(err => { throw new Error(err.message || 'Unknown server error') });
        }
        return res.json();
    })
    .then(data => {
      // ★★★ 핵심 수정 부분 시작 ★★★

      // 1. 서버로부터 받은 JWT 토큰이 있는지 확인합니다.
      if (data && data.token) {
        // 2. 토큰을 브라우저의 로컬 스토리지에 저장합니다.
        localStorage.setItem('authToken', data.token);
        
        // 3. AuthContext에 사용자 정보를 저장합니다.
        if (data.user) {
          login(data.user);
        }

        // 4. 페이지를 새로고침하여 앱 전체에 로그인 상태를 반영합니다.
        //    이렇게 하면 다른 컴포넌트들이 로컬 스토리지의 토큰을 사용해 데이터를 불러올 수 있습니다.
        window.location.reload();

      } else {
        // 백엔드 응답에 토큰이나 사용자 정보가 없는 경우 에러 처리
        throw new Error('Token or user data not found in backend response');
      }
      // ★★★ 핵심 수정 부분 끝 ★★★
    })
    .catch(error => {
      console.error('Login process error:', error);
      alert(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    });
  };

  useEffect(() => {
    // 이 부분은 기존 코드와 동일하며, 수정할 필요가 없습니다.
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const initializeButton = () => {
      if (initAttempted.current) return;
      
      if (window.google && buttonRef.current) {
        initAttempted.current = true;
        
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleLoginSuccess,
        });

        window.google.accounts.id.renderButton(
          buttonRef.current,
          { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' }
        );
      } else if (!initAttempted.current) {
        timeoutId = setTimeout(initializeButton, 50);
      }
    };

    initializeButton();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return <div ref={buttonRef}></div>;
};

export default GoogleLoginButton;