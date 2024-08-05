import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useDarkMode } from '../../DarkModeContext';

const DisplayPage = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.switchContainer}>
        <Text style={[styles.switchName, { color: isDarkMode ? '#fff' : '#000' }]}>Dark mode</Text>
        <Switch
          trackColor={{ false: '#81b0ff', true: '#767577' }}
          thumbColor={isDarkMode ? '#f4f3f4' : '#f5dd4b'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkMode}
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
