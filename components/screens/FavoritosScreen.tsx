import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { RecipeCard } from '@/components/molecules/RecipeCard';
import { useLikes } from '@/hooks/useLikes';

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
const CARD_W = (SCREEN_W - spacing.lg * 2 - CARD_GAP) / 2;

export default function FavoritosScreen() {
  const router = useRouter();
  const { likedRecipes, toggleLike, isLiked, loading } = useLikes();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Volver">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.subTitle}>
          {likedRecipes.length === 0
            ? 'Aún no guardaste recetas'
            : `${likedRecipes.length} ${likedRecipes.length === 1 ? 'receta guardada' : 'recetas guardadas'}`}
        </Text>

        {likedRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="heart" size={56} color={colors.primaryMid} />
            <Text style={styles.emptyTitle}>Sin favoritos todavía</Text>
            <Text style={styles.emptyText}>
              Tocá el corazón en cualquier receta para guardarla acá.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {likedRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                variant="compact"
                width={CARD_W}
                isLiked={isLiked(recipe.id)}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                onLike={() => toggleLike(recipe.id, recipe)}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  subTitle: {
    ...typography.bodyS,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.bodyM,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
});
