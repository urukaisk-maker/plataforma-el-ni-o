/**
 * Tests para security-headers.js
 */

import { generateNetlifyHeaders, SECURITY_CHECKLIST, runSecurityAudit } from '../security-headers.js';

describe('security-headers', () => {
  describe('generateNetlifyHeaders', () => {
    test('genera headers con CSP', () => {
      const headers = generateNetlifyHeaders();
      expect(headers).toContain('Content-Security-Policy:');
      expect(headers).toContain("default-src 'self'");
    });

    test('incluye HSTS', () => {
      const headers = generateNetlifyHeaders();
      expect(headers).toContain('Strict-Transport-Security:');
      expect(headers).toContain('max-age=63072000');
    });

    test('incluye X-Frame-Options DENY', () => {
      const headers = generateNetlifyHeaders();
      expect(headers).toContain('X-Frame-Options: DENY');
    });

    test('incluye Referrer-Policy', () => {
      const headers = generateNetlifyHeaders();
      expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    });

    test('incluye Permissions-Policy', () => {
      const headers = generateNetlifyHeaders();
      expect(headers).toContain('Permissions-Policy:');
      expect(headers).toContain('camera=()');
    });
  });

  describe('SECURITY_CHECKLIST', () => {
    test('tiene items de headers', () => {
      const headerItems = SECURITY_CHECKLIST.filter(i => i.cat === 'headers');
      expect(headerItems.length).toBeGreaterThan(0);
    });

    test('tiene items de coppa', () => {
      const coppaItems = SECURITY_CHECKLIST.filter(i => i.cat === 'coppa');
      expect(coppaItems.length).toBeGreaterThan(0);
    });

    test('tiene items de gdpr', () => {
      const gdprItems = SECURITY_CHECKLIST.filter(i => i.cat === 'gdpr');
      expect(gdprItems.length).toBeGreaterThan(0);
    });

    test('cada item tiene id, label y cat', () => {
      SECURITY_CHECKLIST.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.label).toBeDefined();
        expect(item.cat).toBeDefined();
      });
    });
  });

  describe('runSecurityAudit', () => {
    test('devuelve array de resultados', () => {
      const results = runSecurityAudit();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    test('cada resultado tiene id, pass y msg', () => {
      const results = runSecurityAudit();
      results.forEach(r => {
        expect(r.id).toBeDefined();
        expect(typeof r.pass).toBe('boolean');
        expect(r.msg).toBeDefined();
      });
    });
  });
});
