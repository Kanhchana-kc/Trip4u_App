import { StyleSheet } from 'react-native'
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

  return (
     <Tab.Navigator >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons 
              name="home" 
              size={size} 
              color={colorScheme === 'dark' ? 'white' : 'black'} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Guides" 
        component={GuideStack} 
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons 
              name="book" 
              size={size} 
              color={colorScheme === 'dark' ? 'white' : 'black'} 
            />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons 
              name="person" 
              size={size} 
              color={colorScheme === 'dark' ? 'white' : 'black'} 
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({})
