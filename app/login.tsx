import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Completá todos los campos');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // _layout.tsx detecta el cambio de token y redirige a /(tabs) automáticamente
    } catch (e: any) {
      setError(e.message ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Logo / título */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo-icon.png')}
              style={styles.logo}
              resizeMode="cover"
            />
            <Text style={styles.appName}>Sazón</Text>
            <Text style={styles.subtitle}>¡Encontrá tus recetas favoritas!</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={colors.surface} />
                : <Text style={styles.buttonText}>Iniciar sesión</Text>
              }
            </Pressable>
          </View>

          {/* Link a registro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tenés cuenta?</Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}> Registrate</Text>
            </Pressable>
          </View>

          {/* Hint de usuarios de prueba */}
          <View style={styles.hint}>
            <Text style={styles.hintTitle}>Usuarios de prueba:</Text>
            <Text style={styles.hintText}>sofia@sazon.app  /  sazon123</Text>
            <Text style={styles.hintText}>marco@sazon.app  /  sazon123</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.displayL,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyM,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    ...typography.bodyM,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.bodyS,
    color: colors.error,
    textAlign: 'center',
  },
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.h3,
    color: colors.surface,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    ...typography.bodyM,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyM,
    color: colors.primary,
    fontWeight: '700',
  },
  hint: {
    marginTop: spacing['4xl'],
    padding: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    gap: spacing.xs,
  },
  hintTitle: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  hintText: {
    ...typography.bodyS,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});
