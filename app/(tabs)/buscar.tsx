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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Buscar</Text>
        <Text style={styles.sub}>Buscá recetas por nombre o ingrediente</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:     { ...typography.displayL, color: colors.textPrimary },
  sub:       { ...typography.bodyM, color: colors.textSecondary, marginTop: 8 },
});
