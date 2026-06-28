export type Category =
  | 'Desayuno'
  | 'Almuerzo'
  | 'Cena'
  | 'Postre'
  | 'Snack'
  | 'Vegetariano';

export type Difficulty = 'Fácil' | 'Medio' | 'Difícil';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

export interface Step {
  id: string;
  order: number;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  difficulty: Difficulty;
  cookTime: string;
  servings: number;
  rating: number;
  reviewCount: number;
  author: Author;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  likedRecipeIds: string[];
  myRecipeIds: string[];
}
