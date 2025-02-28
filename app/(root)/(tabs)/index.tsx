import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Search, Briefcase, } from "lucide-react-native";
import useFetch from "@/hook/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { saveJob, unsaveJob, checkJobSaved } from "@/store/savedJobsSlice";
import { FilterChip } from "@/components/filter-chip";
import { JobCard } from "@/components/job-card";

type EmploymentType = "FULLTIME" | "CONTRACTOR" | "PARTTIME" | "INTERN";
type ExperienceLevel = "under_3_years_experience" | "more_than_3_years_experience" | "no_experience" | "no_degree";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_employment_type: EmploymentType;
  job_posted_at_datetime_utc: string;
  job_city?: string;
  job_country?: string;
}

const EMPLOYMENT_TYPES: EmploymentType[] = ["FULLTIME", "CONTRACTOR", "PARTTIME", "INTERN"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["under_3_years_experience", "more_than_3_years_experience", "no_experience", "no_degree"];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState<EmploymentType[]>([]);
  const [activeExperienceLevels, setActiveExperienceLevels] = useState<ExperienceLevel[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [savedJobIds, setSavedJobIds] = useState<Record<string, boolean>>({});

  const { items, isLoadingMore, hasMore } = useSelector((state: RootState) => state.jobs);
  const { isLoading, error, refetch, loadMore } = useFetch("search", {
    query: searchQuery || "all",
    employment_types: activeEmploymentTypes.length > 0 ? activeEmploymentTypes : [],
    job_requirements: activeExperienceLevels.length > 0 ? activeExperienceLevels : [],
    date_posted: "all",
  });

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
  }, [items]);

  const handleSearch = useCallback((): void => {
    refetch();
  }, [searchQuery, activeEmploymentTypes, activeExperienceLevels]);

  const toggleEmploymentType = (type: EmploymentType): void => {
    setActiveEmploymentTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const handleEndReached = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
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

  const toggleExperienceLevel = (level: ExperienceLevel): void => {
    setActiveExperienceLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  };

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
                <FilterChip key={type} label={type} active={activeEmploymentTypes.includes(type)} onToggle={() => toggleEmploymentType(type)} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="mt-4">
          <Text className="text-lg font-semibold mb-2">Experience Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap">
              {EXPERIENCE_LEVELS.map((level) => (
                <FilterChip key={level} label={level} active={activeExperienceLevels.includes(level)} onToggle={() => toggleExperienceLevel(level)} />
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
          <TouchableOpacity onPress={refetch} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
