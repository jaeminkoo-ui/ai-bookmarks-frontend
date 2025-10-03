import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 사용자 정보의 타입을 정의합니다.
interface User {
  email: string;
  name: string;
  avatarUrl: string;
}

// Context가 가지게 될 값들의 타입을 정의합니다.
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Context를 생성합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 다른 컴포넌트들이 Context를 쉽게 사용할 수 있도록 도와주는 Hook입니다.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 앱 전체를 감싸서 로그인 상태를 제공할 Provider 컴포넌트입니다.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 앱이 처음 시작될 때 localStorage에서 토큰을 확인하여 자동 로그인 처리
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  const login = (userData: User, token: string) => {
    setUser(userData);
    // 로그인 시 토큰과 사용자 정보를 localStorage에 저장하여 유지합니다.
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // 로그아웃 시 localStorage에서 토큰과 사용자 정보를 제거합니다.
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // 페이지를 새로고침하여 상태를 완전히 초기화합니다.
    window.location.reload();
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

