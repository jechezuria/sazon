// Pruebas unitarias — services/auth.service
// Verifica que register, login y getMe llamen al endpoint correcto
// con los datos y headers adecuados.

jest.mock('@/services/config', () => ({ API_URL: 'http://localhost:3000' }));

import { register, login, getMe } from '@/services/auth.service';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockUser = {
  id: 'user-1',
  name: 'Sofia Chen',
  username: 'sofia',
  email: 'sofia@email.com',
  avatarUrl: null,
  bio: null,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockAuthResponse = { token: 'jwt-abc123', user: mockUser };

function ok(body: unknown) {
  return { ok: true, status: 200, json: jest.fn().mockResolvedValue(body) };
}
function err(body: unknown, status: number) {
  return { ok: false, status, json: jest.fn().mockResolvedValue(body) };
}

beforeEach(() => { mockFetch.mockReset(); });

// ── register ──────────────────────────────────────────────────────────────────
describe('register', () => {
  it('hace POST a /api/auth/register', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    await register({ name: 'Sofia Chen', username: 'sofia', email: 'sofia@email.com', password: 'Sazon123' });
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/register',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('envía name, username, email y password en el body', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    const input = { name: 'Sofia Chen', username: 'sofia', email: 'sofia@email.com', password: 'Sazon123' };
    await register(input);
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.name).toBe('Sofia Chen');
    expect(body.username).toBe('sofia');
    expect(body.email).toBe('sofia@email.com');
    expect(body.password).toBe('Sazon123');
  });

  it('envía avatarUrl cuando se pasa', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    await register({ name: 'S', username: 's', email: 's@s.com', password: 'Sazon123', avatarUrl: 'data:image/jpeg;base64,abc' });
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.avatarUrl).toBe('data:image/jpeg;base64,abc');
  });

  it('retorna token y user en caso de éxito', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    const result = await register({ name: 'S', username: 's', email: 's@s.com', password: 'Sazon123' });
    expect(result.token).toBe('jwt-abc123');
    expect(result.user.name).toBe('Sofia Chen');
  });

  it('lanza error en caso de email duplicado (409)', async () => {
    mockFetch.mockResolvedValue(err({ error: 'Ya existe un usuario con ese email' }, 409));
    await expect(register({ name: 'S', username: 's', email: 's@s.com', password: 'Sazon123' }))
      .rejects.toThrow('Ya existe un usuario con ese email');
  });
});

// ── login ─────────────────────────────────────────────────────────────────────
describe('login', () => {
  it('hace POST a /api/auth/login', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    await login({ email: 'sofia@email.com', password: 'Sazon123' });
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('envía email y password en el body', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    await login({ email: 'sofia@email.com', password: 'Sazon123' });
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.email).toBe('sofia@email.com');
    expect(body.password).toBe('Sazon123');
  });

  it('retorna token y user en caso de éxito', async () => {
    mockFetch.mockResolvedValue(ok(mockAuthResponse));
    const result = await login({ email: 'sofia@email.com', password: 'Sazon123' });
    expect(result.token).toBeTruthy();
    expect(result.user).toBeDefined();
  });

  it('lanza error con credenciales incorrectas (401)', async () => {
    mockFetch.mockResolvedValue(err({ error: 'Email o contraseña incorrectos' }, 401));
    await expect(login({ email: 'bad@email.com', password: 'wrongpass' }))
      .rejects.toThrow('Email o contraseña incorrectos');
  });
});

// ── getMe ─────────────────────────────────────────────────────────────────────
describe('getMe', () => {
  it('hace GET a /api/auth/me', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await getMe('mi-token');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/me',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('incluye el token en el header Authorization', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    await getMe('mi-token-secreto');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer mi-token-secreto');
  });

  it('retorna el usuario autenticado', async () => {
    mockFetch.mockResolvedValue(ok(mockUser));
    const result = await getMe('token');
    expect(result.id).toBe('user-1');
    expect(result.name).toBe('Sofia Chen');
  });

  it('lanza error si el token es inválido (401)', async () => {
    mockFetch.mockResolvedValue(err({ error: 'Token inválido' }, 401));
    await expect(getMe('token-invalido')).rejects.toThrow('Token inválido');
  });
});
