import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

// Datos para las categorías y los ingredientes
const CATEGORIES = [
  { id: '1', label: 'Cena rápida', icon: '🌙' },
  { id: '2', label: 'Vegano', icon: '🌿' },
  { id: '3', label: 'Postres', icon: '🍰' },
  { id: '4', label: 'Saludable', icon: '🥗' },
];

const INGREDIENTS = [
  { id: '1', emoji: '🥑', label: 'Palta' },
  { id: '2', emoji: '🍗', label: 'Pollo' },
  { id: '3', emoji: '🍋', label: 'Limón' },
  { id: '4', emoji: '🥚', label: 'Huevo' },
];

export default function BuscarScreen() {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Header con Buscador Estilo Sazón */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
        <View style={styles.searchBox}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué quieres cocinar hoy?"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
                {/* 🏷️ Sección de Categorías */}
                <Text style={styles.sectionLabel}>DESTACADOS</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                      <View style={styles.catIconContainer}>
                        <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                      </View>
                      <Text style={styles.categoryCardText}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 🥦 Sección de Ingredientes */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>POR INGREDIENTE</Text>
                  <TouchableOpacity><Text style={styles.seeAll}>Ver todos</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientScroll}>
                  {INGREDIENTS.map((ing) => (
                    <TouchableOpacity key={ing.id} style={styles.ingredientCircle}>
                      <View style={styles.emojiBg}>
                        <Text style={{ fontSize: 24 }}>{ing.emoji}</Text>
                      </View>
                      <Text style={styles.ingredientName}>{ing.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* 🕐 Búsquedas Recientes */}
                <Text style={styles.sectionLabel}>RECIENTES</Text>
                <View style={styles.historyContainer}>
                  {['Pasta', 'Tacos', 'Ensalada'].map((term) => (
                    <View key={term} style={styles.historyTag}>
                      <Text style={styles.historyText}>{term}</Text>
                    </View>
                  ))}
                </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // Sombra sutil para darle profundidad
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    ...typography.displayL,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    ...typography.bodyM,
    color: colors.textPrimary,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryMid,
  },
  catIconContainer: {
    marginBottom: 8,
  },
  categoryCardText: {
    ...typography.h3,
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAll: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  ingredientScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  ingredientCircle: {
    alignItems: 'center',
    marginRight: 24,
  },
  emojiBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  ingredientName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  historyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyText: {
    ...typography.bodyS,
    color: colors.textSecondary,
  },
});