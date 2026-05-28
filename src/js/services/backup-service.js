// Servicio de backup - Gestión de backup de datos en localStorage y exportación/importación JSON

// Claves de localStorage para backup
const STORAGE_KEYS = [
  'elnino_gamification',
  'elnino_social',
  'elnino_customization',
  'elnino_owner'
];

// Exportar todos los datos a JSON
export function exportAllData() {
  const data = {};
  
  STORAGE_KEYS.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        data[key] = JSON.parse(value);
      }
    } catch (error) {
      console.error(`Error al exportar ${key}:`, error);
    }
  });
  
  // Añadir metadatos
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data
  };
  
  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `elnino_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return { success: true };
}

// Importar datos desde JSON
export function importData(jsonString) {
  try {
    const backupData = JSON.parse(jsonString);
    
    // Validar estructura
    if (!backupData.data || typeof backupData.data !== 'object') {
      return { success: false, error: 'Formato de backup inválido' };
    }
    
    // Importar cada clave
    Object.entries(backupData.data).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error al importar ${key}:`, error);
      }
    });
    
    return { success: true, importedKeys: Object.keys(backupData.data) };
  } catch (error) {
    return { success: false, error: 'Error al parsear JSON' };
  }
}

// Exportar datos específicos por clave
export function exportDataByKey(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return { success: false, error: 'No hay datos para exportar' };
    }
    
    const data = JSON.parse(value);
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      key,
      data
    };
    
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `elnino_${key}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al exportar datos' };
  }
}

// Obtener tamaño de datos en localStorage
export function getStorageSize() {
  let total = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    total += (key.length + value.length) * 2; // UTF-16 usa 2 bytes por carácter
  }
  
  return total;
}

// Formatar tamaño en bytes a formato legible
export function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Limpiar todos los datos (factory reset)
export function clearAllData() {
  STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
  
  return { success: true };
}

// Obtener resumen de datos almacenados
export function getDataSummary() {
  const summary = {};
  
  STORAGE_KEYS.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value);
        summary[key] = {
          exists: true,
          size: (key.length + value.length) * 2,
          type: Array.isArray(parsed) ? 'array' : typeof parsed,
          itemCount: Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
        };
      } else {
        summary[key] = {
          exists: false,
          size: 0,
          type: null,
          itemCount: 0
        };
      }
    } catch (error) {
      summary[key] = {
        exists: false,
        size: 0,
        type: null,
        itemCount: 0,
        error: true
      };
    }
  });
  
  return summary;
}

// Crear backup automático con timestamp
export function autoBackup() {
  const backupKey = 'elnino_auto_backup';
  const maxBackups = 5;
  
  try {
    // Obtener backups existentes
    const backupsJson = localStorage.getItem(backupKey);
    const backups = backupsJson ? JSON.parse(backupsJson) : [];
    
    // Crear nuevo backup
    const currentData = {};
    STORAGE_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        currentData[key] = JSON.parse(value);
      }
    });
    
    const newBackup = {
      timestamp: new Date().toISOString(),
      data: currentData
    };
    
    // Añadir nuevo backup
    backups.push(newBackup);
    
    // Mantener solo los últimos backups
    if (backups.length > maxBackups) {
      backups.shift();
    }
    
    // Guardar backups
    localStorage.setItem(backupKey, JSON.stringify(backups));
    
    return { success: true, backupCount: backups.length };
  } catch (error) {
    return { success: false, error: 'Error al crear backup automático' };
  }
}

// Restaurar desde backup automático
export function restoreFromAutoBackup(backupIndex) {
  const backupKey = 'elnino_auto_backup';
  
  try {
    const backupsJson = localStorage.getItem(backupKey);
    if (!backupsJson) {
      return { success: false, error: 'No hay backups disponibles' };
    }
    
    const backups = JSON.parse(backupsJson);
    if (backupIndex < 0 || backupIndex >= backups.length) {
      return { success: false, error: 'Índice de backup inválido' };
    }
    
    const backup = backups[backupIndex];
    
    // Restaurar datos
    Object.entries(backup.data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    
    return { success: true, restoredFrom: backup.timestamp };
  } catch (error) {
    return { success: false, error: 'Error al restaurar backup' };
  }
}

// Obtener lista de backups automáticos
export function getAutoBackups() {
  const backupKey = 'elnino_auto_backup';
  
  try {
    const backupsJson = localStorage.getItem(backupKey);
    if (!backupsJson) {
      return [];
    }
    
    return JSON.parse(backupsJson);
  } catch (error) {
    return [];
  }
}
