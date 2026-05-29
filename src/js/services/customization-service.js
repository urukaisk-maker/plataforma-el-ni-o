// Servicio de personalización - Gestión de avatar, temas, misiones personalizadas y tarjetas con localStorage
import {
  INITIAL_CUSTOMIZATION,
  generateAvatar,
  validateCustomMission,
  validateCustomCard,
} from '../data/customization.js';

const CUSTOMIZATION_STORAGE_KEY = 'elnino_customization';

// Obtener datos de personalización del localStorage
export function getCustomizationData() {
  try {
    const data = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return INITIAL_CUSTOMIZATION;
  } catch (error) {
    console.error('Error al obtener datos de personalización:', error);
    return INITIAL_CUSTOMIZATION;
  }
}

// Guardar datos de personalización en localStorage
export function saveCustomizationData(data) {
  try {
    localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar datos de personalización:', error);
  }
}

// ==================== AVATAR ====================

// Actualizar avatar
export function updateAvatar(avatarData) {
  const data = getCustomizationData();
  data.avatar = { ...data.avatar, ...avatarData };
  saveCustomizationData(data);
  return data.avatar;
}

// Obtener avatar completo
export function getAvatar() {
  const data = getCustomizationData();
  return generateAvatar(data.avatar);
}

// Actualizar nombre del avatar
export function updateAvatarName(name) {
  return updateAvatar({ name });
}

// Actualizar título del avatar
export function updateAvatarTitle(title) {
  return updateAvatar({ title });
}

// Actualizar cara del avatar
export function updateAvatarFace(faceId) {
  return updateAvatar({ face: faceId });
}

// Actualizar accesorio del avatar
export function updateAvatarAccessory(accessoryId) {
  return updateAvatar({ accessory: accessoryId });
}

// Actualizar fondo del avatar
export function updateAvatarBackground(backgroundId) {
  return updateAvatar({ background: backgroundId });
}

// ==================== TEMAS ====================

// Aplicar tema
export function applyTheme(themeId) {
  const data = getCustomizationData();
  data.theme = themeId;
  saveCustomizationData(data);
  applyThemeColors(themeId);
  return data.theme;
}

// Obtener tema actual
export function getCurrentTheme() {
  const data = getCustomizationData();
  return data.theme;
}

// Aplicar colores del tema al documento
export function applyThemeColors(themeId) {
  const data = getCustomizationData();
  const themeIdToUse = themeId || data.theme;

  // Importar THEMES dinámicamente
  import('../data/customization.js').then(({ THEMES }) => {
    const theme = THEMES.find(t => t.id === themeIdToUse);
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  });
}

// ==================== MISIONES PERSONALIZADAS ====================

// Crear misión personalizada
export function createCustomMission(missionData) {
  const validation = validateCustomMission(missionData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const data = getCustomizationData();
  const newMission = {
    id: `custom_mission_${Date.now()}`,
    ...missionData,
    createdAt: new Date().toISOString(),
    completed: false,
  };

  data.customMissions.push(newMission);
  saveCustomizationData(data);

  return { success: true, mission: newMission };
}

// Obtener misiones personalizadas
export function getCustomMissions() {
  const data = getCustomizationData();
  return data.customMissions;
}

// Actualizar misión personalizada
export function updateCustomMission(missionId, missionData) {
  const data = getCustomizationData();
  const missionIndex = data.customMissions.findIndex(m => m.id === missionId);

  if (missionIndex >= 0) {
    const validation = validateCustomMission(missionData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    data.customMissions[missionIndex] = {
      ...data.customMissions[missionIndex],
      ...missionData,
    };
    saveCustomizationData(data);

    return { success: true, mission: data.customMissions[missionIndex] };
  }

  return { success: false, errors: ['Misión no encontrada'] };
}

// Eliminar misión personalizada
export function deleteCustomMission(missionId) {
  const data = getCustomizationData();
  const missionIndex = data.customMissions.findIndex(m => m.id === missionId);

  if (missionIndex >= 0) {
    data.customMissions.splice(missionIndex, 1);
    saveCustomizationData(data);
    return true;
  }

  return false;
}

// Marcar misión como completada
export function completeCustomMission(missionId) {
  const data = getCustomizationData();
  const mission = data.customMissions.find(m => m.id === missionId);

  if (mission) {
    mission.completed = true;
    mission.completedAt = new Date().toISOString();
    saveCustomizationData(data);
    return true;
  }

  return false;
}

// ==================== TARJETAS DIGITALES ====================

// Crear tarjeta personalizada
export function createCustomCard(cardData) {
  const validation = validateCustomCard(cardData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const data = getCustomizationData();
  const newCard = {
    id: `custom_card_${Date.now()}`,
    ...cardData,
    createdAt: new Date().toISOString(),
  };

  data.customCards.push(newCard);
  saveCustomizationData(data);

  return { success: true, card: newCard };
}

// Obtener tarjetas personalizadas
export function getCustomCards() {
  const data = getCustomizationData();
  return data.customCards;
}

// Actualizar tarjeta personalizada
export function updateCustomCard(cardId, cardData) {
  const data = getCustomizationData();
  const cardIndex = data.customCards.findIndex(c => c.id === cardId);

  if (cardIndex >= 0) {
    const validation = validateCustomCard(cardData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    data.customCards[cardIndex] = {
      ...data.customCards[cardIndex],
      ...cardData,
    };
    saveCustomizationData(data);

    return { success: true, card: data.customCards[cardIndex] };
  }

  return { success: false, errors: ['Tarjeta no encontrada'] };
}

// Eliminar tarjeta personalizada
export function deleteCustomCard(cardId) {
  const data = getCustomizationData();
  const cardIndex = data.customCards.findIndex(c => c.id === cardId);

  if (cardIndex >= 0) {
    data.customCards.splice(cardIndex, 1);
    saveCustomizationData(data);
    return true;
  }

  return false;
}

// ==================== UTILIDADES ====================

// Resetear datos de personalización
export function resetCustomization() {
  localStorage.removeItem(CUSTOMIZATION_STORAGE_KEY);
  // Aplicar tema por defecto
  applyThemeColors('default');
}

// Exportar datos de personalización
export function exportCustomization() {
  const data = getCustomizationData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `elnino_customization_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Importar datos de personalización
export function importCustomization(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    saveCustomizationData(data);
    applyThemeColors(data.theme);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Formato inválido' };
  }
}
