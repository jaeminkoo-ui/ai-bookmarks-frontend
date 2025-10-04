import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const initAttempted = useRef(false);

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