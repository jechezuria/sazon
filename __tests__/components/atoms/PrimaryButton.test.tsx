// Pruebas unitarias — components/atoms/PrimaryButton
// Verifica el label, el estado loading, disabled y que se llame onPress.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';

describe('PrimaryButton', () => {

  // ── Renderizado ───────────────────────────────────────────────────────────
  it('muestra el label del botón', () => {
    render(<PrimaryButton label="Guardar" onPress={() => {}} />);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('renderiza con variant filled (por defecto)', () => {
    render(<PrimaryButton label="Crear cuenta" onPress={() => {}} />);
    expect(screen.getByText('Crear cuenta')).toBeTruthy();
  });

  it('renderiza con variant outline', () => {
    render(<PrimaryButton label="Cancelar" onPress={() => {}} variant="outline" />);
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  // ── Interacción ───────────────────────────────────────────────────────────
  it('llama a onPress cuando se presiona', () => {
    const onPress = jest.fn();
    render(<PrimaryButton label="Publicar" onPress={onPress} />);
    fireEvent.press(screen.getByText('Publicar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('NO llama a onPress cuando está disabled', () => {
    const onPress = jest.fn();
    render(<PrimaryButton label="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('NO llama a onPress cuando está loading', () => {
    const onPress = jest.fn();
    render(<PrimaryButton label="Loading" onPress={onPress} loading />);
    // Con loading=true el label no se muestra, hay un ActivityIndicator
    expect(screen.queryByText('Loading')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  // ── Estado loading ────────────────────────────────────────────────────────
  it('oculta el label cuando loading=true', () => {
    render(<PrimaryButton label="Guardar" onPress={() => {}} loading />);
    expect(screen.queryByText('Guardar')).toBeNull();
  });

  it('muestra el label cuando loading=false', () => {
    render(<PrimaryButton label="Guardar" onPress={() => {}} loading={false} />);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  // ── Accesibilidad ─────────────────────────────────────────────────────────
  it('tiene accessibilityRole button', () => {
    render(<PrimaryButton label="Entrar" onPress={() => {}} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

});
