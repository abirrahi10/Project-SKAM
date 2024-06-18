// DisplayCardsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

interface CardData {
  first: string;
  middle: string;
  last: string;
  born: number;
}

const DisplayCardsScreen: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (querySnapshot) => {
      const cardsData: CardData[] = querySnapshot.docs.map((doc) => doc.data() as CardData);
      setCards(cardsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cards: ", error);
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cards.map((card, index) => (
          <LinearGradient
            key={index}
            colors={['#cdffd8', '#94b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.card}
          >
            <Text style={styles.cardText}>
              First Name: {card.first}
            </Text>
            <Text style={styles.cardText}>
              Middle Name: {card.middle}
            </Text>
            <Text style={styles.cardText}>
              Last Name: {card.last}
            </Text>
            <Text style={styles.cardText}>
              Born: {card.born}
            </Text>
          </LinearGradient>
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
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
  },
});

export default DisplayCardsScreen;
