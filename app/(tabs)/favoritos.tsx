import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Favoritos</Text>
          <Text style={styles.headerSub}>
            {likedRecipes.length === 0
              ? 'Aún no guardaste recetas'
              : `${likedRecipes.length} ${likedRecipes.length === 1 ? 'receta guardada' : 'recetas guardadas'}`}
          </Text>
        </View>

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
                onLike={() => toggleLike(recipe.id)}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.displayL,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSub: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
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
    paddingHorizontal: spacing.lg,
    gap: CARD_GAP,
  },
});
