import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

// 1. Datos de ejemplo para las tarjetas
const SAVED_RECIPES = [
  {
    id: '1',
    title: 'Fluffy Buttermilk Pancakes',
    category: 'BREAKFAST',
    author: 'Sofia',
    time: '20 min',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=500',
  },
  {
    id: '2',
    title: 'Silky Chocolate Mousse',
    category: 'DESSERTS',
    author: 'Sofia',
    time: '40 min',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=500',
  },
];

export default function FavoritosScreen() {
  const [activeTab, setActiveTab] = useState('Saved');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Título de la pantalla */}
        <Text style={styles.headerTitle}>Mi Biblioteca</Text>

        {/* 📑 Menú de pestañas superiores */}
        <View style={styles.tabsRow}>
          {['Saved'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabButton}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>
                {tab === 'Saved' ? 'Guardados' : tab === 'Collections' ? 'Colecciones' : 'Offline'}
              </Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 🍱 Grid de Recetas (Muestra las tarjetas) */}
          <View style={styles.grid}>
            {SAVED_RECIPES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9}>
                {/* Imagen con etiquetas encima */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.image }} style={styles.recipeImage} />
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <View style={styles.heartIcon}>
                    <Text style={{ fontSize: 10 }}>🧡</Text>
                  </View>
                </View>

                {/* Información de la receta */}
                <View style={styles.cardInfo}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>

                  <View style={styles.footerRow}>
                    <View style={styles.authorRow}>
                      <View style={styles.avatarPlaceholder} />
                      <Text style={styles.authorName}>{item.author}</Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Text style={{ fontSize: 10 }}>🕒</Text>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  headerTitle: {
    ...typography.displayL,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  // 📑 Estilos de las pestañas superiores
  tabsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    paddingBottom: 10,
    position: 'relative',
  },
  tabText: {
    ...typography.bodyM,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  // 🍱 Estilos del Grid y las Tarjetas
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '700',
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 📝 Información de la receta
  cardInfo: {
    padding: 12,
  },
  recipeTitle: {
    ...typography.h3,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarPlaceholder: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primaryMid,
  },
  authorName: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 10,
    color: colors.textMuted,
  },
});