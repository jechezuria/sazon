import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { Ingredient } from '../../types';

interface IngredientRowProps {
  ingredient: Ingredient;
  showSeparator?: boolean;
}

export function IngredientRow({ ingredient, showSeparator = true }: IngredientRowProps) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setChecked(prev => !prev)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        style={styles.row}
      >
        <View style={[styles.radio, checked && styles.radioChecked]}>
          {checked && <Feather name="check" size={12} color={colors.surface} />}
        </View>
        <Text style={[styles.name, checked && styles.nameChecked]}>{ingredient.name}</Text>
        <Text style={styles.amount}>{ingredient.amount}</Text>
      </Pressable>
      {showSeparator && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  name: {
    ...typography.bodyM,
    color: colors.textPrimary,
    flex: 1,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  amount: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
