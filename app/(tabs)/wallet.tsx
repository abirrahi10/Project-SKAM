// DisplayCardsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, ScrollView, Touchable } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged } from 'firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CardData {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const DisplayCardsScreen: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<any> (null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = (userId: string) => {
    const userCardsCollection =  collection(db, 'users', userId, 'wallet');
    const unsubscribe = onSnapshot(userCardsCollection, (querySnapshot) => {
      const cardsData: CardData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        } as CardData;
    });
      setCards(cardsData);
      setLoading(false);
   }, (error) => {
      console.error("Error fetching cards: ", error);
      setLoading(false);
    });
    return unsubscribe;
  };

  const unsubscribeFromAuth = onAuthStateChanged(auth, (currentUser) => {
    if(currentUser){
      setUser(currentUser);
      fetchCards(currentUser.uid);
    }
    else{
      setUser(null);
      setCards([]);
      setLoading(false);
    }
  });

  // Clean up the subscription on unmount
  return  () => unsubscribeFromAuth();
}, []);

  const isDarkMode = colorScheme === 'dark';

  const renderCards = (cards: CardData[], title: string) => (
    <View style={styles.cardPocket}> 
      <Text style={styles.pocketTitle}>{title}</Text>
      {cards.length > 0 ?(
      cards.map((card) => (
        <LinearGradient
          key={card.id}
          colors = {['#cdffd8', '#94b9ff']}
          start={{ x: 0, y: 0}}
          end={{ x:1, y:0}}
          style={styles.card}
        >
          <Text style={styles.cardText}>Name: {card.firstName} {card.lastName} </Text>
          {card.phone && <Text style={styles.cardText}>Phone: {card.phone}</Text>}
          </LinearGradient>
      ))
      ) : (
        <Text style = {styles.noCardsText}> No {title.toLowerCase()} cards available</Text>
      )}
      </View>
  );

  const schoolCards = cards.filter(card => card.type === 'School');
  const businessCards = cards.filter(card => card.type === 'Business');
  const personalCards = cards.filter(card => card.type === 'Personal');


if(loading){
  return(
  <View style={[styles.container, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
  );
}

if(!user){
  return(
  <View style={[styles.container, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
    <Text style={styles.messageText}>Please log in or sign up to view your wallet</Text>
  </View>
  );
}

const renderPockets = () => (
<View style={styles.pocketsContainer}>
  <TouchableOpacity style={styles.pocket} onPress={() => setSelectedType('School')}>
    <Text style={styles.pocketText}>School</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.pocket} onPress={() => setSelectedType('Business')}>
    <Text style={styles.pocketText}>Business</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.pocket} onPress={() => setSelectedType('Personal')}>
    <Text style={styles.pocketText}>Personal</Text>
  </TouchableOpacity>
</View>
);

return (
  <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
    {selectedType === null? (
      renderPockets()
    ) : (
     <ScrollView>
      <TouchableOpacity onPress={() => setSelectedType(null)} style={styles.backButtonContainter}>
        <Text style={styles.backButton}> Back to Pockets </Text>
      </TouchableOpacity>
      {selectedType === 'School' && renderCards(schoolCards, 'School')}
      {selectedType === 'Business' && renderCards(businessCards, 'Business')}
      {selectedType === 'Personal' && renderCards(personalCards, 'Personal')}
      </ScrollView>
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
  cardPocket: {
    marginBottom: 20,
  },
  pocketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
  },
  noCardsText: {
    fontSize : 16,
    fontStyle: 'italic'
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
  },
  pocketsContainer:{
    flex: 1,
    justifyContent: 'center',
  },
  pocket: {
    backgroundColor: "#4CAF50",
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  pocketText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  backButtonContainter: {
    marginBottom: 20,
    padding: 10,
    alignSelf: 'flex-start'
  },
  backButton:{
    fontSize: 18,
    color: 'blue',
    marginTop: 28,
    marginLeft: -13.5,
  },
  backButtonWrapper:{
    alignSelf: 'flex-start',
  }
});

export default DisplayCardsScreen;
