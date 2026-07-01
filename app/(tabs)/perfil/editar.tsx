import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/users.service';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

// ─── Avatar ───────────────────────────────────────────────────────────────────
function AvatarDisplay({
  name,
  uri,
  onPress,
}: {
  name: string;
  uri: string | null;
  onPress: () => void;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.8} onPress={onPress}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatarImage} contentFit="cover" />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || '?'}</Text>
        </View>
      )}
      <View style={styles.cameraBadge}>
        <Ionicons name="camera" size={14} color={colors.surface} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Pantalla Editar Perfil ───────────────────────────────────────────────────
export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();

  const nameParts  = (user?.name ?? '').split(' ');
  const initFirst  = nameParts[0] ?? '';
  const initLast   = nameParts.slice(1).join(' ');

  const [firstName,    setFirstName]    = useState(initFirst);
  const [lastName,     setLastName]     = useState(initLast);
  const [bio,          setBio]          = useState(user?.bio ?? '');
  const [avatarUri,    setAvatarUri]    = useState<string | null>(user?.avatarUrl ?? null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saving,       setSaving]       = useState(false);

  const canSave = firstName.trim().length > 0;

  // ── Lógica foto ─────────────────────────────────────────────────────────────
  async function handlePickPhoto() {
    Alert.alert('Foto de perfil', 'Elegí una opción', [
      {
        text: 'Sacar foto',
        onPress: launchCamera,
      },
      {
        text: 'Elegir de galería',
        onPress: launchGallery,
      },
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

  // ── Guardar ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!canSave || !token) return;
    setSaving(true);
    try {
      const updated = await updateProfile(
        {
          name:      `${firstName.trim()} ${lastName.trim()}`.trim(),
          bio:       bio.trim() || undefined,
          avatarUrl: avatarUri ?? undefined,
        },
        token,
      );
      updateUser(updated);
      Alert.alert('Listo', 'Perfil actualizado correctamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.error('[EditarPerfil] Error al guardar:', e);
      Alert.alert('Error al guardar', e.message ?? 'No se pudieron guardar los cambios. Revisá tu conexión.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Cancelar">
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[typography.h1, { color: colors.textPrimary }]}>Editar perfil</Text>

        <TouchableOpacity onPress={handleSave} disabled={!canSave || saving} accessibilityLabel="Guardar">
          {saving
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Text style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>Guardar</Text>
          }
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── FOTO ── */}
          <View style={styles.avatarSection}>
            <AvatarDisplay
              name={`${firstName} ${lastName}`}
              uri={avatarUri}
              onPress={handlePickPhoto}
            />
            <TouchableOpacity onPress={handlePickPhoto}>
              <Text style={styles.changePhotoLabel}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>

          {/* ── DATOS PERSONALES ── */}
          <Text style={styles.sectionLabel}>DATOS PERSONALES</Text>
          <View style={styles.card}>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={[styles.input, focusedField === 'first' && styles.inputFocused]}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocusedField('first')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Apellido</Text>
              <TextInput
                style={[styles.input, focusedField === 'last' && styles.inputFocused]}
                placeholder="Tu apellido"
                placeholderTextColor={colors.textMuted}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedField('last')}
                onBlur={() => setFocusedField(null)}
                returnKeyType="next"
              />
            </View>

          </View>

          {/* ── BIO ── */}
          <Text style={styles.sectionLabel}>BIO</Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.bioInput, focusedField === 'bio' && styles.inputFocused]}
              placeholder="Contá algo sobre vos (opcional)..."
              placeholderTextColor={colors.textMuted}
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
              maxLength={160}
              onFocus={() => setFocusedField('bio')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={styles.charCount}>{bio.length}/160</Text>
          </View>

          {/* ── BOTÓN GUARDAR ── */}
          <TouchableOpacity
            style={[styles.saveButtonFull, (!canSave || saving) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave || saving}
            activeOpacity={0.8}
          >
            {saving
              ? <ActivityIndicator color={colors.surface} />
              : <Text style={styles.saveButtonText}>Guardar cambios</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveBtn: {
    ...typography.bodyM,
    color: colors.primary,
    fontWeight: '700',
  },
  saveBtnDisabled: {
    color: colors.textMuted,
  },

  scroll: { paddingHorizontal: 16, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarWrap: { position: 'relative', width: 80, height: 80 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: { ...typography.h1, color: colors.primary, fontSize: 28 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  changePhotoLabel: {
    ...typography.bodyS,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },

  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 8, marginLeft: 4 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...shadows.card,
  },

  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 52 },
  fieldLabel: { ...typography.bodyM, color: colors.textSecondary, width: 80, flexShrink: 0 },
  input: {
    flex: 1,
    height: 44,
    ...typography.bodyM,
    color: colors.textPrimary,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 8,
  },
  inputFocused: { borderColor: colors.primaryMid },

  divider: { height: 1, backgroundColor: colors.border, marginLeft: 16 },

  bioInput: {
    minHeight: 96,
    ...typography.bodyM,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  saveButtonFull: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...shadows.float,
  },
  saveButtonDisabled: { backgroundColor: colors.textMuted, shadowOpacity: 0, elevation: 0 },
  saveButtonText: { ...typography.button, color: colors.surface },
});
