import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import dayjs from 'dayjs';
import { HomeStackParamList } from '../navigation/HomeStack';

const PlanTripScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, 'PlanTrip'>>();
  const { trip: initialTrip } = route.params;
  const [trip] = useState(initialTrip || {});
  const { user, isLoaded } = useUser();

  const fallbackBackground = 'https://via.placeholder.com/600x250';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: trip.background || fallbackBackground }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.overlay}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Trip Info */}
          <View style={styles.tripInfo}>
            <Text style={styles.tripName}>
              Trip to {trip.tripName || 'Unknown'}
            </Text>
            <Text style={styles.tripDates}>
              {trip.startDate ? dayjs(trip.startDate).format('MMM D') : 'N/A'} -{' '}
              {trip.endDate ? dayjs(trip.endDate).format('MMM D') : 'N/A'}
            </Text>
          </View>

          {/* User Profile Image */}
          <View style={styles.userImageContainer}>
            <Image
              source={{
                uri:
                  isLoaded && user?.imageUrl
                    ? user.imageUrl
                    : 'https://randomuser.me/api/portraits/women/1.jpg',
              }}
              style={styles.userImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 192, // 48 * 4 (similar to h-48 in tailwind)
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  tripDates: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  userImageContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
});

export default PlanTripScreen;
