// DisplayCardsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      return;
    }

    const userWalletRef = doc(db, 'wallets', user.uid);
    const cardsRef = collection(userWalletRef, 'cards');

    const unsubscribe = onSnapshot(cardsRef, (querySnapshot) => {
      const cardsData: CardData[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      } as CardData));
      setCards(cardsData);
      setFilteredCards(cardsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cards: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = cards.filter(card => 
      card.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filter
    if (filterBy !== 'A') {
      filtered = filtered.filter(card => card.type[0].toUpperCase() === filterBy);
    }

    // Apply sort
    filtered.sort((a, b) => {
      if (sortBy === 'firstName') {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return a.lastName.localeCompare(b.lastName);
      }
    });

    setFilteredCards(filtered);
  }, [searchQuery, cards, sortBy, filterBy]);

  const renderCard = ({ item }: { item: CardData }) => (
    <LinearGradient
      colors={['#cdffd8', '#94b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>First Name: {item.firstName}</Text>
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Last Name: {item.lastName}</Text>
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Born: {item.birthday}</Text>
      <Text style={[styles.cardText, isDarkMode && styles.darkText]}>Type: {item.type}</Text>
    </LinearGradient>
  );

  return (
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
          onPress={() => navigation.navigate('addCardWallet' as never)}
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
        <ActivityIndicator size="small" color={isDarkMode ? "#ffffff" : "#0000ff"} />
      ) : (
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
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
});

export default DisplayCardsScreen;