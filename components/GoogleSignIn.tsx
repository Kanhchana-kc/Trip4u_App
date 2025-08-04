import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <View className="w-full">
      {error ? (
        <Text className="text-red-500 text-sm text-font-center md-3">
          {error}
        </Text>
      ) : null}
      <TouchableOpacity className="w-full border boder-gray-300 py-3 mt-3 rounded-lg flex-row justify-center items-center">
        {loading ? (
          <ActivityIndicator color="#FF522" />
        ) : (
          <>
            <Image
              source={{
                uri: 'https://i.pinimg.com/1200x/59/7f/11/597f11b631d7d94492f1adb95110cc44.jpg',
              }}
              className="w-5 h-5 mr-2"
            />
            <Text className="text-gray-900 text-base font-semibold">
              Sign In with Google
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GoogleSignIn;

const styles = StyleSheet.create({});
