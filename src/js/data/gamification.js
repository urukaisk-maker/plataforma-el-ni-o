// Sistema de gamificación - Estructura de datos

// Niveles de jugador con requisitos de XP y recompensas
export const LEVELS = [
  { level: 1, name: 'Novato', xpRequired: 0, reward: 'Avatar básico', color: '#00f5ff' },
  { level: 2, name: 'Aprendiz', xpRequired: 100, reward: 'Marco de bronce', color: '#cd7f32' },
  { level: 3, name: 'Explorador', xpRequired: 250, reward: 'Insignia de explorador', color: '#c0c0c0' },
  { level: 4, name: 'Guerrero', xpRequired: 500, reward: 'Espada virtual', color: '#ffd700' },
  { level: 5, name: 'Héroe', xpRequired: 1000, reward: 'Capa de héroe', color: '#ff2bd6' },
  { level: 6, name: 'Campeón', xpRequired: 2000, reward: 'Corona de campeón', color: '#ffe45c' },
  { level: 7, name: 'Leyenda', xpRequired: 3500, reward: 'Trono de leyenda', color: '#ff6b6b' },
  { level: 8, name: 'Mítico', xpRequired: 5000, reward: 'Alas míticas', color: '#9b59b6' },
  { level: 9, name: 'Divino', xpRequired: 7500, reward: 'Aura divina', color: '#e74c3c' },
  { level: 10, name: 'Supremo', xpRequired: 10000, reward: 'Trono supremo + título especial', color: '#f39c12' },
];

// Insignias/achievements desbloqueables
export const BADGES = [
  {
    id: 'first_mission',
    name: 'Primera Misión',
    description: 'Completa tu primera misión',
    icon: '🎯',
    condition: player => player.completedMissions >= 1,
    xpReward: 50,
  },
  {
    id: 'mission_master',
    name: 'Maestro de Misiones',
    description: 'Completa 5 misiones',
    icon: '⚔️',
    condition: player => player.completedMissions >= 5,
    xpReward: 200,
  },
  {
    id: 'daily_streak_3',
    name: 'Racha de 3 Días',
    description: 'Completa misiones diarias 3 días seguidos',
    icon: '🔥',
    condition: player => player.dailyStreak >= 3,
    xpReward: 100,
  },
  {
    id: 'daily_streak_7',
    name: 'Racha de 7 Días',
    description: 'Completa misiones diarias 7 días seguidos',
    icon: '💪',
    condition: player => player.dailyStreak >= 7,
    xpReward: 300,
  },
  {
    id: 'memory_collector',
    name: 'Coleccionista de Recuerdos',
    description: 'Desbloquea 5 recuerdos',
    icon: '📸',
    condition: player => player.unlockedMemories >= 5,
    xpReward: 150,
  },
  {
    id: 'youtube_fan',
    name: 'Fan de YouTube',
    description: 'Ve 10 videos de la plataforma',
    icon: '🎬',
    condition: player => player.videosWatched >= 10,
    xpReward: 100,
  },
  {
    id: 'level_5',
    name: 'Héroe Naciente',
    description: 'Alcanza el nivel 5',
    icon: '🌟',
    condition: player => player.level >= 5,
    xpReward: 500,
  },
  {
    id: 'level_10',
    name: 'Supremo',
    description: 'Alcanza el nivel máximo',
    icon: '👑',
    condition: player => player.level >= 10,
    xpReward: 1000,
  },
  {
    id: 'perfect_day',
    name: 'Día Perfecto',
    description: 'Completa todas las misiones diarias en un día',
    icon: '✨',
    condition: player => player.perfectDays >= 1,
    xpReward: 250,
  },
  {
    id: 'surprise_unlocker',
    name: 'Desbloqueador de Sorpresas',
    description: 'Desbloquea la sorpresa antes de tiempo',
    icon: '🎁',
    condition: player => player.surpriseUnlockedEarly,
    xpReward: 300,
  },
  {
    id: 'music_lover',
    name: 'Amante de la Música',
    description: 'Reproduce música 10 veces',
    icon: '🎵',
    condition: player => player.musicPlays >= 10,
    xpReward: 75,
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Completa una misión antes de las 10 AM',
    icon: '🌅',
    condition: player => player.earlyMissions >= 1,
    xpReward: 100,
  },
];

// Misiones diarias
export const DAILY_MISSIONS = [
  {
    id: 'daily_login',
    name: 'Iniciar Sesión',
    description: 'Entra a la plataforma hoy',
    xpReward: 25,
    type: 'login',
    icon: '🚀',
  },
  {
    id: 'daily_watch_video',
    name: 'Ver un Video',
    description: 'Mira al menos un video de YouTube',
    xpReward: 30,
    type: 'watch_video',
    icon: '🎬',
  },
  {
    id: 'daily_memory',
    name: 'Recordar',
    description: 'Visita la sección de recuerdos',
    xpReward: 20,
    type: 'visit_memories',
    icon: '💭',
  },
  {
    id: 'daily_music',
    name: 'Escuchar Música',
    description: 'Reproduce la canción de fondo',
    xpReward: 15,
    type: 'play_music',
    icon: '🎵',
  },
  {
    id: 'daily_mission',
    name: 'Misión del Día',
    description: 'Avanza en una misión de la campaña',
    xpReward: 50,
    type: 'advance_mission',
    icon: '⚔️',
  },
];

// Misiones semanales
export const WEEKLY_MISSIONS = [
  {
    id: 'weekly_complete_3_missions',
    name: 'Completador',
    description: 'Completa 3 misiones esta semana',
    xpReward: 200,
    type: 'complete_missions',
    target: 3,
    icon: '🏆',
  },
  {
    id: 'weekly_watch_5_videos',
    name: 'Espectador',
    description: 'Mira 5 videos esta semana',
    xpReward: 150,
    type: 'watch_videos',
    target: 5,
    icon: '📺',
  },
  {
    id: 'weekly_unlock_3_memories',
    name: 'Explorador',
    description: 'Desbloquea 3 recuerdos esta semana',
    xpReward: 175,
    type: 'unlock_memories',
    target: 3,
    icon: '🗺️',
  },
  {
    id: 'weekly_daily_streak_5',
    name: 'Constante',
    description: 'Mantén una racha de 5 días con misiones diarias',
    xpReward: 300,
    type: 'daily_streak',
    target: 5,
    icon: '🔥',
  },
];

// Jugadores del leaderboard familiar (datos de ejemplo)
export const FAMILY_PLAYERS = [
  {
    id: 'elnino',
    name: 'El Niño',
    avatar: '🎮',
    level: 1,
    xp: 0,
    completedMissions: 0,
    unlockedMemories: 0,
    videosWatched: 0,
    badges: [],
    dailyStreak: 0,
    perfectDays: 0,
    musicPlays: 0,
    earlyMissions: 0,
    surpriseUnlockedEarly: false,
    lastLogin: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  {
    id: 'familia1',
    name: 'Papá',
    avatar: '👨',
    level: 3,
    xp: 280,
    completedMissions: 2,
    unlockedMemories: 4,
    videosWatched: 8,
    badges: ['first_mission', 'memory_collector'],
    dailyStreak: 2,
    perfectDays: 0,
    musicPlays: 5,
    earlyMissions: 1,
    surpriseUnlockedEarly: false,
    lastLogin: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  {
    id: 'familia2',
    name: 'Mamá',
    avatar: '👩',
    level: 4,
    xp: 520,
    completedMissions: 3,
    unlockedMemories: 6,
    videosWatched: 12,
    badges: ['first_mission', 'mission_master', 'memory_collector', 'youtube_fan'],
    dailyStreak: 5,
    perfectDays: 1,
    musicPlays: 8,
    earlyMissions: 2,
    surpriseUnlockedEarly: false,
    lastLogin: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  {
    id: 'familia3',
    name: 'Hermano',
    avatar: '👦',
    level: 2,
    xp: 150,
    completedMissions: 1,
    unlockedMemories: 2,
    videosWatched: 4,
    badges: ['first_mission'],
    dailyStreak: 1,
    perfectDays: 0,
    musicPlays: 3,
    earlyMissions: 0,
    surpriseUnlockedEarly: false,
    lastLogin: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
  {
    id: 'familia4',
    name: 'Hermana',
    avatar: '👧',
    level: 2,
    xp: 120,
    completedMissions: 1,
    unlockedMemories: 2,
    videosWatched: 3,
    badges: ['first_mission'],
    dailyStreak: 1,
    perfectDays: 0,
    musicPlays: 4,
    earlyMissions: 0,
    surpriseUnlockedEarly: false,
    lastLogin: null,
    lastDailyReset: null,
    lastWeeklyReset: null,
  },
];

// Función para obtener el nivel basado en XP
export function getLevelFromXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Función para calcular XP necesario para el siguiente nivel
export function getXPToNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;

  if (nextLevelIndex >= LEVELS.length) {
    return 0; // Nivel máximo alcanzado
  }

  return LEVELS[nextLevelIndex].xpRequired - currentXP;
}

// Función para verificar insignias desbloqueadas
export function checkUnlockedBadges(player) {
  return BADGES.filter(badge => badge.condition(player));
}

// Función para obtener misiones diarias activas
export function getActiveDailyMissions(player) {
  const today = new Date().toDateString();
  if (player.lastDailyReset !== today) {
    return DAILY_MISSIONS.map(mission => ({
      ...mission,
      completed: false,
      progress: 0,
    }));
  }
  return player.dailyMissions || [];
}

// Función para obtener misiones semanales activas
export function getActiveWeeklyMissions(player) {
  const now = new Date();
  const weekStart = getWeekStart(now);

  if (player.lastWeeklyReset !== weekStart.toISOString()) {
    return WEEKLY_MISSIONS.map(mission => ({
      ...mission,
      completed: false,
      progress: 0,
    }));
  }
  return player.weeklyMissions || [];
}

// Función auxiliar para obtener el inicio de la semana
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}
