import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Recipe } from '../../types';
import { Tag } from '../atoms/Tag';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

type RecipeCardVariant = 'full' | 'compact';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: RecipeCardVariant;
  isLiked?: boolean;
  onPress: () => void;
  onLike?: () => void;
  width?: number;
}

const SCREEN_W = Dimensions.get('window').width;

export function RecipeCard({
  recipe,
  variant = 'full',
  isLiked = false,
  onPress,
  onLike,
  width,
}: RecipeCardProps) {
  if (variant === 'compact') {
    return <CompactCard recipe={recipe} isLiked={isLiked} onPress={onPress} onLike={onLike} width={width} />;
  }
  return <FullCard recipe={recipe} isLiked={isLiked} onPress={onPress} onLike={onLike} width={width} />;
}

function FullCard({ recipe, isLiked, onPress, onLike, width }: Omit<RecipeCardProps, 'variant'>) {
  const cardWidth = width ?? SCREEN_W - spacing.lg * 2;
  const imageHeight = Math.round(cardWidth * (2 / 3));

  return (
    <Pressable onPress={onPress} style={[styles.fullCard, { width: cardWidth }, shadows.card]}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={[styles.fullImage, { height: imageHeight }]}
        contentFit="cover"
        placeholder={{ color: colors.primaryLight }}
      />
      <LinearGradient
        colors={['transparent', colors.overlayDark]}
        style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.categoryChip}>
        <Tag label={recipe.category} variant="category" size="sm" />
      </View>
      {onLike && (
        <View style={styles.likeButton}>
          <IconButton
            icon={isLiked ? 'heart' : 'heart'}
            onPress={onLike}
            variant="surface"
            size="sm"
            color={isLiked ? colors.primary : colors.textSecondary}
            accessibilityLabel={isLiked ? 'Quitar me gusta' : 'Me gusta'}
          />
        </View>
      )}
      <View style={styles.fullOverlay}>
        <Text style={styles.fullTitle} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.fullMeta}>
          <View style={styles.authorRow}>
            <Avatar name={recipe.author.name} avatarUrl={recipe.author.avatarUrl} size="sm" />
            <Text style={styles.authorName}>{recipe.author.name}</Text>
          </View>
          <View style={styles.timeMeta}>
            <Text style={styles.metaText}>{recipe.cookTime}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{recipe.servings} porc.</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CompactCard({ recipe, isLiked, onPress, onLike, width }: Omit<RecipeCardProps, 'variant'>) {
  const cardWidth = width ?? (SCREEN_W - spacing.lg * 2 - spacing.md) / 2;
  const imageHeight = Math.round(cardWidth * (2 / 3));

  return (
    <Pressable onPress={onPress} style={[styles.compactCard, { width: cardWidth }, shadows.card]}>
      <Image
        source={{ uri: recipe.imageUrl }}
        style={[styles.compactImage, { height: imageHeight }]}
        contentFit="cover"
        placeholder={{ color: colors.primaryLight }}
      />
      {onLike && (
        <View style={styles.compactLike}>
          <IconButton
            icon="heart"
            onPress={onLike}
            variant="surface"
            size="sm"
            color={isLiked ? colors.primary : colors.textSecondary}
            accessibilityLabel={isLiked ? 'Quitar me gusta' : 'Me gusta'}
          />
        </View>
      )}
      <View style={styles.compactInfo}>
        <Text style={styles.compactTitle} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.compactMeta}>{recipe.cookTime} · {recipe.servings} porc.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  fullImage: {
    width: '100%',
  },
  categoryChip: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  likeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  fullOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  fullTitle: {
    ...typography.h2,
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  fullMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
  timeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
  metaDot: {
    color: 'rgba(255,255,255,0.6)',
  },
  compactCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  compactImage: {
    width: '100%',
  },
  compactLike: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  compactInfo: {
    padding: spacing.md,
  },
  compactTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  compactMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
