import React from 'react';
import { ScrollView, View, Text, useColorScheme, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Stack } from 'expo-router';

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
}

const HowToPage = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const makeCard: Instruction[] = [
    { key: 'In the "Your Cards" tab, press the + sign to add a card.' },
    { key: 'You will then be able to decide which type you want.' },
    { key: 'Take a look through all 3 types and decide which one you want to make first.' },
    { key: 'Once you fill out all the important information, press save to add it.' },
    { key: 'To edit, press the pen and paper icon on the top right.' },
    { key: 'Choose the card you would like to edit.' },
    { key: 'Once you are done with your changes, press save to finalize the edit and see the new card.' },
  ];

  const addCard: Instruction[] = [
    { key: 'To add via tap is easy, just choose the card you would like to share and ask your new friend to choose one too.' },
    { key: 'Just tap your phones and check your wallet for the new card.' },
    { key: 'To add via search, go to the wallet tab.' },
    { key: 'Click the + to add someone else\'s card.' },
    { key: 'Enter their phone number and check the wallet for the new card.' },
  ];

  const renderItem: ListRenderItem<Instruction> = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>{item.key}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerTitle: 'How To' }} />
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>How to make/edit a card</Text>
      {makeCard.map((item) => renderItem({ item, index: 0, separators: { highlight: () => {}, unhighlight: () => {}, updateProps: () => {} } }))}
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>How to add/search for a card</Text>
      {addCard.map((item) => renderItem({ item, index: 0, separators: { highlight: () => {}, unhighlight: () => {}, updateProps: () => {} } }))}
    </ScrollView>
  );
};

export default HowToPage;
