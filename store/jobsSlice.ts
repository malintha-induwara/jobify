import { Job } from '@/hook/fetchData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface JobsState {
  items: Job[];
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: JobsState = {
  items: [],
  page: 1,
  hasMore: true,
  isLoadingMore: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.items = action.payload;
      state.page = 1;
    },
    appendJobs: (state, action: PayloadAction<Job[]>) => {
      state.items = [...state.items, ...action.payload];
      state.page += 1;
      state.hasMore = action.payload.length > 0;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetJobs: (state) => {
      return initialState;
    },
  },
});

export const { setJobs, appendJobs, setLoadingMore, setError, resetJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
