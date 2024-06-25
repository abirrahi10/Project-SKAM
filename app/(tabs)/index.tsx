// OG CODE
/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface UserData {
  first: string;
  middle: string;
  last: string;
  born: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    first: '',
    middle: '',
    last: '',
    born: ''
  });

  const handleChange = (name: keyof UserData, value: string) => {
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const addDocument = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        first: userData.first,
        middle: userData.middle,
        last: userData.last,
        born: parseInt(userData.born)
      });

      setLoading(false);
      Alert.alert('Success', `Document written with ID: ${docRef.id}`);
    } catch (error) {
      setLoading(false);
      // Assert the type of error as Error
      if (error instanceof Error) {
        Alert.alert('Error', `Error adding document: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000' }]}>Firebase Firestore Example</Text>
      <Input
        placeholder="First Name"
        value={userData.first}
        onChangeText={(value) => handleChange('first', value)}
      />
      <Input
        placeholder="Middle Name"
        value={userData.middle}
        onChangeText={(value) => handleChange('middle', value)}
      />
      <Input
        placeholder="Last Name"
        value={userData.last}
        onChangeText={(value) => handleChange('last', value)}
      />
      <Input
        placeholder="Year Born"
        value={userData.born}
        onChangeText={(value) => handleChange('born', value)}
        keyboardType="numeric"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Document" onPress={addDocument} buttonStyle={styles.button} />
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
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    marginTop: 20,
  },
});
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, useColorScheme, TouchableOpacity, TextInput, Modal, Linking } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const Card: React.FC<{ card: UserData; onPress: () => void; onDelete: () => void; editMode: boolean }> = ({ card, onPress, onDelete, editMode }) => {
  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress}>
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
            {card.workNumber && <Text style={styles.cardPhone}>{card.workNumber}</Text>}
            {card.workEmail && <Text style={styles.cardEmail}>{card.workEmail}</Text>}
            {card.schoolEmail && <Text style={styles.cardEmail}>{card.schoolEmail}</Text>}
            {card.personalEmail && <Text style={styles.cardEmail}>{card.personalEmail}</Text>}
            {card.location && <Text style={styles.cardLocation}>{card.location}</Text>}
            {card.school && <Text style={styles.cardSchool}>{card.school}</Text>}
            {card.major && <Text style={styles.cardMajor}>{card.major}</Text>}
            {card.birthday && <Text style={styles.cardBirthday}>{card.birthday}</Text>}
            {card.additionalInfo && <Text style={styles.cardAdditionalInfo}>{card.additionalInfo}</Text>}
            <Text style={styles.cardMore}>TAP TO VIEW MORE</Text>
          </View>
          {editMode && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Icon name="trash" size={24} color="#D72E2E" />
            </TouchableOpacity>
          )}
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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'));
        const cardList: UserData[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setCards(cardList);
        setLoading(false);
        setCreatedCardTypes(new Set(cardList.map(card => card.type)));
      } catch (error) {
        setLoading(false);
        console.error('Error fetching cards: ', error);
      }
    };

    fetchCards();
  }, [modalVisible]);

  const handleCardPress = (card: UserData) => {
    if (editMode) {
      setSelectedCard(card);
      setModalVisible(true);
    } else {
      Alert.alert('Card Details', `Viewing details for card: ${card.firstName} ${card.lastName}`);
    }
  };

  const handleDelete = async (cardId: string) => {
    console.log('Deleting card with ID:', cardId);
    try {
      const cardRef = doc(db, `cards/${cardId}`);
      await deleteDoc(cardRef);
      setCards(cards.filter(card => card.id !== cardId));
      Alert.alert('Success', 'Card deleted successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to delete card: ${(error as Error).message}`);
    }
  };

  const handleSave = async () => {
    if (selectedCard) {
      try {
        if (isAdding) {
          const docRef = await addDoc(collection(db, 'cards'), selectedCard);
          selectedCard.id = docRef.id; // Ensure the new card has a valid ID
          Alert.alert('Success', 'Card added successfully');
        } else {
          console.log('Updating card with ID:', selectedCard.id);
          const cardRef = doc(db, `cards/${selectedCard.id}`);
          await updateDoc(cardRef, selectedCard as { [x: string]: any });
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

  const handleChange = (name: keyof UserData, value: string) => {
    if (selectedCard) {
      setSelectedCard({ ...selectedCard, [name]: value });
    }
  };

  const handleAddPress = () => {
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
              onChangeText={(value) => handleChange('additionalUrls', value.split(', ').join(', '))}
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
        <Text style={styles.editButtonText}>{editMode ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>YOUR CARDS</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onPress={() => handleCardPress(card)}
            onDelete={() => handleDelete(card.id)}
            editMode={editMode}
          />
        ))
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={cardTypeModalVisible}
        onRequestClose={() => setCardTypeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Card Type</Text>
          {['Student', 'Work', 'Personal'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.cardTypeButton,
                createdCardTypes.has(type) && styles.disabledButton
              ]}
              onPress={() => !createdCardTypes.has(type) && handleCardTypeSelect(type)}
              disabled={createdCardTypes.has(type)}>
              <Text style={styles.cardTypeButtonText}>{type}</Text>
            </TouchableOpacity>
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
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isAdding ? 'Add Details' : 'Edit Card'}</Text>
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start', 
    padding: 70, 
    position: 'relative', 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  addButton: {
    position: 'absolute', 
    top: 60,
    left: 20,
    padding: 10,
  },
  addButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  editButton: {
    position: 'absolute', 
    top: 64,
    right: 18,
    padding: 10,
  },
  editButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardWrapper: {
    marginBottom: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  card: {
    borderRadius: 8,
    padding: 20,
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
  cardLocation: {
    marginTop: 5,
    fontSize: 15,
  },
  cardSchool: {
    marginTop: 5,
    fontSize: 15,
  },
  cardMajor: {
    marginTop: 5,
    fontSize: 15,
  },
  cardBirthday: {
    marginTop: 5,
    fontSize: 15,
  },
  cardAdditionalInfo: {
    marginTop: 5,
    fontSize: 15,
  },
  cardMore: {
    marginTop: 20,
    // marginBottom: -10,
    fontSize: 10,
    color: '#007bff',
    textAlign: 'left',
  },
  deleteButton: {
    marginLeft: 10,
  },
  modalContainer: { 
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
  input: { // border around name, phone, email etc.
    borderWidth: 2, // border thickness
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10, // space between one another
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
});