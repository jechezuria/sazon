import React, { useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { changePassword } from '@/services/users.service';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

function validatePassword(pwd: string) {
  return {
    minLength:    pwd.length >= 8,
    hasLetter:    /[a-zA-Z]/.test(pwd),
    hasNumber:    /[0-9]/.test(pwd),
    alphanumeric: /^[a-zA-Z0-9]*$/.test(pwd) && pwd.length > 0,
  };
}

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

export default function CambiarPasswordScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [nueva,       setNueva]       = useState('');
  const [confirmar,   setConfirmar]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [pwdTocada,   setPwdTocada]   = useState(false);
  const [confTocada,  setConfTocada]  = useState(false);

  const pwdRules  = useMemo(() => validatePassword(nueva), [nueva]);
  const pwdValida = Object.values(pwdRules).every(Boolean);
  const coinciden = nueva === confirmar;

  async function handleGuardar() {
    setPwdTocada(true);
    setConfTocada(true);

    if (!pwdValida || !coinciden || !nueva) return;

    setLoading(true);
    try {
      await changePassword(nueva, token!);
      Alert.alert('Listo', 'Tu contraseña fue actualizada correctamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  }

  const canSave = pwdValida && coinciden && nueva.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Cambiar contraseña</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Campo: Nueva contraseña */}
          <Text style={styles.sectionLabel}>NUEVA CONTRASEÑA</Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, pwdTocada && !pwdValida && styles.inputError]}
              placeholder="Mínimo 8 caracteres alfanuméricos"
              placeholderTextColor={colors.textMuted}
              value={nueva}
              onChangeText={v => { setNueva(v); setPwdTocada(true); }}
              secureTextEntry
              returnKeyType="next"
              autoCapitalize="none"
            />
          </View>

          {/* Requisitos en tiempo real */}
          {pwdTocada && (
            <View style={styles.requisitos}>
              <Requisito cumplido={pwdRules.minLength}    texto="Mínimo 8 caracteres" />
              <Requisito cumplido={pwdRules.hasLetter}    texto="Al menos 1 letra" />
              <Requisito cumplido={pwdRules.hasNumber}    texto="Al menos 1 número" />
              <Requisito cumplido={pwdRules.alphanumeric} texto="Solo letras y números (sin símbolos)" />
            </View>
          )}

          {/* Campo: Confirmar contraseña */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CONFIRMAR CONTRASEÑA</Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, confTocada && !coinciden && styles.inputError]}
              placeholder="Repetí la nueva contraseña"
              placeholderTextColor={colors.textMuted}
              value={confirmar}
              onChangeText={v => { setConfirmar(v); setConfTocada(true); }}
              secureTextEntry
              returnKeyType="done"
              autoCapitalize="none"
              onSubmitEditing={handleGuardar}
            />
          </View>

          {confTocada && !coinciden && confirmar.length > 0 && (
            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
          )}

          {/* Botón guardar */}
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleGuardar}
            disabled={loading || !canSave}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={colors.surface} />
              : <Text style={styles.saveButtonText}>Guardar contraseña</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
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
    ...shadows.card,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    ...typography.bodyM,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  requisitos: {
    gap: 6,
    paddingTop: 10,
    paddingLeft: 4,
  },
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requisitoText: {
    ...typography.bodyS,
    color: colors.textMuted,
  },
  requisitoCumplido: {
    color: colors.success,
  },
  errorText: {
    ...typography.bodyS,
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
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
