import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { IconButton } from '../atoms/IconButton';

const { width: SCREEN_W } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.round(SCREEN_W * (3 / 4));

interface RecipeHeroProps {
  imageUrl: string;
  isLiked: boolean;
  onBack: () => void;
  onLike: () => void;
  onShare: () => void;
}

export function RecipeHero({ imageUrl, isLiked, onBack, onLike, onShare }: RecipeHeroProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ color: colors.primaryLight }}
      />
      <LinearGradient
        colors={[colors.overlayLight, 'transparent']}
        style={[StyleSheet.absoluteFill]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />
      <View style={styles.buttons}>
        <IconButton
          icon="arrow-left"
          onPress={onBack}
          variant="surface"
          size="md"
          accessibilityLabel="Volver"
        />
        <View style={styles.rightButtons}>
          <IconButton
            icon="heart"
            onPress={onLike}
            variant="surface"
            size="md"
            color={isLiked ? colors.primary : colors.textPrimary}
            accessibilityLabel={isLiked ? 'Quitar me gusta' : 'Me gusta'}
          />
          <IconButton
            icon="share-2"
            onPress={onShare}
            variant="surface"
            size="md"
            accessibilityLabel="Compartir"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
