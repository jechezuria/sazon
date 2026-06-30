import { apiRequest } from './apiClient';
import { Recipe } from '../types';
import { AuthUser } from './auth.service';

// GET /api/users/:id — perfil público del autor (sin email/password)
export function getUserById(id: string): Promise<AuthUser> {
  return apiRequest<AuthUser>(`/api/users/${id}`);
}

// GET /api/users/:id/recipes — recetas publicadas por ese usuario
export function getRecipesByUser(id: string): Promise<Recipe[]> {
  return apiRequest<Recipe[]>(`/api/users/${id}/recipes`);
}
