import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Redirect, Link } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/authSlice";
import { ScrollView } from "react-native";
import LoginImage from "@/assets/images/login.png";

export default function SignIn() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Redirect href="/" />;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (data.user) {
        dispatch(setUser(data.user));
      }
    } catch (error) {
      Alert.alert("Login Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-6">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image source={LoginImage} className="w-full h-2/5 mx-auto" resizeMode="contain" />
        <View className="px-5">
          <Text className="text-base text-center uppercase font-rubik text-black-200">Welcome To Jobify</Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Find Your Perfect
            <Text className="text-blue-600">Dream Job</Text>
          </Text>

          <View className="mt-8">
            <Text className="text-base font-rubik text-black-200 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-100 rounded-lg py-3 px-4 mb-4 text-black-300"
            />

            <Text className="text-base font-rubik text-black-200 mb-1">Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry className="bg-gray-100 rounded-lg py-3 px-4 mb-2 text-black-300" />

            <TouchableOpacity onPress={handleLogin} className="bg-blue-600 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5" disabled={loading}>
              <Text className="text-lg text-white font-rubik-medium text-center">{loading ? "Signing in..." : "Sign In"}</Text>
            </TouchableOpacity>

            <View className="flex flex-row justify-center mt-6">
              <Text className="text-black-200 font-rubik">Don't have an account? </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-rubik-medium">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
