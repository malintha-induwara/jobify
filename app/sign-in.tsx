import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { Redirect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/authSlice";
import { ScrollView } from "react-native";
import  LoginImage  from "@/assets/images/login.png";
import Google from "@/assets/images/google.png";



export default function SignIn() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) return <Redirect href="/" />;

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      dispatch(setUser(user));
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-6">
        <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={LoginImage}
          className="w-full h-4/6 mx-auto"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To Jobify
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You
            <Text className="text-blue-600"> A Job</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to Jobify with Google
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-blue-600 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={Google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg text-white font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}
