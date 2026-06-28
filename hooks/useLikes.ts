import { useState } from 'react';
import { MOCK_USER } from '../data/mockData';

export function useLikes() {
  const [likedIds, setLikedIds] = useState<Set<string>>(
    new Set(MOCK_USER.likedRecipeIds)
  );

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isLiked = (id: string) => likedIds.has(id);

  return { likedIds, toggleLike, isLiked };
}
