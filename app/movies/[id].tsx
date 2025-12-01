import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MovieDetails() {
  const { id } = useLocalSearchParams(); 
  return (
    <View>
      <Text>MovieDetails: {id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})