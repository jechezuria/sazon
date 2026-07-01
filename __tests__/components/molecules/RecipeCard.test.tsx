// Pruebas unitarias — components/molecules/RecipeCard
// Verifica que la card muestre el título, autor, categoría y responda al press.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { RecipeCard } from '@/components/molecules/RecipeCard';
import type { Recipe } from '@/types';

// ── Mocks de dependencias nativas ─────────────────────────────────────────────
jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return { Image: (props: any) => <View testID="expo-image" {...props} /> };
});

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  Feather:  () => null,
}));

// ── Receta de prueba ──────────────────────────────────────────────────────────
const mockRecipe: Recipe = {
  id: 'r1',
  title: 'Tarta de manzana',
  description: 'Deliciosa tarta casera',
  imageUrl: '',
  category: 'Postre',
  difficulty: 'Fácil',
  cookTime: '45 min',
  servings: 8,
  rating: 4.5,
  reviewCount: 20,
  author: {
    id: 'u1',
    name: 'Sofia Chen',
    username: 'sofichen',
    avatarUrl: undefined,
  },
  ingredients: [],
  steps: [],
  tags: [],
  createdAt: '2024-01-01',
};

describe('RecipeCard', () => {

  // ── Variant full ─────────────────────────────────────────────────────────────
  describe('variant full (por defecto)', () => {
    it('muestra el título de la receta', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.getByText('Tarta de manzana')).toBeTruthy();
    });

    it('muestra el nombre del autor', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.getByText('Sofia Chen')).toBeTruthy();
    });

    it('muestra la categoría en el tag', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.getByText('Postre')).toBeTruthy();
    });

    it('muestra el tiempo de cocción', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.getByText('45 min')).toBeTruthy();
    });

    it('llama a onPress cuando se presiona la card', () => {
      const onPress = jest.fn();
      render(<RecipeCard recipe={mockRecipe} onPress={onPress} />);
      fireEvent.press(screen.getByText('Tarta de manzana'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('muestra el botón de like cuando se pasa onLike', () => {
      const onLike = jest.fn();
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} onLike={onLike} />);
      const likeBtn = screen.getByRole('button', { name: /me gusta/i });
      expect(likeBtn).toBeTruthy();
    });

    it('llama a onLike cuando se presiona el botón de like', () => {
      const onLike = jest.fn();
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} onLike={onLike} />);
      fireEvent.press(screen.getByRole('button', { name: /me gusta/i }));
      expect(onLike).toHaveBeenCalledTimes(1);
    });

    it('accesibilityLabel cambia a "Quitar me gusta" cuando isLiked=true', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} onLike={() => {}} isLiked={true} />);
      expect(screen.getByLabelText('Quitar me gusta')).toBeTruthy();
    });

    it('NO muestra botón de like cuando no se pasa onLike', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.queryByRole('button', { name: /me gusta/i })).toBeNull();
    });
  });

  // ── Variant compact ───────────────────────────────────────────────────────────
  describe('variant compact', () => {
    it('muestra el título en la versión compact', () => {
      render(<RecipeCard recipe={mockRecipe} variant="compact" onPress={() => {}} />);
      expect(screen.getByText('Tarta de manzana')).toBeTruthy();
    });

    it('muestra el tiempo de cocción en compact', () => {
      render(<RecipeCard recipe={mockRecipe} variant="compact" onPress={() => {}} />);
      expect(screen.getByText(/45 min/)).toBeTruthy();
    });

    it('llama a onPress en la versión compact', () => {
      const onPress = jest.fn();
      render(<RecipeCard recipe={mockRecipe} variant="compact" onPress={onPress} />);
      fireEvent.press(screen.getByText('Tarta de manzana'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('muestra el botón de like en compact cuando se pasa onLike', () => {
      const onLike = jest.fn();
      render(<RecipeCard recipe={mockRecipe} variant="compact" onPress={() => {}} onLike={onLike} />);
      const likeBtn = screen.getByRole('button', { name: /me gusta/i });
      expect(likeBtn).toBeTruthy();
    });
  });

  // ── Porciones ─────────────────────────────────────────────────────────────────
  describe('metadata', () => {
    it('muestra las porciones', () => {
      render(<RecipeCard recipe={mockRecipe} onPress={() => {}} />);
      expect(screen.getByText(/8 porc/)).toBeTruthy();
    });
  });

});
