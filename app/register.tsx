import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { register } from '@/services/auth.service';
import { validatePassword } from '@/utils/validatePassword';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

function Requisito({ cumplido, texto }: { cumplido: boolean; texto: string }) {
  return (
    <View style={styles.requisito}>
      <Feather
        name={cumplido ? 'check-circle' : 'circle'}
        size={14}
        color={cumplido ? colors.success : colors.textMuted}
      />
      <Text style={[styles.requisitoText, cumplido && styles.requisitoCumplido]}>
        {texto}
      </Text>
    </View>
  );
}

const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [avatarUri,   setAvatarUri]   = useState<string | null>(null);
  const [nombre,      setNombre]      = useState('');
  const [apellido,    setApellido]    = useState('');
  const [username,    setUsername]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [pwdTocada,   setPwdTocada]   = useState(false);

  const pwdRules  = useMemo(() => validatePassword(password), [password]);
  const pwdValida = Object.values(pwdRules).every(Boolean);

  // ── Foto de perfil ───────────────────────────────────────────────────────────
  async function handlePickAvatar() {
    Alert.alert('Foto de perfil', 'Elegí una opción', [
      { text: 'Sacar foto',        onPress: launchCamera  },
      { text: 'Elegir de galería', onPress: launchGallery },
      ...(avatarUri ? [{ text: 'Eliminar foto', style: 'destructive' as const, onPress: () => setAvatarUri(null) }] : []),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function launchCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No podemos acceder a tu cámara sin permiso.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setAvatarUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

  async function launchGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No podemos acceder a tus fotos sin permiso.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setAvatarUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

  // ── Registro ─────────────────────────────────────────────────────────────────
  async function handleRegister() {
    if (!nombre.trim() || !apellido.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Completá todos los campos');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Ingresá un email válido (ej: sofia@email.com)');
      return;
    }
    if (!USERNAME_REGEX.test(username.trim())) {
      setError('El usuario debe tener entre 3 y 20 caracteres (letras, números o _)');
      return;
    }
    if (!pwdValida) {
      setPwdTocada(true);
      setError('La contraseña no cumple los requisitos');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const fullName = `${nombre.trim()} ${apellido.trim()}`;
      const authRes = await register({
        name:      fullName,
        username:  username.trim(),
        email:     email.trim(),
        password,
        avatarUrl: avatarUri ?? undefined,
      });
      await setSession(authRes);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  const initials = `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo-icon.png')}
              style={styles.logo}
              contentFit="cover"
            />
            <Text style={styles.appName}>Sazón</Text>
            <Text style={styles.subtitle}>¡Registrate para encontrar tus recetas favoritas!</Text>
          </View>

          {/* Avatar picker */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar} activeOpacity={0.8}>
              {avatarUri ? (
                <>
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} contentFit="cover" />
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={13} color={colors.surface} />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.avatarPlaceholder}>
                    {initials
                      ? <Text style={styles.avatarInitials}>{initials}</Text>
                      : <Ionicons name="camera-outline" size={26} color={colors.primary} />
                    }
                  </View>
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={13} color={colors.surface} />
                  </View>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {avatarUri ? 'Cambiar foto de perfil' : 'Agregar foto de perfil'}
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>

            {/* Nombre y Apellido en fila */}
            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.rowField]}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Sofia"
                  placeholderTextColor={colors.textMuted}
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <View style={[styles.fieldGroup, styles.rowField]}>
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Chen"
                  placeholderTextColor={colors.textMuted}
                  value={apellido}
                  onChangeText={setApellido}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: sofia"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

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

            {/* Contraseña con validación en tiempo real */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={[styles.input, pwdTocada && !pwdValida && styles.inputError]}
                placeholder="Mínimo 8 caracteres alfanuméricos"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={v => { setPassword(v); setPwdTocada(true); }}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              {pwdTocada && (
                <View style={styles.requisitos}>
                  <Requisito cumplido={pwdRules.minLength}    texto="Mínimo 8 caracteres" />
                  <Requisito cumplido={pwdRules.hasLetter}    texto="Al menos 1 letra" />
                  <Requisito cumplido={pwdRules.hasNumber}    texto="Al menos 1 número" />
                  <Requisito cumplido={pwdRules.alphanumeric} texto="Solo letras y números (sin símbolos)" />
                </View>
              )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={colors.surface} />
                : <Text style={styles.buttonText}>Crear cuenta</Text>
              }
            </Pressable>
          </View>

          {/* Link a login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tenés cuenta?</Text>
            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}> Iniciá sesión</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  flex:    { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: spacing['2xl'] },

  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo:   { width: 80, height: 80, borderRadius: 16, marginBottom: spacing.lg },
  appName: { ...typography.displayL, color: colors.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyM, color: colors.textSecondary, textAlign: 'center' },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: spacing['4xl'] },
  avatarWrap:    { width: 80, height: 80, position: 'relative' },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed',
  },
  avatarInitials: { ...typography.h2, color: colors.primary },
  avatarImg:  { width: 80, height: 80, borderRadius: 40 },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.bg,
  },
  avatarLabel: { ...typography.bodyS, color: colors.primary, fontWeight: '600', marginTop: spacing.sm },

  form:    { gap: spacing.lg },
  row:     { flexDirection: 'row', gap: spacing.md },
  rowField: { flex: 1 },
  fieldGroup: { gap: spacing.sm },

  label: { ...typography.label, color: colors.textSecondary },
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
  inputError: { borderColor: colors.error },

  requisitos: { gap: 6, paddingTop: 6 },
  requisito:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  requisitoText:    { ...typography.bodyS, color: colors.textMuted },
  requisitoCumplido:{ color: colors.success },

  errorText: { ...typography.bodyS, color: colors.error, textAlign: 'center' },

  button: {
    height: 52, backgroundColor: colors.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...typography.h3, color: colors.surface },

  loginRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl },
  loginText: { ...typography.bodyM, color: colors.textSecondary },
  loginLink: { ...typography.bodyM, color: colors.primary, fontWeight: '700' },
});
