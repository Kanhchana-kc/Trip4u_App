import {
  Dimensions,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const places = [
  {
    id: '1',
    name: 'Battambang',
    image:
      'https://i.pinimg.com/736x/2b/3f/db/2b3fdb69d5a41341a175caac4241820c.jpg',
    description: 'Discover the best places to visit in Battambang.',
    attributes: {
      location: 'Northwest Cambodia',
      type: 'City & Cultural',
      bestTime: 'November to February',
      attractions: ['Phnom Sampeau', 'Bamboo Train', 'Wat Ek Phnom'],
    },
  },
  {
    id: '2',
    name: 'Siem Reap',
    image:
      'https://i.pinimg.com/736x/c6/27/ea/c627ea9bb054eacbb8e442cd05764ae9.jpg',
    description: 'Explore the ancient temples and vibrant culture.',
    attributes: {
      location: 'Northwest Cambodia',
      type: 'Historical & Tourist',
      bestTime: 'November to March',
      attractions: ['Angkor Wat', 'Angkor Thom', 'Tonle Sap Lake'],
    },
  },
  {
    id: '3',
    name: 'Tokyo',
    image:
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&auto=format&fit=crop',
    description:
      'Discover the vibrant culture and bustling city life of Tokyo.',
    attributes: {
      location: 'Tokyo',
      type: 'Historical & Tourist',
      bestTime: 'November to March',
      attractions: [
        'Shibuya Crossing',
        'Tokyo Tower',
        'Senso-ji Temple',
        'Meiji Shrine',
      ],
    },
  },
];

const GuideScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">
            Explore Battambang
          </Text>
          <Text className="text-sm font-medium text-gray-700 mt-1">
            Discover the best places to visit in Battambang
          </Text>
        </View>

        {places.map((place) => (
          <Pressable
            key={place.id}
            onPress={() => navigation.navigate("GuideDetail", { place })}

            style={styles.card}
            className="mx-4 mt-4 rounded-xl overflow-hidden shadow-sm"
          >
            <ImageBackground
              source={{ uri: place.image }}
              style={{ height: 200, justifyContent: 'flex-end' }}
              imageStyle={{ borderRadius: 15 }}
            >
              <View className="bg-black bg-opacity-50 p-4 rounded-b-lg">
                <Text className="text-white text-xl font-bold">
                  {place.name}
                </Text>
                <Text className="text-white text-sm mt-1">
                  {place.description}
                </Text>
              </View>
            </ImageBackground>
            <View className="bg-white p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#FF5722" />
                <Text className="text-gray-800 text-sm font-medium ml-2">
                  {place.attributes.location}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="map-outline" size={16} color="#FF5722" />
                <Text className="text-gray-800 text-sm font-medium ml-2">
                  {place.attributes.type}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={16} color="#FF5722" />
                <Text className="text-gray-800 text-sm font-medium ml-2">
                  {place.attributes.bestTime}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="star-outline" size={16} color="#FF5722" />
                <Text className="text-gray-800 text-sm font-medium ml-2">
                  {place.attributes.attractions.join(', ')}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuideScreen;

const styles = StyleSheet.create({
  image: {
    height: '56%',
  },
  card: {
    height: Dimensions.get('window').height * 0.5,
    marginBottom: 16,
  },
});
