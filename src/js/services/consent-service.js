// ==========================================
// SERVICIO DE CONSENTIMIENTO PARENTAL
// Cumplimiento COPPA / GDPR-K
// ==========================================

import { supabase, supabaseConfigurado, obtenerUsuarioActual } from '../utils/supabase-client.js';
import { getItem, setItem } from '../utils/storage-adapter.js';

const CLAVE_CONSENT_LOCAL = 'elnino_consent_local';

// ==========================================
// GENERAR TOKEN
// ==========================================

/**
 * Genera un token aleatorio para verificacion parental.
 */
export function generarToken() {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ==========================================
// SOLICITAR CONSENTIMIENTO
// ==========================================

/**
 * Solicita consentimiento parental para un menor.
 * @param {string} childProfileId - UUID del perfil del niño
 * @param {string} parentEmail - Email del padre/madre
 * @returns {Promise<{ok: boolean, token?: string, error?: string}>}
 */
export async function solicitarConsentimiento(childProfileId, parentEmail) {
  // Guardar siempre en local (modo offline)
  const token = generarToken();
  const solicitud = {
    child_profile_id: childProfileId,
    parent_email: parentEmail,
    consent_token: token,
    granted: false,
    created_at: new Date().toISOString(),
  };

  // Guardar en localStorage
  const solicitudes = getItem(CLAVE_CONSENT_LOCAL, []);
  solicitudes.push(solicitud);
  setItem(CLAVE_CONSENT_LOCAL, solicitudes);

  // Si hay conexion, subir a Supabase
  if (supabaseConfigurado && supabase) {
    const { error } = await supabase
      .from('consent')
      .insert({
        child_profile_id: childProfileId,
        parent_email: parentEmail,
        consent_token: token,
      });

    if (error) {
      console.warn('[Consent] No se pudo subir a Supabase:', error.message);
      // Seguimos: se sincronizara despues
    }
  }

  return { ok: true, token };
}

// ==========================================
// VERIFICAR CONSENTIMIENTO
// ==========================================

/**
 * Verifica si un niño tiene consentimiento parental valido.
 */
export async function verificarConsentimiento(childProfileId) {
  // Buscar en local primero
  const solicitudes = getItem(CLAVE_CONSENT_LOCAL, []);
  const local = solicitudes.find(
    (s) => s.child_profile_id === childProfileId && s.granted
  );
  if (local) return { ok: true, origen: 'local' };

  // Si hay conexion, buscar en Supabase
  if (supabaseConfigurado && supabase) {
    const { data, error } = await supabase
      .from('consent')
      .select('granted')
      .eq('child_profile_id', childProfileId)
      .maybeSingle();

    if (!error && data && data.granted) {
      return { ok: true, origen: 'supabase' };
    }
  }

  return { ok: false };
}

// ==========================================
// OTORGAR CONSENTIMIENTO (padre)
// ==========================================

/**
 * Otorga el consentimiento parental usando el token.
 */
export async function otorgarConsentimiento(token) {
  // Actualizar en local
  const solicitudes = getItem(CLAVE_CONSENT_LOCAL, []);
  const idx = solicitudes.findIndex((s) => s.consent_token === token);
  if (idx >= 0) {
    solicitudes[idx].granted = true;
    solicitudes[idx].granted_at = new Date().toISOString();
    setItem(CLAVE_CONSENT_LOCAL, solicitudes);
  }

  // Actualizar en Supabase
  if (supabaseConfigurado && supabase) {
    const { error } = await supabase
      .from('consent')
      .update({
        granted: true,
        granted_at: new Date().toISOString(),
      })
      .eq('consent_token', token);

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  return { ok: true };
}

// ==========================================
// REVOCAR CONSENTIMIENTO
// ==========================================

export async function revocarConsentimiento(childProfileId) {
  const solicitudes = getItem(CLAVE_CONSENT_LOCAL, []);
  const idx = solicitudes.findIndex((s) => s.child_profile_id === childProfileId);
  if (idx >= 0) {
    solicitudes[idx].revoked_at = new Date().toISOString();
    solicitudes[idx].granted = false;
    setItem(CLAVE_CONSENT_LOCAL, solicitudes);
  }

  if (supabaseConfigurado && supabase) {
    const { error } = await supabase
      .from('consent')
      .update({
        granted: false,
        revoked_at: new Date().toISOString(),
      })
      .eq('child_profile_id', childProfileId);

    if (error) return { ok: false, error: error.message };
  }

  return { ok: true };
}

// ==========================================
// LISTAR CONSENTIMIENTOS DE MI FAMILIA
// ==========================================

export async function listarConsentimientos() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('consent')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}
