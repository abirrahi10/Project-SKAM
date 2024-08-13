import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useDarkMode } from '../../DarkModeContext';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../ColorConfig';

const gradients = [
  ['#cdffd8', '#94b9ff'],
  ['#ff9a9e', '#fad0c4'],
  ['#a18cd1', '#fbc2eb'],
  ['#fad0c4', '#ffd1ff'],
  ['#ffecd2', '#fcb69f'],
  ['#ff9a9e', '#fecfef'],
  ['#2E3192', '#1BFFFF'],
  ['#FF512F','#DD2476'],
  ['#02AABD','#00CDAC'],
  ['#D8B5FF','#1EAE98'],
  ['#FF5F6D','#FFC371'],
  ['#662D8C','#ED1E79'],

];

const cardColors = gradients.map((gradient, index) => ({
  label: `Gradient ${index + 1}`,
  value: `item${index + 1}`,
  gradient: gradient,
}));

const DropdownComponent = () => {
  const [value, setValue] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();
  const { setColors } = useColors();

  const handleColorChange = (item: { label: string; value: string; gradient: string[] }) => {
    setValue(item.value);
    setColors(item.gradient);
  };

  const renderItem = (item: { label: string; value: string; gradient: string[] }) => (
    <LinearGradient
      colors={item.gradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.item, { backgroundColor: 'grey' }]}
    >
      <Text style={[styles.itemText, { color: '#000' }]}>
        {item.label}
      </Text>
    </LinearGradient>
  );

  return (
    <Dropdown
    style={[styles.dropdown]}
    containerStyle={{ backgroundColor: isDarkMode ? '#000' : '#fff' }} // Set background color for the dropdown container
    placeholderStyle={[styles.placeholderStyle, { color: '#000', fontSize: 20 }]}
    selectedTextStyle={[styles.selectedTextStyle, { color: isDarkMode ? '#fff' : '#000' }]}
    inputSearchStyle={[styles.inputSearchStyle, { color: isDarkMode ? '#fff' : '#000' }]}
    iconStyle={styles.iconStyle}
    data={cardColors}
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholder="Change Card Background"
    searchPlaceholder="Search..."
    value={value}
    onChange={item => handleColorChange(item)}
    renderRightIcon={() => (
      <AntDesign style={[styles.icon, { color: '#000' }]} name="down" size={20} />
    )}
    renderItem={renderItem}
  />
);
};

const DisplayPage = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { colors } = useColors();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Stack.Screen options={{ headerTitle: 'Display' }} />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={styles.switchContainer}>
        <Text style={[styles.switchName, { color: '#000' }]}>Toggle Dark Mode</Text>
        <Switch
          trackColor={{ false: '#81b0ff', true: 'green' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <DropdownComponent />
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
    backgroundColor: '#dddddd',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  switchName: {
    fontSize: 20,
    alignItems: 'flex-start',
  },
  dropdown: {
    backgroundColor:"#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 20,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  item: {
    padding: 20, 
    height: 80,  
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'black',
  },
  itemText: {
    fontSize: 20,
  },
});

export default DisplayPage;
