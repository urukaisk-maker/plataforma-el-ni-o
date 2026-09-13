// ==========================================
// SERVICIO DE SINCRONIZACION
// Sincroniza localStorage con Supabase
// Estrategia: offline-first
// ==========================================

import { supabase, supabaseDisponible, obtenerUsuarioActual } from '../utils/supabase-client.js';
import { getItem, setItem } from '../utils/storage-adapter.js';

// Claves de localStorage que se sincronizan
const CLAVES_SYNC = {
  gamification: 'elnino_gamification',
  currentPlayer: 'elnino_current_player',
  activity: 'elnino_activity_log',
  memories: 'elnino_memories',
  customization: 'elnino_customization',
};

// ==========================================
// ESTADO DE SINCRONIZACION
// ==========================================

let sincronizando = false;
let ultimaSync = null;
let listeners = [];

/**
 * Suscribirse a cambios de estado de sincronizacion.
 */
export function onSyncChange(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function notificarListeners(estado) {
  listeners.forEach((cb) => {
    try { cb(estado); } catch { /* ignorar */ }
  });
}

export function getEstadoSync() {
  return {
    sincronizando,
    ultimaSync,
    disponible: supabaseDisponible(),
  };
}

// ==========================================
// SINCRONIZACION PRINCIPAL
// ==========================================

/**
 * Sincroniza todo: sube cambios locales y baja cambios remotos.
 * @returns {Promise<{ok: boolean, subido: number, bajado: number}>}
 */
export async function sincronizarTodo() {
  if (!supabaseDisponible() || sincronizando) {
    return { ok: false, subido: 0, bajado: 0 };
  }

  sincronizando = true;
  notificarListeners(getEstadoSync());

  try {
    const user = await obtenerUsuarioActual();
    if (!user) {
      sincronizando = false;
      notificarListeners(getEstadoSync());
      return { ok: false, subido: 0, bajado: 0 };
    }

    // 1) Subir progreso local a Supabase
    const subido = await subirProgreso(user.id);

    // 2) Registrar evento en actividad
    await registrarActividad(user.id, 'sync_completado', { subido });

    ultimaSync = new Date().toISOString();
    sincronizando = false;
    notificarListeners(getEstadoSync());

    return { ok: true, subido, bajado: 0 };
  } catch (e) {
    console.error('[Sync] Error:', e.message);
    sincronizando = false;
    notificarListeners(getEstadoSync());
    return { ok: false, subido: 0, bajado: 0, error: e.message };
  }
}

// ==========================================
// SUBIR DATOS
// ==========================================

async function subirProgreso(userId) {
  const datos = getItem(CLAVES_SYNC.gamification, null);
  if (!datos || !datos.players) return 0;

  const player = getItem(CLAVES_SYNC.currentPlayer, null);
  if (!player) return 0;

  const playerId = typeof player === 'string' ? player : player.id;

  // Buscar el jugador actual en los datos
  const jugador = datos.players.find((p) => p.id === playerId);
  if (!jugador) return 0;

  // Preparar fila para Supabase
  const fila = {
    profile_id: userId,
    xp: jugador.xp || 0,
    level: jugador.level || 1,
    completed_missions: jugador.completedMissions || 0,
    unlocked_memories: jugador.unlockedMemories || 0,
    videos_watched: jugador.videosWatched || 0,
    daily_streak: jugador.dailyStreak || 0,
    perfect_days: jugador.perfectDays || 0,
    badges: jugador.badges || [],
    daily_missions: jugador.dailyMissions || [],
    weekly_missions: jugador.weeklyMissions || [],
    last_login: jugador.lastLogin || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('progress')
    .upsert(fila, { onConflict: 'profile_id' });

  if (error) {
    console.error('[Sync] Error subiendo progreso:', error.message);
    return 0;
  }

  return 1;
}

// ==========================================
// REGISTRAR ACTIVIDAD
// ==========================================

async function registrarActividad(userId, tipo, datos = {}) {
  const { error } = await supabase
    .from('activity')
    .insert({
      profile_id: userId,
      event_type: tipo,
      event_data: datos,
    });

  if (error) {
    console.warn('[Sync] Error registrando actividad:', error.message);
  }
}

// ==========================================
// AUTO-SYNC
// ==========================================

let intervaloSync = null;

/**
 * Inicia la sincronizacion automatica cada N segundos.
 */
export function iniciarAutoSync(intervaloMs = 60000) {
  detenerAutoSync();
  intervaloSync = setInterval(() => {
    sincronizarTodo();
  }, intervaloMs);

  // Sincronizar tambien cuando vuelve la conexion
  if (typeof window !== 'undefined') {
    window.addEventListener('online', sincronizarTodo);
  }
}

export function detenerAutoSync() {
  if (intervaloSync) {
    clearInterval(intervaloSync);
    intervaloSync = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', sincronizarTodo);
  }
}
