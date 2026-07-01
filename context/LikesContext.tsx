import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyLikedRecipes, toggleRecipeLike } from '@/services/recipes.service';
import { useAuth } from '@/context/AuthContext';
import { Recipe } from '@/types';

interface LikesContextValue {
  likedIds: Set<string>;
  likedRecipes: Recipe[];
  toggleLike: (id: string, recipe?: Recipe) => Promise<void>;
  isLiked: (id: string) => boolean;
  loading: boolean;
}

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Cuando el token cambia (login/logout): recarga los favoritos del backend
  useEffect(() => {
    if (!token) {
      setLikedRecipes([]);
      setLikedIds(new Set());
      return;
    }
    setLoading(true);
    getMyLikedRecipes(token)
      .then(recipes => {
        setLikedRecipes(recipes);
        setLikedIds(new Set(recipes.map(r => r.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function toggleLike(id: string, recipe?: Recipe) {
    if (!token) return;

    const wasLiked = likedIds.has(id);

    // Actualización optimista instantánea — no re-fetch, evita flickering
    setLikedIds(prev => {
      const next = new Set(prev);
      wasLiked ? next.delete(id) : next.add(id);
      return next;
    });
    setLikedRecipes(prev => {
      if (wasLiked) return prev.filter(r => r.id !== id);
      if (recipe) return [recipe, ...prev];
      return prev;
    });

    try {
      await toggleRecipeLike(id, token);
    } catch {
      // Revierte si el backend falla
      setLikedIds(prev => {
        const next = new Set(prev);
        wasLiked ? next.add(id) : next.delete(id);
        return next;
      });
      setLikedRecipes(prev => {
        if (!wasLiked) return prev.filter(r => r.id !== id);
        if (wasLiked && recipe) return [recipe, ...prev];
        return prev;
      });
    }
  }

  function isLiked(id: string) {
    return likedIds.has(id);
  }

  return (
    <LikesContext.Provider value={{ likedIds, likedRecipes, toggleLike, isLiked, loading }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikesContext(): LikesContextValue {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikesContext debe usarse dentro de LikesProvider');
  return ctx;
}
