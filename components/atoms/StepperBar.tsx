import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = { current: 1 | 2 | 3 };

const STEPS = ['Detalles', 'Ingredientes', 'Pasos'] as const;

export function StepperBar({ current }: Props) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, i) => {
        const num    = (i + 1) as 1 | 2 | 3;
        const done   = num < current;
        const active = num === current;

        return (
          <React.Fragment key={label}>
            {/* Paso: círculo + label debajo */}
            <View style={styles.step}>
              <View style={[
                styles.circle,
                done   && styles.circleDone,
                active && styles.circleActive,
              ]}>
                {done ? (
                  <Ionicons name="checkmark" size={12} color={colors.surface} />
                ) : (
                  <Text style={[styles.num, active && styles.numActive]}>{num}</Text>
                )}
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </View>

            {/* Línea conectora entre pasos (no después del último) */}
            {i < 2 && (
              <View style={[styles.line, done && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  step: {
    alignItems: 'center',
    gap: 4,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  circleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  num: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  numActive: {
    color: colors.surface,
  },

  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  labelActive: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // Línea horizontal entre pasos
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
    marginTop: 13,   // circle_height/2 - line_height/2 = 28/2 - 1.5/2 ≈ 13
  },
  lineDone: {
    backgroundColor: colors.success,
  },
});
