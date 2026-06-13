import React from 'react';
import { render, screen, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NeuralStateProvider, useNeuralState } from './NeuralStateContext';

describe('NeuralStateContext', () => {
  it('should throw an error when useNeuralState is used outside of NeuralStateProvider', () => {
    // Suppress console.error for expected react boundary warning
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useNeuralState());
    }).toThrow('useNeuralState must be used within a NeuralStateProvider');

    spy.mockRestore();
  });

  it('should provide default state values and update functions when wrapped in NeuralStateProvider', () => {
    const TestComponent = () => {
      const { activeSectionIndex, setActiveSectionIndex } = useNeuralState();
      return (
        <div>
          <span data-testid="index">{activeSectionIndex}</span>
          <button data-testid="btn" onClick={() => setActiveSectionIndex(3)}>Change</button>
        </div>
      );
    };

    render(
      <NeuralStateProvider>
        <TestComponent />
      </NeuralStateProvider>
    );

    const indexSpan = screen.getByTestId('index');
    const btn = screen.getByTestId('btn');

    expect(indexSpan.textContent).toBe('0');
    act(() => {
      btn.click();
    });
    expect(indexSpan.textContent).toBe('3');
  });
});
