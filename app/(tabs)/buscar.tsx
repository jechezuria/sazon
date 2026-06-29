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
  container: { flex: 1, backgroundColor: colors.bg },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:     { ...typography.displayL, color: colors.textPrimary },
  sub:       { ...typography.bodyM, color: colors.textSecondary, marginTop: 8 },
});
