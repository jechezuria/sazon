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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
import { recipeFormStore, StepDraft } from '@/store/recipeFormStore';
import { StepperBar } from '@/components/atoms/StepperBar';
import { useAuth } from '@/context/AuthContext';
import { createRecipe, updateRecipe } from '@/services/recipes.service';
import { invalidateRecipesCache } from '@/hooks/useRecipes';
import { Category, Difficulty } from '@/types';

function newStep(): StepDraft {
  return { id: Date.now().toString(), description: '' };
}

export default function CrearPasosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { editMode, editRecipeId } = recipeFormStore.get();

  const [steps, setSteps] = useState<StepDraft[]>(
    recipeFormStore.get().steps
  );
  const [submitting, setSubmitting] = useState(false);

  function addStep() {
    setSteps((prev) => [...prev, newStep()]);
  }

  function removeStep(id: string) {
    if (steps.length === 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  function updateStep(id: string, value: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, description: value } : s))
    );
  }

  const canPublish = steps.some((s) => s.description.trim()) && !submitting;

  async function handlePublish() {
    if (!user) return;

    recipeFormStore.update({ steps });
    const data = recipeFormStore.get();

    const filteredIngredients = data.ingredients
      .filter((i) => i.name.trim())
      .map(({ name, amount }) => ({ name, amount }));
    const filteredSteps = steps
      .filter((s) => s.description.trim())
      .map((s, index) => ({ description: s.description, order: index + 1 }));

    setSubmitting(true);
    try {
      if (editMode && editRecipeId) {
        await updateRecipe(editRecipeId, {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUri || '',
          category: data.category as Category,
          difficulty: data.difficulty as Difficulty,
          cookTime: data.cookTime,
          servings: parseInt(data.servings, 10) || 1,
          tags: [],
          ingredients: filteredIngredients,
          steps: filteredSteps,
        });
        invalidateRecipesCache();
        recipeFormStore.reset();
        router.replace(`/recipe/${editRecipeId}`);
      } else {
        await createRecipe({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUri || '',
          category: data.category as Category,
          difficulty: data.difficulty as Difficulty,
          cookTime: data.cookTime,
          servings: parseInt(data.servings, 10) || 1,
          tags: [],
          authorId: user.id,
          ingredients: filteredIngredients,
          steps: filteredSteps,
        });
        invalidateRecipesCache();
        recipeFormStore.reset();
        router.replace('/(tabs)/perfil');
      }
    } catch (e: any) {
      Alert.alert(
        editMode ? 'Error al guardar' : 'Error al publicar',
        e.message ?? 'No se pudo guardar la receta. Intentá de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>{editMode ? 'Editar receta' : 'Crear receta'}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ── STEPPER ── */}
      <StepperBar current={3} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── LISTA DE PASOS ── */}
          {steps.map((step, index) => (
            <View key={step.id} style={styles.row}>

              {/* Número */}
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{index + 1}</Text>
              </View>

              {/* Textarea del paso */}
              <TextInput
                style={styles.inputStep}
                placeholder={`Describí el paso ${index + 1}...`}
                placeholderTextColor={colors.textMuted}
                value={step.description}
                onChangeText={(v) => updateStep(step.id, v)}
                multiline
                textAlignVertical="top"
              />

              {/* Botón eliminar */}
              <TouchableOpacity
                onPress={() => removeStep(step.id)}
                disabled={steps.length === 1}
                accessibilityLabel="Eliminar paso"
                style={styles.removeBtn}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={steps.length === 1 ? colors.border : colors.textMuted}
                />
              </TouchableOpacity>

            </View>
          ))}

          {/* ── AGREGAR PASO ── */}
          <TouchableOpacity style={styles.addBtn} onPress={addStep} activeOpacity={0.7} disabled={submitting}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addBtnText}>Agregar paso</Text>
          </TouchableOpacity>

          {/* ── BOTÓN PUBLICAR ── */}
          <TouchableOpacity
            style={[styles.publishBtn, !canPublish && styles.publishBtnDisabled]}
            onPress={handlePublish}
            disabled={!canPublish}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.surface}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.publishBtnText}>{editMode ? 'Guardar cambios' : 'Publicar receta'}</Text>
              </>
            )}
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

  // Fila de paso
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 10,
  },
  numText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },

  inputStep: {
    flex: 1,
    minHeight: 80,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    ...typography.bodyM,
    color: colors.textPrimary,
  },

  removeBtn: {
    padding: 4,
    marginTop: 8,
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

  // Botón publicar
  publishBtn: {
    backgroundColor: colors.success,
    borderRadius: 9999,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  publishBtnDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  publishBtnText: {
    ...typography.button,
    color: colors.surface,
  },
});
