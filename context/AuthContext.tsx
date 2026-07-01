import {
  AuthResponse,
  AuthUser,
  getMe,
  login as loginApi,
  LoginInput,
} from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const TOKEN_KEY = "@sazon:token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  setSession: (res: AuthResponse) => Promise<void>;
  updateUser: (updated: AuthUser) => void;
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
      .then(async (saved) => {
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

  async function setSession(res: AuthResponse) {
    await AsyncStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  }

  function updateUser(updated: AuthUser) {
    setUser(updated);
  }

  async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        setSession,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
