import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ColorProvider } from './ColorConfig';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';  // Import the DarkModeProvider and useDarkMode

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <DarkModeProvider>
      <ThemedApp />
    </DarkModeProvider>
  );
}

function ThemedApp() {
  const { isDarkMode } = useDarkMode();
  return (
  <ColorProvider>
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>  
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    
    </ThemeProvider>
  </ColorProvider>
  );
}
