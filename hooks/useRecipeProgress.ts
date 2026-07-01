import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const key = (id: string) => `@sazon:progress:${id}`;

export function useRecipeProgress(recipeId: string) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(key(recipeId))
      .then(raw => {
        if (!raw) return;
        const { ingredientIds, stepIds } = JSON.parse(raw) as {
          ingredientIds: string[];
          stepIds: string[];
        };
        setCheckedIngredients(new Set(ingredientIds));
        setCheckedSteps(new Set(stepIds));
      })
      .catch(() => {});
  }, [recipeId]);

  function persist(ingredients: Set<string>, steps: Set<string>) {
    AsyncStorage.setItem(
      key(recipeId),
      JSON.stringify({ ingredientIds: [...ingredients], stepIds: [...steps] })
    ).catch(() => {});
  }

  function toggleIngredient(id: string) {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next, checkedSteps);
      return next;
    });
  }

  function toggleStep(id: string) {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(checkedIngredients, next);
      return next;
    });
  }

  return { checkedIngredients, checkedSteps, toggleIngredient, toggleStep };
}
