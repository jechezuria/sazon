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
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { recipeFormStore, IngredientDraft } from '@/store/recipeFormStore';
import { StepperBar } from '@/components/atoms/StepperBar';

function newIngredient(): IngredientDraft {
  return { id: Date.now().toString(), name: '', amount: '' };
}

export default function CrearIngredientesScreen() {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<IngredientDraft[]>(
    recipeFormStore.get().ingredients
  );

  function addIngredient() {
    setIngredients((prev) => [...prev, newIngredient()]);
  }

  function removeIngredient(id: string) {
    if (ingredients.length === 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function updateIngredient(id: string, field: 'name' | 'amount', value: string) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  const canGoNext = ingredients.some((i) => i.name.trim());

  function handleNext() {
    recipeFormStore.update({ ingredients });
    router.push('/crear/pasos');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Crear receta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ── STEPPER ── */}
      <StepperBar current={2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── LISTA DE INGREDIENTES ── */}
          {ingredients.map((ing, index) => (
            <View key={ing.id} style={styles.row}>

              {/* Número */}
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{index + 1}</Text>
              </View>

              {/* Input nombre + cantidad */}
              <View style={styles.inputsGroup}>
                <TextInput
                  style={styles.inputName}
                  placeholder="Ingrediente"
                  placeholderTextColor={colors.textMuted}
                  value={ing.name}
                  onChangeText={(v) => updateIngredient(ing.id, 'name', v)}
                />
                <TextInput
                  style={styles.inputAmount}
                  placeholder="Cantidad"
                  placeholderTextColor={colors.textMuted}
                  value={ing.amount}
                  onChangeText={(v) => updateIngredient(ing.id, 'amount', v)}
                />
              </View>

              {/* Botón eliminar */}
              <TouchableOpacity
                onPress={() => removeIngredient(ing.id)}
                disabled={ingredients.length === 1}
                accessibilityLabel="Eliminar ingrediente"
                style={styles.removeBtn}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={ingredients.length === 1 ? colors.border : colors.textMuted}
                />
              </TouchableOpacity>

            </View>
          ))}

          {/* ── AGREGAR INGREDIENTE ── */}
          <TouchableOpacity style={styles.addBtn} onPress={addIngredient} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addBtnText}>Agregar ingrediente</Text>
          </TouchableOpacity>

          {/* ── BOTÓN SIGUIENTE ── */}
          <TouchableOpacity
            style={[styles.nextBtn, !canGoNext && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canGoNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>Siguiente: Pasos →</Text>
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

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Fila de ingrediente
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },

  inputsGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  inputName: {
    flex: 2,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    ...typography.bodyM,
    color: colors.textPrimary,
  },
  inputAmount: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    ...typography.bodyM,
    color: colors.textPrimary,
  },

  removeBtn: {
    padding: 4,
  },

  // Botón agregar
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    marginBottom: 28,
  },
  addBtnText: {
    ...typography.bodyM,
    color: colors.primary,
    fontWeight: '600',
  },

  // Botón siguiente
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  nextBtnText: {
    ...typography.button,
    color: colors.surface,
  },
});
