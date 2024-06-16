import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface UserData {
  first: string;
  middle: string;
  last: string;
  born: string;
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first: '',
    middle: '',
    last: '',
    born: ''
  });

  const handleChange = (name: keyof UserData, value: string) => {
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const addDocument = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        first: userData.first,
        middle: userData.middle,
        last: userData.last,
        born: parseInt(userData.born)
      });

      setLoading(false);
      Alert.alert('Success', `Document written with ID: ${docRef.id}`);
    } catch (error) {
      setLoading(false);
      // Assert the type of error as Error
      if (error instanceof Error) {
        Alert.alert('Error', `Error adding document: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Firestore Example</Text>
      <Input
        placeholder="First Name"
        value={userData.first}
        onChangeText={(value) => handleChange('first', value)}
      />
      <Input
        placeholder="Middle Name"
        value={userData.middle}
        onChangeText={(value) => handleChange('middle', value)}
      />
      <Input
        placeholder="Last Name"
        value={userData.last}
        onChangeText={(value) => handleChange('last', value)}
      />
      <Input
        placeholder="Year Born"
        value={userData.born}
        onChangeText={(value) => handleChange('born', value)}
        keyboardType="numeric"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Document" onPress={addDocument} buttonStyle={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    marginTop: 20,
  },
});

