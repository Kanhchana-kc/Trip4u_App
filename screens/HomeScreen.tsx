import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import WeekendTrips from "../components/WeekendTrips";
import FeaturedGuides from "../components/FeaturedGuides";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import PopularDestination from "../components/PopularDestination";

export type HomeStackParamList = {
  HomeMain: undefined;
  NewTrip: undefined;
  PlanTrip: { trip: any };
  AIChat: undefined;
  MapScreen: undefined;
};

export type TabNavigatorParamList = {
  Home: undefined;
  Guides: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList & TabNavigatorParamList
>;

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Top bar */}
        <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
          <Image
            source={require('../assets/logo.png')}
            className="w-32 h-20  "
            resizeMode="contain"
          />
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity className="p-2 bg-gray-200 rounded-full">
              <Text className="text-lg">🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-yellow-400 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-white">PRO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border-b border-gray-200 mx-4" />

        {/* Banner with overlay */}
        <View className="relative">
          <Image
            source={require('../assets/acc7e322862bf1f976beebefc10e0a60.jpg')}
            style={{ width: '100%', height: 256 }}
            resizeMode="cover"
          />

          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-white text-4xl font-bold text-center px-6">
              Plan your next adventure
            </Text>
            <TouchableOpacity
              className="bg-orange-500 px-6 py-2 rounded-full mt-4"
              //   onPress={() => navigation.navigate('NewTrip')}
            >
              <Text className="text-white font-semibold text-base">
                Create new trip plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured guides */}
        <View className="p-4">
          <Text className="text-2xl font-semibold mb-4">
            Featured guides from users
          </Text>
          <FeaturedGuides />
        </View>
        {/* Weeked Trip */}
        <View className="p-4">
          <Text className="text-2xl font-semibold mb-4">
            Weeked Trip
          </Text>
          <WeekendTrips />
        </View>
        {/* PopularDesnition */}
        <View className="p-4">
          <Text className="text-2xl font-semibold mb-4">
            Popular Destination
          </Text>
          <PopularDestination />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

