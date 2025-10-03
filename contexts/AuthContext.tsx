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
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // login 함수가 사용자 정보(userData) 객체만 받도록 수정되었습니다.
  const login = (userData: User) => {
    setUser(userData);
    // 로그인 정보를 localStorage에 저장하여 페이지를 새로고침해도 유지되게 합니다.
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // 로그아웃 시 localStorage에서 사용자 정보를 제거합니다.
    localStorage.removeItem('userData');
    window.location.reload();
  };
  
  // 앱이 처음 시작될 때 localStorage를 확인하여 자동 로그인 처리
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);


  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

