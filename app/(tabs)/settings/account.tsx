
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';

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

const AccountPage = () => {
  return (
    <View style={styles.container} >
      <Stack.Screen options={{ headerTitle: 'Account' }} />
      <Button16 href="/settings/changePassword">
        Change Password
      </Button16>

      <Button16 href="/settings/changeEmail">
        Change Email
      </Button16>

      <Button16 href="/settings/deleteAccount">
        Delete Account
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
  button: {
    backgroundColor: '#dddddd',
    borderRadius: 5,
    padding: 20,
    minWidth: 54,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#3c4043',
    fontFamily: 'Arial',
    fontSize: 16,
  },
});

export default AccountPage;