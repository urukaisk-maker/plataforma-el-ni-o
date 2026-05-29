/**
 * Tests para id.js
 */

import { generateId, generateShortId } from '../id.js';

describe('id generator', () => {
  describe('generateId', () => {
    test('genera ID con prefijo', () => {
      const id = generateId('comment');
      expect(id).toMatch(/^comment_/);
      expect(id.length).toBeGreaterThan(10);
    });

    test('genera IDs únicos', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId('test'));
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('generateShortId', () => {
    test('genera ID corto', () => {
      const id = generateShortId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(5);
    });
  });
});
