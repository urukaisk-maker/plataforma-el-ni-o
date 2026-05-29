/**
 * Exportar e importar todos los datos de la plataforma.
 * Útil para transferir progreso entre dispositivos o hacer copias de seguridad.
 */

const STORAGE_KEYS = [
  'elnino_gamification',
  'elnino_customization',
  'elnino_social',
  'elnino_current_player',
  'elnino_current_user',
  'elnino_owner',
  'elnino_kid_mode',
];

/**
 * Exporta todos los datos de localStorage a un objeto JSON.
 * @returns {object}
 */
export function exportAllData() {
  const data = {};
  STORAGE_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
  });
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    platform: 'El Niño',
    data,
  };
}

/**
 * Genera un archivo JSON descargable con todos los datos.
 */
export function downloadBackup() {
  const payload = exportAllData();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `elnino_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Valida que un archivo importado sea válido.
 * @param {object} payload
 * @returns {boolean}
 */
function isValidBackup(payload) {
  return (
    payload &&
    typeof payload === 'object' &&
    payload.platform === 'El Niño' &&
    payload.data &&
    typeof payload.data === 'object'
  );
}

/**
 * Importa datos desde un objeto JSON.
 * @param {object} payload
 * @returns {object} { success: boolean, imported: number, errors: number }
 */
export function importAllData(payload) {
  if (!isValidBackup(payload)) {
    return { success: false, imported: 0, errors: 1 };
  }

  let imported = 0;
  let errors = 0;

  Object.entries(payload.data).forEach(([key, value]) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      imported++;
    } catch {
      errors++;
    }
  });

  return { success: errors === 0, imported, errors };
}

/**
 * Lee un archivo JSON desde un input file.
 * @param {File} file
 * @returns {Promise<object>}
 */
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch {
        reject(new Error('El archivo no es un JSON válido'));
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsText(file);
  });
}
