import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { GuideStackParamList } from '../navigation/GuideStack';
import Ionicons from '@expo/vector-icons/Ionicons';

type GuideDetailScreenRouteProp = RouteProp<GuideStackParamList, 'GuideDetail'>;

type Props = {
  route: GuideDetailScreenRouteProp;
  navigation: any;
};

const itineraries: { [key: string]: string[] } = {
  Battambang: [
    'Day 1: Ride the Bamboo Train and visit local villages.',
    'Day 2: Visit Phnom Sampeau, the Killing Caves, and watch the bat cave at sunset.',
    'Day 3: Explore Wat Ek Phnom and stroll along the Sangker River.',
  ],

  'Siem Reap': [
    'Day 1: Arrive in Siem Reap. Explore Pub Street and local markets.',
    'Day 2: Sunrise at Angkor Wat, visit Angkor Thom and Bayon Temple.',
    'Day 3: Visit Ta Prohm and Tonle Sap floating villages.',
  ],

  Tokyo: [
    'Day 1: Visit Senso-ji Temple in Asakusa and explore traditional streets.',
    'Day 2: Shibuya Crossing, Meiji Shrine, and Harajuku shopping.',
    'Day 3: Take a day trip to Mount Fuji or Disneyland Tokyo.',
  ],

  'Mysore Palace': [
    'Day 1: Arrive in Mysore, check in to your hotel, and visit Mysore Palace. In the evening, enjoy the palace illumination.',
    'Day 2: Morning trip to Chamundi Hills to see the Chamundeshwari Temple and the Nandi Bull statue. Afternoon visit to St. Philomena’s Church and the Mysore Rail Museum.',
    'Day 3: Take a day trip to Srirangapatna to explore Ranganathaswamy Temple, Tipu Sultan’s Summer Palace, and Gumbaz Mausoleum. Return to Mysore in the evening.',
    'Day 4: Spend the morning at Mysore Zoo. In the afternoon, shop for silk sarees, sandalwood products, and handicrafts at Devaraja Market.',
    'Day 5: Visit Brindavan Gardens in the morning. Relax for the rest of the day and prepare for departure or continue your journey to Coorg or Bangalore.',
  ],

  Jaipur: [
    'Day 1: Arrive in Jaipur. Evening visit to Birla Mandir and explore local markets.',
    'Day 2: Visit Amber Fort, Jaigarh Fort, and Nahargarh Fort.',
    'Day 3: City Palace, Jantar Mantar, and Hawa Mahal. Evening shopping at Johari Bazaar.',
    'Day 4: Day trip to Abhaneri Stepwell and Bhangarh Fort. Return to Jaipur.',
    'Day 5: Albert Hall Museum and local handicraft shopping before departure.',
  ],

  Agra: [
    'Day 1: Arrive in Agra. Sunset view of the Taj Mahal from Mehtab Bagh.',
    'Day 2: Early morning visit to the Taj Mahal. Explore Agra Fort afterward.',
    'Day 3: Day trip to Fatehpur Sikri (Buland Darwaza, Panch Mahal).',
    'Day 4: Visit Itmad-ud-Daula Tomb (Baby Taj) and explore local marble handicrafts.',
    'Day 5: Relax, explore local cuisine, and departure.',
  ],

  'Angkor Wat': [
    'Day 1: Arrive in Siem Reap, Cambodia. Evening visit to Pub Street and night markets.',
    'Day 2: Sunrise at Angkor Wat, explore Angkor Thom (Bayon Temple, Terrace of the Elephants).',
    'Day 3: Visit Ta Prohm (Tomb Raider Temple) and Preah Khan. Sunset at Phnom Bakheng.',
    'Day 4: Explore Banteay Srei and the Cambodian Landmine Museum.',
    'Day 5: Floating villages on Tonle Sap Lake. Relax and departure.',
  ],
};

const additionalAttributes: {
  [key: string]: { entryFee: string; travelTrip: string[] };
} = {
  Battambang: {
    entryFee: 'USD 5 for main attractions',
    travelTrip: [
      'Best time to visit: November to February',
      'Try the Bamboo Train!',
      'Visit Phnom Sampeau for sunset.',
    ],
  },
  'Siem Reap': {
    entryFee: 'USD 37 (1-day Angkor Pass)',
    travelTrip: [
      'Best time: November to March',
      'Plan your visit early morning to avoid the heat.',
    ],
  },
  Tokyo: {
    entryFee: 'Most attractions are free; some temples charge small fees',
    travelTrip: [
      'Best time: March–May or October–November',
      'Use a prepaid transit card (Suica or Pasmo) for convenience.',
    ],
  },
};

const GuideDetailScreen = ({ route, navigation }: Props) => {
  const { place } = route?.params;
  const itinerary = itineraries[place.name] || [];
  const extraAttributes = additionalAttributes[place.name] || {
    entryFee: 'N/A',
    travelTrip: [],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <ImageBackground
          style={{ width: '100%', height: 200 }}
          source={{ uri: place.image }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              left: 20,
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: 8,
              borderRadius: 20,
            }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </ImageBackground>

        <View className="p-4">
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              About
            </Text>
            <Text className="text-base font-medium text-gray-800">
              {place.description}
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Detail
            </Text>
            <View className="flex-row items-center mb-3">
              <Ionicons name="location-outline" size={24} color="#FF5722" />
              <Text className="text-gray-800 text-base font-medium ml-3">
                Location: {place.attributes.location}
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
                {Array.isArray(place.attributes.attractions)
                  ? place.attributes.attractions.join(', ')
                  : place.attributes.attractions}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="cash-outline" size={16} color="#FF5722" />
              <Text className="text-gray-800 text-sm font-medium ml-2">
                Entry Fee: {extraAttributes.entryFee}
              </Text>
            </View>
          </View>
        </View>

        {itinerary.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              Suggested Itineraries
            </Text>
            {itinerary.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    lineHeight: 24,
                    marginRight: 8,
                  }}
                >
                  •
                </Text>
                <Text style={{ flex: 1, fontSize: 16, lineHeight: 22 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}
        {extraAttributes.travelTrip.length > 0 && (
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3
            ">
              Travel Tips
            </Text>

            {extraAttributes.travelTrip.map((trip, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-gray-800 text-lg font-bold mr-2">•</Text>
                <Text className="text-gray-800 text-base font-medium flex-1">
                  {trip}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuideDetailScreen;

const styles = StyleSheet.create({});
