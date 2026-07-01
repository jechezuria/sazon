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
import { shadows } from '@/theme/shadows';
import { Category, Difficulty } from '@/types';
import { recipeFormStore } from '@/store/recipeFormStore';
import { StepperBar } from '@/components/atoms/StepperBar';

const CATEGORIES: Category[]   = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack', 'Vegetariano'];
const DIFFICULTIES: Difficulty[] = ['Fácil', 'Medio', 'Difícil'];

export default function CrearDetallesScreen() {
  const router = useRouter();
  const saved  = recipeFormStore.get();
  const editMode = saved.editMode;

  const [title,        setTitle]        = useState(saved.title);
  const [description,  setDescription]  = useState(saved.description);
  const [category,     setCategory]     = useState<Category | ''>(saved.category);
  const [difficulty,   setDifficulty]   = useState<Difficulty | ''>(saved.difficulty);
  const [cookTime,     setCookTime]     = useState(saved.cookTime);
  const [servings,     setServings]     = useState(saved.servings);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const canGoNext = !!(title.trim() && category && difficulty && cookTime.trim() && servings.trim());

  function handleNext() {
    recipeFormStore.update({ title, description, category, difficulty, cookTime, servings });
    router.push('/crear/ingredientes');
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
      <StepperBar current={1} />

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
          <TouchableOpacity style={styles.photoArea} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={36} color={colors.textMuted} />
            <Text style={styles.photoText}>Agregar foto de la receta</Text>
            <Text style={styles.photoHint}>Tocá para seleccionar</Text>
          </TouchableOpacity>

          {/* ── TÍTULO ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>TÍTULO *</Text>
            <TextInput
              style={[styles.input, focusedField === 'title' && styles.inputFocused]}
              placeholder="Ej: Panqueques de avena"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── DESCRIPCIÓN ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DESCRIPCIÓN</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, focusedField === 'desc' && styles.inputFocused]}
              placeholder="Contá brevemente de qué se trata..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              onFocus={() => setFocusedField('desc')}
              onBlur={() => setFocusedField(null)}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* ── CATEGORÍA ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CATEGORÍA *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, category === cat && styles.pillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── DIFICULTAD ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DIFICULTAD *</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.diffBtn, difficulty === d && styles.diffBtnActive]}
                  onPress={() => setDifficulty(d)}
                >
                  <Text style={[styles.diffText, difficulty === d && styles.diffTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── TIEMPO + PORCIONES en fila ── */}
          <View style={styles.twoCol}>
            <View style={[styles.fieldGroup, styles.colItem]}>
              <Text style={styles.fieldLabel}>TIEMPO *</Text>
              <TextInput
                style={[styles.input, focusedField === 'time' && styles.inputFocused]}
                placeholder="Ej: 20 min"
                placeholderTextColor={colors.textMuted}
                value={cookTime}
                onChangeText={setCookTime}
                onFocus={() => setFocusedField('time')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={[styles.fieldGroup, styles.colItem]}>
              <Text style={styles.fieldLabel}>PORCIONES *</Text>
              <TextInput
                style={[styles.input, focusedField === 'servings' && styles.inputFocused]}
                placeholder="Ej: 4"
                placeholderTextColor={colors.textMuted}
                value={servings}
                onChangeText={setServings}
                onFocus={() => setFocusedField('servings')}
                onBlur={() => setFocusedField(null)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* ── BOTÓN SIGUIENTE ── */}
          <TouchableOpacity
            style={[styles.nextBtn, !canGoNext && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!canGoNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>Siguiente: Ingredientes →</Text>
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

  // Foto
  photoArea: {
    height: 152,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  photoText: {
    ...typography.bodyM,
    color: colors.textSecondary,
  },
  photoHint: {
    ...typography.caption,
    color: colors.textMuted,
  },

  // Campo genérico
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    ...typography.bodyM,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primaryMid,
  },
  inputMultiline: {
    height: 88,
    paddingTop: 12,
  },

  // Pills de categoría
  pillRow: {
    paddingBottom: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
  pillTextActive: {
    ...typography.bodyS,
    color: colors.surface,
    fontWeight: '600',
  },

  // Selector dificultad
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  diffText: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
  diffTextActive: {
    ...typography.bodyS,
    color: colors.primary,
    fontWeight: '600',
  },

  // Fila de 2 columnas
  twoCol: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  colItem: {
    flex: 1,
    marginBottom: 0,
  },

  // Botón siguiente
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  nextBtnDisabled: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    ...typography.button,
    color: colors.surface,
  },
});
