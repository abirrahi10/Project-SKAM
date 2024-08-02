import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Password has been changed successfully.');
        router.back();
      } else {
        Alert.alert('Error', 'User not found or email is missing.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'There was a problem changing the password. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Old Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="New Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Confirm New Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
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

export default ChangePasswordPage;