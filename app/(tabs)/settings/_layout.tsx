import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown:false }} />
      <Stack.Screen name="about"options={{ headerBackTitle: 'Settings' }}/>
      <Stack.Screen name="display"options={{ headerBackTitle: 'Settings' }}/>
      <Stack.Screen name="account"options={{ headerBackTitle: 'Settings' }}/>
      <Stack.Screen name="HowTo"options={{ headerBackTitle: 'Settings' }}/>
      <Stack.Screen name="changePassword"options={{ headerTitle: 'Change Password' }}/>
      <Stack.Screen name="changeEmail"options={{ headerTitle: 'Change Email ' }}/>

    </Stack>






  );
}