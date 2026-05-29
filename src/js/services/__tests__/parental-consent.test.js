/**
 * Tests para parental-consent.js
 */

import {
  checkAge,
  requestParentalConsent,
  verifyParentalConsent,
  revokeConsent,
  hasValidConsent,
  getConsentStatus,
} from '../parental-consent.js';

describe('parental-consent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('checkAge', () => {
    test('detecta mayor de 13 anos', () => {
      const birth = '2000-01-01';
      const result = checkAge(birth);
      expect(result.meetsMinimum).toBe(true);
      expect(result.age).toBeGreaterThan(20);
    });

    test('detecta menor de 13 anos', () => {
      const birth = new Date();
      birth.setFullYear(birth.getFullYear() - 10);
      const result = checkAge(birth.toISOString().split('T')[0]);
      expect(result.meetsMinimum).toBe(false);
      expect(result.age).toBe(10);
    });

    test('detecta exactamente 13 anos', () => {
      const birth = new Date();
      birth.setFullYear(birth.getFullYear() - 13);
      const result = checkAge(birth.toISOString().split('T')[0]);
      expect(result.meetsMinimum).toBe(true);
    });
  });

  describe('requestParentalConsent', () => {
    test('genera token y guarda estado', () => {
      const status = requestParentalConsent('padre@test.com', 'Juan');
      expect(status.parentEmail).toBe('padre@test.com');
      expect(status.childName).toBe('Juan');
      expect(status.token).toBeDefined();
      expect(status.token.length).toBe(32);
      expect(status.verified).toBe(false);
      expect(status.approved).toBe(false);
    });

    test('guarda en localStorage', () => {
      requestParentalConsent('padre@test.com', 'Juan');
      const saved = getConsentStatus();
      expect(saved.parentEmail).toBe('padre@test.com');
    });
  });

  describe('verifyParentalConsent', () => {
    test('verifica token correcto', () => {
      const { token } = requestParentalConsent('padre@test.com', 'Juan');
      const result = verifyParentalConsent(token);
      expect(result).toBe(true);
      const saved = getConsentStatus();
      expect(saved.verified).toBe(true);
      expect(saved.approved).toBe(true);
    });

    test('rechaza token incorrecto', () => {
      requestParentalConsent('padre@test.com', 'Juan');
      const result = verifyParentalConsent('token-falso');
      expect(result).toBe(false);
    });

    test('rechaza si no hay consentimiento previo', () => {
      const result = verifyParentalConsent('cualquier-token');
      expect(result).toBe(false);
    });
  });

  describe('revokeConsent', () => {
    test('elimina consentimiento', () => {
      requestParentalConsent('padre@test.com', 'Juan');
      revokeConsent();
      expect(getConsentStatus()).toBeNull();
    });
  });

  describe('hasValidConsent', () => {
    test('false cuando no hay consentimiento', () => {
      expect(hasValidConsent()).toBe(false);
    });

    test('false cuando no esta aprobado', () => {
      requestParentalConsent('padre@test.com', 'Juan');
      expect(hasValidConsent()).toBe(false);
    });

    test('true cuando esta verificado y aprobado', () => {
      const { token } = requestParentalConsent('padre@test.com', 'Juan');
      verifyParentalConsent(token);
      expect(hasValidConsent()).toBe(true);
    });

    test('true cuando el usuario es mayor de edad', () => {
      localStorage.setItem('elnino_user_age', '15');
      expect(hasValidConsent()).toBe(true);
    });
  });
});
