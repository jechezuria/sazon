import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/spacing';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = 'filled',
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={[
        styles.base,
        variant === 'outline' && styles.outline,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.surface} />
      ) : (
        <Text style={[styles.label, variant === 'outline' && styles.labelOutline]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
    color: colors.surface,
  },
  labelOutline: {
    color: colors.primary,
  },
});
