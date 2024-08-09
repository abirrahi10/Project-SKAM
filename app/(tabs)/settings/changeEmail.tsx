import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, useColorScheme, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';

const ChangeEmailPage = () => {
  const [password, setPassword] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleChangeEmail = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.email) {
        if (user.email !== oldEmail) {
          Alert.alert('Error', 'Old email does not match current email.');
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, newEmail);
        Alert.alert('Success', 'Email has been changed successfully.');
        router.back();
      } else {
        Alert.alert('Error', 'User not found or email is missing.');
      }
    } catch (error) {
      console.error('Error changing Email:', error);
      Alert.alert('Error', 'There was a problem changing the email. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Old Email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={oldEmail}
        onChangeText={setOldEmail}
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="New Email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
        <Text style={styles.buttonText}>Change Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f8f9fa',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#3c4043',
    fontFamily: 'Arial',
    fontSize: 14,
  },
});

export default ChangeEmailPage;
