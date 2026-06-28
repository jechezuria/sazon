import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

type Tab = 'ingredientes' | 'pasos';

interface TabSelectorProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabSelector({ active, onChange }: TabSelectorProps) {
  return (
    <View style={styles.container}>
      {(['ingredientes', 'pasos'] as Tab[]).map(tab => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          accessibilityRole="tab"
          style={[styles.tab, active === tab && styles.tabActive]}
        >
          <Text style={[styles.label, active === tab && styles.labelActive]}>
            {tab === 'ingredientes' ? 'Ingredientes' : 'Pasos'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  label: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
  },
});
