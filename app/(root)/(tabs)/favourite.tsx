import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { BookMarked, ExternalLink, Trash, Trash2 } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchSavedJobs, unsaveJob } from "@/store/savedJobsSlice";
import { Job } from "@/store/jobsSlice";

interface SavedJobCardProps {
  job: Job;
  onRemove: (jobId: string) => void;
  onView: (jobId: string) => void;
}

const SavedJobCard = ({ job, onRemove, onView }: SavedJobCardProps) => {
  return (
    <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100 ">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center flex-1">
          <Image
            source={{
              uri: job.employer_logo || "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
            }}
            className="w-12 h-12 rounded-lg"
          />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {job.job_title}
            </Text>
            <Text className="text-sm text-gray-600">{job.employer_name}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onRemove(job.job_id)} className="p-2">
          <Trash2 size={23} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <View className="mt-3 flex-row justify-between items-center">
        <View className="bg-blue-50 px-3 py-1 rounded-full">
          <Text className="text-blue-600 text-sm">{job.job_employment_type}</Text>
        </View>
        <Text className="text-gray-500 text-sm">{new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}</Text>
      </View>

      {job.job_city && (
        <Text className="mt-2 text-gray-600 text-sm">
          📍 {job.job_city}, {job.job_country}
        </Text>
      )}

      <TouchableOpacity onPress={() => onView(job.job_id)} className="mt-4 bg-blue-600 py-3 rounded-xl flex-row justify-center items-center">
        <ExternalLink size={18} color="white" />
        <Text className="ml-2 font-medium text-white">View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const Favourite = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector((state: RootState) => state.savedJobs);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    await dispatch(fetchSavedJobs());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedJobs();
    setRefreshing(false);
  };

  const handleRemoveJob = async (jobId: string) => {
    await dispatch(unsaveJob(jobId));
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/details/${jobId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center">
            <BookMarked size={24} color="white" />
          </View>
          <Text className="text-2xl font-bold ml-3 text-gray-900">Saved Jobs</Text>
        </View>

        <Text className="text-gray-600 mt-2">Keep track of jobs you're interested in</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center">Something went wrong. Please try again later.</Text>
          <TouchableOpacity onPress={loadSavedJobs} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          className="px-6"
          data={items}
          renderItem={({ item }) => <SavedJobCard job={item} onRemove={handleRemoveJob} onView={handleViewJob} />}
          keyExtractor={(item) => item.job_id}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <View className="items-center p-6">
                <BookMarked size={64} color="#d1d5db" />
                <Text className="text-xl font-semibold text-gray-700 mt-4">No saved jobs yet</Text>
                <Text className="text-gray-500 text-center mt-2">Jobs you save will appear here</Text>
                <TouchableOpacity onPress={() => router.push("/")} className="mt-6 bg-blue-600 px-6 py-3 rounded-xl">
                  <Text className="text-white font-medium">Browse Jobs</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#2563eb"]} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Favourite;
