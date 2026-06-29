import { Category, Difficulty } from '@/types';

export type IngredientDraft = { id: string; name: string; amount: string };
export type StepDraft       = { id: string; description: string };

export type RecipeFormData = {
  imageUri:    string;
  title:       string;
  description: string;
  category:    Category | '';
  difficulty:  Difficulty | '';
  cookTime:    string;
  servings:    string;
  ingredients: IngredientDraft[];
  steps:       StepDraft[];
};

const INITIAL: RecipeFormData = {
  imageUri:    '',
  title:       '',
  description: '',
  category:    '',
  difficulty:  '',
  cookTime:    '',
  servings:    '',
  ingredients: [{ id: '1', name: '', amount: '' }],
  steps:       [{ id: '1', description: '' }],
};

// Variable módulo — persiste mientras la app está corriendo
let _data: RecipeFormData = { ...INITIAL };

export const recipeFormStore = {
  get:    (): RecipeFormData              => _data,
  update: (patch: Partial<RecipeFormData>) => { _data = { ..._data, ...patch }; },
  reset:  ()                              => { _data = { ...INITIAL }; },
};
