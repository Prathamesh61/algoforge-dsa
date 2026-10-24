import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile } from '@/types';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  profile: null,
  accessToken: getInitialToken('algoforge_access_token'),
  refreshToken: getInitialToken('algoforge_refresh_token'),
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        profile?: UserProfile | null;
        accessToken?: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, profile, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.profile = profile || user.profile || null;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (accessToken) {
        state.accessToken = accessToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('algoforge_access_token', accessToken);
        }
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('algoforge_refresh_token', refreshToken);
        }
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload?.profile) {
        state.profile = action.payload.profile;
      }
      state.isAuthenticated = Boolean(action.payload);
      state.isLoading = false;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
      if (state.user && action.payload) {
        state.user.profile = action.payload;
      }
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('algoforge_access_token', action.payload.accessToken);
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('algoforge_refresh_token', action.payload.refreshToken);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('algoforge_access_token');
        localStorage.removeItem('algoforge_refresh_token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setUser, setProfile, setTokens, logout, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
