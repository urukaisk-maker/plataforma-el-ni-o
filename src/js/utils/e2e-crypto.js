/**
 * Cifrado extremo a extremo (E2E) con Web Crypto API.
 * Para mensajeria entre profesores y padres.
 * Solo stub de funciones; las claves reales se generan en el cliente.
 */

const ALGO = { name: 'AES-GCM', length: 256 };

/**
 * Genera un par de claves AES-GCM.
 * @returns {Promise<CryptoKey>}
 */
export async function generateKey() {
  return crypto.subtle.generateKey(ALGO, true, ['encrypt', 'decrypt']);
}

/**
 * Exporta una clave a formato raw (base64).
 */
export async function exportKey(key) {
  const raw = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(raw);
}

/**
 * Importa una clave desde raw base64.
 */
export async function importKey(base64Key) {
  const raw = new Uint8Array(base64ToArrayBuffer(base64Key));
  return crypto.subtle.importKey('raw', raw, ALGO, true, ['encrypt', 'decrypt']);
}

/**
 * Cifra un mensaje de texto.
 * @param {string} text
 * @param {CryptoKey} key
 */
export async function encryptMessage(text, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt({ name: ALGO.name, iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return arrayBufferToBase64(combined);
}

/**
 * Descifra un mensaje cifrado.
 * @param {string} base64Payload
 * @param {CryptoKey} key
 */
export async function decryptMessage(base64Payload, key) {
  const combined = new Uint8Array(base64ToArrayBuffer(base64Payload));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: ALGO.name, iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

/**
 * Deriva una clave compartida a partir de dos claves publicas ECDH (stub).
 */
export async function deriveSharedKey() {
  // Stub: en produccion usar ECDH para intercambio de claves
  return generateKey();
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
