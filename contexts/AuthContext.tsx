import React, { createContext, useState, useContext, ReactNode } from 'react';

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

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // ★★★ 핵심 수정 부분 ★★★
    // 1. 로컬 스토리지에서 인증 토큰을 삭제합니다.
    localStorage.removeItem('authToken');
    
    // 2. 앱의 사용자 상태를 null로 변경합니다.
    setUser(null);

    // 3. 페이지를 새로고침하여 앱을 완전히 초기 상태로 만듭니다.
    window.location.reload();
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};