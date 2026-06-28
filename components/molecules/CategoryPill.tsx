import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

interface CategoryPillProps {
  label: string;
  emoji?: string;
  active?: boolean;
  onPress: () => void;
}

export function CategoryPill({ label, emoji, active = false, onPress }: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
        {emoji ? `${emoji} ${label}` : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    ...typography.buttonSm,
  },
  textActive: {
    color: colors.surface,
  },
  textInactive: {
    color: colors.textSecondary,
  },
});
