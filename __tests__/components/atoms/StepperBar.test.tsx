// Pruebas unitarias — components/atoms/StepperBar
// Verifica que se muestren las 3 etiquetas de pasos y que el componente
// responda correctamente a cada valor posible del prop `current` (1, 2, 3).

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StepperBar } from '@/components/atoms/StepperBar';

describe('StepperBar', () => {

  // ── Etiquetas de pasos ────────────────────────────────────────────────────────
  describe('etiquetas visibles', () => {
    it('muestra la etiqueta "Detalles"', () => {
      render(<StepperBar current={1} />);
      expect(screen.getByText('Detalles')).toBeTruthy();
    });

    it('muestra la etiqueta "Ingredientes"', () => {
      render(<StepperBar current={1} />);
      expect(screen.getByText('Ingredientes')).toBeTruthy();
    });

    it('muestra la etiqueta "Pasos"', () => {
      render(<StepperBar current={1} />);
      expect(screen.getByText('Pasos')).toBeTruthy();
    });

    it('siempre muestra los 3 pasos sin importar cuál es el actual', () => {
      render(<StepperBar current={2} />);
      expect(screen.getByText('Detalles')).toBeTruthy();
      expect(screen.getByText('Ingredientes')).toBeTruthy();
      expect(screen.getByText('Pasos')).toBeTruthy();
    });
  });

  // ── current = 1 (Detalles activo) ─────────────────────────────────────────────
  describe('current = 1', () => {
    it('se renderiza sin errores con current=1', () => {
      render(<StepperBar current={1} />);
    });

    it('muestra el número 1 (paso activo)', () => {
      render(<StepperBar current={1} />);
      expect(screen.getByText('1')).toBeTruthy();
    });

    it('muestra los números 2 y 3 (pasos pendientes)', () => {
      render(<StepperBar current={1} />);
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
    });
  });

  // ── current = 2 (Ingredientes activo) ────────────────────────────────────────
  describe('current = 2', () => {
    it('se renderiza sin errores con current=2', () => {
      render(<StepperBar current={2} />);
    });

    it('muestra el número 2 (paso activo)', () => {
      render(<StepperBar current={2} />);
      expect(screen.getByText('2')).toBeTruthy();
    });

    it('muestra el número 3 (paso pendiente)', () => {
      render(<StepperBar current={2} />);
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('el paso 1 aparece con checkmark (done) — no se muestra el número 1', () => {
      render(<StepperBar current={2} />);
      // El paso completado muestra un ícono checkmark, no el número
      expect(screen.queryByText('1')).toBeNull();
    });
  });

  // ── current = 3 (Pasos activo) ───────────────────────────────────────────────
  describe('current = 3', () => {
    it('se renderiza sin errores con current=3', () => {
      render(<StepperBar current={3} />);
    });

    it('muestra el número 3 (paso activo)', () => {
      render(<StepperBar current={3} />);
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('los pasos 1 y 2 están done — no muestran sus números', () => {
      render(<StepperBar current={3} />);
      expect(screen.queryByText('1')).toBeNull();
      expect(screen.queryByText('2')).toBeNull();
    });
  });

});
