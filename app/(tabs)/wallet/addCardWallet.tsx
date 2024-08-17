//addCardWallet.tsx

import React, { useState } from 'react';
import { useColorScheme, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { doc, setDoc, getDoc, collection, query, where, getDocs, or} from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useColors} from '../../ColorConfig';
import {LinearGradient} from 'expo-linear-gradient';
import  MaskInput, {createNumberMask} from 'react-native-mask-input';
import { useDarkMode } from '@/app/DarkModeContext';
import Icon from 'react-native-vector-icons/FontAwesome'
import { SocialIcon } from 'react-native-elements';

interface CardData {
  //id: string;
  firstName: string;
  lastName: string;
  born: number;
  type: 'Student' | 'Work' | 'Personal';
  phone: string;
  workNumber?: string;
}

const AddCardScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(CardData & {docId: string})[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const colorScheme = useColorScheme();
  const {isDarkMode} = useDarkMode();
  const navigation = useNavigation();
  const { colors } = useColors();
  const [phoneNumber, setPhoneNumber] = useState('');


  useFocusEffect(() => {
navigation.setOptions({
    title: 'Add a Card',
    headerBackTitle: 'Wallets',
    headerBackTitleVisible: true,
   } as StackNavigationOptions);
  });

  const handlePhoneNumber = (formatted: string, extracted: string) => {
    setPhoneNumber(extracted);
  };

  const searchCards = async () => {
    if(!phoneNumber.trim()){
      Alert.alert('Error', 'Please enter a phone number or work number');
      return;
    }

    setIsLoading(true);
    try{
    const q = query(
      collection(db, 'cards'),
      or (
        where('phone', '==', phoneNumber),
        where('workNumber', '==', phoneNumber)
        )
      );
    const querySnapshot = await getDocs(q);
    const results: (CardData & {docId: string})[] = [];
    querySnapshot.forEach((doc) => {
      //const cardData = doc.data() as Omit<CardData, 'id'>;
      results.push({docId: doc.id, ...doc.data() as CardData});
    });
    setSearchResults(results);
    // if (results.length > 0){
    // addCardToWallet(results[0]);
    // }
    setHasSearched(true);
  } catch(error){
    console.error('Error searching cards:', error);
    Alert.alert('Error', 'Failed to search for cards');
  }finally{
    setIsLoading(false);
  }
  };

  const addCardToWallet = async (cardDocId: string) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    setIsLoading(true);
    try {
      const cardsCollectionRef = collection(db, 'cards');
      const originalCardRef = doc(cardsCollectionRef, cardDocId);
      const originalCardSnap = await getDoc(originalCardRef);

      if(!originalCardSnap.exists()){
        Alert.alert('Error', 'Card not found');
        setIsLoading(false);
        return;
      }

      const originalCardData = originalCardSnap.data() as CardData;

      const userWalletRef = doc(db, 'wallets', user.uid);
      const cardsRef = collection(userWalletRef, 'cards');

      const duplicateCheckQuery = query(
        cardsRef,
          where('phone', '==', originalCardData.phone),
          where ('type', '==', originalCardData.type)
    );
      const duplicateCheckSnapshot = await getDocs(duplicateCheckQuery);

      let isDuplicate = false;

      const phoneCheck = originalCardData.phone || '';
      const workNumberCheck = originalCardData.workNumber || '';

      duplicateCheckSnapshot.forEach((doc)=>{
      const data = doc.data();
      if(
        (data.phone === phoneCheck && data.workNumber === workNumberCheck) &&
        data.type === originalCardData.type
      ){
        isDuplicate = true;
      }
    });

      if(isDuplicate){
        Alert.alert('Duplicate', 'You have already swapped cards with this user');
        setIsLoading(false);
        return;
      }

      const newCardRef = doc(cardsRef);
      await setDoc(newCardRef, {
        ...originalCardData,
        originalCardId: cardDocId,
      });
      
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

  const formatPhoneNumber = (phone: string) =>{
    const cleaned = (''+ phone). replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match){
    return '(' + match[1] + ')-' + match[2] + '-' + match[3];
    }
    return phone;
  };

  const renderCardDetails = (item: CardData) => {
    switch(item.type){
      case 'Personal':
        return (
          <>
           <View style = {styles.CardDetailsContainer}>
           <View style = {styles.cardHeader}>
          <Text style= {[styles.cardName, isDarkMode && styles.darkText]}> {`${item.firstName} ${item.lastName}`}</Text>
          <Text style={[styles.cardType, isDarkMode && styles.darkText]}>{item.type}</Text>
          </View>
          <View style = {styles.detailsContainer}>
          {item.phone && <Text style={[styles.cardPhone, isDarkMode && styles.darkText]}>{formatPhoneNumber(item.phone)}</Text>}
          </View>
          </View>
          </>
        );
        case 'Student':
          return (
            <>
          <View style = {styles.CardDetailsContainer}>
           <View style = {styles.cardHeader}>
          <Text style= {[styles.cardName, isDarkMode && styles.darkText]}> {`${item.firstName} ${item.lastName}`}</Text>
          <Text style={[styles.cardType, isDarkMode && styles.darkText]}>{item.type}</Text>
          </View>
          <View style = {styles.detailsContainer}>
            {item.phone && <Text style={[styles.cardPhone, isDarkMode && styles.darkText]}>{formatPhoneNumber(item.phone)}</Text>}
            </View>
            </View>
            </>
          );
          case 'Work':
            return (
              <>
          <View style = {styles.CardDetailsContainer}>
           <View style = {styles.cardHeader}>
          <Text style= {[styles.cardName, isDarkMode && styles.darkText]}> {`${item.firstName} ${item.lastName}`}</Text>
          <Text style={[styles.cardType, isDarkMode && styles.darkText]}>{item.type}</Text>
          </View>
          <View style = {styles.detailsContainer}>
              {item.workNumber && <Text style={[styles.cardPhone, isDarkMode && styles.darkText]}>{formatPhoneNumber(item.workNumber)}</Text>}
              </View>
              </View>
              </>
            );
            default:
              return null;
    }
  };
  const renderCard = ({ item }: {item: CardData & {docId: string}}) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Add Card',
          `Do you want to add ${item.firstName} ${item.lastName} to your wallet?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => addCardToWallet(item.docId) },
          ]
        );
      }}
    >
      <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.card}
        >
        {renderCardDetails(item)}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MaskInput
        style={[styles.searchInput, 
          { color: isDarkMode ? '#fff' : '#000',
            backgroundColor: isDarkMode ? '#333' : '#fff',
          }

        ]}
        mask = {[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/,/\d/, /\d/]}
        placeholder = {"Enter phone number"}
        onChangeText= {handlePhoneNumber}
        placeholderTextColor="gray"
        value={phoneNumber}
        keyboardType="numeric"
        
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
        keyExtractor={(item) => item.docId}
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
  },
  searchIcon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  darkText: {
    color: '#ffffff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    height: 200,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName:{
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: -3,
  },
  cardType:{
    marginTop: -30,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  cardPhone:{
    marginTop: 5,
    fontSize: 15,
  },
  cardEmail:{
    marginTop: 5,
    fontSize: 15,
  },
  cardLocation:{
    marginTop: 5,
    fontSize: 15,
  },
  cardSchool:{
    marginTop: 5,
    fontSize: 15,
  },
  cardMajor:{
    marginTop: 5,
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  cardText: {
    fontSize: 15,
    marginTop: 5,
  },
  CardDetailsContainer:{
    flex: 1,
  },
  detailsContainer:{
    marginTop: 15,
  },
});

export default AddCardScreen;