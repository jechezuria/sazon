import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LikesProvider } from "@/context/LikesContext";
import { colors } from "@/theme/colors";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Componente interno: puede usar hooks de Expo Router y de los contextos
function RootNavigator() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "login" || segments[0] === "register";
    if (!token && !inAuth) {
      router.replace("/login");
    } else if (token && inAuth) {
      router.replace("/(tabs)");
    }
  }, [token, loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LikesProvider>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles" options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes" options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos" options={{ headerShown: false }} />
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
