/**
 * Tests para e2e-crypto.js
 * Requiere Web Crypto API (polyfill en setup.js)
 */

import {
  generateKey,
  exportKey,
  importKey,
  encryptMessage,
  decryptMessage,
} from '../e2e-crypto.js';

describe('e2e-crypto', () => {
  test('genera clave valida', async () => {
    const key = await generateKey();
    expect(key).toBeDefined();
    expect(key.type).toBe('secret');
  });

  test('exporta e importa clave correctamente', async () => {
    const key = await generateKey();
    const exported = await exportKey(key);
    expect(typeof exported).toBe('string');
    expect(exported.length).toBeGreaterThan(20);

    const imported = await importKey(exported);
    expect(imported.type).toBe('secret');
  });

  test('cifra y descifra mensaje', async () => {
    const key = await generateKey();
    const original = 'Mensaje secreto entre profesor y padre';
    const encrypted = await encryptMessage(original, key);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(original);

    const decrypted = await decryptMessage(encrypted, key);
    expect(decrypted).toBe(original);
  });

  test('descifrado con clave incorrecta falla', async () => {
    const key1 = await generateKey();
    const key2 = await generateKey();
    const encrypted = await encryptMessage('test', key1);
    await expect(decryptMessage(encrypted, key2)).rejects.toThrow();
  });

  test('cifra mensaje vacio', async () => {
    const key = await generateKey();
    const encrypted = await encryptMessage('', key);
    const decrypted = await decryptMessage(encrypted, key);
    expect(decrypted).toBe('');
  });
});
