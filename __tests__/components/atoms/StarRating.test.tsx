// Pruebas unitarias — components/atoms/StarRating
// Verifica que el componente muestre el reviewCount y acepte distintos ratings y tamaños.

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StarRating } from '@/components/atoms/StarRating';

describe('StarRating', () => {

  it('se renderiza con rating 0', () => {
    render(<StarRating rating={0} />);
    // No lanza error, renderiza sin problemas
  });

  it('se renderiza con rating 5 (máximo)', () => {
    render(<StarRating rating={5} />);
    // Renderiza correctamente con la nota máxima
  });

  it('se renderiza con rating intermedio (3)', () => {
    render(<StarRating rating={3} />);
  });

  it('muestra el reviewCount cuando se pasa', () => {
    render(<StarRating rating={4} reviewCount={25} />);
    expect(screen.getByText('(25)')).toBeTruthy();
  });

  it('NO muestra reviewCount cuando no se pasa', () => {
    render(<StarRating rating={4} />);
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();
  });

  it('muestra reviewCount 0 correctamente', () => {
    render(<StarRating rating={3} reviewCount={0} />);
    expect(screen.getByText('(0)')).toBeTruthy();
  });

  it('se renderiza con size sm', () => {
    render(<StarRating rating={4} size="sm" />);
  });

  it('se renderiza con size md (default)', () => {
    render(<StarRating rating={4} size="md" />);
  });

  it('se renderiza con rating decimal (4.5)', () => {
    render(<StarRating rating={4.5} reviewCount={100} />);
    expect(screen.getByText('(100)')).toBeTruthy();
  });

});
