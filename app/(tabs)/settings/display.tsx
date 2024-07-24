import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Switch, StyleSheet, useColorScheme, Appearance } from 'react-native';
import { Stack } from 'expo-router';

const DisplayPage = () => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkModeEnabled(previousState => !previousState);
  };

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      setIsDarkModeEnabled(true); // true means dark
    } else {
      setIsDarkModeEnabled(false); // false means light
    }
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkModeEnabled(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  const [isAnotherSwitchEnabled, setIsAnotherSwitchEnabled] = useState(false);
  const toggleAnotherSwitch = () => setIsAnotherSwitchEnabled(previousState => !previousState);

  return (
    <View style={[styles.container, { backgroundColor: isDarkModeEnabled ? '#333' : '#f0f0f0' }]}>
      <StatusBar style={isDarkModeEnabled ? 'light' : 'dark'} />
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchName, { color: isDarkModeEnabled ? '#fff' : '#000' }]}>Dark mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkModeEnabled}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchName, { color: isDarkModeEnabled ? '#fff' : '#000' }]}>Another switch</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isAnotherSwitchEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAnotherSwitch}
          value={isAnotherSwitchEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'grey',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  switchName: {
    fontSize: 20,
    alignItems: 'flex-start',
  },



  
});

export default DisplayPage;
