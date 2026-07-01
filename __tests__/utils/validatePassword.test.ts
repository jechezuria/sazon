// Pruebas unitarias — utils/validatePassword
// Función pura: no necesita mocks ni renderizar componentes.
// Verifica cada regla de validación de contraseña por separado.

import { validatePassword, isPasswordValid } from '@/utils/validatePassword';

describe('validatePassword', () => {

  // ── minLength ─────────────────────────────────────────────────────────────
  describe('regla minLength (mínimo 8 caracteres)', () => {
    it('es true con exactamente 8 caracteres', () => {
      expect(validatePassword('Abcd1234').minLength).toBe(true);
    });

    it('es true con más de 8 caracteres', () => {
      expect(validatePassword('Abcdefgh1').minLength).toBe(true);
    });

    it('es false con 7 caracteres', () => {
      expect(validatePassword('Abcd123').minLength).toBe(false);
    });

    it('es false con contraseña vacía', () => {
      expect(validatePassword('').minLength).toBe(false);
    });
  });

  // ── hasLetter ─────────────────────────────────────────────────────────────
  describe('regla hasLetter (al menos 1 letra)', () => {
    it('es true cuando tiene letras minúsculas', () => {
      expect(validatePassword('abcd1234').hasLetter).toBe(true);
    });

    it('es true cuando tiene letras mayúsculas', () => {
      expect(validatePassword('ABCD1234').hasLetter).toBe(true);
    });

    it('es false cuando solo tiene números', () => {
      expect(validatePassword('12345678').hasLetter).toBe(false);
    });
  });

  // ── hasNumber ─────────────────────────────────────────────────────────────
  describe('regla hasNumber (al menos 1 número)', () => {
    it('es true cuando tiene al menos un número', () => {
      expect(validatePassword('HolaHola1').hasNumber).toBe(true);
    });

    it('es false cuando solo tiene letras', () => {
      expect(validatePassword('HolaHola').hasNumber).toBe(false);
    });
  });

  // ── alphanumeric ──────────────────────────────────────────────────────────
  describe('regla alphanumeric (solo letras y números)', () => {
    it('es true con solo letras y números', () => {
      expect(validatePassword('Hola1234').alphanumeric).toBe(true);
    });

    it('es false con símbolo especial (!)', () => {
      expect(validatePassword('Hola123!').alphanumeric).toBe(false);
    });

    it('es false con arroba (@)', () => {
      expect(validatePassword('Hola123@').alphanumeric).toBe(false);
    });

    it('es false con guión (-)', () => {
      expect(validatePassword('Hola123-').alphanumeric).toBe(false);
    });

    it('es false con cadena vacía', () => {
      expect(validatePassword('').alphanumeric).toBe(false);
    });
  });

  // ── Caso completo ─────────────────────────────────────────────────────────
  it('devuelve todas las reglas en true para una contraseña válida', () => {
    const resultado = validatePassword('Sazon123');
    expect(resultado.minLength).toBe(true);
    expect(resultado.hasLetter).toBe(true);
    expect(resultado.hasNumber).toBe(true);
    expect(resultado.alphanumeric).toBe(true);
  });

  it('devuelve múltiples reglas en false para una contraseña vacía', () => {
    const resultado = validatePassword('');
    expect(resultado.minLength).toBe(false);
    expect(resultado.hasLetter).toBe(false);
    expect(resultado.hasNumber).toBe(false);
    expect(resultado.alphanumeric).toBe(false);
  });

});

// ── isPasswordValid ───────────────────────────────────────────────────────────
describe('isPasswordValid', () => {
  it('retorna true cuando la contraseña cumple todas las reglas', () => {
    expect(isPasswordValid('Sazon123')).toBe(true);
    expect(isPasswordValid('MiClave99')).toBe(true);
  });

  it('retorna false cuando no tiene número', () => {
    expect(isPasswordValid('SoloLetras')).toBe(false);
  });

  it('retorna false cuando no tiene letra', () => {
    expect(isPasswordValid('12345678')).toBe(false);
  });

  it('retorna false cuando es muy corta', () => {
    expect(isPasswordValid('Abc12')).toBe(false);
  });

  it('retorna false cuando tiene símbolo especial', () => {
    expect(isPasswordValid('Abc1234!')).toBe(false);
  });
});
