import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type TagVariant = 'category' | 'difficulty' | 'filter';
type TagSize = 'sm' | 'md';

interface TagProps {
  label: string;
  variant?: TagVariant;
  size?: TagSize;
  active?: boolean;
  difficulty?: 'Fácil' | 'Medio' | 'Difícil';
}

export function Tag({ label, variant = 'category', size = 'md', active, difficulty }: TagProps) {
  const containerStyle = [
    styles.base,
    size === 'sm' && styles.sm,
    variant === 'category' && styles.category,
    variant === 'difficulty' && getDifficultyStyle(difficulty),
    variant === 'filter' && (active ? styles.filterActive : styles.filterInactive),
  ];

  const textStyle = [
    size === 'sm' ? typography.caption : typography.buttonSm,
    variant === 'category' && { color: colors.primary },
    variant === 'filter' && (active ? { color: colors.surface } : { color: colors.textSecondary }),
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

function getDifficultyStyle(difficulty?: string) {
  switch (difficulty) {
    case 'Fácil':  return { backgroundColor: '#E8F5E9' };
    case 'Medio':  return { backgroundColor: '#FFF8E1' };
    case 'Difícil': return { backgroundColor: '#FFEBEE' };
    default:       return { backgroundColor: colors.primaryLight };
  }
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  category: {
    backgroundColor: colors.primaryLight,
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
