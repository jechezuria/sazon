import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useRecipe } from '@/hooks/useRecipes';
import { useLikes } from '@/hooks/useLikes';
import { useRecipeProgress } from '@/hooks/useRecipeProgress';
import { useAuth } from '@/context/AuthContext';
import { recipeFormStore } from '@/store/recipeFormStore';
import { deleteRecipe } from '@/services/recipes.service';
import { invalidateRecipesCache } from '@/hooks/useRecipes';

function SmallAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={styles.smallAvatar}>
      <Text style={styles.smallAvatarText}>{initials}</Text>
    </View>
  );
}

function MetaChip({ icon, value, label }: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.metaChip}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

type Tab = 'ingredientes' | 'pasos';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recipe, loading, error } = useRecipe(id as string);
  const { isLiked, toggleLike } = useLikes();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('ingredientes');
  const { checkedIngredients, checkedSteps, toggleIngredient, toggleStep } = useRecipeProgress(id as string);

  const isOwner = !!user && !!recipe && recipe.author.id === user.id;

  function handleDelete() {
    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro que querés eliminar esta receta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe!.id);
              invalidateRecipesCache();
              router.replace('/(tabs)/(home)');
            } catch (e: any) {
              Alert.alert('Error', e.message ?? 'No se pudo eliminar la receta.');
            }
          },
        },
      ],
    );
  }

  function handleEdit() {
    if (!recipe) return;
    recipeFormStore.update({
      editMode:     true,
      editRecipeId: recipe.id,
      title:        recipe.title,
      description:  recipe.description,
      imageUri:     recipe.imageUrl,
      category:     recipe.category,
      difficulty:   recipe.difficulty,
      cookTime:     recipe.cookTime,
      servings:     String(recipe.servings),
      ingredients:  recipe.ingredients.map((ing, i) => ({
        id: String(i + 1),
        name: ing.name,
        amount: ing.amount,
      })),
      steps: recipe.steps.map((s, i) => ({
        id: String(i + 1),
        description: s.description,
      })),
    });
    router.push('/crear/detalles');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.centered}>
        <Text style={[typography.h2, { color: colors.textPrimary }]}>Receta no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: colors.primary }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View>
        <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.heroGradient} />
        <View style={[styles.heroButtons, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.heroBtnGroup}>
            {isOwner && (
              <>
                <TouchableOpacity style={styles.heroBtn} onPress={handleDelete} accessibilityLabel="Eliminar receta">
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.heroBtn} onPress={handleEdit} accessibilityLabel="Editar receta">
                  <Ionicons name="create-outline" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => toggleLike(recipe.id, recipe)}
              accessibilityLabel={isLiked(recipe.id) ? 'Quitar me gusta' : 'Me gusta'}
            >
              <Ionicons
                name={isLiked(recipe.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked(recipe.id) ? colors.error : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleFlex]} numberOfLines={3}>{recipe.title}</Text>
          {recipe.difficulty && (
            <View style={styles.difficultyChip}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          )}
        </View>

        <View style={styles.authorRow}>
          <SmallAvatar name={recipe.author.name} />
          <Text style={styles.authorName}>{recipe.author.name}</Text>
        </View>

        <View style={styles.metaRow}>
          <MetaChip icon="time-outline"   value={recipe.cookTime}         label="Cook Time" />
          <MetaChip icon="people-outline" value={String(recipe.servings)} label="Porciones" />
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.tabBar}>
          {(['ingredientes', 'pasos'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'ingredientes' && (
          <View style={styles.tabContent}>
            <Text style={styles.tabCount}>{recipe.ingredients.length} ingredientes</Text>
            {recipe.ingredients.map((ing, index) => (
              <React.Fragment key={ing.id}>
                <TouchableOpacity style={styles.ingredientRow} onPress={() => toggleIngredient(ing.id)} activeOpacity={0.7}>
                  <View style={[styles.ingredientBadge, checkedIngredients.has(ing.id) && styles.ingredientBadgeChecked]}>
                    {checkedIngredients.has(ing.id)
                      ? <Ionicons name="checkmark" size={14} color={colors.surface} />
                      : <Text style={styles.ingredientNumber}>{index + 1}</Text>}
                  </View>
                  <Text style={[styles.ingredientName, checkedIngredients.has(ing.id) && styles.ingredientChecked]}>{ing.name}</Text>
                  <Text style={styles.ingredientAmount}>{ing.amount}</Text>
                </TouchableOpacity>
                {index < recipe.ingredients.length - 1 && <View style={styles.ingredientSep} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {activeTab === 'pasos' && (
          <View style={styles.tabContent}>
            {recipe.steps.map(step => (
              <TouchableOpacity key={step.id} style={styles.stepRow} onPress={() => toggleStep(step.id)} activeOpacity={0.7}>
                <View style={[styles.stepBadge, checkedSteps.has(step.id) && styles.stepBadgeChecked]}>
                  {checkedSteps.has(step.id)
                    ? <Ionicons name="checkmark" size={14} color={colors.surface} />
                    : <Text style={styles.stepNumber}>{step.order}</Text>}
                </View>
                <Text style={[styles.stepText, checkedSteps.has(step.id) && styles.stepTextChecked]}>
                  {step.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, gap: 16 },
  backBtn: { padding: 12 },
  heroImage: { width: '100%', aspectRatio: 4 / 3 },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  heroButtons: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBtnGroup: { flexDirection: 'row', gap: 8 },
  heroBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  panel: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  titleFlex: { flex: 1 },
  title: { ...typography.displayL, color: colors.textPrimary },
  difficultyChip: { backgroundColor: colors.primaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 4, flexShrink: 0 },
  difficultyText: { ...typography.bodyS, color: colors.primary, fontWeight: '700' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  smallAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  smallAvatarText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  authorName: { ...typography.bodyS, fontWeight: '600', color: colors.textSecondary },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  metaChip: { flex: 1, backgroundColor: colors.primaryLight, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center', gap: 4 },
  metaValue: { ...typography.h3, color: colors.textPrimary },
  metaLabel: { ...typography.caption, color: colors.textSecondary },
  description: { ...typography.bodyM, color: colors.textSecondary, lineHeight: 22, marginTop: 16 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.h3, color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  tabContent: { marginTop: 16 },
  tabCount: { ...typography.label, color: colors.textMuted, marginBottom: 12 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  ingredientBadge: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ingredientBadgeChecked: { backgroundColor: colors.success, borderColor: colors.success },
  ingredientNumber: { ...typography.caption, fontWeight: '600', color: colors.textMuted },
  ingredientName: { ...typography.bodyM, color: colors.textPrimary, flex: 1 },
  ingredientChecked: { textDecorationLine: 'line-through', color: colors.textMuted },
  ingredientAmount: { ...typography.bodyS, color: colors.textSecondary },
  ingredientSep: { height: 1, backgroundColor: colors.border, marginLeft: 40 },
  stepRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  stepBadge: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepBadgeChecked: { backgroundColor: colors.success, borderColor: colors.success },
  stepNumber: { ...typography.buttonSm, color: colors.textMuted },
  stepText: { ...typography.bodyM, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  stepTextChecked: { textDecorationLine: 'line-through', color: colors.textMuted },
});
