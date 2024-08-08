import React from 'react';
import { ScrollView, View, Text, useColorScheme, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useDarkMode } from '../../DarkModeContext';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    marginBottom: 0,
    textAlign: 'left',
  },
});

interface Instruction {
  key: string;
  text: string;
}

const HowToPage = () => {
  const { isDarkMode } = useDarkMode();

  const makeCard: Instruction[] = [
    { key: '1', text: 'In the "Your Cards" tab, press the + sign to add a card.' },
    { key: '2', text: 'You will then be able to decide which type you want.' },
    { key: '3', text: 'Take a look through all 3 types and decide which one you want to make first.' },
    { key: '4', text: 'Once you fill out all the important information, press save to add it.' },
    { key: '5', text: 'To edit, press the pen and paper icon on the top right.' },
    { key: '6', text: 'Choose the card you would like to edit.' },
    { key: '7', text: 'Once you are done with your changes, press save to finalize the edit and see the new card.' },
  ];

  const addCard: Instruction[] = [
    { key: '1', text: 'To add via tap is easy, just choose the card you would like to share and ask your new friend to choose one too.' },
    { key: '2', text: 'Just tap your phones and check your wallet for the new card.' },
    { key: '3', text: 'To add via search, go to the wallet tab.' },
    { key: '4', text: 'Click the + to add someone else\'s card.' },
    { key: '5', text: 'Enter their phone number and check the wallet for the new card.' },
  ];

  const renderItem = (item: Instruction) => (
    <View key={item.key} style={{ marginBottom: 10 }}>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{item.text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerTitle: 'How To' }} />
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>How to make/edit a card</Text>
      {makeCard.map((item) => renderItem(item))}
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>How to add/search for a card</Text>
      {addCard.map((item) => renderItem(item))}
    </ScrollView>
  );
};

export default HowToPage;
