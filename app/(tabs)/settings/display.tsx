import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

const DisplayPage = () => {
  return (
    <View>
      <Stack.Screen options={{ headerTitle: 'Display' }} />
      <Text>Display page content</Text>
    </View>
  );
};

export default DisplayPage;