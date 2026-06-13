import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { cn, generateSphericalPosition, pseudoNoise } from './math-helpers';

describe('math-helpers', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      const result = cn('bg-red-500 text-white', 'bg-blue-500');
      // bg-blue-500 should override bg-red-500 when merged via tailwind-merge
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('bg-red-500');
    });

    it('should ignore falsey values', () => {
      const result = cn('text-xl', false && 'text-lg', null, undefined, 'font-bold');
      expect(result).toBe('text-xl font-bold');
    });
  });

  describe('generateSphericalPosition', () => {
    it('should return a Vector3', () => {
      const position = generateSphericalPosition(0, 10, 5, 1, 2, 3);
      expect(position).toBeInstanceOf(THREE.Vector3);
      // Validate that radius calculation roughly holds
      const distance = new THREE.Vector3(1, 2, 3).distanceTo(position);
      expect(distance).toBeCloseTo(5, 5);
    });

    it('should return a safe fallback and avoid NaN when total is 0 or negative', () => {
      const position = generateSphericalPosition(0, 0, 5, 1, 2, 3);
      expect(Number.isNaN(position.x)).toBe(false);
      expect(Number.isNaN(position.y)).toBe(false);
      expect(Number.isNaN(position.z)).toBe(false);
      expect(position.x).toBe(1);
      expect(position.y).toBe(2);
      expect(position.z).toBe(8); // radius * cos(0) + centerZ = 5 * 1 + 3 = 8
    });
  });

  describe('pseudoNoise', () => {
    it('should return a value between 0 and 1', () => {
      const noise = pseudoNoise(1.2, 3.4, 5.6, 9.9);
      expect(noise).toBeGreaterThanOrEqual(0);
      expect(noise).toBeLessThanOrEqual(1);
    });
  });
});
