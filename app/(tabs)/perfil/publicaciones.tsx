import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { getRecipesByUser } from '@/services/users.service';
import { useLikes } from '@/hooks/useLikes';
import { RecipeCard } from '@/components/molecules/RecipeCard';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { Recipe } from '@/types';

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
const CARD_W = (SCREEN_W - spacing.lg * 2 - CARD_GAP) / 2;

export default function MisPublicacionesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPublications() {
    if (!user) return;
    try {
      setError(null);
      const data = await getRecipesByUser(user.id);
      setRecipes(data);
    } catch (e: any) {
      setError(e.message ?? 'No se pudieron cargar tus publicaciones');
    }
  }

  useEffect(() => {
    fetchPublications().finally(() => setLoading(false));
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPublications();
    setRefreshing(false);
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Header con botón volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis publicaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Subtítulo con conteo */}
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            {recipes.length === 0
              ? 'Todavía no publicaste ninguna receta'
              : `${recipes.length} ${recipes.length === 1 ? 'receta publicada' : 'recetas publicadas'}`}
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={20} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Estado vacío */}
        {!error && recipes.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={56} color={colors.primaryMid} />
            <Text style={styles.emptyTitle}>Sin publicaciones aún</Text>
            <Text style={styles.emptyText}>
              Creá tu primera receta y aparecerá acá para que todos la vean.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/crear/detalles')}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={18} color={colors.surface} />
              <Text style={styles.createButtonText}>Crear receta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grid de recetas */}
        {recipes.length > 0 && (
          <View style={styles.grid}>
            {recipes.map(recipe => (
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
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingBottom: spacing['4xl'],
  },
  subHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  subHeaderText: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#FDECEA',
    borderRadius: 12,
  },
  errorText: {
    ...typography.bodyS,
    color: colors.error,
    flex: 1,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  createButtonText: {
    ...typography.h3,
    color: colors.surface,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: CARD_GAP,
  },
});
