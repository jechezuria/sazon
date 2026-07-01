// Pruebas unitarias — screens/LoginScreen
// Verifica renderizado, validación de campos vacíos, llamada a login y navegación.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/login';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
const mockPush    = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

const mockLogin = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('LoginScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Renderizado ───────────────────────────────────────────────────────────────
  describe('renderizado inicial', () => {
    it('muestra el título Sazón', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Sazón')).toBeTruthy();
    });

    it('muestra el subtítulo de bienvenida', () => {
      render(<LoginScreen />);
      expect(screen.getByText('¡Encontrá tus recetas favoritas!')).toBeTruthy();
    });

    it('muestra el botón Iniciar sesión', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Iniciar sesión')).toBeTruthy();
    });

    it('muestra el link para registrarse', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Registrate')).toBeTruthy();
    });

    it('muestra el label del campo Email', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Email')).toBeTruthy();
    });

    it('muestra el label del campo Contraseña', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Contraseña')).toBeTruthy();
    });

    it('no muestra ningún error al iniciar', () => {
      render(<LoginScreen />);
      expect(screen.queryByText('Completá todos los campos')).toBeNull();
    });
  });

  // ── Validación ────────────────────────────────────────────────────────────────
  describe('validación de campos', () => {
    it('muestra error si se presiona el botón con campos vacíos', async () => {
      render(<LoginScreen />);
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(screen.getByText('Completá todos los campos')).toBeTruthy();
      });
    });

    it('no llama a login si los campos están vacíos', async () => {
      render(<LoginScreen />);
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });

    it('muestra error si solo se completa el email', async () => {
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'test@test.com');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(screen.getByText('Completá todos los campos')).toBeTruthy();
      });
    });

    it('muestra error si solo se completa la contraseña', async () => {
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('••••••'), 'MiClave1');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(screen.getByText('Completá todos los campos')).toBeTruthy();
      });
    });
  });

  // ── Login exitoso ─────────────────────────────────────────────────────────────
  describe('login exitoso', () => {
    it('llama a login con email y password correctos', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••'), 'MiClave1');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'sofia@test.com',
          password: 'MiClave1',
        });
      });
    });

    it('navega a /(tabs) después del login exitoso', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••'), 'MiClave1');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
      });
    });
  });

  // ── Error de backend ──────────────────────────────────────────────────────────
  describe('error de backend', () => {
    it('muestra el mensaje de error cuando login falla', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Credenciales incorrectas'));
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'wrong@test.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••'), 'WrongPwd1');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas')).toBeTruthy();
      });
    });

    it('no navega cuando login falla', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Error'));
      render(<LoginScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'x@x.com');
      fireEvent.changeText(screen.getByPlaceholderText('••••••'), 'MiClave1');
      fireEvent.press(screen.getByText('Iniciar sesión'));
      await waitFor(() => {
        expect(mockReplace).not.toHaveBeenCalled();
      });
    });
  });

  // ── Navegación secundaria ─────────────────────────────────────────────────────
  describe('navegación a registro', () => {
    it('navega a /register al presionar Registrate', () => {
      render(<LoginScreen />);
      fireEvent.press(screen.getByText('Registrate'));
      expect(mockPush).toHaveBeenCalledWith('/register');
    });
  });

});
