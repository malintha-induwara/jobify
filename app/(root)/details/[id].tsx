import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Briefcase, MapPin, Calendar, BookmarkPlus, ExternalLink } from "lucide-react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { saveJob, unsaveJob, checkJobSaved } from "@/store/savedJobsSlice";
import { Job, EmploymentType } from "@/hook/fetchData";

interface JobDetail {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_description: string;
  job_employment_type: string;
  job_posted_at_datetime_utc: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_apply_link?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchJobDetails();
    checkIfJobIsSaved();
  }, [id]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.request({
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/job-details`,
        headers: {
          "X-RapidAPI-Key": "e2761828bbmsh8b04a89d35c81f6p1a5075jsn1f75b2ecb4c4",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: {
          job_id: id,
          country: "us",
        },
      });

      setJobDetails(response.data.data[0]);
    } catch (err) {
      setError("Failed to load job details. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfJobIsSaved = async () => {
    if (id) {
      try {
        const resultAction = await dispatch(checkJobSaved(id as string));
        if (checkJobSaved.fulfilled.match(resultAction)) {
          setIsSaved(resultAction.payload);
        }
      } catch (error) {
        console.error("Error checking if job is saved:", error);
      }
    }
  };

  const handleSaveJob = async () => {
    if (!jobDetails) return;

    try {
      if (isSaved) {
        await dispatch(unsaveJob(jobDetails.job_id));
        setIsSaved(false);
        Alert.alert("Job Removed", "This job has been removed from your saved jobs.");
      } else {
        await dispatch(
          saveJob({
            ...jobDetails,
            job_employment_type: jobDetails.job_employment_type as EmploymentType,
          })
        );
        setIsSaved(true);
        Alert.alert("Job Saved", "This job has been saved to your profile.");
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      Alert.alert("Error", "There was an error updating your saved jobs. Please try again.");
    }
  };

  const handleApplyJob = () => {
    if (jobDetails?.job_apply_link) {
      Linking.openURL(jobDetails.job_apply_link);
    } else {
      Alert.alert("Apply Link Unavailable", "The application link for this job is not available.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0061FF" />
          <Text className="mt-4 text-gray-700">Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !jobDetails) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <ArrowLeft size={24} color="#0061FF" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center text-lg">{error || "Failed to load job details."}</Text>
          <TouchableOpacity onPress={fetchJobDetails} className="mt-4 bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <ArrowLeft size={24} color="#0061FF" />
          </TouchableOpacity>
          <View className="flex-row items-center mb-4">
            <Image
              source={{
                uri: jobDetails.employer_logo || "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
              }}
              className="w-16 h-16 rounded-xl"
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-900">{jobDetails.job_title}</Text>
              <Text className="text-gray-600">{jobDetails.employer_name}</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap">
            <View className="bg-blue-50 p-3 rounded-xl mr-3 mb-3 flex-row items-center">
              <Briefcase size={18} color="#0061FF" />
              <Text className="ml-2 text-blue-600 font-medium">{jobDetails.job_employment_type}</Text>
            </View>

            {(jobDetails.job_city || jobDetails.job_country) && (
              <View className="bg-blue-50 p-3 rounded-xl mr-3 mb-3 flex-row items-center">
                <MapPin size={18} color="#0061FF" />
                <Text className="ml-2 text-blue-600 font-medium">{[jobDetails.job_city, jobDetails.job_state, jobDetails.job_country].filter(Boolean).join(", ")}</Text>
              </View>
            )}

            <View className="bg-blue-50 p-3 rounded-xl mb-3 flex-row items-center">
              <Calendar size={18} color="#0061FF" />
              <Text className="ml-2 text-blue-600 font-medium">{formatDate(jobDetails.job_posted_at_datetime_utc)}</Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Job Description</Text>
          <Text className="text-gray-700 mb-6 leading-6">{jobDetails.job_description}</Text>

          {jobDetails.job_highlights?.Qualifications && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Qualifications</Text>
              {jobDetails.job_highlights.Qualifications.map((item, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-blue-600 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {jobDetails.job_highlights?.Responsibilities && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Responsibilities</Text>
              {jobDetails.job_highlights.Responsibilities.map((item, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-blue-600 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {jobDetails.job_highlights?.Benefits && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Benefits</Text>
              {jobDetails.job_highlights.Benefits.map((item, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-blue-600 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-100">
        <View className="flex-row">
          <TouchableOpacity onPress={handleSaveJob} className={`flex-1 mr-3 py-4 rounded-xl flex-row justify-center items-center ${isSaved ? "bg-blue-100" : "bg-blue-50"}`}>
            <BookmarkPlus size={20} color="#0061FF" />
            <Text className="ml-2 font-medium text-blue-600">{isSaved ? "Saved" : "Save Job"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleApplyJob} className="flex-1 bg-blue-600 py-4 rounded-xl flex-row justify-center items-center">
            <ExternalLink size={20} color="white" />
            <Text className="ml-2 font-medium text-white">Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JobDetails;
