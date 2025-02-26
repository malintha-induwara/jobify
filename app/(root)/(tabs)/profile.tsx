import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Settings, Heart, CreditCard, HelpCircle, LogOut } from 'lucide-react-native';
import { RootState } from '@/store';
import { logout } from '@/lib/auth';
import { logoutUser } from '@/store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await logout();
    dispatch(logoutUser());
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
      >
        <Text className="text-2xl font-bold mt-6 text-gray-900">Profile</Text>

        <View className="mt-6 bg-blue-50 rounded-2xl p-6">
          <View className="items-center">
            <View className="bg-blue-600 rounded-full p-4">
              <User size={40} color="white" strokeWidth={1.5} />
            </View>
               <Text className="mt-4 text-xl font-bold text-gray-900">
              {user.user_metadata.name}
            </Text>
          </View>

          <View className="mt-6 space-y-4">
            <View className="flex-row items-center space-x-3">
              <Mail size={20} color="#2563eb" />
              <Text className="text-gray-700">{user.email}</Text>
            </View>
            <View className="flex-row items-center space-x-3">
              <Phone size={20} color="#2563eb" />
              <Text className="text-gray-700">{user.phone || 'No phone added'}</Text>
            </View>
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Account Settings</Text>
          
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <Settings size={22} color="#2563eb" />
            <Text className="ml-3 text-gray-700 flex-1">Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <Heart size={22} color="#2563eb" />
            <Text className="ml-3 text-gray-700 flex-1">Saved Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <HelpCircle size={22} color="#2563eb" />
            <Text className="ml-3 text-gray-700 flex-1">Help & Support</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="mt-8 mb-6 flex-row items-center py-4 px-6 bg-red-50 rounded-xl"
        >
          <LogOut size={22} color="#ef4444" />
          <Text className="ml-3 text-red-500 font-semibold">Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;