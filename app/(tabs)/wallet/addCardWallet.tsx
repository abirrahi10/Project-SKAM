import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, Button, Alert, useColorScheme, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Card {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  workNumber?: string;
  workEmail?: string;
  schoolEmail?: string;
  personalEmail?: string;
  location?: string;
  school?: string;
  major?: string;
  discord?: string;
  additionalInfo?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  snapchat?: string;
  birthday?: string;
  additionalUrls?: string[];
}

const AddCardWallet: React.FC = () => {
  const user = auth.currentUser;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<Card[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const searchCardsByPhoneNumber = async (phoneNumber: string) => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('phone', '==', phoneNumber));
    const querySnapshot = await getDocs(q);
    setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card)));
  };

  const handleSearch = () => {
    searchCardsByPhoneNumber(searchQuery);
  };

  const handleAddCard = (card: Card) => {
    Alert.alert(
      'Add Card',
      `Do you want to add the card: ${card.firstName} ${card.lastName}?`,
      [
        { text: 'No' },
        { text: 'Yes', onPress: () => addCardToWallet(card) }
      ]
    );
  };

  const addCardToWallet = async (card: Card) => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }
    const userId = user.uid;
    const cardType = card.type || 'default'; // Fallback to 'default' if cardType is not specified
    const cardRef = doc(db, 'wallets', userId, cardType, card.id);
    await setDoc(cardRef, card);
  };

  const CardDisplay: React.FC<{ card: Card }> = ({ card }) => {
    const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

    return (
      <TouchableOpacity onPress={() => {
        setSelectedCard(card);
        setDetailsModalVisible(true);
      }}>
        <LinearGradient
          colors={['#cdffd8', '#94b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <Text style={styles.cardName}>{card.firstName} {card.lastName}</Text>
          <Text style={styles.cardText}>{card.phone}</Text>
          <Text style={styles.cardText}>{card.type}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by phone number"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <View>
        {results.map(card => (
          <View key={card.id} style={styles.cardContainer}>
            <CardDisplay card={card} />
            <Button title="Add Card" onPress={() => handleAddCard(card)} />
          </View>
        ))}
      </View>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    margin: 10,
    color: 'black',
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    margin: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    margin: 10,
    color: 'white',
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddCardWallet;
