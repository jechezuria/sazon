import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export default function CrearIngredientesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Crear receta</Text>
        <Text style={styles.sub}>Paso 2 · Ingredientes</Text>
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
