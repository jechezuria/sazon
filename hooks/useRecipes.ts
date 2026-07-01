import { useState, useEffect } from 'react';
import { getRecipes, getRecipeById as fetchById } from '@/services/recipes.service';
import { Category, Recipe } from '@/types';

// Cache a nivel de módulo: se hace una sola llamada al backend por sesión
let _cache: Recipe[] | null = null;
let _promise: Promise<Recipe[]> | null = null;

function getRecipesOnce(): Promise<Recipe[]> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = getRecipes()
    .then(data => { _cache = data; _promise = null; return data; })
    .catch(e => { _promise = null; throw e; });
  return _promise;
}

export function invalidateRecipesCache() {
  _cache = null;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(_cache ?? []);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (_cache) return;
    getRecipesOnce()
      .then(setRecipes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getAll = (): Recipe[] => recipes;
  const getById = (id: string): Recipe | undefined => recipes.find(r => r.id === id);
  const getByCategory = (cat: Category): Recipe[] => recipes.filter(r => r.category === cat);
  const search = (q: string): Recipe[] => {
    const lower = q.toLowerCase();
    return recipes.filter(r =>
      r.title.toLowerCase().includes(lower) ||
      r.tags.some(t => t.toLowerCase().includes(lower)) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(lower))
    );
  };
  const getLiked = (ids: Set<string>): Recipe[] => recipes.filter(r => ids.has(r.id));
  const getByAuthor = (authorId: string): Recipe[] => recipes.filter(r => r.author.id === authorId);

  return { recipes, loading, error, getAll, getById, getByCategory, search, getLiked, getByAuthor };
}

// Para la pantalla de detalle: fetch directo por ID sin depender del cache
export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<Recipe | undefined>(
    _cache?.find(r => r.id === id)
  );
  const [loading, setLoading] = useState(!recipe);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipe) return;
    fetchById(id)
      .then(setRecipe)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { recipe, loading, error };
}
