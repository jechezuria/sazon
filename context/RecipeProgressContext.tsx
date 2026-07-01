import React, { createContext, useCallback, useContext, useRef } from 'react';

type ProgressMap = Map<string, { ingredientIds: Set<string>; stepIds: Set<string> }>;

interface RecipeProgressContextValue {
  getProgress: (recipeId: string) => { ingredientIds: Set<string>; stepIds: Set<string> };
  toggleIngredient: (recipeId: string, ingredientId: string) => void;
  toggleStep: (recipeId: string, stepId: string) => void;
  clearAll: () => void;
}

const RecipeProgressContext = createContext<RecipeProgressContextValue | null>(null);

export function RecipeProgressProvider({ children }: { children: React.ReactNode }) {
  // useRef para que las mutaciones no rerenderizen toda la app
  const progressRef = useRef<ProgressMap>(new Map());

  function ensureEntry(recipeId: string) {
    if (!progressRef.current.has(recipeId)) {
      progressRef.current.set(recipeId, { ingredientIds: new Set(), stepIds: new Set() });
    }
    return progressRef.current.get(recipeId)!;
  }

  const getProgress = useCallback((recipeId: string) => {
    const entry = progressRef.current.get(recipeId);
    // Devuelve copias para que el estado inicial del hook sea independiente
    return {
      ingredientIds: entry ? new Set(entry.ingredientIds) : new Set<string>(),
      stepIds: entry ? new Set(entry.stepIds) : new Set<string>(),
    };
  }, []);

  const toggleIngredient = useCallback((recipeId: string, ingredientId: string) => {
    const entry = ensureEntry(recipeId);
    entry.ingredientIds.has(ingredientId)
      ? entry.ingredientIds.delete(ingredientId)
      : entry.ingredientIds.add(ingredientId);
  }, []);

  const toggleStep = useCallback((recipeId: string, stepId: string) => {
    const entry = ensureEntry(recipeId);
    entry.stepIds.has(stepId)
      ? entry.stepIds.delete(stepId)
      : entry.stepIds.add(stepId);
  }, []);

  const clearAll = useCallback(() => {
    progressRef.current.clear();
  }, []);

  return (
    <RecipeProgressContext.Provider value={{ getProgress, toggleIngredient, toggleStep, clearAll }}>
      {children}
    </RecipeProgressContext.Provider>
  );
}

export function useRecipeProgressContext() {
  const ctx = useContext(RecipeProgressContext);
  if (!ctx) throw new Error('useRecipeProgressContext debe usarse dentro de RecipeProgressProvider');
  return ctx;
}
