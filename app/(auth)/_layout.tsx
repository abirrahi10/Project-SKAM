import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true, // Show header for all screens in this stack
      headerBackTitle: "Back", // Set back button text for all screens
      headerTitleAlign: "center", // Center the header title
    }}>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Login",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: "Sign Up",
          headerShown: false,
        }} 
      />
    </Stack>
  );
}