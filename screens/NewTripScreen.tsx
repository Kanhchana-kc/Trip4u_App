// Polyfill for UUID randomness — must be first
import 'react-native-get-random-values';

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, DateObject } from 'react-native-calendars';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { useTrip } from '../context/TripContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth, useUser } from '@clerk/clerk-expo';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.168:3000'; // Use your local backend IP and port

// Fixed Wikimedia static map URL generator (correct URL format)
const getOSMStaticMapURL = (
  lat: number,
  lon: number,
  zoom = 14,
  width = 400,
  height = 300
) => {
  return `https://maps.wikimedia.org/img/osm-intl/${zoom}/${lat}/${lon}/${width}x${height}.png`;
};

// Fetch Wikimedia image URL by place name
const fetchPlaceImageFromWikimedia = async (placeName: string) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(
      placeName
    )}&piprop=original&origin=*`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const pages = data.query?.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    return page?.original?.source || null;
  } catch (err) {
    console.error('Wikimedia image fetch error:', err);
    return null;
  }
};

// Fetch Wikimedia coordinates by place name
const fetchPlaceCoordinatesFromWikimedia = async (placeName: string) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates&titles=${encodeURIComponent(
      placeName
    )}&origin=*`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const pages = data.query?.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    if (!page?.coordinates || page.coordinates.length === 0) return null;

    const { lat, lon } = page.coordinates[0];
    return { lat, lon };
  } catch (err) {
    console.error('Wikimedia coordinates fetch error:', err);
    return null;
  }
};

// Fetch both Wikimedia image URL and map URL by place name
const fetchPlaceImageAndMapFromWikimedia = async (placeName: string) => {
  try {
    const imageUrl = await fetchPlaceImageFromWikimedia(placeName);
    const coords = await fetchPlaceCoordinatesFromWikimedia(placeName);
    const mapUrl = coords ? getOSMStaticMapURL(coords.lat, coords.lon) : null;
    return { imageUrl, mapUrl };
  } catch (err) {
    console.error('Fetch place image and map error:', err);
    return { imageUrl: null, mapUrl: null };
  }
};

const NewTripScreen = () => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [displayStart, setDisplayStart] = useState('');
  const [displayEnd, setDisplayEnd] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [chosenLocation, setChosenLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Hold Wikimedia images
  const [placeImage, setPlaceImage] = useState<string | null>(null);
  const [mapImage, setMapImage] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addTrip } = useTrip();
  const { getToken } = useAuth();
  const { user } = useUser();

  const today = dayjs().format('YYYY-MM-DD');

  const handleDayPress = (day: DateObject) => {
    const selected = day.dateString;

    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      setSelectedRange({ startDate: selected });
    } else if (
      selectedRange.startDate &&
      dayjs(selected).isAfter(selectedRange.startDate)
    ) {
      setSelectedRange({
        ...selectedRange,
        endDate: selected,
      });
    }
  };

  const getMarkedDates = () => {
    const marks: any = {};

    const { startDate, endDate } = selectedRange;
    if (startDate && !endDate) {
      marks[startDate] = {
        startingDay: true,
        endingDay: true,
        color: '#FF5722',
        textColor: 'white',
      };
    } else if (startDate && endDate) {
      let curr = dayjs(startDate);
      const end = dayjs(endDate);

      while (curr.isBefore(end) || curr.isSame(end)) {
        const formatted = curr.format('YYYY-MM-DD');
        marks[formatted] = {
          color: '#FF5722',
          textColor: 'white',
          ...(formatted === startDate && { startingDay: true }),
          ...(formatted === endDate && { endingDay: true }),
        };
        curr = curr.add(1, 'day');
      }
    }

    return marks;
  };

  const onSaveDates = () => {
    if (selectedRange.startDate) setDisplayStart(selectedRange.startDate);
    if (selectedRange.endDate) setDisplayEnd(selectedRange.endDate);
    setCalendarVisible(false);
  };

  const onCancelDates = () => {
    setSelectedRange({});
    setCalendarVisible(false);
  };

  // Debounce helper
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSearchResults = async (text: string) => {
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(
          text
        )}`,
        {
          headers: {
            'User-Agent': 'MyTripPlannerApp/1.0 (contact@myemail.com)',
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('OSM Search HTTP error:', res.status, errorText);
        setSearchResults([]);
        return;
      }

      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('OSM Search Error:', err);
      setSearchResults([]);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 400), []);

  // When user selects a location from search results
  const onSelectLocation = async (locationName: string) => {
    setChosenLocation(locationName);
    setSearchVisible(false);
    setPlaceImage(null);
    setMapImage(null);

    // Fetch images from Wikimedia when location is chosen
    try {
      const { imageUrl, mapUrl } = await fetchPlaceImageAndMapFromWikimedia(
        locationName
      );
      setPlaceImage(imageUrl);
      setMapImage(mapUrl);
    } catch (err) {
      console.warn('Error fetching images:', err);
    }
  };

  const handleCreateTrip = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (
        !chosenLocation ||
        !selectedRange.startDate ||
        !selectedRange.endDate
      ) {
        setError('Please select a location and date range');
        setIsLoading(false);
        return;
      }

      const clerkUserId = user?.id;
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!clerkUserId || !email) {
        setError('User not authenticated or email missing');
        setIsLoading(false);
        return;
      }

      const background = placeImage || 'https://via.placeholder.com/150';
      const map =
        mapImage || 'https://via.placeholder.com/400x150?text=No+Map+Available';

      const tripData = {
        tripName: chosenLocation,
        startDate: selectedRange.startDate,
        endDate: selectedRange.endDate,
        startDay: dayjs(selectedRange.startDate).format('dddd'),
        endDay: dayjs(selectedRange.endDate).format('dddd'),
        background,
        mapImage: map,
        clerkUserId,
        userData: {
          email,
          name: user?.fullName || '',
        },
      };

      const token = await getToken();

      const response = await axios.post(`${API_BASE_URL}/api/trips`, tripData, {
        headers: {
          Authorization: `Bearer ${token}`, // replace token with your actual token
        },
      });

      const createdTrip = response.data.trip;

      addTrip(createdTrip);

      navigation.navigate('PlanTrip', { trip: createdTrip });
    } catch (error: any) {
      console.error('Error creating trip:', error);
      setError(error.response?.data?.error || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      {/* Close Button */}
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Title and Subtitle */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        Plan a new trip
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
        Build an itinerary and map out your upcoming travel plans
      </Text>

      {/* Where to Input */}
      <TouchableOpacity
        onPress={() => setSearchVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: '600', color: '#444', marginBottom: 6 }}>
          Where to?
        </Text>
        <Text style={{ color: '#999' }}>
          {chosenLocation || 'e.g., Paris, Hawaii, Japan'}
        </Text>
      </TouchableOpacity>

      {/* Display Wikimedia images */}
      {(placeImage || mapImage) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20, flexDirection: 'row', gap: 10 }}
        >
          {placeImage && (
            <Image
              source={{ uri: placeImage }}
              style={{
                width: 150,
                height: 100,
                borderRadius: 8,
                marginRight: 10,
              }}
              resizeMode="cover"
            />
          )}
          {mapImage && (
            <Image
              source={{ uri: mapImage }}
              style={{ width: 150, height: 100, borderRadius: 8 }}
              resizeMode="cover"
            />
          )}
        </ScrollView>
      )}

      {/* Date Inputs */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 12,
          padding: 14,
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        onPress={() => setCalendarVisible(true)}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontWeight: '600', color: '#444', marginBottom: 6 }}>
            Dates (optional)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="calendar"
              size={16}
              color="#666"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: '#999' }}>
              {displayStart
                ? dayjs(displayStart).format('MMM D')
                : 'Start date'}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: '600',
              color: '#444',
              marginBottom: 6,
              opacity: 0,
            }}
          >
            .
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="calendar"
              size={16}
              color="#666"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: '#999' }}>
              {displayEnd ? dayjs(displayEnd).format('MMM D') : 'End date'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error && <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>}

      {/* Start Planning Button */}
      <TouchableOpacity
        onPress={handleCreateTrip}
        style={{
          backgroundColor: '#FF5722',
          borderRadius: 30,
          paddingVertical: 14,
          alignItems: 'center',
          marginBottom: 16,
          opacity: isLoading ? 0.7 : 1,
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Start planning
          </Text>
        )}
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal animationType="slide" transparent visible={calendarVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              overflow: 'hidden',
              paddingBottom: 10,
            }}
          >
            <Calendar
              markingType={'period'}
              markedDates={getMarkedDates()}
              onDayPress={handleDayPress}
              minDate={today}
              theme={{
                todayTextColor: '#FF5722',
                arrowColor: '#FF5722',
                selectedDayTextColor: '#fff',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                borderTopWidth: 1,
                borderTopColor: '#ddd',
              }}
            >
              <Pressable
                style={{
                  flex: 1,
                  padding: 16,
                  alignItems: 'center',
                  borderRightWidth: 1,
                  borderRightColor: '#ddd',
                }}
                onPress={onCancelDates}
              >
                <Text style={{ color: '#555', fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{ flex: 1, padding: 16, alignItems: 'center' }}
                onPress={onSaveDates}
              >
                <Text style={{ color: '#555', fontWeight: '600' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal animationType="fade" visible={searchVisible}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: 'white', padding: 16 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setSearchVisible(false)}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Search for a place
            </Text>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Type a place name..."
            onChangeText={debouncedSearch}
            style={{
              backgroundColor: '#f1f1f1',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginBottom: 10,
            }}
          />

          {/* Search Results */}
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectLocation(item.display_name)}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default NewTripScreen;
