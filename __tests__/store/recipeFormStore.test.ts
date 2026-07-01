// Pruebas unitarias — store/recipeFormStore
// Store en memoria sin dependencias externas.
// Verifica las operaciones get(), update() y reset().

import { recipeFormStore } from '@/store/recipeFormStore';

describe('recipeFormStore', () => {

  beforeEach(() => {
    recipeFormStore.reset();
  });

  // ── Estado inicial ────────────────────────────────────────────────────────
  describe('estado inicial', () => {
    it('title empieza vacío', () => {
      expect(recipeFormStore.get().title).toBe('');
    });

    it('description empieza vacío', () => {
      expect(recipeFormStore.get().description).toBe('');
    });

    it('category empieza vacío', () => {
      expect(recipeFormStore.get().category).toBe('');
    });

    it('difficulty empieza vacío', () => {
      expect(recipeFormStore.get().difficulty).toBe('');
    });

    it('cookTime empieza vacío', () => {
      expect(recipeFormStore.get().cookTime).toBe('');
    });

    it('servings empieza vacío', () => {
      expect(recipeFormStore.get().servings).toBe('');
    });

    it('imageUri empieza vacío', () => {
      expect(recipeFormStore.get().imageUri).toBe('');
    });

    it('editMode empieza en false', () => {
      expect(recipeFormStore.get().editMode).toBe(false);
    });

    it('editRecipeId empieza en null', () => {
      expect(recipeFormStore.get().editRecipeId).toBeNull();
    });

    it('ingredients empieza con un ítem vacío', () => {
      const { ingredients } = recipeFormStore.get();
      expect(ingredients).toHaveLength(1);
      expect(ingredients[0].name).toBe('');
    });

    it('steps empieza con un paso vacío', () => {
      const { steps } = recipeFormStore.get();
      expect(steps).toHaveLength(1);
      expect(steps[0].description).toBe('');
    });
  });

  // ── update() ─────────────────────────────────────────────────────────────
  describe('update()', () => {
    it('actualiza el título correctamente', () => {
      recipeFormStore.update({ title: 'Empanadas' });
      expect(recipeFormStore.get().title).toBe('Empanadas');
    });

    it('actualiza múltiples campos a la vez', () => {
      recipeFormStore.update({ title: 'Pizza', category: 'Almuerzo', cookTime: '45 min' });
      const data = recipeFormStore.get();
      expect(data.title).toBe('Pizza');
      expect(data.category).toBe('Almuerzo');
      expect(data.cookTime).toBe('45 min');
    });

    it('no pisa campos que no se enviaron', () => {
      recipeFormStore.update({ title: 'Milanesa' });
      recipeFormStore.update({ cookTime: '20 min' });
      expect(recipeFormStore.get().title).toBe('Milanesa');
      expect(recipeFormStore.get().cookTime).toBe('20 min');
    });

    it('acumula varios updates consecutivos', () => {
      recipeFormStore.update({ title: 'A' });
      recipeFormStore.update({ title: 'B' });
      recipeFormStore.update({ title: 'C' });
      expect(recipeFormStore.get().title).toBe('C');
    });

    it('permite activar editMode', () => {
      recipeFormStore.update({ editMode: true, editRecipeId: 'abc-123' });
      expect(recipeFormStore.get().editMode).toBe(true);
      expect(recipeFormStore.get().editRecipeId).toBe('abc-123');
    });
  });

  // ── reset() ───────────────────────────────────────────────────────────────
  describe('reset()', () => {
    it('limpia el título después de haber sido actualizado', () => {
      recipeFormStore.update({ title: 'Sopa' });
      recipeFormStore.reset();
      expect(recipeFormStore.get().title).toBe('');
    });

    it('limpia todos los campos', () => {
      recipeFormStore.update({ title: 'Pizza', category: 'Cena', difficulty: 'Fácil', editMode: true });
      recipeFormStore.reset();
      const data = recipeFormStore.get();
      expect(data.title).toBe('');
      expect(data.category).toBe('');
      expect(data.difficulty).toBe('');
      expect(data.editMode).toBe(false);
    });

    it('reset es idempotente (llamarlo dos veces da el mismo resultado)', () => {
      recipeFormStore.update({ title: 'Test' });
      recipeFormStore.reset();
      recipeFormStore.reset();
      expect(recipeFormStore.get().title).toBe('');
    });
  });

});
