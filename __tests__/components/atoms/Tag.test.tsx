// Pruebas unitarias — components/atoms/Tag
// Verifica que el componente Tag muestre el label correcto
// y aplique los estilos según variant, size y active.

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Tag } from '@/components/atoms/Tag';

describe('Tag', () => {

  // ── Renderizado básico ────────────────────────────────────────────────────
  describe('renderizado básico', () => {
    it('muestra el label correctamente', () => {
      render(<Tag label="Desayuno" />);
      expect(screen.getByText('Desayuno')).toBeTruthy();
    });

    it('renderiza sin props opcionales (solo label)', () => {
      render(<Tag label="Solo label" />);
      expect(screen.getByText('Solo label')).toBeTruthy();
    });

    it('muestra el label con caracteres especiales', () => {
      render(<Tag label="Fácil" />);
      expect(screen.getByText('Fácil')).toBeTruthy();
    });
  });

  // ── Variant category ──────────────────────────────────────────────────────
  describe('variant category', () => {
    it('se renderiza con variant category', () => {
      render(<Tag label="Almuerzo" variant="category" />);
      expect(screen.getByText('Almuerzo')).toBeTruthy();
    });

    it('se renderiza sin especificar variant (default category)', () => {
      render(<Tag label="Cena" />);
      expect(screen.getByText('Cena')).toBeTruthy();
    });
  });

  // ── Variant difficulty ────────────────────────────────────────────────────
  describe('variant difficulty', () => {
    it('se renderiza con dificultad Fácil', () => {
      render(<Tag label="Fácil" variant="difficulty" difficulty="Fácil" />);
      expect(screen.getByText('Fácil')).toBeTruthy();
    });

    it('se renderiza con dificultad Medio', () => {
      render(<Tag label="Medio" variant="difficulty" difficulty="Medio" />);
      expect(screen.getByText('Medio')).toBeTruthy();
    });

    it('se renderiza con dificultad Difícil', () => {
      render(<Tag label="Difícil" variant="difficulty" difficulty="Difícil" />);
      expect(screen.getByText('Difícil')).toBeTruthy();
    });
  });

  // ── Variant filter ────────────────────────────────────────────────────────
  describe('variant filter', () => {
    it('se renderiza como filtro activo', () => {
      render(<Tag label="Vegetariano" variant="filter" active={true} />);
      expect(screen.getByText('Vegetariano')).toBeTruthy();
    });

    it('se renderiza como filtro inactivo', () => {
      render(<Tag label="Postre" variant="filter" active={false} />);
      expect(screen.getByText('Postre')).toBeTruthy();
    });
  });

  // ── Size ──────────────────────────────────────────────────────────────────
  describe('size', () => {
    it('se renderiza con size sm', () => {
      render(<Tag label="Snack" size="sm" />);
      expect(screen.getByText('Snack')).toBeTruthy();
    });

    it('se renderiza con size md (default)', () => {
      render(<Tag label="Snack" size="md" />);
      expect(screen.getByText('Snack')).toBeTruthy();
    });
  });

});
