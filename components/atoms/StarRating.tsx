import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

type StarSize = 'sm' | 'md';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: StarSize;
}

const SIZES = { sm: 12, md: 16 };

export function StarRating({ rating, reviewCount, size = 'md' }: StarRatingProps) {
  const starSize = SIZES[size];

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(i => (
        <Feather
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star'}
          size={starSize}
          color={i <= Math.round(rating) ? colors.rating : colors.border}
          style={{ marginRight: 1 }}
        />
      ))}
      {reviewCount !== undefined && (
        <Text style={[styles.count, size === 'sm' && styles.countSm]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  countSm: {
    fontSize: 11,
  },
});
