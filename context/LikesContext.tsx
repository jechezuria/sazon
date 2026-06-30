import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyLikedRecipes, toggleRecipeLike } from '@/services/recipes.service';
import { useAuth } from '@/context/AuthContext';
import { Recipe } from '@/types';

interface LikesContextValue {
  likedIds: Set<string>;
  likedRecipes: Recipe[];
  toggleLike: (id: string) => Promise<void>;
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

  async function toggleLike(id: string) {
    if (!token) return;

    // Actualización optimista: cambia la UI antes de esperar la respuesta del backend
    const wasLiked = likedIds.has(id);
    setLikedIds(prev => {
      const next = new Set(prev);
      wasLiked ? next.delete(id) : next.add(id);
      return next;
    });
    if (wasLiked) {
      setLikedRecipes(prev => prev.filter(r => r.id !== id));
    }

    try {
      await toggleRecipeLike(id, token);
      // Sincroniza el estado real del backend (incluye la receta completa si fue agregada)
      const updated = await getMyLikedRecipes(token);
      setLikedRecipes(updated);
      setLikedIds(new Set(updated.map(r => r.id)));
    } catch {
      // Revierte el cambio optimista si la llamada falla
      setLikedIds(prev => {
        const next = new Set(prev);
        wasLiked ? next.add(id) : next.delete(id);
        return next;
      });
      if (wasLiked) {
        getMyLikedRecipes(token).then(rs => {
          setLikedRecipes(rs);
          setLikedIds(new Set(rs.map(r => r.id)));
        }).catch(() => {});
      }
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
