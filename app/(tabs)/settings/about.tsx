import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

const AboutPage = () => {
  return (
    <View>
      <Stack.Screen options={{ headerTitle: 'About' }} />
      <Text>About page content</Text>
    </View>
  );
};

export default AboutPage;