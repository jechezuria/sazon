import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { CategoryPill } from '@/components/molecules/CategoryPill';

const CATEGORIAS = ['Todas', 'Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Postres'];

const FRASES = [
  '¿En qué te inspirás hoy?',
  '¿Qué cocinamos hoy?',
  '¿Sale algo rico?',
  '¿Qué se te antoja?',
  '¿Con ganas de cocinar...?',
];

export default function HomeScreen() {
  const router = useRouter();
  const frase = useMemo(() => FRASES[Math.floor(Math.random() * FRASES.length)], []);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.headline}>{frase}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/likes')}
            accessibilityLabel="Mis me gusta"
            accessibilityRole="button"
            style={styles.likeBtn}
          >
            <Feather name="heart" size={20} color={colors.surface} />
          </Pressable>
        </View>

        {/* Barra de búsqueda */}
        <Pressable
          onPress={() => router.push('/buscar')}
          accessibilityLabel="Buscar recetas"
          accessibilityRole="button"
          style={styles.searchBar}
        >
          <Feather name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Buscá recetas, ingredientes...</Text>
        </Pressable>
        {/* Categorías */}
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {CATEGORIAS.map(cat => (
            <CategoryPill
              key={cat}
              label={cat}
              active={categoriaActiva === cat}
              onPress={() => setCategoriaActiva(cat)}
            />
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greeting: {
    ...typography.bodyS,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.displayL,
    color: colors.textPrimary,
    maxWidth: 260,
  },
  likeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    ...typography.bodyM,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  pillsRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
