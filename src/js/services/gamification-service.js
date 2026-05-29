// Servicio de gamificación - Gestión de puntos, XP y localStorage
import {
  LEVELS,
  BADGES,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  FAMILY_PLAYERS,
  getLevelFromXP,
  getXPToNextLevel,
  checkUnlockedBadges,
  getActiveDailyMissions,
  getActiveWeeklyMissions,
} from '../data/gamification.js';

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

// Obtener datos de gamificación del localStorage
export function getGamificationData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      players: FAMILY_PLAYERS,
      currentWeekStart: getWeekStart(new Date()).toISOString(),
    };
  } catch (error) {
    console.error('Error al obtener datos de gamificación:', error);
    return {
      players: FAMILY_PLAYERS,
      currentWeekStart: getWeekStart(new Date()).toISOString(),
    };
  }
}

// Guardar datos de gamificación en localStorage
export function saveGamificationData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar datos de gamificación:', error);
  }
}

// Obtener jugador actual
export function getCurrentPlayer() {
  try {
    const playerId = localStorage.getItem(CURRENT_PLAYER_KEY) || 'elnino';
    const data = getGamificationData();
    const player = data.players.find(p => p.id === playerId);

    if (!player) {
      return JSON.parse(JSON.stringify(INITIAL_PLAYER_STATE));
    }

    return player;
  } catch (error) {
    console.error('Error al obtener jugador actual:', error);
    return JSON.parse(JSON.stringify(INITIAL_PLAYER_STATE));
  }
}

// Guardar estado del jugador actual
export function saveCurrentPlayer(player) {
  try {
    const data = getGamificationData();
    const playerIndex = data.players.findIndex(p => p.id === player.id);

    if (playerIndex >= 0) {
      data.players[playerIndex] = player;
    } else {
      data.players.push(player);
    }

    saveGamificationData(data);
  } catch (error) {
    console.error('Error al guardar jugador actual:', error);
  }
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
  const player = getCurrentPlayer();
  player.completedMissions += 1;

  // Añadir XP por completar misión
  const xpResult = addXP(50);

  // Verificar insignias
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  saveCurrentPlayer(player);

  return {
    ...xpResult,
    newBadges,
  };
}

// Desbloquear recuerdo
export function unlockMemory() {
  const player = getCurrentPlayer();
  player.unlockedMemories += 1;

  const xpResult = addXP(25);
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  saveCurrentPlayer(player);

  return {
    ...xpResult,
    newBadges,
  };
}

// Ver video
export function watchVideo() {
  const player = getCurrentPlayer();
  player.videosWatched += 1;

  const xpResult = addXP(10);
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  // Actualizar misión diaria si existe
  updateDailyMissionProgress('daily_watch_video', 1);

  saveCurrentPlayer(player);

  return {
    ...xpResult,
    newBadges,
  };
}

// Reproducir música
export function playMusic() {
  const player = getCurrentPlayer();
  player.musicPlays += 1;

  const xpResult = addXP(5);
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  // Actualizar misión diaria si existe
  updateDailyMissionProgress('daily_music', 1);

  saveCurrentPlayer(player);

  return {
    ...xpResult,
    newBadges,
  };
}

// Completar misión temprano (antes de las 10 AM)
export function completeEarlyMission() {
  const hour = new Date().getHours();
  if (hour < 10) {
    const player = getCurrentPlayer();
    player.earlyMissions += 1;

    const xpResult = addXP(20); // Bonus XP
    const { newBadges, levelUpInfo } = checkForNewBadges(player);

    if (levelUpInfo && !xpResult.levelUp) {
      xpResult.levelUp = true;
      xpResult.oldLevel = levelUpInfo.oldLevel;
      xpResult.newLevel = levelUpInfo.newLevel;
    }

    saveCurrentPlayer(player);

    return {
      ...xpResult,
      newBadges,
      isEarly: true,
    };
  }

  return { isEarly: false };
}

// Desbloquear sorpresa antes de tiempo
export function unlockSurpriseEarly() {
  const player = getCurrentPlayer();
  player.surpriseUnlockedEarly = true;

  const xpResult = addXP(100);
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  saveCurrentPlayer(player);

  return {
    ...xpResult,
    newBadges,
  };
}

// Verificar nuevas insignias
function checkForNewBadges(player) {
  const unlockedBadges = checkUnlockedBadges(player);
  const newBadges = [];
  let levelUpInfo = null;

  unlockedBadges.forEach(badge => {
    if (!player.badges.includes(badge.id)) {
      player.badges.push(badge.id);
      newBadges.push(badge);
      // Añadir XP de la insignia
      player.xp += badge.xpReward;
      const oldLevel = getLevelFromXP(player.xp - badge.xpReward);
      const newLevel = getLevelFromXP(player.xp);
      if (newLevel.level > oldLevel.level) {
        player.level = newLevel.level;
        levelUpInfo = { oldLevel, newLevel };
      }
    }
  });

  return { newBadges, levelUpInfo };
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

  // Completar misión de login
  updateDailyMissionProgress('daily_login', 1);

  const xpResult = addXP(10);
  const { newBadges, levelUpInfo } = checkForNewBadges(player);

  if (levelUpInfo && !xpResult.levelUp) {
    xpResult.levelUp = true;
    xpResult.oldLevel = levelUpInfo.oldLevel;
    xpResult.newLevel = levelUpInfo.newLevel;
  }

  saveCurrentPlayer(player);

  return {
    ...xpResult,
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
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_PLAYER_KEY);
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
