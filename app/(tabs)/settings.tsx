import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface CardData {
  first: string;
  middle: string;
  last: string;
  born: number;
}

const DisplayCardsScreen: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const cardsData: CardData[] = querySnapshot.docs.map((doc) => doc.data() as CardData);
        setCards(cardsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching cards: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text>First Name: {card.first}</Text>
            <Text>Middle Name: {card.middle}</Text>
            <Text>Last Name: {card.last}</Text>
            <Text>Born: {card.born}</Text>
          </View>
        ))
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
  card: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default DisplayCardsScreen;
