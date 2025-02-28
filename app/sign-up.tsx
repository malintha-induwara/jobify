import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Redirect, Link } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/authSlice";
import { ScrollView } from "react-native";
import SignUpImage from "@/assets/images/login.png";

export default function SignUp() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Redirect href="/" />;

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        Alert.alert("Sign Up Failed", error.message);
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
        Alert.alert("Verification Email Sent", "Please check your email to verify your account");
      }
    } catch (error) {
      Alert.alert("Sign Up Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-6">
      <ScrollView>
        <Image source={SignUpImage} className="w-full h-48 mx-auto" resizeMode="contain" />
        <View className="px-5">
          <Text className="text-base text-center uppercase font-rubik text-black-200">Join Jobify</Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Create Your
            <Text className="text-blue-600"> Account</Text>
          </Text>

          <View className="mt-6">
            <Text className="text-base font-rubik text-black-200 mb-1">Full Name</Text>
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Enter your full name" className="bg-gray-100 rounded-lg py-3 px-4 mb-3 text-black-300" />

            <Text className="text-base font-rubik text-black-200 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-100 rounded-lg py-3 px-4 mb-3 text-black-300"
            />

            <Text className="text-base font-rubik text-black-200 mb-1">Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry className="bg-gray-100 rounded-lg py-3 px-4 mb-3 text-black-300" />

            <Text className="text-base font-rubik text-black-200 mb-1">Confirm Password</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password" secureTextEntry className="bg-gray-100 rounded-lg py-3 px-4 mb-3 text-black-300" />

            <TouchableOpacity onPress={handleSignUp} className="bg-blue-600 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-4" disabled={loading}>
              <Text className="text-lg text-white font-rubik-medium text-center">{loading ? "Creating Account..." : "Sign Up"}</Text>
            </TouchableOpacity>

            <View className="flex flex-row justify-center mt-6 mb-8">
              <Text className="text-black-200 font-rubik">Already have an account? </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-rubik-medium">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
