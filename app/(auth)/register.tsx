import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Input } from '../../components/atoms/Input';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { register } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}$/;
    return regex.test(pass);
  };

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña debe tener al menos 8 caracteres alfanuméricos, incluyendo al menos una letra y un número.'
      );
      return;
    }

    try {
      setLoading(true);
      const response = await register({ name, username, email, password });
      login(response.user, response.token);
      Alert.alert('Éxito', 'Cuenta creada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo realizar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Únete a la comunidad de Sazón</Text>

          <View style={styles.form}>
            <Input
              label="Nombre y apellido"
              placeholder="Tu nombre y apellido"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <View style={styles.gap} />
            <Input
              label="Usuario"
              placeholder="nombre_usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={styles.gap} />
            <Input
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.gap} />
            <Input
              label="Contraseña"
              placeholder="Al menos 8 caracteres (A-Z, 0-9)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <PrimaryButton
                label="Registrarse"
                onPress={handleRegister}
                loading={loading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyL,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  form: {
    width: '100%',
  },
  gap: {
    height: spacing.lg,
  },
  buttonContainer: {
    marginTop: spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.bodyM,
    color: colors.textSecondary,
  },
  link: {
    ...typography.bodyM,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
