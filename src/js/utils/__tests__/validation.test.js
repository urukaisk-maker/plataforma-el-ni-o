/**
 * Tests para validation.js
 */

import {
  escapeHtml,
  sanitizeText,
  sanitizeTags,
  isValidImageUrl,
  isNonEmptyString,
} from '../validation.js';

describe('validation', () => {
  describe('escapeHtml', () => {
    test('escapa caracteres especiales', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    test('devuelve string vacío para no-strings', () => {
      expect(escapeHtml(123)).toBe('');
      expect(escapeHtml(null)).toBe('');
    });
  });

  describe('sanitizeText', () => {
    test('elimina etiquetas prohibidas', () => {
      expect(sanitizeText('<script>evil</script>Hola')).toBe('Hola');
    });

    test('limita longitud', () => {
      const long = 'a'.repeat(2000);
      expect(sanitizeText(long, 10).length).toBe(10);
    });

    test('recorta espacios', () => {
      expect(sanitizeText('  hola  ')).toBe('hola');
    });
  });

  describe('sanitizeTags', () => {
    test('limpia y limita etiquetas', () => {
      expect(sanitizeTags(['  FAMILIA  ', 'GAMER', ''])).toEqual([
        'familia',
        'gamer',
      ]);
    });

    test('limita número de etiquetas', () => {
      const tags = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(sanitizeTags(tags, 3).length).toBe(3);
    });
  });

  describe('isValidImageUrl', () => {
    test('acepta URLs http/https', () => {
      expect(isValidImageUrl('https://example.com/img.png')).toBe(true);
      expect(isValidImageUrl('http://localhost/img.jpg')).toBe(true);
    });

    test('rechaza URLs malformadas', () => {
      expect(isValidImageUrl('not-a-url')).toBe(false);
      expect(isValidImageUrl('ftp://server.com/img.png')).toBe(false);
      expect(isValidImageUrl('')).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    test('acepta strings no vacíos', () => {
      expect(isNonEmptyString('hola')).toBe(true);
    });

    test('rechaza vacíos y no-strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
    });
  });
});
