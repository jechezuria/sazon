import { MOCK_RECIPES } from '../data/mockData';
import { Category, Recipe } from '../types';

export function useRecipes() {
  const getAll = (): Recipe[] => MOCK_RECIPES;

  const getById = (id: string): Recipe | undefined =>
    MOCK_RECIPES.find(r => r.id === id);

  const getByCategory = (cat: Category): Recipe[] =>
    MOCK_RECIPES.filter(r => r.category === cat);

  const search = (query: string): Recipe[] => {
    const q = query.toLowerCase();
    return MOCK_RECIPES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  };

  const getLiked = (likedIds: Set<string>): Recipe[] =>
    MOCK_RECIPES.filter(r => likedIds.has(r.id));

  const getByAuthor = (authorId: string): Recipe[] =>
    MOCK_RECIPES.filter(r => r.author.id === authorId);

  return { getAll, getById, getByCategory, search, getLiked, getByAuthor };
}
