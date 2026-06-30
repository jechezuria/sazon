import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LikesProvider } from '@/context/LikesContext';
import { colors } from '@/theme/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Componente interno: puede usar hooks de Expo Router y de los contextos
function RootNavigator() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inLogin = segments[0] === 'login';
    if (!token && !inLogin) {
      router.replace('/login');
    } else if (token && inLogin) {
      router.replace('/(tabs)');
    }
  }, [token, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LikesProvider>
      <Stack>
        <Stack.Screen name="login"                  options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"                 options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]"            options={{ headerShown: false }} />
        <Stack.Screen name="likes"                  options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles"         options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes"     options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos"            options={{ headerShown: false }} />
        <Stack.Screen name="perfil/editar"          options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </LikesProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
