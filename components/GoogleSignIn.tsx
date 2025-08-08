import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useOAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  useWarmUpBrowser();

  const onGoogleSignInPress = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/'),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      } else {
        setError('Google sign-in incomplete, please try again.');
      }
    } catch (err: any) {
      console.log('Error', err);
      setError(err?.errors?.[0]?.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={{ width: '100%' }}>
      {error ? (
        <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginBottom: 8 }}>
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={onGoogleSignInPress}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          paddingVertical: 12,
          marginTop: 12,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FF522" />
        ) : (
          <>
            <Image
              source={{
                uri: 'https://i.pinimg.com/1200x/59/7f/11/597f11b631d7d94492f1adb95110cc44.jpg',
              }}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text style={{ color: '#333', fontSize: 16, fontWeight: '600' }}>
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
