import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
    const router = useRouter();

      useEffect(() => {
         // Usamos un pequeño timeout (0ms) para esperar al siguiente "tic" del motor
         // Esto evita el error de "Attempted to navigate before mounting"
         const timer = setTimeout(() => {
           router.replace('/register');
         }, 1);

         return () => clearTimeout(timer);
       }, []);

       return (
         <>
           <Stack>
             {/* AGREGÁ ESTA LÍNEA PARA QUE EL STACK CONOZCA LA PANTALLA */}
             <Stack.Screen name="register" options={{ headerShown: false }} />

             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
             <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
             <Stack.Screen name="likes" options={{ headerShown: false }} />
             <Stack.Screen name="crear/detalles" options={{ headerShown: false }} />
             <Stack.Screen name="crear/ingredientes" options={{ headerShown: false }} />
             <Stack.Screen name="crear/pasos" options={{ headerShown: false }} />
           </Stack>
           <StatusBar style="dark" backgroundColor="transparent" translucent />
         </>
       );
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]"  options={{ headerShown: false }} />
        <Stack.Screen name="likes"        options={{ headerShown: false }} />
        <Stack.Screen name="crear/detalles"     options={{ headerShown: false }} />
        <Stack.Screen name="crear/ingredientes" options={{ headerShown: false }} />
        <Stack.Screen name="crear/pasos"        options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </>
  );
}
