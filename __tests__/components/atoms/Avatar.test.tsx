// Pruebas unitarias — components/atoms/Avatar
// Verifica que el Avatar muestre las iniciales correctas cuando no hay foto,
// y que acepte los distintos tamaños disponibles.

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Avatar } from '@/components/atoms/Avatar';

describe('Avatar', () => {

  // ── Iniciales ─────────────────────────────────────────────────────────────
  describe('iniciales (sin avatarUrl)', () => {
    it('muestra la primera letra de cada palabra del nombre', () => {
      render(<Avatar name="Sofia Chen" />);
      expect(screen.getByText('SC')).toBeTruthy();
    });

    it('muestra las iniciales en mayúsculas', () => {
      render(<Avatar name="maria garcia" />);
      expect(screen.getByText('MG')).toBeTruthy();
    });

    it('toma solo las 2 primeras iniciales para nombres con más de 2 palabras', () => {
      render(<Avatar name="Juan Carlos Alberto" />);
      expect(screen.getByText('JC')).toBeTruthy();
    });

    it('funciona con un solo nombre', () => {
      render(<Avatar name="Valentina" />);
      expect(screen.getByText('V')).toBeTruthy();
    });
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────
  describe('tamaños disponibles', () => {
    it('se renderiza con size sm', () => {
      render(<Avatar name="Test Usuario" size="sm" />);
      expect(screen.getByText('TU')).toBeTruthy();
    });

    it('se renderiza con size md (default)', () => {
      render(<Avatar name="Test Usuario" />);
      expect(screen.getByText('TU')).toBeTruthy();
    });

    it('se renderiza con size lg', () => {
      render(<Avatar name="Test Usuario" size="lg" />);
      expect(screen.getByText('TU')).toBeTruthy();
    });

    it('se renderiza con size xl', () => {
      render(<Avatar name="Test Usuario" size="xl" />);
      expect(screen.getByText('TU')).toBeTruthy();
    });
  });

  // ── Con foto ──────────────────────────────────────────────────────────────
  describe('con avatarUrl', () => {
    it('no muestra iniciales cuando hay avatarUrl', () => {
      render(<Avatar name="Sofia Chen" avatarUrl="https://ejemplo.com/foto.jpg" />);
      expect(screen.queryByText('SC')).toBeNull();
    });
  });

});
