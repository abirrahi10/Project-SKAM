import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, useColorScheme } from 'react-native';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebaseConfig";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
                <Text style={[styles.title, isDarkMode && styles.darkText]}>Login</Text>
                <TextInput
                value={email}
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? "#999" : "#666"}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                />
                <TextInput
                value={password}
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? "#999" : "#666"}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
            />
                {loading ? (
                    <ActivityIndicator size="large" color={isDarkMode ? "#ffffff" : "#000000"} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/signup')}>
                    <Text style={[styles.linkText, isDarkMode && styles.darkLinkText]}>Don't have an account? Sign up</Text>
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
        backgroundColor: '#000000',
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