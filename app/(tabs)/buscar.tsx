import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import { CategoryPill } from '@/components/molecules/CategoryPill';
import { RecipeCard } from '@/components/molecules/RecipeCard';
import { useLikes } from '@/hooks/useLikes';
import { getRecipes } from '@/services/recipes.service';
import { Category, Difficulty, Recipe } from '@/types';

const RECENT_KEY = '@sazon:recent_searches';
const MAX_RECIENTES = 5;

const SEARCH_DEBOUNCE_MS = 400;

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
const CARD_W = (SCREEN_W - spacing.lg * 2 - CARD_GAP) / 2;

const FILTROS: Array<'Todas' | Category> = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack', 'Vegetariano'];
const DIFICULTADES: Difficulty[] = ['Fácil', 'Medio', 'Difícil'];
const INGREDIENTES = ['Palta', 'Pollo', 'Limón', 'Ajo', 'Tomate', 'Huevo', 'Arroz', 'Queso'];

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState<'Todas' | Category>('Todas');
  const [dificultadActiva, setDificultadActiva] = useState<Difficulty | null>(null);
  const [recientes, setRecientes] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  const { toggleLike, isLiked } = useLikes();

  const [resultados, setResultados] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Resetear filtros y resultados cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setDificultadActiva(null);
      setResultados([]);
      setError(false);
    }, [])
  );

  // Cargar búsquedas recientes al montar
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(raw => {
      if (raw) setRecientes(JSON.parse(raw));
    });
  }, []);

  async function guardarReciente(term: string) {
    const updated = [term, ...recientes.filter(r => r !== term)].slice(0, MAX_RECIENTES);
    setRecientes(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }

  useEffect(() => {
    const trimmed = query.trim();
    const hayFiltro = dificultadActiva !== null || filtroActivo !== 'Todas';

    if (trimmed.length === 0 && !hayFiltro) {
      setResultados([]);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const timeoutId = setTimeout(async () => {
      if (trimmed.length > 0) guardarReciente(trimmed);
      try {
        const data = await getRecipes({
          search: trimmed.length > 0 ? trimmed : undefined,
          category: filtroActivo !== 'Todas' ? filtroActivo : undefined,
          difficulty: dificultadActiva ?? undefined,
        });
        if (!cancelled) setResultados(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, filtroActivo, dificultadActiva]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.navigate('/')} accessibilityLabel="Volver al inicio">
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Buscar recetas</Text>
        </View>

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

        {/* Pills de categoría */}
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

        {(query.trim().length > 0 || dificultadActiva !== null) ? (
          /* ── Resultados ── */
          <>
          {/* Chips de dificultad visibles cuando no hay texto, para poder deseleccionar */}
          {query.trim().length === 0 && (
            <View style={[styles.ingredientesWrap, { marginBottom: spacing.lg }]}>
              {DIFICULTADES.map(dif => (
                <CategoryPill
                  key={dif}
                  label={dif}
                  active={dificultadActiva === dif}
                  onPress={() => setDificultadActiva(prev => prev === dif ? null : dif)}
                />
              ))}
            </View>
          )}
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Feather name="wifi-off" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No pudimos conectar</Text>
              <Text style={styles.emptySubtitle}>Revisá tu conexión e intentá de nuevo.</Text>
            </View>
          ) : resultados.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>{resultados.length} resultado{resultados.length !== 1 ? 's' : ''}</Text>
              <View style={styles.grid}>
                {resultados.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="compact"
                    width={CARD_W}
                    isLiked={isLiked(recipe.id)}
                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                    onLike={() => toggleLike(recipe.id, recipe)}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="search" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySubtitle}>
                {query.trim().length > 0
                  ? `No encontramos recetas para "${query}"`
                  : `No hay recetas con dificultad "${dificultadActiva}"`}
              </Text>
            </View>
          )}
          </>
        ) : (
          /* ── Estado inicial: recientes + ingredientes + dificultad ── */
          <>
            {recientes.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Búsquedas recientes</Text>
                <View style={styles.recentList}>
                  {recientes.map(term => (
                    <Pressable
                      key={term}
                      onPress={() => setQuery(term)}
                      accessibilityRole="button"
                      style={styles.recentItem}
                    >
                      <Feather name="clock" size={16} color={colors.textMuted} />
                      <Text style={styles.recentText}>{term}</Text>
                      <Feather name="arrow-right" size={16} color={colors.textMuted} />
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Buscar por ingrediente</Text>
            <View style={styles.ingredientesWrap}>
              {INGREDIENTES.map(ing => (
                <CategoryPill
                  key={ing}
                  label={ing}
                  active={query === ing}
                  onPress={() => setQuery(query === ing ? '' : ing)}
                />
              ))}
            </View>

            <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Buscar por dificultad</Text>
            <View style={styles.ingredientesWrap}>
              {DIFICULTADES.map(dif => (
                <CategoryPill
                  key={dif}
                  label={dif}
                  active={dificultadActiva === dif}
                  onPress={() => setDificultadActiva(prev => (prev === dif ? null : dif))}
                />
              ))}
            </View>
          </>
        )}

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.displayL,
    color: colors.textPrimary,
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
    marginHorizontal: -spacing.lg,
    marginTop: spacing.lg,
  },
  pillsRow: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  recentList: {
    gap: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentText: {
    ...typography.bodyM,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionLabelTop: {
    marginTop: spacing.xl,
  },
  ingredientesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.bodyM,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
