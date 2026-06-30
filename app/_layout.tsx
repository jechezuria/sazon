import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)"       options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]"  options={{ headerShown: false }} />
        <Stack.Screen name="likes"        options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles"     options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes" options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos"        options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </AuthProvider>
  );
}
