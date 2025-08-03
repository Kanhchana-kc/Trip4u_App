import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React from 'react';

const destinations = [
  {
    name: 'Cambodia',
    image:
      'https://i.pinimg.com/1200x/a4/0d/5b/a40d5b008f9c0b698d6ced5759d9fe30.jpg',
  },
  {
    name: 'New York',
    image:
      'https://i.pinimg.com/1200x/01/64/6d/01646db9d878ac3f59d272f6877598cf.jpg',
  },
  {
    name: 'Paris',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
  },
  {
    name: 'Tokyo',
    image:
      'https://i.pinimg.com/736x/67/6f/6a/676f6a242558b7c08f7d2a63fb951b2e.jpg',
  },
  {
    name: 'London',
    image:
      'https://i.pinimg.com/736x/3c/e1/37/3ce13726cd35a17a0650fe095a1ff67e.jpg',
  },
  {
    name: 'Sydney',
    image:
      'https://i.pinimg.com/1200x/18/40/ed/1840ed855d970fe2cf62105742ce7171.jpg',
  },
];

const PopularDestination = () => {
  return (
    <View className="mt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {destinations.map((place, index) => (
          <View key={index} className="w-40 mr-4 rounded-2xl overflow-hidden">
            <View className="relative">
              <Image
                source={{ uri: place.image }}
                className="w-40 h-52 rounded-2xl"
                resizeMode="cover"
              />

              {/* Overlay for name */}
              <View className="absolute bottom-0 left-0 right-0 bg-black/20 px-2 py-1">
                <Text className="text-white font-bold text-xl">
                  {place.name}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PopularDestination;

const styles = StyleSheet.create({});
