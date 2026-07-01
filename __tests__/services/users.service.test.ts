// Pruebas unitarias — services/users.service
// Verifica getUserById, getRecipesByUser, updateProfile y changePassword.

jest.mock('@/services/config', () => ({ API_URL: 'http://localhost:3000' }));

import { getUserById, getRecipesByUser, updateProfile, changePassword } from '@/services/users.service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockUser = {
  id: 'u1', name: 'Carlos López', username: 'carlos',
  email: 'carlos@email.com', avatarUrl: null, bio: 'Chef aficionado', createdAt: '2024-01-01',
};

function ok(body: unknown) {
  return { ok: true, status: 200, json: jest.fn().mockResolvedValue(body) };
}
function err(body: unknown, status: number) {
  return { ok: false, status, json: jest.fn().mockResolvedValue(body) };
}

beforeEach(() => { mockFetch.mockReset(); });

// ── getUserById ───────────────────────────────────────────────────────────────
describe('getUserById', () => {
  it('hace GET a /api/users/:id', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await getUserById('u1');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/u1',
      expect.anything(),
    );
  });

  it('retorna los datos del usuario', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    const result = await getUserById('u1');
    expect(result.name).toBe('Carlos López');
    expect(result.username).toBe('carlos');
  });

  it('lanza error 404 cuando el usuario no existe', async () => {
    mockFetch.mockResolvedValue(err({ error: 'Usuario no encontrado' }, 404));
    await expect(getUserById('no-existe')).rejects.toThrow('Usuario no encontrado');
  });
});

// ── getRecipesByUser ──────────────────────────────────────────────────────────
describe('getRecipesByUser', () => {
  it('hace GET a /api/users/:id/recipes', async () => {
    mockFetch.mockResolvedValue(ok([]));
    await getRecipesByUser('u1');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/u1/recipes',
      expect.anything(),
    );
  });

  it('retorna array de recetas del usuario', async () => {
    const recipes = [{ id: 'r1', title: 'Pasta' }];
    mockFetch.mockResolvedValue(ok(recipes));
    const result = await getRecipesByUser('u1');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('retorna array vacío cuando el usuario no tiene recetas', async () => {
    mockFetch.mockResolvedValue(ok([]));
    const result = await getRecipesByUser('u1');
    expect(result).toHaveLength(0);
  });
});

// ── updateProfile ─────────────────────────────────────────────────────────────
describe('updateProfile', () => {
  it('hace PUT a /api/users/me', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await updateProfile({ name: 'Nuevo Nombre' }, 'token');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('incluye token en Authorization', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await updateProfile({ name: 'Test' }, 'mi-token-secreto');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer mi-token-secreto');
  });

  it('envía los campos a actualizar en el body', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await updateProfile({ name: 'Juan', bio: 'Nuevo bio' }, 'token');
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.name).toBe('Juan');
    expect(body.bio).toBe('Nuevo bio');
  });

  it('retorna el usuario actualizado', async () => {
    const updated = { ...mockUser, name: 'Carlos Actualizado' };
    mockFetch.mockResolvedValue(ok(updated));
    const result = await updateProfile({ name: 'Carlos Actualizado' }, 'token');
    expect(result.name).toBe('Carlos Actualizado');
  });
});

// ── changePassword ────────────────────────────────────────────────────────────
describe('changePassword', () => {
  it('hace PUT a /api/users/me/password', async () => {
    mockFetch.mockResolvedValue(ok({ message: 'Contraseña actualizada' }));
    await changePassword('NuevaClave1', 'token');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me/password',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('envía newPassword en el body', async () => {
    mockFetch.mockResolvedValue(ok({ message: 'ok' }));
    await changePassword('NuevaClave1', 'token');
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.newPassword).toBe('NuevaClave1');
  });

  it('incluye token en Authorization', async () => {
    mockFetch.mockResolvedValue(ok({ message: 'ok' }));
    await changePassword('NuevaClave1', 'token-abc');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer token-abc');
  });

  it('retorna mensaje de confirmación', async () => {
    mockFetch.mockResolvedValue(ok({ message: 'Contraseña actualizada correctamente' }));
    const result = await changePassword('NuevaClave1', 'token');
    expect(result.message).toBe('Contraseña actualizada correctamente');
  });

  it('lanza error si la contraseña es inválida', async () => {
    mockFetch.mockResolvedValue(err({ error: 'La contraseña debe tener al menos 8 caracteres' }, 400));
    await expect(changePassword('corta', 'token'))
      .rejects.toThrow('La contraseña debe tener al menos 8 caracteres');
  });
});
