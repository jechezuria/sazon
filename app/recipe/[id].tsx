import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useRecipes } from '@/hooks/useRecipes';
import { useLikes } from '@/hooks/useLikes';
import { Difficulty } from '@/types';

// ─── Colores del badge según dificultad ───────────────────────────────────────
const DIFFICULTY_COLOR: Record<Difficulty, { bg: string; text: string }> = {
  'Fácil':   { bg: '#E8F5E9', text: '#388E3C' },
  'Medio':   { bg: '#FFF8E1', text: '#F9A825' },
  'Difícil': { bg: '#FFEBEE', text: '#C62828' },
};

// ─── Avatar pequeño (28px) ────────────────────────────────────────────────────
function SmallAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.smallAvatar}>
      <Text style={styles.smallAvatarText}>{initials}</Text>
    </View>
  );
}

// ─── Estrellas de calificación ────────────────────────────────────────────────
function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={styles.starsRow}>
      <View style={styles.starsIcons}>
        {Array.from({ length: full }).map((_, i) => (
          <Ionicons key={`f${i}`} name="star" size={14} color={colors.rating} />
        ))}
        {half === 1 && (
          <Ionicons name="star-half" size={14} color={colors.rating} />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Ionicons key={`e${i}`} name="star-outline" size={14} color={colors.rating} />
        ))}
      </View>
      <Text style={styles.reviewCount}>{reviewCount} reseñas</Text>
    </View>
  );
}

// ─── Chip de metadato ─────────────────────────────────────────────────────────
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

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { getById }             = useRecipes();
  const { isLiked, toggleLike } = useLikes();

  const recipe = getById(id as string);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>
          Receta no encontrada
        </Text>
      </View>
    );
  }

  const diffColor = DIFFICULTY_COLOR[recipe.difficulty];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── PASO 1: HERO ── */}
      <View>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={styles.heroGradient}
        />
        <View style={[styles.heroButtons, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.back()}
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.heroBtnGroup}>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => toggleLike(recipe.id)}
              accessibilityLabel={isLiked(recipe.id) ? 'Quitar me gusta' : 'Me gusta'}
            >
              <Ionicons
                name={isLiked(recipe.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked(recipe.id) ? colors.error : colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtn} accessibilityLabel="Compartir">
              <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── PANEL DE CONTENIDO ── */}
      <View style={styles.panel}>

        {/* ── PASO 2: TÍTULO + BADGE ── */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={3}>
            {recipe.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: diffColor.bg }]}>
            <Text style={[styles.badgeText, { color: diffColor.text }]}>
              {recipe.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ── PASO 3: AUTOR + ESTRELLAS ── */}
        <View style={styles.authorRow}>
          <SmallAvatar name={recipe.author.name} />
          <Text style={styles.authorName}>{recipe.author.name}</Text>
          <StarRating rating={recipe.rating} reviewCount={recipe.reviewCount} />
        </View>

        {/* ── PASO 4: META CHIPS ── */}
        <View style={styles.metaRow}>
          <MetaChip icon="time-outline"   value={recipe.cookTime}         label="Cook Time"  />
          <MetaChip icon="people-outline" value={String(recipe.servings)} label="Porciones"  />
        </View>

        {/* ── PASO 5: DESCRIPCIÓN ── */}
        <Text style={styles.description}>{recipe.description}</Text>

      </View>
    </ScrollView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  // PASO 1 — Hero
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  heroButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Panel base
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // PASO 2 — Título + badge
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    ...typography.displayL,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    flexShrink: 0,
  },
  badgeText: {
    ...typography.label,
  },

  // PASO 3 — Autor + estrellas
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  authorName: {
    ...typography.bodyS,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsIcons: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // PASO 4 — MetaChips
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metaChip: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // PASO 5 — Descripción
  description: {
    ...typography.bodyM,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 16,
  },
});
