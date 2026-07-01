import { useCallback, useState } from 'react';
import { useRecipeProgressContext } from '@/context/RecipeProgressContext';

export function useRecipeProgress(recipeId: string) {
  const { getProgress, toggleIngredient: ctxToggleIngredient, toggleStep: ctxToggleStep } = useRecipeProgressContext();

  // Inicializa desde el contexto (persiste si el usuario navega y vuelve)
  const saved = getProgress(recipeId);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(() => new Set(saved.ingredientIds));
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set(saved.stepIds));

  const toggleIngredient = useCallback((id: string) => {
    // Actualiza el contexto (persistencia entre navegaciones)
    ctxToggleIngredient(recipeId, id);
    // Actualiza el estado local (rerenderiza la pantalla de inmediato)
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [recipeId, ctxToggleIngredient]);

  const toggleStep = useCallback((id: string) => {
    ctxToggleStep(recipeId, id);
    setCheckedSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [recipeId, ctxToggleStep]);

  return { checkedIngredients, checkedSteps, toggleIngredient, toggleStep };
}
