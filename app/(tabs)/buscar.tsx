import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import { CategoryPill } from '@/components/molecules/CategoryPill';

const FILTROS = ['Todo', 'Rápido', 'Vegetariano', 'Popular', 'Nuevo'];

export default function BuscarScreen() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState('Todo');
  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar recetas</Text>

        {/* Barra de búsqueda — real TextInput, no decorativa */}
        <Pressable onPress={() => inputRef.current?.focus()} style={[styles.searchBar, focused && styles.searchBarFocused]}>
          <Feather
            name="search"
            size={18}
            color={focused ? colors.primary : colors.textMuted}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Buscá recetas, ingredientes..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Limpiar búsqueda">
              <Feather name="x" size={16} color={colors.textMuted} />
            </Pressable>
          )}
        </Pressable>

        {/* Pills de filtro — dentro del header para mantener el fondo blanco */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
          style={styles.pillsScroll}
        >
          {FILTROS.map(filtro => (
            <CategoryPill
              key={filtro}
              label={filtro}
              active={filtroActivo === filtro}
              onPress={() => setFiltroActivo(filtro)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* El resto de las secciones van acá */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    ...typography.displayL,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchBarFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    ...typography.bodyM,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  pillsScroll: {
    marginHorizontal: -spacing.lg,   // cancela el padding del header para ir de borde a borde
    marginTop: spacing.lg,
  },
  pillsRow: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing['4xl'],
  },
});
