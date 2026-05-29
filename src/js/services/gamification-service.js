// Servicio de gamificación - Gestión de puntos, XP y localStorage
import {
  BADGES,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  FAMILY_PLAYERS,
  getLevelFromXP,
  getXPToNextLevel,
  checkUnlockedBadges,
} from '../data/gamification.js';
import { getItem, setItem, removeItem } from '../utils/storage-adapter.js';

const STORAGE_KEY = 'elnino_gamification';
const CURRENT_PLAYER_KEY = 'elnino_current_player';

// Estado inicial del jugador
const INITIAL_PLAYER_STATE = {
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
  dailyMissions: [],
  weeklyMissions: [],
};

function getDefaultGamificationData() {
  return {
    players: FAMILY_PLAYERS,
    currentWeekStart: getWeekStart(new Date()).toISOString(),
  };
}

// Obtener datos de gamificación del localStorage
export function getGamificationData() {
  return getItem(STORAGE_KEY, getDefaultGamificationData());
}

// Guardar datos de gamificación en localStorage
export function saveGamificationData(data) {
  setItem(STORAGE_KEY, data);
}

// Obtener jugador actual
export function getCurrentPlayer() {
  const playerId = getItem(CURRENT_PLAYER_KEY, 'elnino');
  const data = getGamificationData();
  const player = data.players.find(p => p.id === playerId);
  return player ? structuredClone(player) : structuredClone(INITIAL_PLAYER_STATE);
}

// Guardar estado del jugador actual
export function saveCurrentPlayer(player) {
  const data = getGamificationData();
  const playerIndex = data.players.findIndex(p => p.id === player.id);

  if (playerIndex >= 0) {
    data.players[playerIndex] = player;
  } else {
    data.players.push(player);
  }

  saveGamificationData(data);
}

// Ejecuta una acción de gamificación con XP + badges + persistencia
function executeAction(actionFn) {
  const player = getCurrentPlayer();
  actionFn(player);
  const xpBefore = player.xp;
  const levelBefore = getLevelFromXP(xpBefore).level;

  const { newBadges } = checkForNewBadges(player);
  const levelAfter = getLevelFromXP(player.xp).level;
  const levelUp = levelAfter > levelBefore;

  saveCurrentPlayer(player);

  return {
    xpGained: player.xp - xpBefore,
    levelUp,
    oldLevel: levelBefore,
    newLevel: levelAfter,
    newBadges,
  };
}

// Añadir XP al jugador
export function addXP(amount) {
  const player = getCurrentPlayer();
  const oldLevel = getLevelFromXP(player.xp);
  player.xp += amount;
  const newLevel = getLevelFromXP(player.xp);

  // Verificar si subió de nivel
  if (newLevel.level > oldLevel.level) {
    player.level = newLevel.level;
  }

  saveCurrentPlayer(player);
  return {
    xpGained: amount,
    levelUp: newLevel.level > oldLevel.level,
    newLevel: newLevel,
    oldLevel: oldLevel,
  };
}

// Completar misión
export function completeMission() {
  return executeAction(p => {
    p.completedMissions += 1;
    p.xp += 50;
  });
}

// Desbloquear recuerdo
export function unlockMemory() {
  return executeAction(p => {
    p.unlockedMemories += 1;
    p.xp += 25;
  });
}

// Ver video
export function watchVideo() {
  const result = executeAction(p => {
    p.videosWatched += 1;
    p.xp += 10;
  });
  updateDailyMissionProgress('daily_watch_video', 1);
  return result;
}

// Reproducir música
export function playMusic() {
  const result = executeAction(p => {
    p.musicPlays += 1;
    p.xp += 5;
  });
  updateDailyMissionProgress('daily_music', 1);
  return result;
}

// Completar misión temprano (antes de las 10 AM)
export function completeEarlyMission() {
  const hour = new Date().getHours();
  if (hour >= 10) return { isEarly: false };

  const result = executeAction(p => {
    p.earlyMissions += 1;
    p.xp += 20; // Bonus XP
  });
  return { ...result, isEarly: true };
}

// Desbloquear sorpresa antes de tiempo
export function unlockSurpriseEarly() {
  return executeAction(p => {
    p.surpriseUnlockedEarly = true;
    p.xp += 100;
  });
}

// Verificar nuevas insignias (no muta el jugador original)
function checkForNewBadges(player) {
  const unlockedBadges = checkUnlockedBadges(player);
  const newBadges = [];

  unlockedBadges.forEach(badge => {
    if (!player.badges.includes(badge.id)) {
      player.badges.push(badge.id);
      newBadges.push(badge);
      player.xp += badge.xpReward;
    }
  });

  player.level = getLevelFromXP(player.xp).level;

  return { newBadges };
}

// Iniciar sesión diario
export function dailyLogin() {
  const player = getCurrentPlayer();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Verificar racha diaria
  if (player.lastLogin === yesterday) {
    player.dailyStreak += 1;
  } else if (player.lastLogin !== today) {
    player.dailyStreak = 1;
  }

  player.lastLogin = today;

  // Resetear misiones diarias si es un nuevo día
  if (player.lastDailyReset !== today) {
    player.dailyMissions = DAILY_MISSIONS.map(mission => ({
      ...mission,
      completed: false,
      progress: 0,
    }));
    player.lastDailyReset = today;
  }

  // Resetear misiones semanales si es una nueva semana
  const weekStart = getWeekStart(new Date());
  if (player.lastWeeklyReset !== weekStart.toISOString()) {
    player.weeklyMissions = WEEKLY_MISSIONS.map(mission => ({
      ...mission,
      completed: false,
      progress: 0,
    }));
    player.lastWeeklyReset = weekStart.toISOString();
  }

  player.xp += 10; // Login bonus
  updateDailyMissionProgress('daily_login', 1);

  const { newBadges } = checkForNewBadges(player);
  const levelBefore = getLevelFromXP(player.xp - 10).level;
  const levelAfter = getLevelFromXP(player.xp).level;

  saveCurrentPlayer(player);

  return {
    xpGained: 10,
    levelUp: levelAfter > levelBefore,
    oldLevel: levelBefore,
    newLevel: levelAfter,
    newBadges,
    dailyStreak: player.dailyStreak,
  };
}

// Actualizar progreso de misión diaria
export function updateDailyMissionProgress(missionId, progress) {
  const player = getCurrentPlayer();
  const mission = player.dailyMissions.find(m => m.id === missionId);

  if (mission && !mission.completed) {
    mission.progress += progress;

    // Verificar si la misión está completada
    if (mission.progress >= 1) {
      mission.completed = true;
      addXP(mission.xpReward);

      // Verificar si completó todas las misiones diarias
      const allCompleted = player.dailyMissions.every(m => m.completed);
      if (allCompleted) {
        player.perfectDays += 1;
        addXP(50); // Bonus por día perfecto
      }
    }

    saveCurrentPlayer(player);
  }
}

// Actualizar progreso de misión semanal
export function updateWeeklyMissionProgress(missionId, progress) {
  const player = getCurrentPlayer();
  const mission = player.weeklyMissions.find(m => m.id === missionId);

  if (mission && !mission.completed) {
    mission.progress += progress;

    // Verificar si la misión está completada
    if (mission.progress >= mission.target) {
      mission.completed = true;
      addXP(mission.xpReward);
    }

    saveCurrentPlayer(player);
  }
}

// Obtener leaderboard ordenado
export function getLeaderboard() {
  const data = getGamificationData();
  return data.players
    .map(player => ({
      ...player,
      levelInfo: getLevelFromXP(player.xp),
    }))
    .sort((a, b) => b.xp - a.xp);
}

// Obtener estadísticas del jugador
export function getPlayerStats() {
  const player = getCurrentPlayer();
  const levelInfo = getLevelFromXP(player.xp);
  const xpToNext = getXPToNextLevel(player.xp);
  const unlockedBadges = checkUnlockedBadges(player);
  const totalBadges = BADGES.length;

  return {
    player,
    levelInfo,
    xpToNext,
    unlockedBadges,
    totalBadges,
    badgeProgress: Math.round((unlockedBadges.length / totalBadges) * 100),
    dailyMissions: player.dailyMissions,
    weeklyMissions: player.weeklyMissions,
    dailyStreak: player.dailyStreak,
    perfectDays: player.perfectDays,
  };
}

// Resetear datos (para testing)
export function resetGamificationData() {
  removeItem(STORAGE_KEY);
  removeItem(CURRENT_PLAYER_KEY);
}

// Función auxiliar para obtener el inicio de la semana (lunes)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=domingo, 1=lunes...
  const diff = day === 0 ? -6 : 1 - day; // distancia al lunes
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
