import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = async () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newIsDarkMode));
  };

  useEffect(() => {
    const loadPreferences = async () => {
      const savedPreference = await AsyncStorage.getItem('darkMode');
      if (savedPreference !== null) {
        setIsDarkMode(JSON.parse(savedPreference));
      } else {
        const colorScheme = Appearance.getColorScheme();
        setIsDarkMode(colorScheme === 'dark');
      }
    };

    loadPreferences();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
