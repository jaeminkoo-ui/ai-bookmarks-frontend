import React, { useEffect } from 'react';

// window 객체에 google 속성을 추가하기 위한 타입 선언
declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton = () => {
  // 로그인 성공 시 호출될 함수
  const handleLoginSuccess = (response: any) => {
    console.log("✅ Google Login Success");
    const idToken = response.credential; // Google이 발행한 사용자 인증 토큰(JWT)

    // 이 토큰을 우리 백엔드 서버로 보내서 최종 로그인을 처리합니다.
    fetch('https://ai-bookmarks-backends.onrender.com/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
    .then(res => res.json())
    .then(data => {
      // 서버로부터 최종 로그인 성공 응답을 받은 후의 처리 (예: 페이지 이동)
      console.log('Backend response:', data);
      alert('로그인 성공!');
      // 예시: localStorage.setItem('authToken', data.token);
      // window.location.reload();
    })
    .catch(error => {
      console.error('Backend communication error:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    });
  };

  useEffect(() => {
    // index.html에 추가한 Google 스크립트가 로드되면 window.google 객체가 생성됩니다.
    if (window.google) {
      window.google.accounts.id.initialize({
        // 🚨 여기에 아까 발급받은 본인의 Client ID를 붙여넣으세요!
        client_id: '603050281673-t7jr6pqgv4equu58f7uhno8m4bef5h9g.apps.googleusercontent.com',
        callback: handleLoginSuccess, // 로그인 성공 시 실행할 함수
      });

      // 버튼을 화면에 렌더링합니다.
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' } // 버튼 디자인 옵션
      );
    }
  }, []);

  // 이 div 안에 Google 버튼이 표시됩니다.
  return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;