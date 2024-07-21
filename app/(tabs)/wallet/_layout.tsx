import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack>
      <Stack.Screen name="wallets" options={{ headerShown:false }} />
    </Stack>
  );
}