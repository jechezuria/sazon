import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface ProfileMenuItemProps {
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
  showSeparator?: boolean;
}

export function ProfileMenuItem({
  icon,
  label,
  onPress,
  danger = false,
  showSeparator = true,
}: ProfileMenuItemProps) {
  const tint = danger ? colors.error : colors.primary;

  return (
    <>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={styles.row}
      >
        <View style={[styles.iconWrap, { backgroundColor: danger ? '#FFEBEE' : colors.primaryLight }]}>
          <Feather name={icon} size={18} color={tint} />
        </View>
        <Text style={[styles.label, danger && { color: colors.error }]}>{label}</Text>
        {!danger && <Feather name="chevron-right" size={18} color={colors.textMuted} />}
      </Pressable>
      {showSeparator && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodyM,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 36 + spacing.md,
  },
});
