import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]"  options={{ headerShown: false }} />
        <Stack.Screen name="likes"        options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles"     options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes" options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos"        options={{ headerShown: false }} />
        <Stack.Screen name="perfil/editar"     options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </>
  );
}
