import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

// Button16 component
interface Button16Props {
  children: React.ReactNode;
  href: string;
}

const Button16: React.FC<Button16Props> = ({ children, href }) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  </Link>
);

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, {color: isDarkMode ? '#fff' : '#000'}]}>Settings</Text>

      <Button16 href="/settings/about">
        About
      </Button16>

      <Button16 href="/settings/account">
        Account
      </Button16>

      <Button16 href="/settings/display">
        Display
      </Button16>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f8f9fa',
    borderRadius: 4,
    padding: 10,
    minWidth: 54,
    alignItems: 'center',
    marginBottom: 10, // Add space between buttons
  },
  buttonText: {
    color: '#3c4043',
    fontFamily: 'Arial',
    fontSize: 14,
  },
});

export default SettingsScreen;