// /mnt/data/ColorConfig.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ColorContextType {
  colors: string[];
  setColors: (newColors: string[]) => void;
}

const defaultColors: string[] = ['#cdffd8', '#94b9ff'];

const ColorContext = createContext<ColorContextType>({
  colors: defaultColors,
  setColors: () => {},
});

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider = ({ children }: ColorProviderProps) => {
  const [colors, setColorsState] = useState<string[]>(defaultColors);

  const setColors = async (newColors: string[]) => {
    setColorsState(newColors);
    await AsyncStorage.setItem('colors', JSON.stringify(newColors));
  };

  useEffect(() => {
    const loadColors = async () => {
      const savedColors = await AsyncStorage.getItem('colors');
      if (savedColors !== null) {
        setColorsState(JSON.parse(savedColors));
      }
    };

    loadColors();
  }, []);

  return (
    <ColorContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);