import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import { Search, Briefcase } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { saveJob, unsaveJob, checkJobSaved } from "@/store/savedJobsSlice";
import { FilterChip } from "@/components/filter-chip";
import { JobCard } from "@/components/job-card";
import { EmploymentType, JobRequirement, Job, fetchJobs, loadMoreJobs, resetJobs } from "@/store/jobsSlice";

const EMPLOYMENT_TYPES: EmploymentType[] = ["FULLTIME", "CONTRACTOR", "PARTTIME", "INTERN"];
const EXPERIENCE_LEVELS: JobRequirement[] = ["under_3_years_experience", "more_than_3_years_experience", "no_experience", "no_degree"];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeEmploymentType, setActiveEmploymentType] = useState<EmploymentType | null>(null);
  const [activeExperienceLevel, setActiveExperienceLevel] = useState<JobRequirement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [savedJobIds, setSavedJobIds] = useState<Record<string, boolean>>({});

  const { items, isLoading, isLoadingMore, hasMore, error } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const checkSavedJobs = async () => {
      if (items.length > 0) {
        const savedStatus: Record<string, boolean> = {};
        for (const job of items) {
          try {
            const resultAction = await dispatch(checkJobSaved(job.job_id));
            if (checkJobSaved.fulfilled.match(resultAction)) {
              savedStatus[job.job_id] = resultAction.payload;
            }
          } catch (error) {
            console.error("Error checking saved job status:", error);
          }
        }
        setSavedJobIds(savedStatus);
      }
    };

    checkSavedJobs();
  }, [items, dispatch]);

  const handleSearch = useCallback((): void => {
    const queryParams: any = {
      query: searchQuery || "all",
      date_posted: "all",
    };

    if (activeEmploymentType) {
      queryParams.employment_types = activeEmploymentType;
    }

    if (activeExperienceLevel) {
      queryParams.job_requirements = activeExperienceLevel;
    }

    dispatch(fetchJobs(queryParams));
  }, [searchQuery, activeEmploymentType, activeExperienceLevel, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      const queryParams: any = {
        query: searchQuery || "all",
        date_posted: "all",
      };

      if (activeEmploymentType) {
        queryParams.employment_types = activeEmploymentType;
      }

      if (activeExperienceLevel) {
        queryParams.job_requirements = activeExperienceLevel;
      }

      dispatch(loadMoreJobs(queryParams));
    }
  }, [hasMore, isLoadingMore, searchQuery, activeEmploymentType, activeExperienceLevel, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(resetJobs());
    handleSearch();
  }, [dispatch, handleSearch]);

  const toggleEmploymentType = useCallback((type: EmploymentType): void => {
    setActiveEmploymentType((prevType) => (prevType === type ? null : type));
  }, []);

  const toggleExperienceLevel = useCallback((level: JobRequirement): void => {
    setActiveExperienceLevel((prevLevel) => (prevLevel === level ? null : level));
  }, []);

  const handleSaveJob = async (job: Job, isSaved: boolean): Promise<void> => {
    try {
      if (isSaved) {
        await dispatch(unsaveJob(job.job_id));
        setSavedJobIds((prev) => ({ ...prev, [job.job_id]: false }));
      } else {
        await dispatch(saveJob(job));
        setSavedJobIds((prev) => ({ ...prev, [job.job_id]: true }));
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  };

  const renderJobCard = ({ item }: { item: Job }) => <JobCard job={item} onSave={handleSaveJob} isSaved={savedJobIds[item.job_id] || false} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center">
            <Briefcase size={24} color="white" />
          </View>
          <Text className="text-2xl font-bold ml-3 text-gray-900">Jobify</Text>
        </View>

        <Text className="text-3xl font-bold mt-6 text-gray-900">Find Your Perfect Job</Text>
        <Text className="text-gray-600 mt-2">Explore thousands of job opportunities</Text>

        <View className="flex-row items-center mt-6 bg-white rounded-xl px-4 py-2 border border-gray-200">
          <Search size={20} color="#6b7280" />
          <TextInput className="flex-1 ml-3 text-base" placeholder="Search jobs..." value={searchQuery} onChangeText={setSearchQuery} />
          <TouchableOpacity onPress={handleSearch} className="bg-blue-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Search</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <Text className="text-lg font-semibold mb-2">Employment Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {EMPLOYMENT_TYPES.map((type) => (
                <FilterChip key={type} label={type} active={activeEmploymentType === type} onToggle={() => toggleEmploymentType(type)} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mt-4">
          <Text className="text-lg font-semibold mb-2">Experience Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {EXPERIENCE_LEVELS.map((level) => (
                <FilterChip key={level} label={level} active={activeExperienceLevel === level} onToggle={() => toggleExperienceLevel(level)} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">Something went wrong. Please try again later.</Text>
          <TouchableOpacity onPress={handleRefresh} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          className="px-6"
          data={items}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.job_id}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">No jobs found</Text>
            </View>
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          onRefresh={handleRefresh}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
