import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';

    async function setupNewUser(uid: string) {
        try {
            // Create empty user document
            await setDoc(doc(db, 'users', uid), {});
            
            // Create empty wallet document
            await setDoc(doc(db, 'wallets', uid), { cards: [] });
            
            console.log('New user documents created successfully');
        } catch (error) {
            console.error('Error setting up new user:', error);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setupNewUser(user.uid);
            alert("Account created successfully!");
            router.replace("(tabs)");
        } catch (error: any) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <KeyboardAvoidingView behavior='padding'>
                <Text style={[styles.title, isDarkMode && styles.darkText]}>Sign Up</Text>
                <TextInput
                    value={email}
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    placeholder="Email"
                    placeholderTextColor={isDarkMode ? "#999" : "#666"}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    value={password}
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    placeholder="Password"
                    placeholderTextColor={isDarkMode ? "#999" : "#666"}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />
                {loading ? (
                    <ActivityIndicator size="large" color={isDarkMode ? "#ffffff" : "#0000ff"} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={signUp}>
                        <Text style={styles.buttonText}>Create Account</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
                    <Text style={[styles.linkText, isDarkMode && styles.darkLinkText]}>Already have an account? Sign in</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#1a1a1a',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#000000',
    },
    darkText: {
        color: '#ffffff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: '#000000',
        backgroundColor: '#ffffff',
    },
    darkInput: {
        color: '#ffffff',
        backgroundColor: '#333333',
        borderColor: '#666666',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
    darkLinkText: {
        color: '#4da6ff',
    },
});