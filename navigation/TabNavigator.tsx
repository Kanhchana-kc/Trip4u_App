import { StyleSheet, Platform } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useColorScheme } from 'react-native'

import HomeStack from './HomeStack'
import GuideStack from './GuideStack'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const colorScheme = useColorScheme()

  const activeColor = colorScheme === 'dark' ? '#4CAF50' : '#007AFF'
  const inactiveColor = colorScheme === 'dark' ? '#888' : '#777'
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#fff'

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 0,
          elevation: 8, // shadow on Android
          shadowOpacity: 0.1, // shadow on iOS
          height: Platform.OS === 'android' ? 65 : 80, // taller for phone screens
          paddingBottom: Platform.OS === 'android' ? 8 : 20,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuideStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})
