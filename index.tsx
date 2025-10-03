import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'; // 방금 만든 index.css 파일을 불러옵니다.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find the root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider children={undefined}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);