import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ title: 'Search Buses' }} />
        <Stack.Screen name="bus-list" options={{ title: 'Available Buses' }} />
        <Stack.Screen name="seat-selection" options={{ title: 'Select Seats' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment' }} />
        <Stack.Screen name="ticket" options={{ title: 'Your Ticket' }} />
        <Stack.Screen name="history" options={{ title: 'Trip History' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
