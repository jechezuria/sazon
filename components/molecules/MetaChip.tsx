import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface MetaChipProps {
  icon: FeatherIconName;
  label: string;
}

export function MetaChip({ icon, label }: MetaChipProps) {
  return (
    <View style={styles.chip}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    minWidth: 90,
  },
  label: {
    ...typography.bodyS,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
