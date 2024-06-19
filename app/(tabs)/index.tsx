/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, useColorScheme } from 'react-native';
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
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
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

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000' }]}>Firebase Firestore Example</Text>
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
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, useColorScheme, TouchableOpacity, TextInput, Modal } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

interface UserData {
  id: string;
  type: string;
  name: string;
  contact: string;
  email: string;
}

const Card: React.FC<{ card: UserData; onPress: () => void }> = ({ card, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardType}>{card.type}</Text>
      <Text style={styles.cardName}>{card.name}</Text>
      <Text style={styles.cardContact}>{card.contact}</Text>
      <Text style={styles.cardEmail}>{card.email}</Text>
      <Text style={styles.cardMore}>TAP TO VIEW MORE</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<UserData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'));
        const cardList: UserData[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setCards(cardList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching cards: ', error);
      }
    };

    fetchCards();
  }, []);

  const handleCardPress = (card: UserData) => {
    if (editMode) {
      setSelectedCard(card);
      setModalVisible(true);
    } else {
      Alert.alert('Card Details', `Viewing details for card: ${card.name}`);
    }
  };

  const handleSave = async () => {
    if (selectedCard) {
      try {
        if (isAdding) {
          await addDoc(collection(db, 'cards'), selectedCard);
          Alert.alert('Success', 'Card added successfully');
        } else {
          const cardRef = doc(db, 'cards', selectedCard.id!);
          await updateDoc(cardRef, selectedCard as { [x: string]: any });
          Alert.alert('Success', 'Card updated successfully');
        }
        setModalVisible(false);
        setEditMode(false);
        setIsAdding(false);
        setLoading(true);
        setCards([]);
      } catch (error) {
        Alert.alert('Error', `Failed to save card: ${(error as Error).message}`);
      }
    }
  };

  const handleChange = (name: keyof UserData, value: string) => {
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, [name]: value });
    }
  };

  const handleAddPress = () => {
    setSelectedCard({ id: '', type: 'Personal', name: '', contact: '', email: '' });
    setIsAdding(true);
    setModalVisible(true);
  };

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
        <Text style={styles.editButtonText}>{editMode ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>YOUR CARDS</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cards.map(card => (
          <Card key={card.id} card={card} onPress={() => handleCardPress(card)} />
        ))
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setIsAdding(false);
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isAdding ? 'Add Card' : 'Edit Card'}</Text>
          {selectedCard && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={selectedCard.name}
                onChangeText={(value) => handleChange('name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                value={selectedCard.contact}
                onChangeText={(value) => handleChange('contact', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={selectedCard.email}
                onChangeText={(value) => handleChange('email', value)}
              />
              {/* Add other inputs as needed */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 600,
  },
  addButton: {
    position: 'absolute',
    top: 58,
    left: 20,
    padding: 10,
  },
  addButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  editButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
  },
  editButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  cardType: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContact: {
    fontSize: 16,
  },
  cardEmail: {
    fontSize: 16,
  },
  cardMore: {
    marginTop: 10,
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});