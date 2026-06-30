import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, getMe, AuthUser, LoginInput } from '@/services/auth.service';

const TOKEN_KEY = '@sazon:token';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al iniciar: recupera el token guardado y valida la sesión
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then(async saved => {
        if (saved) {
          try {
            const me = await getMe(saved);
            setToken(saved);
            setUser(me);
          } catch {
            await AsyncStorage.removeItem(TOKEN_KEY);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(input: LoginInput) {
    const res = await loginApi(input);
    await AsyncStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
