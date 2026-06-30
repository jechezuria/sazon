// URL del backend en un solo lugar. Cuando el backend se suba a Render,
// solo hay que cambiar EXPO_PUBLIC_API_URL en el .env (o el fallback de acá abajo).
//
// Expo solo expone al cliente las variables de entorno que empiezan con EXPO_PUBLIC_.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
