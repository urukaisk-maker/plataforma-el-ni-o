/**
 * Tests para storage-adapter.js
 * @jest-environment jsdom
 */

import { getItem, setItem, removeItem, clear } from '../storage-adapter.js';

describe('storage-adapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setItem / getItem', () => {
    test('guarda y recupera un objeto', () => {
      const data = { name: 'El Niño', xp: 100 };
      expect(setItem('test_key', data)).toBe(true);
      expect(getItem('test_key')).toEqual(data);
    });

    test('devuelve fallback si la clave no existe', () => {
      expect(getItem('missing_key', 'default')).toBe('default');
      expect(getItem('missing_key', { a: 1 })).toEqual({ a: 1 });
    });

    test('devuelve fallback si el JSON está corrupto', () => {
      localStorage.setItem('bad_key', 'not json');
      expect(getItem('bad_key', 'fallback')).toBe('fallback');
    });
  });

  describe('removeItem', () => {
    test('elimina una clave', () => {
      setItem('to_remove', 123);
      expect(removeItem('to_remove')).toBe(true);
      expect(getItem('to_remove')).toBeNull();
    });
  });

  describe('clear', () => {
    test('limpia todo el localStorage', () => {
      setItem('a', 1);
      setItem('b', 2);
      expect(clear()).toBe(true);
      expect(getItem('a')).toBeNull();
      expect(getItem('b')).toBeNull();
    });
  });
});
