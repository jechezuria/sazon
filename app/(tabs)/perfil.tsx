import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export default function PerfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.sub}>Tu cuenta y configuración</Text>
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
