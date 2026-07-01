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

// PUT /api/users/me — actualizar nombre, bio, avatarUrl — requiere token
export function updateProfile(
  data: { name?: string; bio?: string; avatarUrl?: string },
  token: string,
): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/users/me', { method: 'PUT', body: data, token });
}

// PUT /api/users/me/password — requiere token
export function changePassword(newPassword: string, token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/api/users/me/password', {
    method: 'PUT',
    body: { newPassword },
    token,
  });
}
