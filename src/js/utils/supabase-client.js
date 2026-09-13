// ==========================================
// CLIENTE DE SUPABASE
// Conexion centralizada con la base de datos
// ==========================================

import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.js';

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_ANON_KEY;

// Verificar que las credenciales estan configuradas
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseKey);

// Cliente de Supabase (o null si no esta configurado)
export const supabase = supabaseConfigurado
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==========================================
// HELPERS DE CONEXION
// ==========================================

/**
 * Comprueba si hay conexion a Internet.
 */
export function hayInternet() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Comprueba si Supabase esta disponible (configurado + con conexion).
 */
export function supabaseDisponible() {
  return supabaseConfigurado && hayInternet();
}

/**
 * Obtiene el usuario actual autenticado.
 * @returns {Promise<object|null>}
 */
export async function obtenerUsuarioActual() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Cierra la sesion del usuario actual.
 */
export async function cerrarSesion() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ==========================================
// LOG DE ESTADO
// ==========================================

if (typeof console !== 'undefined') {
  if (supabaseConfigurado) {
    console.log('[Supabase] Cliente configurado correctamente');
  } else {
    console.warn('[Supabase] Sin credenciales - modo solo local');
  }
}
