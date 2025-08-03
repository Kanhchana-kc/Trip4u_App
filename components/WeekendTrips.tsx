import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';

const weekendTrips = [
  {
    name: 'Siem Reap',
    image:
      'https://i.pinimg.com/736x/d8/e2/73/d8e2734f015b345538124ff956d1f5aa.jpg',
  },
  {
    name: 'Phnom Penh',
    image:
      'https://i.pinimg.com/736x/f7/e5/f7/f7e5f790913aaad233891739740df030.jpg',
  },
  {
    name: 'Kampot',
    image:
      'https://i.pinimg.com/736x/52/13/89/521389d9e6ed918029343584df51eed5.jpg',
  },
  {
    name: 'Battambong',
    image:
      'https://i.pinimg.com/736x/ff/6d/a9/ff6da94e1d64544b15fa958d4e17be1c.jpg',
  },
  {
    name: 'Kep',
    image:
      'https://i.pinimg.com/736x/d6/02/6e/d6026ede73de3cd9cf2f96917681eefd.jpg',
  },
  {
    name: 'Sihanoukville',
    image:
      'https://i.pinimg.com/736x/11/99/10/1199101d35032b8fd59d541ab0b834bf.jpg',
  },
  {
    name: 'Mondulkiri',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop',
  },
];

const WeekendTrips = () => {
  return (
    <View className="mt-6">
      <Text className="text-xl font-bold px-4 mb-3">Weekend Trips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekendTrips.map((place, index) => (
          <View key={index} className="w-40 mr-4 rounded-2xl overflow-hidden">
            <View className="relative">
              <Image
                source={{ uri: place.image }}
                className="w-40 h-52 rounded-2xl"
                resizeMode="cover"
              />
              {/* Overlay name */}
              <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1">
                <Text className="text-white font-bold text-lg">
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

export default WeekendTrips;

const styles = StyleSheet.create({});
