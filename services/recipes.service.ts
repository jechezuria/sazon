import { apiRequest } from './apiClient';
import { Category, Difficulty, Recipe } from '../types';

export interface RecipeFilters {
  category?: Category;
  difficulty?: Difficulty;
  search?: string;
  authorId?: string;
}

function buildQuery(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.search) params.set('search', filters.search);
  if (filters.authorId) params.set('authorId', filters.authorId);

  const query = params.toString();
  return query ? `?${query}` : '';
}

// GET /api/recipes — con filtros opcionales de categoría, dificultad, búsqueda y autor
export function getRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  return apiRequest<Recipe[]>(`/api/recipes${buildQuery(filters)}`);
}

// GET /api/recipes/:id
export function getRecipeById(id: string): Promise<Recipe> {
  return apiRequest<Recipe>(`/api/recipes/${id}`);
}

// GET /api/recipes/liked/mine — requiere token
export function getMyLikedRecipes(token: string): Promise<Recipe[]> {
  return apiRequest<Recipe[]>('/api/recipes/liked/mine', { token });
}

// POST /api/recipes — crea una nueva receta
export interface CreateRecipeInput {
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;
  servings: number;
  tags: string[];
  authorId: string;
  ingredients: { name: string; amount: string }[];
  steps: { description: string; order: number }[];
}

export function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  return apiRequest<Recipe>('/api/recipes', {
    method: 'POST',
    body: input,
  });
}

export interface UpdateRecipeInput {
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;
  servings: number;
  tags: string[];
  ingredients: { name: string; amount: string }[];
  steps: { description: string; order: number }[];
}

export function updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe> {
  return apiRequest<Recipe>(`/api/recipes/${id}`, {
    method: 'PUT',
    body: input,
  });
}

export function deleteRecipe(id: string): Promise<void> {
  return apiRequest<void>(`/api/recipes/${id}`, { method: 'DELETE' });
}

// POST /api/recipes/:id/like — requiere token. Toggle: alterna el estado de like.
export function toggleRecipeLike(recipeId: string, token: string): Promise<{ liked: boolean }> {
  return apiRequest<{ liked: boolean }>(`/api/recipes/${recipeId}/like`, {
    method: 'POST',
    token,
  });
}
