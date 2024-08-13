//addCardWallet.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { doc, setDoc, getDoc, collection, query, where, getDocs} from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';


interface CardData {
  id: string;
  firstName: string;
  lastName: string;
  born: number;
  type: 'student' | 'work' | 'personal';
  phone: string;
}

const AddCardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(() => {
navigation.setOptions({
    title: 'Add a Card',
    headerBackTitle: 'Wallets',
    headerBackTitleVisible: true,
   } as StackNavigationOptions);
  });


  const searchCards = async () => {
    if(!searchQuery.trim()){
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setIsLoading(true);
    try{
    const q = query(collection(db, 'cards'), where('phone', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    const results: CardData[] = [];
    querySnapshot.forEach((doc) => {
      results.push({id: doc.id, ...doc.data() as Omit<CardData, 'id'> });
    });
    setSearchResults(results);
    // if (results.length > 0){
    // addCardToWallet(results[0]);
    // }
  } catch(error){
    console.error('Error searching cards:', error);
    Alert.alert('Error', 'Failed to search for cards');
  }finally{
    setIsLoading(false);
  }
  };

  const addCardToWallet = async (cardId: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    setIsLoading(true);
    try {
      const originalCardRef = doc(db, 'cards', cardId);
      const originalCardSnap =await getDoc(originalCardRef);

      if(!originalCardSnap.exists()){
        Alert.alert('Error', 'Card not found');
        return;
      }

      const originalCardData = originalCardSnap.data();

      const userWalletRef = doc(db, 'wallets', user.uid);
      const cardsRef = collection(userWalletRef, 'cards');

      const duplicateCheckQuery = query(cardsRef, where('phone', '==', originalCardData.phone));
      const duplicateCheckSnapshot = await getDocs(duplicateCheckQuery);

      if(!duplicateCheckSnapshot.empty){
        Alert.alert('Duplicate', 'You have already swapped cards with this user');
        setIsLoading(false);
        return;
      }

      await setDoc(doc(cardsRef, cardId), originalCardData);
      
      Alert.alert('Success', 'Card added to your wallet', [
     { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding card to wallet:', error);
      Alert.alert('Error', 'Failed to add card to wallet');
    } finally{
      setIsLoading(false);
    }
  };

  const renderCard = ({ item }: {item: CardData}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Alert.alert(
          'Add Card',
          `Do you want to add ${item.firstName} ${item.lastName} to your wallet?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => addCardToWallet(item.id) },
          ]
        );
      }}
    >
      <Text>Name: {item.firstName} {item.lastName}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Phone: {item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter phone number"
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={setSearchQuery}
        keyboardType="phone-pad"
      />
      <TouchableOpacity 
      style={styles.searchButton} 
      onPress={searchCards} 
      disabled = {isLoading}
      >
        <Text style = {styles.buttonText}>{isLoading ? 'Searching...' : 'Search'}</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size ="large" color="#0000ff" />}
      {!isLoading && (
      <FlatList
        data={searchResults}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          hasSearched ? (
        <Text style = {styles.emptyText}>No cards found. Try a different phone number.</Text>
          ) : null
        }
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText:{
    color: 'white',
    fontWeight: 'bold',
  },
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
    color: 'gray',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default AddCardScreen;