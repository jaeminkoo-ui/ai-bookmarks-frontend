import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // 방금 수정한 AuthProvider를 불러옵니다.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find the root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* AuthProvider로 App 전체를 감싸서, 모든 자식 컴포넌트가 로그인 상태를 공유할 수 있게 합니다. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

