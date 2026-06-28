import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: AvatarSize;
}

const SIZES = { sm: 28, md: 36, lg: 56, xl: 80 };
const FONT_SIZES = { sm: 11, md: 13, lg: 20, xl: 28 };

export function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps) {
  const dim = SIZES[size];
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[styles.image, { width: dim, height: dim, borderRadius: radius.full }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: dim, height: dim, borderRadius: radius.full }]}>
      <Text style={[styles.initials, { fontSize: FONT_SIZES[size] }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.label,
    color: colors.primary,
    letterSpacing: 0,
  },
});
