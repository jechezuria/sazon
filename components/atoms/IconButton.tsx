import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { radius } from '../../theme/spacing';

type IconButtonVariant = 'ghost' | 'surface' | 'primary';
type IconButtonSize = 'sm' | 'md' | 'lg';
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface IconButtonProps {
  icon: FeatherIconName;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: string;
  accessibilityLabel: string;
}

const SIZES = { sm: 32, md: 40, lg: 48 };
const ICON_SIZES = { sm: 16, md: 18, lg: 22 };

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  color,
  accessibilityLabel,
}: IconButtonProps) {
  const dim = SIZES[size];
  const iconSize = ICON_SIZES[size];

  const iconColor = color ?? (variant === 'primary' ? colors.surface : colors.textPrimary);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[
        styles.base,
        { width: dim, height: dim, borderRadius: radius.full },
        variant === 'surface' && styles.surface,
        variant === 'primary' && styles.primary,
      ]}
    >
      <Feather name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.float,
  },
});
