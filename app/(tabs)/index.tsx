// Implemented some small changes and styling

/*
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, useColorScheme, TouchableOpacity, TouchableHighlight, TextInput, Modal, Linking, ScrollView, KeyboardAvoidingView, Platform, Switch, Animated } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, setDoc, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

interface UserData {
  id: string;
  type: string;
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
}

const Card: React.FC<{ card: UserData; onPress: () => void; onLongPress: () => void; onDelete: () => void; editMode: boolean }> = ({ card, onPress, onLongPress, onDelete, editMode }) => {
  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => confirmDelete()}
      >
        <Animated.View style={[styles.deleteButtonContent, { transform: [{ translateX: trans }] }]}>
          <Icon name="trash" size={24} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete }
      ]
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={editMode ? onPress : undefined} 
        onLongPress={onLongPress}
      >
        <LinearGradient
          colors={['#cdffd8', '#94b9ff']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.cardType}>{card.type}</Text>
              <Text style={styles.cardName}>{`${card.firstName} ${card.lastName}`}</Text>
              {card.phone && <Text style={styles.cardPhone}>{card.phone}</Text>}
              {card.personalEmail && <Text style={styles.cardEmail}>{card.personalEmail}</Text>}
            </View>
          </View>
          <View style={styles.socialIcons}>
            {card.instagram && <Icon name="instagram" size={24} color="#C13584" onPress={() => openUrl(card.instagram)} />}
            {card.twitter && <Icon name="twitter" size={24} color="#1DA1F2" onPress={() => openUrl(card.twitter)} />}
            {card.facebook && <Icon name="facebook" size={24} color="#3b5998" onPress={() => openUrl(card.facebook)} />}
            {card.linkedin && <Icon name="linkedin" size={24} color="#0077B5" onPress={() => openUrl(card.linkedin)} />}
            {card.snapchat && <Icon name="snapchat" size={24} color="#FFFC00" onPress={() => openUrl(card.snapchat)} />}
            {card.discord && <Icon name="discord" size={24} color="#7289DA" onPress={() => openUrl(card.discord)} />}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<UserData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cardTypeModalVisible, setCardTypeModalVisible] = useState(false);
  const [createdCardTypes, setCreatedCardTypes] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null); // Updated to store user information
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false); // State to control social media visibility

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchCards(currentUser.uid); // Fetch cards for the logged-in user
        } else {
          setUser(null);
          setCards([]);
          setLoading(false);
        }
      });
    };

    const fetchCards = async (userId: string) => {
      try {
        const userCardsCollection = collection(db, 'users', userId, 'cards');
        const querySnapshot = await getDocs(userCardsCollection);
        const cardList: UserData[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setCards(cardList);
        setLoading(false);
        setCreatedCardTypes(new Set(cardList.map(card => card.type)));
      } catch (error) {
        setLoading(false);
        console.error('Error fetching cards: ', error);
      }
    };

    fetchUser();
  }, [modalVisible]);

  const handleCardPress = (card: UserData) => {
    if (editMode) {
      setSelectedCard(card);
      setModalVisible(true);
    }
  };

  const handleCardLongPress = (card: UserData) => {
    setSelectedCard(card);
    setDetailsModalVisible(true);
  };

  const handleDelete = async (cardId: string) => {
    if (!user || !cardId) {
      Alert.alert('Error', 'Invalid card ID or user not authenticated');
      return;
    }

    console.log('Deleting card with ID:', cardId);
    try {
      const cardRef = doc(db, 'cards', cardId);
      const userCardRef = doc(db, 'users', user.uid, 'cards', cardId);
      await deleteDoc(cardRef);
      await deleteDoc(userCardRef);
      setCards(cards.filter(card => card.id !== cardId));
      setCreatedCardTypes(new Set(cards.filter(card => card.id !== cardId).map(card => card.type))); // Update createdCardTypes state
      Alert.alert('Success', 'Card deleted successfully');
    } catch (error) {
      console.error('Failed to delete card:', error);
      Alert.alert('Error', `Failed to delete card: ${(error as Error).message}`);
    }
  };

  const handleSave = async () => {
    if (selectedCard && user) {
      try {
        if (isAdding) {
          const cardRef = await addDoc(collection(db, 'cards'), selectedCard);
          selectedCard.id = cardRef.id;
          const userCardRef = doc(db, 'users', user.uid, 'cards', selectedCard.id);
          await setDoc(userCardRef, selectedCard);
          Alert.alert('Success', 'Card added successfully');
        } else {
          const cardRef = doc(db, 'cards', selectedCard.id);
          const userCardRef = doc(db, 'users', user.uid, 'cards', selectedCard.id);
          await updateDoc(cardRef, selectedCard as { [x: string]: any });
          await updateDoc(userCardRef, selectedCard as { [x: string]: any });
          Alert.alert('Success', 'Card updated successfully');
        }
        setModalVisible(false);
        setEditMode(false);
        setIsAdding(false);
        setLoading(true);
        setCards([]);
      } catch (error) {
        Alert.alert('Error', `Failed to save card: ${(error as Error).message}`);
      }
    }
  };

  const handleChange = (name: keyof UserData, value: string | string[]) => {
    if (selectedCard) {
      if (name === 'additionalUrls' && Array.isArray(value)) {
        setSelectedCard({ ...selectedCard, [name]: value });
      } else {
        setSelectedCard({ ...selectedCard, [name]: value });
      }
    }
  };

  const handleAddPress = () => {
    if (cards.length >= 3) {
      Alert.alert('Limit reached', 'You can only create up to 3 cards.');
      return;
    }
    setCardTypeModalVisible(true);
  };

  const handleCardTypeSelect = (type: string) => {
    setCardTypeModalVisible(false);
    setSelectedCard({ id: '', type, firstName: '', lastName: '', phone: '', workNumber: '', workEmail: '', schoolEmail: '', personalEmail: '', location: '', linkedin: '', school: '', major: '', discord: '', additionalInfo: '', instagram: '', twitter: '', facebook: '', tiktok: '', snapchat: '', birthday: '', additionalUrls: [] });
    setIsAdding(true);
    setModalVisible(true);
  };

  const renderFormFields = () => {
    return (
      <>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={selectedCard?.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={selectedCard?.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
        />
        {selectedCard?.type === 'Work' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Work Number"
              value={selectedCard.workNumber}
              onChangeText={(value) => handleChange('workNumber', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Work Email"
              value={selectedCard.workEmail}
              onChangeText={(value) => handleChange('workEmail', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Location (City, State)"
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn"
              value={selectedCard.linkedin}
              onChangeText={(value) => handleChange('linkedin', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional URLs (comma-separated)"
              value={selectedCard.additionalUrls?.join(', ')}
              onChangeText={(value) => handleChange('additionalUrls', value.split(', '))}
            />
          </>
        )}
        {selectedCard?.type === 'Student' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={selectedCard.phone}
              onChangeText={(value) => handleChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="School Email"
              value={selectedCard.schoolEmail}
              onChangeText={(value) => handleChange('schoolEmail', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Personal Email"
              value={selectedCard.personalEmail}
              onChangeText={(value) => handleChange('personalEmail', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="School Location"
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="LinkedIn"
              value={selectedCard.linkedin}
              onChangeText={(value) => handleChange('linkedin', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="School"
              value={selectedCard.school}
              onChangeText={(value) => handleChange('school', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Major"
              value={selectedCard.major}
              onChangeText={(value) => handleChange('major', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Discord"
              value={selectedCard.discord}
              onChangeText={(value) => handleChange('discord', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional Info"
              value={selectedCard.additionalInfo}
              onChangeText={(value) => handleChange('additionalInfo', value)}
            />
          </>
        )}
        {selectedCard?.type === 'Personal' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={selectedCard.phone}
              onChangeText={(value) => handleChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Personal Email"
              value={selectedCard.personalEmail}
              onChangeText={(value) => handleChange('personalEmail', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <View style={styles.socialMediaToggle}>
            <Text>Show Social Media</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={showSocialMedia ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShowSocialMedia(!showSocialMedia)}
              value={showSocialMedia}
            />
          </View>
            {showSocialMedia && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Instagram"
                  value={selectedCard.instagram}
                  onChangeText={(value) => handleChange('instagram', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Twitter"
                  value={selectedCard.twitter}
                  onChangeText={(value) => handleChange('twitter', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Facebook"
                  value={selectedCard.facebook}
                  onChangeText={(value) => handleChange('facebook', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="TikTok"
                  value={selectedCard.tiktok}
                  onChangeText={(value) => handleChange('tiktok', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Snapchat"
                  value={selectedCard.snapchat}
                  onChangeText={(value) => handleChange('snapchat', value)}
                />
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="Birthday"
              value={selectedCard.birthday}
              onChangeText={(value) => handleChange('birthday', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional Info"
              value={selectedCard.additionalInfo}
              onChangeText={(value) => handleChange('additionalInfo', value)}
            />
          </>
         )}
      </>
    );
  };

  const isDarkMode = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        {!editMode && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {
            setEditMode(!editMode);
          if (!editMode) {
            Alert.alert('Edit Mode', 'You are now in Edit Mode.');
          }
        }}
      >
        {editMode ? (
    <Text style={styles.doneButtonText}>Done</Text>
  ) : (
    <Icon name="edit" size={24} color="#007bff" />
    )}
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>YOUR CARDS</Text>
        {editMode && <Text style={styles.editModeText}>Select a card to edit, hit Done when finished.</Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView>
            {cards.map(card => (
              <Card
              key={card.id}
              card={card}
              onPress={() => handleCardPress(card)}
              onLongPress={() => handleCardLongPress(card)}
              onDelete={() => handleDelete(card.id)}
              editMode={editMode}
            />
          ))}
          </ScrollView>
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={cardTypeModalVisible}
          onRequestClose={() => setCardTypeModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Card Type</Text>
            {['Student', 'Work', 'Personal'].map(type => (
              <TouchableHighlight
                key={type}
                style={[
                  styles.cardTypeButton,
                  createdCardTypes.has(type) && styles.disabledButton
                ]}
                onPress={() => !createdCardTypes.has(type) && handleCardTypeSelect(type)}
                disabled={createdCardTypes.has(type)}>
                <Text style={styles.cardTypeButtonText}>{type}</Text>
              </TouchableHighlight>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setCardTypeModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setIsAdding(false);
          }}>
          <View style={styles.container}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{isAdding ? 'Add Details' : 'Edit Details'}</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                {selectedCard && (
                  <>
                    {renderFormFields()}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={detailsModalVisible}
          onRequestClose={() => setDetailsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Card Details</Text>
            <ScrollView>
              {selectedCard && (
                <View>
                  <Text style={styles.detailText}>Type: {selectedCard.type}</Text>
                  <Text style={styles.detailText}>Name: {selectedCard.firstName} {selectedCard.lastName}</Text>
                  <Text style={styles.detailText}>Phone: {selectedCard.phone}</Text>
                  <Text style={styles.detailText}>Work Number: {selectedCard.workNumber}</Text>
                  <Text style={styles.detailText}>Work Email: {selectedCard.workEmail}</Text>
                  <Text style={styles.detailText}>School Email: {selectedCard.schoolEmail}</Text>
                  <Text style={styles.detailText}>Personal Email: {selectedCard.personalEmail}</Text>
                  <Text style={styles.detailText}>Location: {selectedCard.location}</Text>
                  <Text style={styles.detailText}>School: {selectedCard.school}</Text>
                  <Text style={styles.detailText}>Major: {selectedCard.major}</Text>
                  <Text style={styles.detailText}>Discord: {selectedCard.discord}</Text>
                  <Text style={styles.detailText}>Additional Info: {selectedCard.additionalInfo}</Text>
                  <Text style={styles.detailText}>Instagram: {selectedCard.instagram}</Text>
                  <Text style={styles.detailText}>Twitter: {selectedCard.twitter}</Text>
                  <Text style={styles.detailText}>Facebook: {selectedCard.facebook}</Text>
                  <Text style={styles.detailText}>TikTok: {selectedCard.tiktok}</Text>
                  <Text style={styles.detailText}>Snapchat: {selectedCard.snapchat}</Text>
                  <Text style={styles.detailText}>Birthday: {selectedCard.birthday}</Text>
                  <Text style={styles.detailText}>Additional URLs: {selectedCard.additionalUrls?.join(', ')}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDetailsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start', 
    padding: 20, // Adjust padding to change white border size
    position: 'relative', 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 35,
  },
  addButton: {
    position: 'absolute',
    top: 56,
    left: 24,
    padding: 10, 
    zIndex: 1, // Adjust z-index to change button layering
  },
  addButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 26,
  },
  editButton: {
    position: 'absolute', 
    top: 62,
    right: 16,
    padding: 10,
    zIndex: 1, // Adjust z-index to change button layering
  },
  editButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  doneButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardWrapper: { // Around the card itself
    marginBottom: 30, // Space between each card
    borderRadius: 8,
    elevation: 10, 
  },
  card: { // Inside the card itself
    borderRadius: 10,
    padding: 20,
    // Adjust height to change card height
    height: 200, // Modify this value to change card height
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardType: { 
    marginTop: -8,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPhone: {
    marginTop: 5,
    fontSize: 15,
  },
  cardEmail: {
    marginTop: 5,
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: '#D72E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '87%',
    borderRadius: 8,
  },
  deleteButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: { // Buttons in "Select Card Type" when creating a new card
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: { // "Select Card Type" Font when creating a new card
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50, // Adjust this to change the vertical position
  },
  cardTypeButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTypeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#D72E2E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#2BBC51',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalContent: {
    paddingBottom: 70, // Adjust bottom padding for scrolling space in modal
  },
  detailText: { // Card Details when you hold onto the card
    fontSize: 16,
    marginBottom: 14, // Distance of each detail from each other
  },
  socialMediaToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  editModeText: {
    color: '#8B918D',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -20,
    marginBottom: 10,
  },
});
*/



// Some changes

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, useColorScheme, TouchableOpacity, TouchableHighlight, TextInput, Modal, Linking, ScrollView, KeyboardAvoidingView, Platform, Switch, Animated } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, setDoc, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

interface UserData {
  id: string;
  type: string;
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
}

const Card: React.FC<{ card: UserData; onPress: () => void; onLongPress: () => void; onDelete: () => void; editMode: boolean }> = ({ card, onPress, onLongPress, onDelete, editMode }) => {
  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => confirmDelete()}
      >
        <Animated.View style={[styles.deleteButtonContent, { transform: [{ translateX: trans }] }]}>
          <Icon name="trash" size={24} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete }
      ]
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={editMode ? onPress : undefined} 
        onLongPress={onLongPress}
      >
        <LinearGradient
          colors={['#cdffd8', '#94b9ff']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardText}>
              <Text style={styles.cardType}>{card.type}</Text>
              <Text style={styles.cardName}>{`${card.firstName} ${card.lastName}`}</Text>
              {card.phone && <Text style={styles.cardPhone}>{card.phone}</Text>}
              {card.personalEmail && <Text style={styles.cardEmail}>{card.personalEmail}</Text>}
            </View>
          </View>
          <View style={styles.socialIcons}>
            {card.instagram && <Icon name="instagram" size={24} color="#C13584" onPress={() => openUrl(card.instagram)} />}
            {card.twitter && <Icon name="twitter" size={24} color="#1DA1F2" onPress={() => openUrl(card.twitter)} />}
            {card.facebook && <Icon name="facebook" size={24} color="#3b5998" onPress={() => openUrl(card.facebook)} />}
            {card.linkedin && <Icon name="linkedin" size={24} color="#0077B5" onPress={() => openUrl(card.linkedin)} />}
            {card.snapchat && <Icon name="snapchat" size={24} color="#FFFC00" onPress={() => openUrl(card.snapchat)} />}
            {card.discord && <Icon name="discord" size={24} color="#7289DA" onPress={() => openUrl(card.discord)} />}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<UserData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cardTypeModalVisible, setCardTypeModalVisible] = useState(false);
  const [createdCardTypes, setCreatedCardTypes] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  const fetchCards = async (userId: string) => {
    try {
      const userCardsCollection = collection(db, 'users', userId, 'cards');
      const querySnapshot = await getDocs(userCardsCollection);
      const cardList: UserData[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
      setCards(cardList);
      setLoading(false);
      setCreatedCardTypes(new Set(cardList.map(card => card.type)));
    } catch (error) {
      setLoading(false);
      console.error('Error fetching cards: ', error);
    }
  };

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchCards(currentUser.uid);
        } else {
          setUser(null);
          setCards([]);
          setLoading(false);
        }
      });
    };

    fetchUser();
  }, [modalVisible]);

  const handleCardPress = (card: UserData) => {
    if (editMode) {
      setSelectedCard(card);
      setModalVisible(true);
    }
  };

  const handleCardLongPress = (card: UserData) => {
    setSelectedCard(card);
    setDetailsModalVisible(true);
  };

  const handleDelete = async (cardId: string) => {
    if (!user || !cardId) {
      Alert.alert('Error', 'Invalid card ID or user not authenticated');
      return;
    }

    console.log('Deleting card with ID:', cardId);
    try {
      const cardRef = doc(db, 'cards', cardId);
      const userCardRef = doc(db, 'users', user.uid, 'cards', cardId);
      await deleteDoc(cardRef);
      await deleteDoc(userCardRef);
      setCards(cards.filter(card => card.id !== cardId));
      setCreatedCardTypes(new Set(cards.filter(card => card.id !== cardId).map(card => card.type))); // Update createdCardTypes state
      Alert.alert('Success', 'Card deleted successfully');
    } catch (error) {
      console.error('Failed to delete card:', error);
      Alert.alert('Error', `Failed to delete card: ${(error as Error).message}`);
    }
  };

  const handleSave = async () => {
    if (selectedCard && user) {
      try {
        if (isAdding) {
          const cardRef = await addDoc(collection(db, 'cards'), selectedCard);
          selectedCard.id = cardRef.id;
          const userCardRef = doc(db, 'users', user.uid, 'cards', selectedCard.id);
          await setDoc(userCardRef, selectedCard);
          Alert.alert('Success', 'Card added successfully');
        } else {
          const cardRef = doc(db, 'cards', selectedCard.id);
          const userCardRef = doc(db, 'users', user.uid, 'cards', selectedCard.id);
          await updateDoc(cardRef, selectedCard as { [x: string]: any });
          await updateDoc(userCardRef, selectedCard as { [x: string]: any });
          Alert.alert('Success', 'Card updated successfully');
        }
        setModalVisible(false);
        setEditMode(false);
        setIsAdding(false);
        setLoading(true);
        setCards([]);
      } catch (error) {
        Alert.alert('Error', `Failed to save card: ${(error as Error).message}`);
      }
    }
  };

  const handleChange = (name: keyof UserData, value: string | string[]) => {
    if (selectedCard) {
      if (name === 'additionalUrls' && Array.isArray(value)) {
        setSelectedCard({ ...selectedCard, [name]: value });
      } else {
        setSelectedCard({ ...selectedCard, [name]: value });
      }
    }
  };

  const handleAddPress = () => {
    if (cards.length >= 3) {
      Alert.alert('Limit reached', 'You can only create up to 3 cards.');
      return;
    }
    setCardTypeModalVisible(true);
  };

  const handleCardTypeSelect = (type: string) => {
    setCardTypeModalVisible(false);
    setSelectedCard({ id: '', type, firstName: '', lastName: '', phone: '', workNumber: '', workEmail: '', schoolEmail: '', personalEmail: '', location: '', linkedin: '', school: '', major: '', discord: '', additionalInfo: '', instagram: '', twitter: '', facebook: '', tiktok: '', snapchat: '', birthday: '', additionalUrls: [] });
    setIsAdding(true);
    setModalVisible(true);
  };

  const renderFormFields = () => {
    return (
      <>
        <TextInput
          style={[
            styles.input,
            { 
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? '#555' : '#ccc',
              backgroundColor: isDarkMode ? '#333' : '#fff'
            }
          ]}
          placeholder="First Name"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          value={selectedCard?.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
        />
        <TextInput
          style={[
            styles.input,
            { 
              color: isDarkMode ? '#fff' : '#000',
              borderColor: isDarkMode ? '#555' : '#ccc',
              backgroundColor: isDarkMode ? '#333' : '#fff'
            }
          ]}
          placeholder="Last Name"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          value={selectedCard?.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
        />
        {selectedCard?.type === 'Work' && (
          <>
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Work Number"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.workNumber}
              onChangeText={(value) => handleChange('workNumber', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Work Email"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.workEmail}
              onChangeText={(value) => handleChange('workEmail', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Location (City, State)"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="LinkedIn"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.linkedin}
              onChangeText={(value) => handleChange('linkedin', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Additional URLs (comma-separated)"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.additionalUrls?.join(', ')}
              onChangeText={(value) => handleChange('additionalUrls', value.split(', '))}
            />
          </>
        )}
        {selectedCard?.type === 'Student' && (
          <>
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Phone Number"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.phone}
              onChangeText={(value) => handleChange('phone', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="School Email"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.schoolEmail}
              onChangeText={(value) => handleChange('schoolEmail', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Personal Email"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.personalEmail}
              onChangeText={(value) => handleChange('personalEmail', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="School Location"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="LinkedIn"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.linkedin}
              onChangeText={(value) => handleChange('linkedin', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="School"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.school}
              onChangeText={(value) => handleChange('school', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Major"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.major}
              onChangeText={(value) => handleChange('major', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Discord"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.discord}
              onChangeText={(value) => handleChange('discord', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Additional Info"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.additionalInfo}
              onChangeText={(value) => handleChange('additionalInfo', value)}
            />
          </>
        )}
        {selectedCard?.type === 'Personal' && (
          <>
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Phone Number"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.phone}
              onChangeText={(value) => handleChange('phone', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Personal Email"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.personalEmail}
              onChangeText={(value) => handleChange('personalEmail', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Location"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.location}
              onChangeText={(value) => handleChange('location', value)}
            />
            <View style={styles.socialMediaToggle}>
            <Text>Show Social Media</Text>
            <Switch
              trackColor={{ false: "#CBD8CF", true: "#36c244" }}
              thumbColor={showSocialMedia ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#CBD8CF"
              onValueChange={() => setShowSocialMedia(!showSocialMedia)}
              value={showSocialMedia}
            />
          </View>
            {showSocialMedia && (
              <>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? '#555' : '#ccc',
                      backgroundColor: isDarkMode ? '#333' : '#fff'
                    }
                  ]}
                  placeholder="Instagram (provide URL)"
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  value={selectedCard.instagram}
                  onChangeText={(value) => handleChange('instagram', value)}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? '#555' : '#ccc',
                      backgroundColor: isDarkMode ? '#333' : '#fff'
                    }
                  ]}
                  placeholder="Twitter (provide URL)"
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  value={selectedCard.twitter}
                  onChangeText={(value) => handleChange('twitter', value)}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? '#555' : '#ccc',
                      backgroundColor: isDarkMode ? '#333' : '#fff'
                    }
                  ]}
                  placeholder="Facebook"
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  value={selectedCard.facebook}
                  onChangeText={(value) => handleChange('facebook', value)}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? '#555' : '#ccc',
                      backgroundColor: isDarkMode ? '#333' : '#fff'
                    }
                  ]}
                  placeholder="TikTok"
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  value={selectedCard.tiktok}
                  onChangeText={(value) => handleChange('tiktok', value)}
                />
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: isDarkMode ? '#fff' : '#000',
                      borderColor: isDarkMode ? '#555' : '#ccc',
                      backgroundColor: isDarkMode ? '#333' : '#fff'
                    }
                  ]}
                  placeholder="Snapchat"
                  placeholderTextColor={isDarkMode ? '#999' : '#666'}
                  value={selectedCard.snapchat}
                  onChangeText={(value) => handleChange('snapchat', value)}
                />
              </>
            )}
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Birthday"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.birthday}
              onChangeText={(value) => handleChange('birthday', value)}
            />
            <TextInput
              style={[
                styles.input,
                { 
                  color: isDarkMode ? '#fff' : '#000',
                  borderColor: isDarkMode ? '#555' : '#ccc',
                  backgroundColor: isDarkMode ? '#333' : '#fff'
                }
              ]}
              placeholder="Additional Info"
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={selectedCard.additionalInfo}
              onChangeText={(value) => handleChange('additionalInfo', value)}
            />
          </>
         )}
      </>
    );
  };

  const isDarkMode = colorScheme === 'dark';

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Please log in to view your cards</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        {!user ? (
          <>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Please log in to view your wallet</Text>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => {/* Navigate to Settings/Login page */}}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {!editMode && (
              <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => {
                setEditMode(!editMode);
                if (!editMode) {
                  Alert.alert('Edit Mode', 'You are now in Edit Mode.');
                }
              }}
            >
              {editMode ? (
                <Text style={styles.doneButtonText}>Done</Text>
              ) : (
                <Icon name="edit" size={24} color="#007bff" />
              )}
            </TouchableOpacity>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>YOUR CARDS</Text>
            {editMode && <Text style={styles.editModeText}>Select a card to edit, hit Done when finished.</Text>}
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView>
                {cards.map(card => (
                  <Card
                    key={card.id}
                    card={card}
                    onPress={() => handleCardPress(card)}
                    onLongPress={() => handleCardLongPress(card)}
                    onDelete={() => handleDelete(card.id)}
                    editMode={editMode}
                  />
                ))}
              </ScrollView>
            )}
  
            <Modal
              animationType="slide"
              transparent={false}
              visible={cardTypeModalVisible}
              onRequestClose={() => setCardTypeModalVisible(false)}>
              <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Select Card Type</Text>
                {['Student', 'Work', 'Personal'].map(type => (
                  <TouchableHighlight
                    key={type}
                    style={[
                      styles.cardTypeButton,
                      createdCardTypes.has(type) && styles.disabledButton
                    ]}
                    onPress={() => !createdCardTypes.has(type) && handleCardTypeSelect(type)}
                    disabled={createdCardTypes.has(type)}>
                    <Text style={styles.cardTypeButtonText}>{type}</Text>
                  </TouchableHighlight>
                ))}
                <TouchableOpacity style={styles.cancelButton} onPress={() => setCardTypeModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
  
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                setIsAdding(false);
              }}>
              <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{isAdding ? 'Add Details' : 'Edit Details'}</Text>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}>
                  <ScrollView contentContainerStyle={styles.modalContent}>
                    {selectedCard && (
                      <>
                        {renderFormFields()}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                          <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </Modal>
  
            <Modal
              animationType="slide"
              transparent={false}
              visible={detailsModalVisible}
              onRequestClose={() => setDetailsModalVisible(false)}>
              <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Card Details</Text>
                <ScrollView>
                  {selectedCard && (
                    <View>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Type: {selectedCard.type}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Name: {selectedCard.firstName} {selectedCard.lastName}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Phone: {selectedCard.phone}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Work Number: {selectedCard.workNumber}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Work Email: {selectedCard.workEmail}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>School Email: {selectedCard.schoolEmail}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Personal Email: {selectedCard.personalEmail}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Location: {selectedCard.location}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>School: {selectedCard.school}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Major: {selectedCard.major}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Discord: {selectedCard.discord}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Additional Info: {selectedCard.additionalInfo}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Instagram: {selectedCard.instagram}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Twitter: {selectedCard.twitter}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Facebook: {selectedCard.facebook}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>TikTok: {selectedCard.tiktok}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Snapchat: {selectedCard.snapchat}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Birthday: {selectedCard.birthday}</Text>
                      <Text style={[styles.detailText, { color: isDarkMode ? '#fff' : '#000' }]}>Additional URLs: {selectedCard.additionalUrls?.join(', ')}</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setDetailsModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Modal>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, // Adjust padding to change white border size
    position: 'relative', 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 35,
  },
  addButton: {
    position: 'absolute',
    top: 56,
    left: 24,
    padding: 10, 
    zIndex: 1, // Adjust z-index to change button layering
  },
  addButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 26,
  },
  editButton: {
    position: 'absolute', 
    top: 62,
    right: 16,
    padding: 10,
    zIndex: 1, // Adjust z-index to change button layering
  },
  editButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  doneButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardWrapper: { // Around the card itself
    marginBottom: 30, // Space between each card
    borderRadius: 8,
    elevation: 10, 
  },
  card: { // Inside the card itself
    borderRadius: 10,
    padding: 20,
    // Adjust height to change card height
    height: 200, // Modify this value to change card height
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardType: { 
    marginTop: -8,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPhone: {
    marginTop: 5,
    fontSize: 15,
  },
  cardEmail: {
    marginTop: 5,
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: '#D72E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '87%',
    borderRadius: 8,
  },
  deleteButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: { // Buttons in "Select Card Type" when creating a new card
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: { // "Select Card Type" Font when creating a new card
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50, // Adjust this to change the vertical position
  },
  cardTypeButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTypeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#D72E2E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2BBC51',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalContent: {
    paddingBottom: 70, // Adjust bottom padding for scrolling space in modal
  },
  detailText: { // Card Details when you hold onto the card
    fontSize: 16,
    marginBottom: 14, // Distance of each detail from each other
  },
  socialMediaToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  editModeText: {
    color: '#8B918D',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -20,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',  // This will be overridden inline for dark mode
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});