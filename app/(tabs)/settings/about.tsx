import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useDarkMode } from '../../DarkModeContext';

const AboutPage = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Stack.Screen options={{ headerTitle: 'About' }} />
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Cards</Text>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
        You will have 3 card types to choose from with a limit of 1 for each type. Each type will have some things that are specific to it. For example, you would only put your work email on your work card, just like you would only put your student email on your student card. Some cards will also share some similar information like your name, LinkedIn, location, and more. You will also be able to attach links to your socials if you choose, as well as have a section on the back of the card for additional info or anything you'd like others to know about yourself.
      </Text>
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Wallet</Text>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
        Your wallet will be a collection of all of your friends' cards. It's basically a "following" tab but with cards. In this tab, you'll be able to find the person you're looking for and add them on whatever social media or even email or text them if you desire and have that option. You'll be able to filter these cards by types as well as sort them by first and last name. If you are looking for a specific person, you can also type their name in the search bar and their card will show up.
      </Text>
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Tapping (WIP)</Text>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
        Once added, this feature will allow two people that are close to each other to pick which card they want to share with the other person, tap their phones, and exchange cards. Once the cards are exchanged, the other person's card will show up in your wallet page allowing you to see things like their socials, LinkedIn, email, etc. depending on which card type they decided to share.
      </Text>
      <Text style={[styles.heading, { color: isDarkMode ? '#fff' : '#000' }]}>Searching (WIP)</Text>
      <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
        Once fully implemented, this feature will allow you to search someone via phone number. Even though we have the tap feature which would seem like a quicker alternative, this is for those quick situations when neither party has time to open the app and whatnot, so they just exchange numbers and go on to add each other later on.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
    alignItems: 'center', // Center items horizontally
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AboutPage;
