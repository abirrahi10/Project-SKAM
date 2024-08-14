//Wallets.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, TextInput, TouchableOpacity, FlatList, Alert, Animated } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { collection, onSnapshot, doc, query, orderBy, deleteDoc, where, getDocs } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface CardData {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  workNumber?: string;
  workEmail?: string;
  schoolEmail?: string;
  personalEmail?: string;
  location?: string;
  linkedin?: string;
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
  type: 'student' | 'work' | 'personal';
}

type SortOption = 'firstName' | 'lastName';
type FilterOption = 'S' | 'W' | 'P' | 'A';

const DisplayCardsScreen: React.FC = () => { 
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('firstName');
  const [filterBy, setFilterBy] = useState<FilterOption>('A');
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [expandedCardID, setExpandedCardID] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const isDarkMode = colorScheme === 'dark';

  const handleAddCardPress = () =>{
    // @ts-ignore
    navigation.navigate('addCardWallet');
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if(user){
        fetchCards();
      } else {
        setCards([]);
        setFilteredCards([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();

  }, []);

  const fetchCards = useCallback(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      setLoading(false);
      return;
    }

    const userWalletRef = doc(db, 'wallets', user.uid);
    const cardsRef = collection(userWalletRef, 'cards');
    const q = query(cardsRef, orderBy(sortBy));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cardsData: CardData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as CardData));
      console.log("Fetched cards:", cardsData);
      setCards(cardsData);
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cards: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [sortBy]);

  useEffect(() => {
    let filtered = cards.filter(card => 
      card.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filter
    if (filterBy !== 'A') {
      filtered = filtered.filter(card => card.type?.[0].toUpperCase() === filterBy);
    }

    setFilteredCards(filtered);
  }, [searchQuery, cards, filterBy]);

    const toggleCardExpansion = (cardId: string) => {
      setExpandedCardID(prevID => prevID === cardId ? null :cardId);
    };

    const deleteCard = async (cardId: string) => {
      const user = auth.currentUser;
      if(!user){
        console.error("No user logged in");
        return;
      }
    

    try{
      const userWalletRef = doc(db, 'wallets', user.uid);
      const cardRef = doc(collection(userWalletRef, 'cards'), cardId);
      await deleteDoc(cardRef);
      Alert.alert("Success", "Card deleted successfully");
    } catch (error){
      console.error("Error deleting card", error);
      Alert.alert("Error", "Failed to delete card");
    }
    };

    const confirmDelete = (cardId: string) => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this card?",
        [
          {text: "Cancel", style: "cancel"},
          {text: "Delete", style: "destructive", onPress: () => deleteCard(cardId)}
        ]
      );
    };

    const renderRightActions = (cardId: string) => {
      return (
        <TouchableOpacity
        style = {styles.deleteButton}
        onPress={() => confirmDelete(cardId)}>
          <View style={styles.deleteButtonContent}>
            <Ionicons name="trash" size={24} color = "#FFF"/>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </View>
        </TouchableOpacity>
      );
    };

  const renderCard = ({ item }: { item: CardData }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}
    >
    <TouchableOpacity onPress = {() => toggleCardExpansion(item.id)}>
    <LinearGradient
      colors={['#cdffd8', '#94b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>First Name: {item.firstName}</Text>
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Last Name: {item.lastName}</Text>
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Type: {item.type}</Text>
    

    {expandedCardID === item.id && (
      <View style={styles.expandedCardDetails}>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Work Number: {item.workNumber}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Work Email: {item.workEmail}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>School Email: {item.schoolEmail}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Personal Email: {item.personalEmail}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Location: {item.location}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Linkedin: {item.linkedin}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>School: {item.school}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Major: {item.major}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Discord: {item.discord}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Instagram: {item.instagram}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Twitter: {item.twitter}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Facebook: {item.facebook}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Tiktok: {item.tiktok}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Snapchat: {item.snapchat}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Birthday: {item.birthday}</Text>
        <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Additional Information: {item.additionalInfo}</Text>
        {item.additionalUrls && (
          <Text style={[styles.cardText, isDarkMode && styles.darkText]}>
            Additional URLs: {item.additionalUrls.join(', ')}
          </Text>
        )}
      </View>
    )}
    </LinearGradient>
    </TouchableOpacity>
    </Swipeable>
  );

  //const [expandedCardID, setExpandedCardID] = useState<string | null>(null);

  // const toggleCardExpansion = (cardId: string) => {
  //   setExpandedCardID (prevID => prevID === cardId ? null: cardId);
  // };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Wallet</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}>
          <Ionicons name="search" size={20} color={isDarkMode ? "lightgray" : "gray"} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkText]}
            placeholder="Search by name..."
            placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color={isDarkMode ? "lightgray" : "gray"} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCardPress}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <View style={styles.sortContainer}>
          <Text style={[styles.optionLabel, isDarkMode && styles.darkText]}>SORT:</Text>
          <TouchableOpacity onPress={() => setSortBy('firstName')}>
            <Text style={[
              styles.optionValue, 
              isDarkMode && styles.darkOptionValue,
              sortBy === 'firstName' && styles.selectedOption
            ]}>FIRST NAME</Text>
          </TouchableOpacity>
          <Text style={[styles.optionSeparator, isDarkMode && styles.darkText]}>|</Text>
          <TouchableOpacity onPress={() => setSortBy('lastName')}>
            <Text style={[
              styles.optionValue, 
              isDarkMode && styles.darkOptionValue,
              sortBy === 'lastName' && styles.selectedOption
            ]}>LAST NAME</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          <Text style={[styles.optionLabel, isDarkMode && styles.darkText]}>FILTER:</Text>
          {(['S', 'W', 'P', 'A'] as FilterOption[]).map((option, index) => (
            <React.Fragment key={option}>
              {index > 0 && <Text style={[styles.optionSeparator, isDarkMode && styles.darkText]}>|</Text>}
              <TouchableOpacity onPress={() => setFilterBy(option)}>
                <Text style={[
                  styles.optionValue, 
                  isDarkMode && styles.darkOptionValue,
                  filterBy === option && styles.selectedOption
                ]}>{option}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? "#ffffff" : "#0000ff"} />
      ) : filteredCards.length > 0 ? (
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={[styles.noCardText, isDarkMode && styles.darkText]}>
        No cards found.
        </Text>
      )}
    </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  darkSearchBar: {
    backgroundColor: '#2a2a2a',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000000',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000000',
  },
  optionValue: {
    color: '#007bff',
  },
  darkOptionValue: {
    color: '#007bff',
  },
  selectedOption: {
    fontWeight: 'bold',
  },
  optionSeparator: {
    marginHorizontal: 5,
    color: '#000000',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#000000',
  },
  noCardText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  expandedCardDetails:{
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  deleteButton:{
    backgroundColor: '#D72E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '87%',
    borderRadius: 8,
  },
  deleteButtonContent:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  deleteButtonText:{
    color: "#FFF",
    fontWeight: 'bold',
    marginLeft : 10,
  }
});

export default DisplayCardsScreen;