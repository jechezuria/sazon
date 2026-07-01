// Pruebas unitarias — services/apiClient
// Verifica que apiRequest construya correctamente los requests HTTP
// y maneje bien los casos de éxito y error.

import { apiRequest, ApiError } from '@/services/apiClient';

jest.mock('@/services/config', () => ({ API_URL: 'http://localhost:3000' }));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockOkResponse(body: unknown, status = 200) {
  return {
    ok: true,
    status,
    json: jest.fn().mockResolvedValue(body),
  };
}

function mockErrorResponse(body: unknown, status: number) {
  return {
    ok: false,
    status,
    json: jest.fn().mockResolvedValue(body),
  };
}

// ── ApiError ──────────────────────────────────────────────────────────────────
describe('ApiError', () => {
  it('tiene name "ApiError"', () => {
    const error = new ApiError('Mensaje', 404);
    expect(error.name).toBe('ApiError');
  });

  it('guarda el status HTTP correctamente', () => {
    const error = new ApiError('No encontrado', 404);
    expect(error.status).toBe(404);
  });

  it('guarda el mensaje correctamente', () => {
    const error = new ApiError('Error interno', 500);
    expect(error.message).toBe('Error interno');
  });

  it('es instancia de Error', () => {
    const error = new ApiError('Test', 400);
    expect(error).toBeInstanceOf(Error);
  });
});

// ── apiRequest ────────────────────────────────────────────────────────────────
describe('apiRequest', () => {

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('hace GET a la URL correcta', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({ data: 'ok' }));
    await apiRequest('/api/recipes');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/recipes',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('incluye Content-Type application/json en todos los requests', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({}));
    await apiRequest('/api/test');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('incluye Authorization Bearer cuando se pasa token', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({}));
    await apiRequest('/api/me', { token: 'mi-jwt-token' });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer mi-jwt-token');
  });

  it('NO incluye Authorization cuando no hay token', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({}));
    await apiRequest('/api/recipes');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('hace POST con body serializado como JSON', async () => {
    mockFetch.mockResolvedValue(mockOkResponse({ id: '1' }));
    const body = { name: 'Sofia', email: 'sofia@test.com' };
    await apiRequest('/api/auth/register', { method: 'POST', body });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify(body));
  });

  it('retorna los datos parseados del JSON', async () => {
    const expected = { id: 'abc', name: 'Maria' };
    mockFetch.mockResolvedValue(mockOkResponse(expected));
    const result = await apiRequest('/api/users/abc');
    expect(result).toEqual(expected);
  });

  it('lanza ApiError cuando response.ok es false', async () => {
    mockFetch.mockResolvedValue(mockErrorResponse({ error: 'No encontrado' }, 404));
    await expect(apiRequest('/api/recipes/999')).rejects.toThrow(ApiError);
  });

  it('usa el mensaje del body en el ApiError', async () => {
    mockFetch.mockResolvedValue(mockErrorResponse({ error: 'Email ya registrado' }, 409));
    await expect(apiRequest('/api/auth/register', { method: 'POST', body: {} }))
      .rejects.toThrow('Email ya registrado');
  });

  it('el ApiError tiene el status HTTP correcto', async () => {
    mockFetch.mockResolvedValue(mockErrorResponse({ error: 'Sin permisos' }, 401));
    try {
      await apiRequest('/api/me');
    } catch (e) {
      expect((e as ApiError).status).toBe(401);
    }
  });

  it('retorna undefined para respuesta 204 No Content', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 204, json: jest.fn() });
    const result = await apiRequest('/api/recipes/1', { method: 'DELETE' });
    expect(result).toBeUndefined();
  });

});
