import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LikesProvider } from '@/context/LikesContext';
import { colors } from '@/theme/colors';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// ─── Splash JS — PNG transparente centrado sobre fondo naranja ────────────────
function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </View>
  );
}

// ─── Navegador raíz ───────────────────────────────────────────────────────────
function RootNavigator() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Splash visible exactamente 2 segundos
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Solo redirige al arranque: si no hay token → login
  useEffect(() => {
    if (!splashDone || loading) return;
    if (!token) router.replace('/login');
  }, [splashDone, loading]);

  // 1. Splash durante los primeros 2 segundos
  if (!splashDone) return <SplashScreen />;

  // 2. Si auth todavía carga después de 2 s → spinner simple
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 3. App lista
  return (
    <LikesProvider>
      <Stack>
        <Stack.Screen name="login"                options={{ headerShown: false }} />
        <Stack.Screen name="register"             options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"               options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]"          options={{ headerShown: false }} />
        <Stack.Screen name="likes"                options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles"       options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes"   options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos"          options={{ headerShown: false }} />
        <Stack.Screen name="perfil/editar"        options={{ headerShown: false }} />
        <Stack.Screen name="perfil/publicaciones" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" backgroundColor="transparent" translucent />
    </LikesProvider>
  );
}

// ─── Layout raíz ─────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 220,
    height: 220,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
});
