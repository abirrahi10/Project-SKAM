// AddCardScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

interface CardData {
  id: string;
  first: string;
  middle: string;
  last: string;
  born: number;
  type: 'student' | 'work' | 'personal';
  phone: string;
}

const AddCardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardData[]>([]);

  const searchCards = async () => {
    const q = query(collection(db, 'globalCards'), where('phone', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    const results: CardData[] = [];
    querySnapshot.forEach((doc) => {
      results.push({...doc.data() as CardData });
    });
    setSearchResults(results);
  };

  const addCardToWallet = async (card: CardData) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    try {
      const userWalletRef = doc(db, 'wallets', user.uid);
      const cardRef = doc(collection(userWalletRef, 'cards'));
      await setDoc(cardRef, {
        first: card.first,
        middle: card.middle,
        last: card.last,
        born: card.born,
        type: card.type,
        phone: card.phone,
      });
      Alert.alert('Success', 'Card added to your wallet');
    } catch (error) {
      console.error('Error adding card to wallet:', error);
      Alert.alert('Error', 'Failed to add card to wallet');
    }
  };

  const renderCard = ({ item }: { item: CardData }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Alert.alert(
          'Add Card',
          'Do you want to add this card to your wallet?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => addCardToWallet(item) },
          ]
        );
      }}
    >
      <Text>Name: {item.first} {item.middle} {item.last}</Text>
      <Text>Born: {item.born}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Phone: {item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter phone number"
        value={searchQuery}
        onChangeText={setSearchQuery}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchCards}>
        <Text>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddCardScreen;