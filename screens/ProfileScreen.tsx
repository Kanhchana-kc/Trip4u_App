import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'

const ProfileScreen = () => {
  const {signOut} = useClerk();
  const handleSignout = async ()=>{
    try{
      await signOut();

    }catch(err){
      console.log("Error ",err)
    }
  }
  return (
    <SafeAreaView>
      <Text>ProfileScreen</Text>
      <Pressable onPress={handleSignout}>
        <Text>Logout</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})