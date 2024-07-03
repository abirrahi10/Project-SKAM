import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

const AccountPage = () => {
  return (
    <View>
      <Stack.Screen options={{ headerTitle: 'Account' }} />
      <Text>Account page content</Text>
    </View>
  );
};

export default AccountPage;