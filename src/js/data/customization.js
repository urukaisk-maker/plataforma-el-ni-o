// Sistema de personalización - Estructura de datos para avatar, temas, misiones personalizadas y tarjetas

// Opciones de avatar
export const AVATAR_OPTIONS = {
  faces: [
    { id: 'face_1', emoji: '😎', name: 'Cool' },
    { id: 'face_2', emoji: '🎮', name: 'Gamer' },
    { id: 'face_3', emoji: '🦸', name: 'Héroe' },
    { id: 'face_4', emoji: '🤖', name: 'Robot' },
    { id: 'face_5', emoji: '🐉', name: 'Dragón' },
    { id: 'face_6', emoji: '👾', name: 'Alien' },
    { id: 'face_7', emoji: '🦊', name: 'Zorro' },
    { id: 'face_8', emoji: '🦁', name: 'León' },
  ],
  accessories: [
    { id: 'acc_1', emoji: '🎧', name: 'Auriculares' },
    { id: 'acc_2', emoji: '👓', name: 'Gafas' },
    { id: 'acc_3', emoji: '🎩', name: 'Sombrero' },
    { id: 'acc_4', emoji: '👑', name: 'Corona' },
    { id: 'acc_5', emoji: '🧢', name: 'Gorra' },
    { id: 'acc_6', emoji: '⚔️', name: 'Espada' },
    { id: 'acc_7', emoji: '🛡️', name: 'Escudo' },
    { id: 'acc_8', emoji: '🔮', name: 'Orbe' },
  ],
  backgrounds: [
    { id: 'bg_1', color: '#00f5ff', name: 'Cian', gradient: 'linear-gradient(135deg, #00f5ff 0%, #0066ff 100%)' },
    { id: 'bg_2', color: '#ff2bd4', name: 'Magenta', gradient: 'linear-gradient(135deg, #ff2bd4 0%, #ff0066 100%)' },
    { id: 'bg_3', color: '#7cff6b', name: 'Verde', gradient: 'linear-gradient(135deg, #7cff6b 0%, #00ff88 100%)' },
    { id: 'bg_4', color: '#ff6b2b', name: 'Naranja', gradient: 'linear-gradient(135deg, #ff6b2b 0%, #ff9500 100%)' },
    { id: 'bg_5', color: '#ffd700', name: 'Oro', gradient: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)' },
    { id: 'bg_6', color: '#9b59b6', name: 'Púrpura', gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' },
    { id: 'bg_7', color: '#1abc9c', name: 'Turquesa', gradient: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)' },
    { id: 'bg_8', color: '#e74c3c', name: 'Rojo', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
  ],
};

// Temas de colores
export const THEMES = [
  {
    id: 'default',
    name: 'Ciberpunk',
    description: 'Colores neón sobre fondo oscuro',
    colors: {
      primary: '#00f5ff',
      secondary: '#ff2bd4',
      accent: '#7cff6b',
      danger: '#ff3131',
      success: '#7cff6b',
      warning: '#ffd700',
      background: '#080914',
      surface: 'rgba(8, 9, 20, 0.85)',
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    description: 'Tonos azules y turquesas',
    colors: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      accent: '#00ff88',
      danger: '#ff4757',
      success: '#2ed573',
      warning: '#ffa502',
      background: '#0a1628',
      surface: 'rgba(10, 22, 40, 0.85)',
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
  },
  {
    id: 'forest',
    name: 'Bosque',
    description: 'Verdes naturales y tierra',
    colors: {
      primary: '#2ecc71',
      secondary: '#27ae60',
      accent: '#f39c12',
      danger: '#e74c3c',
      success: '#27ae60',
      warning: '#f1c40f',
      background: '#0d1f0d',
      surface: 'rgba(13, 31, 13, 0.85)',
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    description: 'Naranjas, rojos y púrpuras',
    colors: {
      primary: '#ff6b6b',
      secondary: '#ee5a24',
      accent: '#f9ca24',
      danger: '#c0392b',
      success: '#27ae60',
      warning: '#f39c12',
      background: '#1a0a0a',
      surface: 'rgba(26, 10, 10, 0.85)',
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
  },
  {
    id: 'galaxy',
    name: 'Galaxia',
    description: 'Púrpuras y violetas cósmicos',
    colors: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      accent: '#00d4ff',
      danger: '#e74c3c',
      success: '#2ecc71',
      warning: '#f1c40f',
      background: '#1a0a2e',
      surface: 'rgba(26, 10, 46, 0.85)',
      text: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Blanco y negro elegante',
    colors: {
      primary: '#ffffff',
      secondary: '#cccccc',
      accent: '#00f5ff',
      danger: '#ff4444',
      success: '#44ff44',
      warning: '#ffaa00',
      background: '#ffffff',
      surface: 'rgba(240, 240, 240, 0.9)',
      text: '#000000',
      muted: 'rgba(0, 0, 0, 0.6)',
    },
  },
];

// Plantillas de tarjetas digitales
export const CARD_TEMPLATES = [
  {
    id: 'template_1',
    name: 'Gamer Pro',
    description: 'Diseño futurista con efectos neón',
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '2px solid #00f5ff',
      borderRadius: '20px',
      fontFamily: 'Orbitron',
      primaryColor: '#00f5ff',
    },
  },
  {
    id: 'template_2',
    name: 'Classic',
    description: 'Diseño clásico y elegante',
    style: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      border: '2px solid #333',
      borderRadius: '10px',
      fontFamily: 'Inter',
      primaryColor: '#333',
    },
  },
  {
    id: 'template_3',
    name: 'Fire',
    description: 'Diseño con efecto de fuego',
    style: {
      background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
      border: '2px solid #ff6b2b',
      borderRadius: '15px',
      fontFamily: 'Orbitron',
      primaryColor: '#fff',
    },
  },
  {
    id: 'template_4',
    name: 'Nature',
    description: 'Diseño natural con verdes',
    style: {
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      border: '2px solid #2ecc71',
      borderRadius: '15px',
      fontFamily: 'Inter',
      primaryColor: '#fff',
    },
  },
  {
    id: 'template_5',
    name: 'Space',
    description: 'Diseño espacial con estrellas',
    style: {
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      border: '2px solid #9b59b6',
      borderRadius: '20px',
      fontFamily: 'Orbitron',
      primaryColor: '#9b59b6',
    },
  },
];

// Datos iniciales de personalización
export const INITIAL_CUSTOMIZATION = {
  avatar: {
    face: 'face_2',
    accessory: 'acc_1',
    background: 'bg_1',
    name: 'El Niño',
    title: 'Gamer Legend',
  },
  theme: 'default',
  customMissions: [],
  customCards: [],
};

// Función para obtener avatar por ID
export function getAvatarById(id) {
  return AVATAR_OPTIONS.faces.find(f => f.id === id);
}

// Función para obtener accesorio por ID
export function getAccessoryById(id) {
  return AVATAR_OPTIONS.accessories.find(a => a.id === id);
}

// Función para obtener fondo por ID
export function getBackgroundById(id) {
  return AVATAR_OPTIONS.backgrounds.find(b => b.id === id);
}

// Función para obtener tema por ID
export function getThemeById(id) {
  return THEMES.find(t => t.id === id);
}

// Función para obtener plantilla de tarjeta por ID
export function getCardTemplateById(id) {
  return CARD_TEMPLATES.find(t => t.id === id);
}

// Función para generar avatar completo
export function generateAvatar(avatarData) {
  const face = getAvatarById(avatarData.face);
  const accessory = getAccessoryById(avatarData.accessory);
  const background = getBackgroundById(avatarData.background);

  return {
    ...avatarData,
    faceEmoji: face?.emoji || '🎮',
    accessoryEmoji: accessory?.emoji || '',
    backgroundGradient: background?.gradient || 'linear-gradient(135deg, #00f5ff 0%, #0066ff 100%)',
    backgroundColor: background?.color || '#00f5ff',
  };
}

// Función para validar datos de misión personalizada
export function validateCustomMission(mission) {
  const errors = [];

  if (!mission.title || mission.title.trim().length === 0) {
    errors.push('El título es requerido');
  }

  if (!mission.description || mission.description.trim().length === 0) {
    errors.push('La descripción es requerida');
  }

  if (!mission.difficulty || !['easy', 'medium', 'hard', 'legendary'].includes(mission.difficulty)) {
    errors.push('La dificultad debe ser: easy, medium, hard o legendary');
  }

  if (!mission.xpReward || mission.xpReward < 0) {
    errors.push('La recompensa de XP debe ser un número positivo');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Función para validar datos de tarjeta personalizada
export function validateCustomCard(card) {
  const errors = [];

  if (!card.title || card.title.trim().length === 0) {
    errors.push('El título es requerido');
  }

  if (!card.templateId) {
    errors.push('La plantilla es requerida');
  }

  if (!card.message || card.message.trim().length === 0) {
    errors.push('El mensaje es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
