/**
 * Adaptador de almacenamiento centralizado para localStorage.
 * Envuelve todas las operaciones con manejo de errores y validación.
 */

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clear() {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
}
