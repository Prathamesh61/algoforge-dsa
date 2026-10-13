import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProblemsState {
  selectedDifficulty: string;
  selectedTag: string;
  searchQuery: string;
  codeDrafts: Record<string, string>;
}

const initialState: ProblemsState = {
  selectedDifficulty: 'all',
  selectedTag: 'all',
  searchQuery: '',
  codeDrafts: {},
};

export const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    setSelectedDifficulty: (state, action: PayloadAction<string>) => {
      state.selectedDifficulty = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    saveCodeDraft: (
      state,
      action: PayloadAction<{ problemSlug: string; language: string; code: string }>
    ) => {
      const key = `${action.payload.problemSlug}_${action.payload.language}`;
      state.codeDrafts[key] = action.payload.code;
    },
    clearCodeDraft: (
      state,
      action: PayloadAction<{ problemSlug: string; language: string }>
    ) => {
      const key = `${action.payload.problemSlug}_${action.payload.language}`;
      delete state.codeDrafts[key];
    },
  },
});

export const {
  setSelectedDifficulty,
  setSelectedTag,
  setSearchQuery,
  saveCodeDraft,
  clearCodeDraft,
} = problemsSlice.actions;

export default problemsSlice.reducer;
