import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useRecipes } from '@/hooks/useRecipes';
import { useLikes } from '@/hooks/useLikes';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { getById }             = useRecipes();
  const { isLiked, toggleLike } = useLikes();

  const recipe = getById(id as string);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>
          Receta no encontrada
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── PASO 1: HERO ── */}
      <View>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />

        {/* Gradiente oscuro en la mitad inferior de la imagen */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)']}
          style={styles.heroGradient}
        />

        {/* Botones flotantes sobre la imagen */}
        <View style={[styles.heroButtons, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.back()}
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.heroBtnGroup}>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => toggleLike(recipe.id)}
              accessibilityLabel={isLiked(recipe.id) ? 'Quitar me gusta' : 'Me gusta'}
            >
              <Ionicons
                name={isLiked(recipe.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked(recipe.id) ? colors.error : colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtn} accessibilityLabel="Compartir">
              <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Panel blanco que sube 24px sobre el hero */}
      <View style={styles.panel}>
        <Text style={[typography.displayL, { color: colors.textPrimary }]}>
          {recipe.title}
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },

  // PASO 1 — Hero
  heroImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  heroButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Panel base
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
