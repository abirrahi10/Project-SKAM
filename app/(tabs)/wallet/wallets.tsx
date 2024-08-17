//Wallets.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, TextInput, TouchableOpacity, FlatList, Alert, Animated, Easing, Linking, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { db, auth } from '../../../firebaseConfig';
import { collection, onSnapshot, doc, query, orderBy, deleteDoc, where, getDocs, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../../DarkModeContext';
import { useColors } from '@/app/ColorConfig';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'
import { SocialIcon } from 'react-native-elements';

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
  type: 'Student' | 'Work' | 'Personal';
  originalCardId?: string;
}

type SortOption = 'firstName' | 'lastName';
type FilterOption = 'S' | 'W' | 'P' | 'A';

const DisplayCardsScreen: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('firstName');
  const [filterBy, setFilterBy] = useState<FilterOption>('A');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState <CardData | null> (null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { colors } = useColors();

  const handleAddCardPress = () =>{
    // @ts-ignore
    navigation.navigate('addCardWallet');
  };

  const formatPhoneNumber = (phone: string) =>{
    const cleaned = (''+ phone). replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match){
    return '(' + match[1] + ')-' + match[2] + '-' + match[3];
    }
    return phone;
  };

  const handleCardLongPress = (card: CardData) => {
    setSelectedCard(card);
    setDetailsModalVisible(true);
  }

  const fetchCards = async() => {
    const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in");
        setLoading(false);
        return;
      }

    const userWalletRef = doc(db, 'wallets', user.uid);
    const cardsRef = collection(userWalletRef, 'cards');
    const q = query(cardsRef, orderBy(sortBy));

    const unsubscribe = onSnapshot(q, async(querySnapshot) => {
      //console.log("Triggered");
      const cardsData: CardData[] = [];
      const cardPromises = querySnapshot.docs.map(async(docSnapshot) => {
        const cardData = docSnapshot.data() as CardData;
        const originalCardId = cardData.originalCardId;
        if (originalCardId){
          const originalCardRef = doc(db, 'cards', originalCardId);
          const originalCardSnap = await getDoc(originalCardRef);
        if(originalCardSnap.exists()){
        const originalCardData = originalCardSnap.data() as CardData;
        //console.log('Original card Data:', originalCardData);
        cardsData.push({
        ...originalCardData,
        id: docSnapshot.id,
        originalCardId:originalCardId,
      });
    } else{
      //console.log('original card not found:', originalCardId);
    }
  } else{
    cardsData.push({
      ...cardData,
      id: docSnapshot.id,
    });
  }
});

  await Promise.all(cardPromises);
  //console.log('Fetched Cards data:', cardsData);
  setCards(cardsData);
  setLoading(false);

}, (error) => {
  console.error("Error fetching cards: ", error);
  setLoading(false);
});
 
    return() => unsubscribe();
  };

  const onRefresh = async () =>{
    //console.log("refreshed");
    setRefreshing(true);
    await fetchCards();
    setRefreshing(false);
  };
  
  useFocusEffect(
    useCallback(() => {
    fetchCards();
    }, [sortBy])
  );

  useEffect(() =>{
    //console.log("updated cards state:", cards);
    setFilteredCards(cards);
  }, [cards]);

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

  useEffect(() => {
    //("Filtered cards:", filteredCards);
  }, [filteredCards]);

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

      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      setFilteredCards(prevCards => prevCards.filter(card => card.id !== cardId))

    Alert.alert("Success", "Card deleted successfully");
  } catch (error){
    console.error("Error deleting card", error);
    Alert.alert("Error", "Failed to delete card");
  }
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
          {item.personalEmail && <Text style={[styles.cardEmail, isDarkMode && styles.darkText]}>{item.personalEmail}</Text>}
          {item.location && <Text style={[styles.cardLocation, isDarkMode && styles.darkText]}>{item.location}</Text>}
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
            {item.schoolEmail && <Text style={[styles.cardEmail, isDarkMode && styles.darkText]}>{item.schoolEmail}</Text>}
            {item.school && <Text style={[styles.cardSchool, isDarkMode && styles.darkText]}>{item.school}</Text>}
            {item.major && <Text style={[styles.cardMajor, isDarkMode && styles.darkText]}>{item.major}</Text>}
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
              {item.workEmail && <Text style={[styles.cardEmail, isDarkMode && styles.darkText]}>{item.workEmail}</Text>}
              {item.school && <Text style={[styles.cardSchool, isDarkMode && styles.darkText]}>{item.school}</Text>}
              {item.location && <Text style={[styles.cardLocation, isDarkMode && styles.darkText]}>{item.location}</Text>}
              </View>
              </View>
              </>
            );
            default:
              return null;
    }
  };


  const renderSocialIcons = (item: CardData) => {
    switch (item.type){
      case 'Personal':
        return(
          <>
          <View style = {styles.SocialIconContainer}>
          {item.instagram && <Icon name= "instagram" size ={24} color = "#C13584" onPress={() => Linking.openURL(`https://www.instagram.com/${item.instagram}`)}/>}
          {item.twitter && <Icon name= "twitter" size ={24} color = "#1DA1F2" onPress={() => Linking.openURL(`https://www.tiwtter.com/${item.twitter}`)}/>}
          {item.facebook && <Icon name= "facebook" size ={24} color = "#3b5998" onPress={() => Linking.openURL(`https://www.facebook.com/${item.facebook}`)}/>}
          {item.tiktok && <Icon name= "tiktok" size ={24} color = "#000000" onPress={() => Linking.openURL(`https://www.tiktok.com/${item.tiktok}`)}/>}
          {item.snapchat && <Icon name= "snapchat" size ={24} color = "#FFFC00" onPress={() => Linking.openURL(`https://www.snapchat.com/${item.snapchat}`)}/>}
          </View>
          </>
        );
        case 'Student':
        case 'Work':
          return(
          <View style = {styles.SocialIconContainer}>
          {item.linkedin && <Icon name= "linkedin" size ={24} color = "#0077B5" onPress={() => Linking.openURL(`https://www.linkedin.com/in/${item.linkedin}`)} />}
          </View>
          );
        default:
          return null;
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
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
    <TouchableOpacity onLongPress={() => handleCardLongPress(item)}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >

      {renderCardDetails(item)}
      {renderSocialIcons(item)}
    </LinearGradient>
    </TouchableOpacity>
    </Swipeable>
  );
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Wallet</Text>
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
        <ActivityIndicator size="large" color= {"#0000ff"} />
      ) : filteredCards.length > 0 ? (
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh = {onRefresh}
        />
      ) : (
        <Text style={[styles.noCardText, isDarkMode && styles.darkText]}>
        No cards found
        </Text>
      )}
    </View>

      <Modal
        animationType='slide'
        transparent = {false}
        visible = {detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}>
      <View style={[styles.modalContainer, {backgroundColor: isDarkMode ? '#000' : '#fff'}]}>
        <Text style = {[styles.modalTitle, {color: isDarkMode ? '#fff' : "#000"}]} > Card Details </Text>
        <ScrollView>
          {selectedCard && (
            <View>
              <Text style={[styles.detailText, {color: isDarkMode ? '#fff' : '#000'}]}>
                <Text style = {styles.boldLabel}>Card Type: </Text>{selectedCard.type}
              </Text>
              <Text style={[styles.detailText, {color: isDarkMode ? '#fff' : '#000'}]}>
                <Text style = {styles.boldLabel}>Name: </Text>{selectedCard.firstName} {selectedCard.firstName}
              </Text>

              {selectedCard.type === 'Personal' && (
                <>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Phone: </Text> {selectedCard.phone}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Personal Email: </Text> {selectedCard.personalEmail}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Location: </Text> {selectedCard.location}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Instagram: </Text> {selectedCard.instagram}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Twitter: </Text> {selectedCard.twitter}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Facebook: </Text> {selectedCard.facebook}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Tiktok: </Text> {selectedCard.tiktok}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>SnapChat: </Text> {selectedCard.snapchat}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Birthday: </Text> {selectedCard.birthday}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Additional Info: </Text> {selectedCard.additionalInfo}
                </Text>
                </>
              )}
              {selectedCard.type === 'Work' && (
                <>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Work Number: </Text> {selectedCard.workNumber}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Work Email: </Text> {selectedCard.workEmail}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Location: </Text> {selectedCard.location}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>LinkedIn: </Text> {selectedCard.linkedin}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Additional URLs: </Text> {selectedCard.additionalUrls}
                </Text>
                </>
              )}
                    {selectedCard.type === 'Student' && (
                <>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Phone: </Text> {selectedCard.phone}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>School Email: </Text> {selectedCard.schoolEmail}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>School Location: </Text> {selectedCard.location}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>LinkedIn: </Text> {selectedCard.linkedin}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>School / University: </Text> {selectedCard.school}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Major: </Text> {selectedCard.major}
                </Text>
                <Text style={[styles.detailText, {color : isDarkMode ? '#fff' : '#000'}]}>
                  <Text style={styles.boldLabel}>Additional Info: </Text> {selectedCard.additionalInfo}
                </Text>
                </>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress ={() => setDetailsModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header:{
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
    backgroundColor: '#dddddd',
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
    alignItems: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  optionLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 11.5,
    color: '#000000',
  },
  optionValue: {
    color: '#007bff',
    fontSize: 12,
  },
  darkOptionValue: {
    color: '#007bff',
    fontSize: 12,
  },
  selectedOption: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  optionSeparator: {
    marginHorizontal: 5,
    color: '#000000',
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    height: 200,
    width: '100%',
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
  cardText: {
    fontSize: 15,
    color: '#000000',
    marginTop: 5,
  },
  noCardText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  CardDetailsContainer:{
    flex: 1,
  },
  detailsContainer:{
    marginTop: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SocialIconContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  deleteButton:{
    backgroundColor: '#D72E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '91%',
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
  },
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle:{
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  detailText:{
    fontSize: 16,
    marginBottom: 14,
  },
  boldLabel:{
    fontFamily: 'Sans-Serif',
    fontWeight: 'bold',
    fontSize: 17,
  },
  closeButton:{
    backgroundColor: '#D72E2E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText:{
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DisplayCardsScreen;