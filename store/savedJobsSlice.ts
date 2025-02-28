import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { EmploymentType } from './jobsSlice';

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

interface SavedJob extends Job {
  id?: string; 
}

interface SavedJobsState {
  items: SavedJob[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SavedJobsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchSavedJobs = createAsyncThunk(
  'savedJobs/fetchSavedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SavedJob[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  'savedJobs/saveJob',
  async (job: Job, { rejectWithValue }) => {
    try {
      const { data: existingJob } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('job_id', job.job_id)
        .single();

      if (existingJob) {
        return { ...job, id: existingJob.id };
      }

      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          job_id: job.job_id,
          job_title: job.job_title,
          employer_name: job.employer_name,
          employer_logo: job.employer_logo,
          job_employment_type: job.job_employment_type,
          job_city: job.job_city,
          job_country: job.job_country,
          job_posted_at_datetime_utc: job.job_posted_at_datetime_utc
        })
        .select()
        .single();

      if (error) throw error;
      return data as SavedJob;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unsaveJob = createAsyncThunk(
  'savedJobs/unsaveJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('job_id', jobId);

      if (error) throw error;
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkJobSaved = createAsyncThunk(
  'savedJobs/checkJobSaved',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; 
      
      return !!data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {
    clearSavedJobs: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action: PayloadAction<SavedJob[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveJob.fulfilled, (state, action: PayloadAction<SavedJob>) => {
        const exists = state.items.some(job => job.job_id === action.payload.job_id);
        if (!exists) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(unsaveJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(job => job.job_id !== action.payload);
      });
  },
});

export const { clearSavedJobs } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;