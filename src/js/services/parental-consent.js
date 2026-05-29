/**
 * Consentimiento parental (COPPA + GDPR-K).
 * Verificacion de edad, consentimiento del padre/madre, token de validacion.
 */

const CONSENT_KEY = 'elnino_parental_consent';
const MIN_AGE = 13;

export function getConsentStatus() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY)) || null;
  } catch {
    return null;
  }
}

export function setConsentStatus(status) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(status));
}

/**
 * Verifica si el nino cumple la edad minima.
 * @param {string} birthDate — YYYY-MM-DD
 */
export function checkAge(birthDate) {
  const dob = new Date(birthDate);
  const diff = Date.now() - dob.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return { age, meetsMinimum: age >= MIN_AGE };
}

/**
 * Solicita consentimiento parental para menores de 13 anos.
 * @param {string} parentEmail
 * @param {string} childName
 */
export function requestParentalConsent(parentEmail, childName) {
  const token = cryptoRandomToken();
  const status = {
    childName,
    parentEmail,
    token,
    requestedAt: new Date().toISOString(),
    verified: false,
    approved: false,
  };
  setConsentStatus(status);
  // En produccion: enviar email al padre con link de verificacion
  return status;
}

/**
 * Verifica el token de consentimiento parental.
 */
export function verifyParentalConsent(token) {
  const status = getConsentStatus();
  if (!status || status.token !== token) return false;
  status.verified = true;
  status.approved = true;
  status.verifiedAt = new Date().toISOString();
  setConsentStatus(status);
  return true;
}

/**
 * Revoca el consentimiento (derecho al olvido parcial).
 */
export function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY);
}

/**
 * Indica si la cuenta tiene consentimiento valido.
 */
export function hasValidConsent() {
  // Si es mayor de edad, no se requiere consentimiento
  const savedAge = localStorage.getItem('elnino_user_age');
  if (savedAge && parseInt(savedAge, 10) >= MIN_AGE) return true;
  const s = getConsentStatus();
  if (!s) return false;
  return s.approved === true && s.verified === true;
}

function cryptoRandomToken() {
  const arr = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}
