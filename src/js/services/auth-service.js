// ==========================================
// SERVICIO DE AUTENTICACION
// Magic links (sin contrasena) + roles familia
// ==========================================

import { supabase, supabaseConfigurado } from '../utils/supabase-client.js';

// ==========================================
// ESTADO
// ==========================================

let listeners = [];

export function onAuthChange(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function notificar(user) {
  listeners.forEach((cb) => {
    try { cb(user); } catch { /* ignorar */ }
  });
}

// ==========================================
// SUSCRIPCION A CAMBIOS DE SESION
// ==========================================

if (supabase) {
  supabase.auth.onAuthStateChange((evento, session) => {
    notificar(session?.user || null);
  });
}

// ==========================================
// ENVIAR MAGIC LINK
// ==========================================

/**
 * Envia un magic link al email del padre/madre.
 * @param {string} email
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function enviarMagicLink(email) {
  if (!supabaseConfigurado) {
    return { ok: false, error: 'Supabase no configurado' };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/perfil.html',
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

// ==========================================
// CERRAR SESION
// ==========================================

export async function cerrarSesion() {
  if (!supabase) return { ok: false };
  const { error } = await supabase.auth.signOut();
  return { ok: !error, error: error?.message };
}

// ==========================================
// OBTENER USUARIO ACTUAL
// ==========================================

export async function obtenerUsuario() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ==========================================
// CREAR PERFIL (despues del primer login)
// ==========================================

/**
 * Crea el perfil del usuario en la tabla profiles.
 * @param {object} datos - { display_name, role, birth_year }
 */
export async function crearPerfil(datos) {
  if (!supabase) return { ok: false, error: 'Sin conexion' };

  const user = await obtenerUsuario();
  if (!user) return { ok: false, error: 'No hay sesion' };

  // Crear familia si es la primera vez (si es padre)
  let familyId = null;
  if (datos.role === 'parent') {
    const { data: familia, error: errFam } = await supabase
      .from('families')
      .insert({ name: datos.family_name || 'Mi familia' })
      .select()
      .single();

    if (errFam) return { ok: false, error: errFam.message };
    familyId = familia.id;
  }

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      family_id: familyId,
      display_name: datos.display_name,
      role: datos.role || 'child',
      birth_year: datos.birth_year || null,
      language: datos.language || 'es',
    });

  if (error) return { ok: false, error: error.message };
  return { ok: true, familyId };
}

// ==========================================
// OBTENER PERFIL
// ==========================================

export async function obtenerPerfil() {
  if (!supabase) return null;
  const user = await obtenerUsuario();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return null;
  return data;
}

// ==========================================
// ESTA LOGUEADO?
// ==========================================

export async function estaLogueado() {
  const user = await obtenerUsuario();
  return Boolean(user);
}
