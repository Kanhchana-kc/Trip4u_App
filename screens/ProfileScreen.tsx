import { useClerk, useUser } from '@clerk/clerk-expo';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import dayjs from 'dayjs';
import { HomeStackParamList } from '../navigation/HomeStack';
import * as ImagePicker from 'expo-image-picker';

// Define TabNavigatorParamList
export type TabNavigatorParamList = {
  Home: { screen?: string; params?: any };
  Guides: undefined;
  Profile: undefined;
};

// Combined navigation prop type
type ProfileScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  NativeStackNavigationProp<TabNavigatorParamList>
>;

const ProfileScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [trips, setTrips] = useState<any[]>([]);
  const [rawTrips, setRawTrips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // New state for profile image URI with cache buster
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // Sync local profileImageUri with user.imageUrl on mount or user update
  useEffect(() => {
    if (user?.imageUrl) {
      setProfileImageUri(user.imageUrl);
    }
  }, [user?.imageUrl]);

  const fetchTrips = useCallback(async () => {
    try {
      const clerkUserId = user?.id;
      if (!clerkUserId) {
        setError('User not authenticated');
        return;
      }

      const response = await axios.get('http://192.168.100.168:3000/api/trips', {
        params: { clerkUserId },
      });

      const formattedTrips = response.data.trips.map((trip: any) => ({
        id: trip._id,
        name: trip.tripName,
        date: `${dayjs(trip.startDate).format('D MMM')} – ${dayjs(
          trip.endDate
        ).format('D MMM, YYYY')}`,
        image: trip.background || 'https://via.placeholder.com/150',
        places: trip.placesToVisit?.length || 0,
        daysLeft: dayjs(trip.startDate).isAfter(dayjs())
          ? dayjs(trip.startDate).diff(dayjs(), 'day')
          : null,
      }));

      setTrips(formattedTrips);
      setRawTrips(response.data.trips);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      setError(
        error?.response?.data?.error?.toString() || 'Failed to fetch trips'
      );
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ fontSize: 18, color: '#888' }}>Please sign in</Text>
      </View>
    );
  }

  const email = user.primaryEmailAddress?.emailAddress || 'No email available';
  const name = user.fullName || 'Anonymous User';
  const handle = `@${user.username || user.id.slice(0, 8)}`;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign-out error:', JSON.stringify(err, null, 2));
    }
  };

  const handleEditProfile = async () => {
    setUploadError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        // @ts-ignore
        await user?.setProfileImage({ file: blob });
        // Update local state with cache buster to force image refresh
        setProfileImageUri(imageUri + '?t=' + Date.now());
      } catch (err) {
        setUploadError(
          'Failed to update profile image. Please check your connection and try again.'
        );
        console.error('Failed to update profile image:', err);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: '#ffe4e6',
            alignItems: 'center',
            paddingBottom: 24,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            position: 'relative',
          }}
        >
          {/* PRO Badge */}
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: '#facc15',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
              PRO
            </Text>
          </View>

          {/* Profile Image */}
          <View style={{ marginTop: 32, position: 'relative' }}>
            <Image
              source={{
                uri:
                  profileImageUri ||
                  'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
              }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#d1d5db',
              }}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={12} color="#555" />
            </TouchableOpacity>
          </View>
          {/* Show upload error */}
          {uploadError && (
            <View style={{ padding: 8 }}>
              <Text style={{ color: '#ef4444', fontSize: 13 }}>
                {uploadError}
              </Text>
            </View>
          )}

          {/* Name, Handle & Email */}
          <Text style={{ marginTop: 12, fontSize: 18, fontWeight: 'bold' }}>
            {name}
          </Text>
          <Text style={{ color: '#6b7280' }}>{handle}</Text>
          <Text style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
            {email}
          </Text>

          {/* Followers / Following */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 16,
            }}
          >
            <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>0</Text>
              <Text
                style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1 }}
              >
                FOLLOWERS
              </Text>
            </View>
            <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>0</Text>
              <Text
                style={{ fontSize: 12, color: '#6b7280', letterSpacing: 1 }}
              >
                FOLLOWING
              </Text>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#f97316',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              marginTop: 16,
            }}
            onPress={handleSignOut}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#f97316',
              fontWeight: 'bold',
              marginRight: 24,
            }}
          >
            Trips
          </Text>
          <Text style={{ fontSize: 14, color: '#9ca3af', marginRight: 'auto' }}>
            Guides
          </Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="swap-vertical-outline" size={16} color="#666" />
            <Text style={{ fontSize: 14, color: '#6b7280', marginLeft: 4 }}>
              Sort
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Trip Cards */}
        {trips.length === 0 && !error && (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Text style={{ color: '#6b7280', fontSize: 13 }}>
              No trips found. Create a new trip!
            </Text>
          </View>
        )}

        {trips.map((trip, index) => (
          <Pressable
            key={trip.id}
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'PlanTrip',
                params: { trip: rawTrips[index] },
              })
            }
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              backgroundColor: '#fff',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              marginHorizontal: 16,
              marginTop: 16,
              padding: 12,
            }}
          >
            <Image
              source={{ uri: trip.image }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              {trip.daysLeft && (
                <Text
                  style={{
                    fontSize: 12,
                    color: '#ea580c',
                    backgroundColor: '#ffedd5',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                    alignSelf: 'flex-start',
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}
                >
                  In {trip.daysLeft} days
                </Text>
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: 4,
                }}
              >
                {trip.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/32.jpg',
                  }}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  {trip.date} • {trip.places} places
                </Text>
              </View>
            </View>
            <Entypo name="dots-three-vertical" size={14} color="#999" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;