/**
 * Setup global para tests Jest.
 * Polyfill de Web Crypto API y TextEncoder en entorno jsdom.
 */

import { webcrypto } from 'node:crypto';

if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  });
}

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = class {
    encode(str) {
      const buf = new Uint8Array(new ArrayBuffer(str.length));
      for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
      return buf;
    }
  };
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = class {
    decode(buf) {
      const bytes = new Uint8Array(buf);
      let str = '';
      for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
      return str;
    }
  };
}
