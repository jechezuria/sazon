// Pruebas unitarias — services/recipes.service
// Verifica que cada función haga el request correcto al endpoint correspondiente.

jest.mock('@/services/config', () => ({ API_URL: 'http://localhost:3000' }));

import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleRecipeLike,
  getMyLikedRecipes,
} from '@/services/recipes.service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockRecipe = {
  id: 'r1',
  title: 'Tortilla española',
  description: 'Clásica tortilla',
  imageUrl: '',
  category: 'Almuerzo',
  difficulty: 'Fácil',
  cookTime: '30 min',
  servings: 4,
  rating: 4.5,
  reviewCount: 10,
  tags: [],
  createdAt: '2024-01-01',
  author: { id: 'u1', name: 'Maria', username: 'maria', avatarUrl: null },
  ingredients: [],
  steps: [],
};

function ok(body: unknown) {
  return { ok: true, status: 200, json: jest.fn().mockResolvedValue(body) };
}
function err(body: unknown, status: number) {
  return { ok: false, status, json: jest.fn().mockResolvedValue(body) };
}

beforeEach(() => { mockFetch.mockReset(); });

// ── getRecipes ────────────────────────────────────────────────────────────────
describe('getRecipes', () => {
  it('hace GET a /api/recipes sin parámetros', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipes();
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes',
      expect.anything(),
    );
  });

  it('incluye filtro de categoría en la URL', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipes({ category: 'Desayuno' });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('category=Desayuno');
  });

  it('incluye filtro de dificultad en la URL', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipes({ difficulty: 'Fácil' });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('difficulty=F%C3%A1cil');
  });

  it('incluye término de búsqueda en la URL', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipes({ search: 'pasta' });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('search=pasta');
  });

  it('combina múltiples filtros correctamente', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipes({ category: 'Cena', search: 'pollo' });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('category=Cena');
    expect(url).toContain('search=pollo');
  });

  it('retorna array de recetas', async () => {
    mockFetch.mockResolvedValue(ok([mockRecipe]));
    const result = await getRecipes();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].title).toBe('Tortilla española');
  });
});

// ── getRecipeById ─────────────────────────────────────────────────────────────
describe('getRecipeById', () => {
  it('hace GET a /api/recipes/:id', async () => {
    mockFetch.mockResolvedValue(ok(mockRecipe));
    await getRecipeById('r1');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes/r1',
      expect.anything(),
    );
  });

  it('retorna la receta encontrada', async () => {
    mockFetch.mockResolvedValue(ok(mockRecipe));
    const result = await getRecipeById('r1');
    expect(result.id).toBe('r1');
    expect(result.title).toBe('Tortilla española');
  });

  it('lanza error 404 cuando no existe la receta', async () => {
    mockFetch.mockResolvedValue(err({ error: 'Receta no encontrada' }, 404));
    await expect(getRecipeById('no-existe')).rejects.toThrow('Receta no encontrada');
  });
});

// ── createRecipe ──────────────────────────────────────────────────────────────
describe('createRecipe', () => {
  const newRecipeInput = {
    title: 'Pizza casera',
    description: 'Masa crujiente',
    imageUrl: '',
    category: 'Cena' as const,
    difficulty: 'Medio' as const,
    cookTime: '45 min',
    servings: 2,
    tags: [],
    authorId: 'u1',
    ingredients: [{ name: 'Harina', amount: '500g' }],
    steps: [{ description: 'Mezclar', order: 1 }],
  };

  it('hace POST a /api/recipes', async () => {
    mockFetch.mockResolvedValue(ok(mockRecipe));
    await createRecipe(newRecipeInput);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('envía todos los campos de la receta en el body', async () => {
    mockFetch.mockResolvedValue(ok(mockRecipe));
    await createRecipe(newRecipeInput);
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.title).toBe('Pizza casera');
    expect(body.category).toBe('Cena');
    expect(body.authorId).toBe('u1');
  });

  it('retorna la receta creada', async () => {
    mockFetch.mockResolvedValue(ok(mockRecipe));
    const result = await createRecipe(newRecipeInput);
    expect(result).toBeDefined();
    expect(result.title).toBe('Tortilla española');
  });
});

// ── toggleRecipeLike ──────────────────────────────────────────────────────────
describe('toggleRecipeLike', () => {
  it('hace POST a /api/recipes/:id/like', async () => {
    mockFetch.mockResolvedValue(ok({ liked: true }));
    await toggleRecipeLike('r1', 'mi-token');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes/r1/like',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('incluye el token en Authorization', async () => {
    mockFetch.mockResolvedValue(ok({ liked: true }));
    await toggleRecipeLike('r1', 'token-del-usuario');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer token-del-usuario');
  });

  it('retorna { liked: true } al dar like', async () => {
    mockFetch.mockResolvedValue(ok({ liked: true }));
    const result = await toggleRecipeLike('r1', 'token');
    expect(result.liked).toBe(true);
  });

  it('retorna { liked: false } al quitar like', async () => {
    mockFetch.mockResolvedValue(ok({ liked: false }));
    const result = await toggleRecipeLike('r1', 'token');
    expect(result.liked).toBe(false);
  });
});

// ── deleteRecipe ──────────────────────────────────────────────────────────────
describe('deleteRecipe', () => {
  it('hace DELETE a /api/recipes/:id', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 204, json: jest.fn() });
    await deleteRecipe('r1');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes/r1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});

// ── getMyLikedRecipes ─────────────────────────────────────────────────────────
describe('getMyLikedRecipes', () => {
  it('hace GET a /api/recipes/liked/mine', async () => {
    mockFetch.mockResolvedValue(ok([mockRecipe]));
    await getMyLikedRecipes('mi-token');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes/liked/mine',
      expect.anything(),
    );
  });

  it('incluye token en Authorization', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getMyLikedRecipes('token-123');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer token-123');
  });
});
