import { Job } from "@/store/jobsSlice";
import { useRouter } from "expo-router";
import { BookmarkPlus, Check } from "lucide-react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";

interface JobCardProps {
  job: Job;
  onSave: (job: Job, isSaved: boolean) => void;
  isSaved: boolean;
}

export const JobCard = ({ job, onSave, isSaved }: JobCardProps) => {
  const router = useRouter();

  const handleJobPress = () => {
    router.push(`/details/${job.job_id}`);
  };

  return (
    <TouchableOpacity className="bg-white p-4 rounded-xl mb-3 border border-gray-100" onPress={handleJobPress}>
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
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onSave(job, isSaved);
          }}
          className="p-2"
        >
          {isSaved ? <Check size={20} color="#2563eb" /> : <BookmarkPlus size={20} color="#2563eb" />}
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
    </TouchableOpacity>
  );
};
