import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, deleteUser, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useColorScheme, KeyboardAvoidingView } from 'react-native';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useDarkMode } from '../../DarkModeContext';


const DeleteAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();
  const colorScheme = useColorScheme();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setEmail(user.email || ''); 
      } else {
        router.push('../../(auth)/login');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleDeleteAccount = async () => {
    try {
      if (!currentUser) {
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.uid !== currentUser.uid) {
        Alert.alert('Error', 'You can only delete the account you are currently logged into.');
        return;
      }

      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: async () => {
              const userCardsCollectionRef = collection(firestore, `users/${user.uid}/cards`);
              const userCardsSnapshot = await getDocs(userCardsCollectionRef);
              const cardDeletions = userCardsSnapshot.docs.map((cardDoc) => {
                const cardDocRef = doc(firestore, 'cards', cardDoc.id);
                return deleteDoc(cardDocRef);
              });
              await Promise.all(cardDeletions);

              const userDocRef = doc(db, 'users', user.uid);
              await deleteDoc(userDocRef);

              const walletDocRef = doc(firestore, 'wallets', user.uid);
              await deleteDoc(walletDocRef);

              const unsubscribe = onAuthStateChanged(auth, () => {});
              await deleteUser(user);
              unsubscribe(); 
              Alert.alert('Account Deleted', 'Your account and related data have been deleted.');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please check your credentials.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <KeyboardAvoidingView behavior='padding'>
            <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000' }]}>
              This page is to delete your account! Please enter your password and confirm if you want to delete
            </Text>
            <TextInput
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                value={email}
                onChangeText={setEmail}
                editable={false} // Make the email field non-editable since it must match the logged-in user
            />
            <TextInput
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Arial',
    fontSize: 15,
  },
});

export default DeleteAccount;
