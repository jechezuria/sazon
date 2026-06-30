import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USER } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

// ─── Avatar editable ──────────────────────────────────────────────────────────
function AvatarPicker({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.8}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials || '?'}</Text>
      </View>
      <View style={styles.cameraBadge}>
        <Ionicons name="camera" size={14} color={colors.surface} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Pantalla Editar Perfil ───────────────────────────────────────────────────
export default function EditarPerfilScreen() {
  const router = useRouter();
  const user   = MOCK_USER;

  const [firstName,    setFirstName]    = useState(user.name.split(' ')[0] ?? '');
  const [lastName,     setLastName]     = useState(user.name.split(' ')[1] ?? '');
  const [bio,          setBio]          = useState(user.bio ?? '');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const canSave = firstName.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    // TODO: persistir cambios
    router.back();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Cancelar">
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[typography.h1, { color: colors.textPrimary }]}>Editar perfil</Text>

        <TouchableOpacity onPress={handleSave} disabled={!canSave} accessibilityLabel="Guardar">
          <Text style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── FOTO ── */}
          <View style={styles.avatarSection}>
            <AvatarPicker name={`${firstName} ${lastName}`} />
            <Text style={styles.changePhotoLabel}>Cambiar foto</Text>
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
            style={[styles.saveButtonFull, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
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

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarWrap: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 28,
  },
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

  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 8,
    marginLeft: 4,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    ...shadows.card,
  },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  fieldLabel: {
    ...typography.bodyM,
    color: colors.textSecondary,
    width: 80,
    flexShrink: 0,
  },
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
  inputFocused: {
    borderColor: colors.primaryMid,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },

  // Bio
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

  // Botón guardar
  saveButtonFull: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...shadows.float,
  },
  saveButtonDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});
