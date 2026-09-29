'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserProfile } from '@/types';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, fullName: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('algoforge_access_token') : null;
      if (!token) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const userData = await apiClient.get<User>('/auth/me/');
      setUser(userData);
      if (userData.profile) {
        setProfile(userData.profile);
      }
    } catch {
      setUser(null);
      setProfile(null);
      apiClient.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login/', { email, password });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      setUser(res.user);
      if (res.user.profile) {
        setProfile(res.user.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, fullName: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register/', {
        email,
        username,
        full_name: fullName,
        password,
      });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      setUser(res.user);
      if (res.user.profile) {
        setProfile(res.user.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken?: string) => {
    setIsLoading(true);
    try {
      // If no token passed, generate a mock developer token for testing / quick start
      const tokenToSend = idToken || `mock_token_developer@google.com`;
      const res = await apiClient.post('/auth/google/', { id_token: tokenToSend });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      setUser(res.user);
      if (res.user.profile) {
        setProfile(res.user.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('algoforge_refresh_token') : null;
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh: refreshToken }).catch(() => {});
      }
    } finally {
      apiClient.clearTokens();
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUserData: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
