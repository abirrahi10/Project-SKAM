import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

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

interface LoginButtonProps {
  children: React.ReactNode;
  href: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ children, href }) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.loginButton}>
      <Text style={styles.loginButtonText}>{children}</Text>
    </TouchableOpacity>
  </Link>
);

const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, {color: isDarkMode ? '#fff' : '#000'}]}>Settings</Text>
        <LoginButton href="/login">
          Login
        </LoginButton>
      </View>

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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f8f9fa',
    borderRadius: 4,
    padding: 10,
    minWidth: 54,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#3c4043',
    fontFamily: 'Arial',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 8,
    minWidth: 54,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;