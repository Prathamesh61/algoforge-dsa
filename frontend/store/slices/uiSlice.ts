import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  sidebarCollapsed: boolean;
  searchModalOpen: boolean;
  theme: 'dark' | 'light';
  activeCodeLanguage: 'python' | 'javascript' | 'cpp';
  activeVisualizerAlgorithm: string;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  searchModalOpen: false,
  theme: 'dark',
  activeCodeLanguage: 'python',
  activeVisualizerAlgorithm: 'binary-search',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    openSearchModal: (state) => {
      state.searchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setCodeLanguage: (state, action: PayloadAction<'python' | 'javascript' | 'cpp'>) => {
      state.activeCodeLanguage = action.payload;
    },
    setVisualizerAlgorithm: (state, action: PayloadAction<string>) => {
      state.activeVisualizerAlgorithm = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openSearchModal,
  closeSearchModal,
  toggleSearchModal,
  setTheme,
  setCodeLanguage,
  setVisualizerAlgorithm,
} = uiSlice.actions;

export default uiSlice.reducer;
