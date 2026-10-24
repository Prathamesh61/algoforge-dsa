'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserProfile } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useAppDispatch } from '@/store/hooks';
import {
  setCredentials as reduxSetCredentials,
  setUser as reduxSetUser,
  setProfile as reduxSetProfile,
  logout as reduxLogout,
  setLoading as reduxSetLoading,
} from '@/store/slices/authSlice';

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

export function normalizeProfile(raw: any): UserProfile | null {
  if (!raw) return null;
  return {
    ...raw,
    userId: raw.userId || raw.user_id || raw.id,
    user_id: raw.user_id || raw.userId || raw.id,
    headline: raw.headline || '',
    bio: raw.bio || '',
    totalXp: raw.totalXp ?? raw.total_xp ?? 0,
    total_xp: raw.total_xp ?? raw.totalXp ?? 0,
    currentLevel: raw.currentLevel ?? raw.current_level ?? 1,
    current_level: raw.current_level ?? raw.currentLevel ?? 1,
    currentStreak: raw.currentStreak ?? raw.current_streak ?? 0,
    current_streak: raw.current_streak ?? raw.currentStreak ?? 0,
    longestStreak: raw.longestStreak ?? raw.longest_streak ?? 0,
    longest_streak: raw.longest_streak ?? raw.longestStreak ?? 0,
    lastActiveDate: raw.lastActiveDate || raw.last_active_date,
    last_active_date: raw.last_active_date || raw.lastActiveDate,
    dailyGoalTarget: raw.dailyGoalTarget ?? raw.daily_goal_target ?? 5,
    daily_goal_target: raw.daily_goal_target ?? raw.dailyGoalTarget ?? 5,
    dailyGoalSolved: raw.dailyGoalSolved ?? raw.daily_goal_solved ?? raw.today_problems_solved ?? 0,
    daily_goal_solved: raw.daily_goal_solved ?? raw.dailyGoalSolved ?? raw.today_problems_solved ?? 0,
    today_problems_solved: raw.today_problems_solved ?? raw.daily_goal_solved ?? raw.dailyGoalSolved ?? 0,
    preferredLanguage: raw.preferredLanguage || raw.preferred_language || 'python',
    preferred_language: raw.preferred_language || raw.preferredLanguage || 'python',
    problemsSolvedCount: raw.problemsSolvedCount ?? raw.problems_solved_count ?? 0,
    problems_solved_count: raw.problems_solved_count ?? raw.problemsSolvedCount ?? 0,
    lessonsCompletedCount: raw.lessonsCompletedCount ?? raw.lessons_completed_count ?? 0,
    lessons_completed_count: raw.lessons_completed_count ?? raw.lessonsCompletedCount ?? 0,
    achievementsUnlockedCount: raw.achievementsUnlockedCount ?? raw.achievements_count ?? 0,
    achievements_count: raw.achievements_count ?? raw.achievementsUnlockedCount ?? 0,
  };
}

export function normalizeUser(raw: any): User | null {
  if (!raw) return null;
  const profile = normalizeProfile(raw.profile);
  return {
    ...raw,
    fullName: raw.fullName || raw.full_name || raw.username || '',
    full_name: raw.full_name || raw.fullName || raw.username || '',
    avatarUrl: raw.avatarUrl || raw.avatar_url || '',
    avatar_url: raw.avatar_url || raw.avatarUrl || '',
    authProvider: raw.authProvider || raw.auth_provider || 'email',
    dateJoined: raw.dateJoined || raw.created_at || raw.date_joined || '',
    profile: profile || undefined,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('algoforge_access_token') : null;
      if (!token) {
        setUser(null);
        setProfile(null);
        dispatch(reduxSetUser(null));
        setIsLoading(false);
        dispatch(reduxSetLoading(false));
        return;
      }

      const rawData = await apiClient.get<User>('/auth/me/');
      const userData = normalizeUser(rawData);
      setUser(userData);
      dispatch(reduxSetUser(userData));
      if (userData?.profile) {
        setProfile(userData.profile);
        dispatch(reduxSetProfile(userData.profile));
      }
    } catch {
      setUser(null);
      setProfile(null);
      dispatch(reduxLogout());
      apiClient.clearTokens();
    } finally {
      setIsLoading(false);
      dispatch(reduxSetLoading(false));
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    const handleProgressUpdate = () => {
      fetchCurrentUser();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('algoforge:progress-updated', handleProgressUpdate);
      return () => {
        window.removeEventListener('algoforge:progress-updated', handleProgressUpdate);
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    dispatch(reduxSetLoading(true));
    try {
      const res = await apiClient.post('/auth/login/', { email, password });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      const userData = normalizeUser(res.user);
      if (userData) {
        setUser(userData);
        const userProfile = userData.profile || null;
        if (userProfile) {
          setProfile(userProfile);
        }
        dispatch(
          reduxSetCredentials({
            user: userData,
            profile: userProfile,
            accessToken: res.tokens.access,
            refreshToken: res.tokens.refresh,
          })
        );
      }
    } finally {
      setIsLoading(false);
      dispatch(reduxSetLoading(false));
    }
  };

  const register = async (email: string, username: string, fullName: string, password: string) => {
    setIsLoading(true);
    dispatch(reduxSetLoading(true));
    try {
      const res = await apiClient.post('/auth/register/', {
        email,
        username,
        full_name: fullName,
        password,
      });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      const userData = normalizeUser(res.user);
      if (userData) {
        setUser(userData);
        const userProfile = userData.profile || null;
        if (userProfile) {
          setProfile(userProfile);
        }
        dispatch(
          reduxSetCredentials({
            user: userData,
            profile: userProfile,
            accessToken: res.tokens.access,
            refreshToken: res.tokens.refresh,
          })
        );
      }
    } finally {
      setIsLoading(false);
      dispatch(reduxSetLoading(false));
    }
  };

  const loginWithGoogle = async (idToken?: string) => {
    if (!idToken) {
      throw new Error('No Google credentials provided. Please sign in with your Google account.');
    }
    setIsLoading(true);
    dispatch(reduxSetLoading(true));
    try {
      const res = await apiClient.post('/auth/google/', { id_token: idToken });
      apiClient.setTokens(res.tokens.access, res.tokens.refresh);
      const userData = normalizeUser(res.user);
      if (userData) {
        setUser(userData);
        const userProfile = userData.profile || null;
        if (userProfile) {
          setProfile(userProfile);
        }
        dispatch(
          reduxSetCredentials({
            user: userData,
            profile: userProfile,
            accessToken: res.tokens.access,
            refreshToken: res.tokens.refresh,
          })
        );
      }
    } finally {
      setIsLoading(false);
      dispatch(reduxSetLoading(false));
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
      dispatch(reduxLogout());
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
