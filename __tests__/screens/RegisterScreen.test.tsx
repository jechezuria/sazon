// Pruebas unitarias — screens/RegisterScreen
// Verifica renderizado, validaciones, llamada al servicio y navegación.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/app/register';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
const mockPush    = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

const mockSetSession = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ setSession: mockSetSession }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return { Image: (props: any) => <View testID="expo-image" {...props} /> };
});

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync:       jest.fn().mockResolvedValue({ status: 'granted' }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchCameraAsync:       jest.fn().mockResolvedValue({ canceled: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  Feather:  () => null,
}));

const mockRegister = jest.fn();
jest.mock('@/services/auth.service', () => ({
  register: (...args: any[]) => mockRegister(...args),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('RegisterScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Renderizado inicial ───────────────────────────────────────────────────────
  describe('renderizado inicial', () => {
    it('muestra el título Sazón', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Sazón')).toBeTruthy();
    });

    it('muestra el subtítulo de registro', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('¡Registrate para encontrar tus recetas favoritas!')).toBeTruthy();
    });

    it('muestra el botón Crear cuenta', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Crear cuenta')).toBeTruthy();
    });

    it('muestra el label Nombre', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Nombre')).toBeTruthy();
    });

    it('muestra el label Apellido', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Apellido')).toBeTruthy();
    });

    it('muestra el label Nombre de usuario', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Nombre de usuario')).toBeTruthy();
    });

    it('muestra el label Email', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Email')).toBeTruthy();
    });

    it('muestra el label Contraseña', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Contraseña')).toBeTruthy();
    });

    it('muestra el texto para ir al login', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Iniciá sesión')).toBeTruthy();
    });

    it('muestra el label de foto de perfil', () => {
      render(<RegisterScreen />);
      expect(screen.getByText('Agregar foto de perfil')).toBeTruthy();
    });

    it('no muestra errores al iniciar', () => {
      render(<RegisterScreen />);
      expect(screen.queryByText('Completá todos los campos')).toBeNull();
    });
  });

  // ── Validación de campos vacíos ───────────────────────────────────────────────
  describe('validación de campos vacíos', () => {
    it('muestra error si se presiona el botón con campos vacíos', async () => {
      render(<RegisterScreen />);
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(screen.getByText('Completá todos los campos')).toBeTruthy();
      });
    });

    it('no llama a register si los campos están vacíos', async () => {
      render(<RegisterScreen />);
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  // ── Validación de email ────────────────────────────────────────────────────────
  describe('validación de email', () => {
    it('muestra error si el email no tiene formato válido', async () => {
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),     'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),      'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),     'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'),  'no-es-un-email');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(screen.getByText('Ingresá un email válido (ej: sofia@email.com)')).toBeTruthy();
      });
    });
  });

  // ── Validación de username ────────────────────────────────────────────────────
  describe('validación de usuario', () => {
    it('muestra error si el username tiene menos de 3 caracteres', async () => {
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'ab');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(screen.getByText(
          'El usuario debe tener entre 3 y 20 caracteres (letras, números o _)'
        )).toBeTruthy();
      });
    });
  });

  // ── Validación de contraseña ──────────────────────────────────────────────────
  describe('validación de contraseña', () => {
    it('muestra los requisitos cuando se escribe en el campo contraseña', async () => {
      render(<RegisterScreen />);
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'abc',
      );
      await waitFor(() => {
        expect(screen.getByText('Mínimo 8 caracteres')).toBeTruthy();
        expect(screen.getByText('Al menos 1 letra')).toBeTruthy();
        expect(screen.getByText('Al menos 1 número')).toBeTruthy();
        expect(screen.getByText('Solo letras y números (sin símbolos)')).toBeTruthy();
      });
    });

    it('muestra error si la contraseña no cumple los requisitos al presionar Crear cuenta', async () => {
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'corta',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(screen.getByText('La contraseña no cumple los requisitos')).toBeTruthy();
      });
    });
  });

  // ── Registro exitoso ──────────────────────────────────────────────────────────
  describe('registro exitoso', () => {
    const authResponse = { token: 'jwt-abc', user: { id: 'u1', name: 'Sofia Chen' } };

    it('llama a register con los datos correctos', async () => {
      mockRegister.mockResolvedValueOnce(authResponse);
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
          name:     'Sofia Chen',
          username: 'sofichen',
          email:    'sofia@test.com',
          password: 'Clave123',
        }));
      });
    });

    it('llama a setSession con la respuesta del backend', async () => {
      mockRegister.mockResolvedValueOnce(authResponse);
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(mockSetSession).toHaveBeenCalledWith(authResponse);
      });
    });

    it('navega a /(tabs) después del registro exitoso', async () => {
      mockRegister.mockResolvedValueOnce(authResponse);
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
      });
    });
  });

  // ── Error de backend ──────────────────────────────────────────────────────────
  describe('error de backend', () => {
    it('muestra el mensaje de error cuando register falla', async () => {
      mockRegister.mockRejectedValueOnce(new Error('El email ya está registrado'));
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(screen.getByText('El email ya está registrado')).toBeTruthy();
      });
    });

    it('no navega cuando register falla', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Error'));
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'),    'Sofia');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),     'Chen');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: sofia'),    'sofichen');
      fireEvent.changeText(screen.getByPlaceholderText('tu@email.com'), 'sofia@test.com');
      fireEvent.changeText(
        screen.getByPlaceholderText('Mínimo 8 caracteres alfanuméricos'),
        'Clave123',
      );
      fireEvent.press(screen.getByText('Crear cuenta'));
      await waitFor(() => {
        expect(mockReplace).not.toHaveBeenCalled();
      });
    });
  });

  // ── Navegación al login ───────────────────────────────────────────────────────
  describe('navegación al login', () => {
    it('navega a /login al presionar Iniciá sesión', () => {
      render(<RegisterScreen />);
      fireEvent.press(screen.getByText('Iniciá sesión'));
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  // ── Iniciales del avatar ──────────────────────────────────────────────────────
  describe('iniciales del avatar', () => {
    it('muestra las iniciales al escribir nombre y apellido', async () => {
      render(<RegisterScreen />);
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Sofia'), 'Maria');
      fireEvent.changeText(screen.getByPlaceholderText('Ej: Chen'),  'Garcia');
      await waitFor(() => {
        expect(screen.getByText('MG')).toBeTruthy();
      });
    });
  });

});
