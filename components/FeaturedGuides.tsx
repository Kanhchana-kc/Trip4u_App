import { ScrollView, StyleSheet, View, Image, Text } from 'react-native';
import React from 'react';

type Guides = {
  place: string;
  Description: string;
  image: any; // require() returns a number
  user: {
    name: string;
    avatar: any; // also require() for local images
    views: number;
  };
};

const guides: Guides[] = [
  {
    place: 'Paris',
    Description: 'A guide to the best places in Paris',
    image: require('../assets/p.jpg'),
    user: {
      name: 'John Doe',
      avatar: require('../assets/p-1.jpg'), // FIXED
      views: 1000,
    },
  },
  {
    place: 'New York',
    Description: 'Explore the city that never sleeps',
    image: require('../assets/N.jpg'),
    user: {
      name: 'Jane Smith',
      avatar: require('../assets/p-2.jpg'), // FIXED
      views: 2000,
    },
  },
  {
    place: 'Tokyo',
    Description: 'Discover the vibrant culture of Tokyo',
    image: require('../assets/t.jpg'),
    user: {
      name: 'Akira Tanaka',
      avatar: require('../assets/p.jpg'), // FIXED
      views: 1500,
    },
  },
];

const FeaturedGuides = () => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {guides.map((guide) => (
          <View
            key={guide.place}
            className="w-64 mr-4 rounded-2xl overflow-hidden bg-white shadow-lg"
          >
            <Image
              className="w-full h-40"
              resizeMode="cover"
              source={guide.image}
            />
            <View className="py-3 px-4">
              <Text className="text-base font-bold text-gray-900">
                {guide.place}
              </Text>
              <Text className="text-xs text-gray-600 bg-gray-100 rounded-lg px-2 py-1 mt-2">
                {guide.Description}
              </Text>

              {/* User info */}
              <View className="flex-row items-center mt-3">
                <Image
                  source={guide.user.avatar} // FIXED: no uri here
                  className="w-8 h-8 rounded-full mr-2"
                />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">
                    {guide.user.name}
                  </Text>
                  <Text className="text-[11px] text-gray-500">
                    {guide.user.views} views
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedGuides;

const styles = StyleSheet.create({});
