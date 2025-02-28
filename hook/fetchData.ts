import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { appendJobs, resetJobs, setError, setJobs, setLoadingMore } from "@/store/jobsSlice";

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

interface FetchResponse {
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  loadMore: () => void;
}

interface SearchQuery {
  query: string;
  page?: number;
  num_pages?: number;
  date_posted?: "all" | "today" | "3days" | "week" | "month";
  employment_types?: EmploymentType[];
  job_requirements?: JobRequirement[];
  radius?: number;
}

const useFetch = (endpoint: string, query: SearchQuery): FetchResponse => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { page, isLoadingMore } = useSelector((state: RootState) => state.jobs);

  const fetchData = async (isLoadingMore = false): Promise<void> => {
    const currentPage = isLoadingMore ? page : 1;

    if (isLoadingMore) {
      dispatch(setLoadingMore(true));
    } else {
      setIsLoading(true);
    }

    try {
      const response = await axios.request({
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,
        headers: {
          "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.EXPO_PUBLIC_RAPID_API_HOST,
        },
        params: {
          ...query,
          page: currentPage,
          num_pages: 1,
          employment_types: query.employment_types,
          job_requirements: query.job_requirements,
        },
      });

      if (isLoadingMore) {
        dispatch(appendJobs(response.data.data));
      } else {
        dispatch(setJobs(response.data.data));
      }
    } catch (error) {
      dispatch(setError((error as Error).message));
    } finally {
      setIsLoading(false);
      dispatch(setLoadingMore(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query)]);

  const refetch = (): void => {
    dispatch(resetJobs());
    fetchData();
  };

  const loadMore = (): void => {
    if (!isLoadingMore) {
      fetchData(true);
    }
  };

  return { isLoading, error: null, refetch, loadMore };
};

export default useFetch;
