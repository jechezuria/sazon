import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { Step } from '../../types';

interface StepRowProps {
  step: Step;
}

export function StepRow({ step }: StepRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.number}>{step.order}</Text>
      </View>
      <Text style={styles.description}>{step.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  number: {
    ...typography.buttonSm,
    color: colors.surface,
  },
  description: {
    ...typography.bodyM,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
});
