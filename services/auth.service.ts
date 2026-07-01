import { apiRequest } from './apiClient';

// Forma del usuario que devuelve el backend — sin likedRecipeIds/myRecipeIds
// (esos son del UserProfile mockeado, acá se consultan por separado vía recipes/users service)
export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// POST /api/auth/register
export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/register', { method: 'POST', body: input });
}

// POST /api/auth/login
export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/auth/login', { method: 'POST', body: input });
}

// GET /api/auth/me — requiere token
export function getMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/me', { token });
}
