/**
 * Sistema de referidos infantil-friendly.
 * Genera códigos únicos, permite compartir y recompensa con XP/insignias.
 * Los datos se guardan en localStorage (sin backend real).
 */

import { getItem, setItem } from '../utils/storage-adapter.js';
import { generateShortId } from '../utils/id.js';
import { addXP } from './gamification-service.js';
import { logActivity } from './activity-service.js';

const REFERRAL_KEY = 'elnino_referrals';
const REFERRAL_CODE_KEY = 'elnino_my_referral_code';
const REFERRAL_REWARD_XP = 100;
const MAX_REFERRALS = 10;

/**
 * Obtiene o genera el código de referido del usuario actual.
 * @returns {string}
 */
export function getMyReferralCode() {
  let code = getItem(REFERRAL_CODE_KEY, '');
  if (!code) {
    code = `NINO-${generateShortId().toUpperCase()}`;
    setItem(REFERRAL_CODE_KEY, code);
  }
  return code;
}

/**
 * Obtiene el estado de referidos (cuántos ha invitado, quiénes).
 * @returns {object}
 */
export function getReferralStatus() {
  return getItem(REFERRAL_KEY, {
    invitedCount: 0,
    invitedBy: null,
    claimedRewards: [],
  });
}

/**
 * Valida un código de referido introducido por otro usuario.
 * Si es válido y no se ha usado antes, da recompensa a ambos.
 * @param {string} code
 * @returns {object} { success: boolean, message: string }
 */
export function validateReferralCode(code) {
  if (!code || typeof code !== 'string') {
    return { success: false, message: 'Código inválido' };
  }

  const myCode = getMyReferralCode();
  if (code === myCode) {
    return { success: false, message: 'No puedes usar tu propio código' };
  }

  const status = getReferralStatus();
  if (status.invitedBy) {
    return { success: false, message: 'Ya has usado un código de referido' };
  }

  // Simular validación (en backend real se verificaría contra DB)
  // Aquí aceptamos cualquier código con formato NINO-XXXXX
  if (!/^NINO-[A-Z0-9]{5,}$/i.test(code)) {
    return { success: false, message: 'Código no válido' };
  }

  // Registrar que este usuario fue invitado por otro
  status.invitedBy = code;
  setItem(REFERRAL_KEY, status);

  // Recompensa al usuario que introduce el código
  addXP(REFERRAL_REWARD_XP);
  logActivity('referral', 'Amigo invitado', `Usaste el código ${code}`, REFERRAL_REWARD_XP);

  return {
    success: true,
    message: `¡Bienvenido! Has ganado ${REFERRAL_REWARD_XP} XP por unirte con un código de referido.`,
  };
}

/**
 * Simula que un amigo se ha unido con el código del usuario actual.
 * En producción esto lo haría el backend. Aquí es manual/demo.
 * @returns {object}
 */
export function simulateFriendJoined() {
  const status = getReferralStatus();
  if (status.invitedCount >= MAX_REFERRALS) {
    return { success: false, message: 'Has alcanzado el límite de invitaciones' };
  }

  status.invitedCount += 1;
  setItem(REFERRAL_KEY, status);

  // Recompensa al invitador
  addXP(REFERRAL_REWARD_XP);
  logActivity('referral', 'Nuevo amigo invitado', `Has invitado a ${status.invitedCount} amigos`, REFERRAL_REWARD_XP);

  return {
    success: true,
    message: `¡Un amigo se unió! Has ganado ${REFERRAL_REWARD_XP} XP.`,
    totalInvited: status.invitedCount,
  };
}

/**
 * Comparte el código de referido usando Web Share API o portapapeles.
 * @returns {Promise<boolean>}
 */
export async function shareReferralCode() {
  const code = getMyReferralCode();
  const text = `¡Únete a El Niño, la plataforma gamer más divertida! 🎮 Usa mi código ${code} y empieza con ${REFERRAL_REWARD_XP} XP de regalo.`;

  if (navigator.share) {
    try {
      await navigator.share({ title: 'El Niño | Plataforma Gamer', text, url: window.location.origin });
      return true;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
    return true;
  } catch {
    return false;
  }
}
