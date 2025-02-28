import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type EmploymentType = "FULLTIME" | "CONTRACTOR" | "PARTTIME" | "INTERN";
export type JobRequirement = "under_3_years_experience" | "more_than_3_years_experience" | "no_experience" | "no_degree";

export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_employment_type: EmploymentType;
  job_posted_at_datetime_utc: string;
  job_city?: string;
  job_country?: string;
  job_requirements?: string[];
}

export interface JobDetail extends Job {
  job_description: string;
  job_state?: string;
  job_apply_link?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

interface JobsState {
  items: Job[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  selectedJob: {
    data: JobDetail | null;
    isLoading: boolean;
    error: string | null;
  };
}

interface SearchQuery {
  query: string;
  page?: number;
  num_pages?: number;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  employment_types?: EmploymentType | EmploymentType[];
  job_requirements?: JobRequirement | JobRequirement[];
  radius?: number;
}

const initialState: JobsState = {
  items: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  selectedJob: {
    data: null,
    isLoading: false,
    error: null,
  },
};

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (query: SearchQuery, { rejectWithValue }) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `https://jsearch.p.rapidapi.com/search`,
      headers: {
        "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.EXPO_PUBLIC_RAPID_API_HOST,
      },
      params: {
        ...query,
        page: query.page || 1,
        num_pages: 1,
      },
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const loadMoreJobs = createAsyncThunk("jobs/loadMoreJobs", async (query: Omit<SearchQuery, "page">, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { jobs: JobsState };
    const nextPage = state.jobs.page + 1;

    const response = await axios.request({
      method: "GET",
      url: `https://jsearch.p.rapidapi.com/search`,
      headers: {
        "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.EXPO_PUBLIC_RAPID_API_HOST,
      },
      params: {
        ...query,
        page: nextPage,
        num_pages: 1,
      },
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const fetchJobDetails = createAsyncThunk("jobs/fetchJobDetails", async (jobId: string, { rejectWithValue }) => {
  try {
    const response = await axios.request({
      method: "GET",
      url: `https://jsearch.p.rapidapi.com/job-details`,
      headers: {
        "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.EXPO_PUBLIC_RAPID_API_HOST,
      },
      params: {
        job_id: jobId,
        country: "us",
      },
    });

    return response.data.data[0] as JobDetail;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to load job details. Please try again.");
  }
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    resetJobs: () => initialState,
    clearSelectedJob: (state) => {
      state.selectedJob = {
        data: null,
        isLoading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.page = 1;
        state.hasMore = action.payload.length === 10;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(loadMoreJobs.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.isLoadingMore = false;
        state.items = [...state.items, ...action.payload];
        state.page += 1;
        state.hasMore = action.payload.length === 10;
        state.error = null;
      })
      .addCase(loadMoreJobs.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      .addCase(fetchJobDetails.pending, (state) => {
        state.selectedJob.isLoading = true;
        state.selectedJob.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action: PayloadAction<JobDetail>) => {
        state.selectedJob.isLoading = false;
        state.selectedJob.data = action.payload;
        state.selectedJob.error = null;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.selectedJob.isLoading = false;
        state.selectedJob.error = action.payload as string;
      });
  },
});

export const { resetJobs, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
