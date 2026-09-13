#!/usr/bin/env node
/**
 * Lee .env.local y genera src/js/config/env.js
 * Uso: node scripts/generate-env.js
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(__dirname, '..');

function leerEnv() {
  try {
    const contenido = readFileSync(resolve(raiz, '.env.local'), 'utf-8');
    const vars = {};
    contenido.split('\n').forEach((linea) => {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) return;
      const [clave, ...resto] = limpia.split('=');
      vars[clave.trim()] = resto.join('=').trim();
    });
    return vars;
  } catch (e) {
    console.error('AVISO: no se pudo leer .env.local:', e.message);
    return {};
  }
}

const env = leerEnv();

const salida = `// ==========================================
// ARCHIVO GENERADO AUTOMATICAMENTE
// NO EDITAR A MANO - Se sobreescribe
// Generado por: scripts/generate-env.js
// ==========================================

export const ENV = {
  SUPABASE_URL: '${env.VITE_SUPABASE_URL || ''}',
  SUPABASE_ANON_KEY: '${env.VITE_SUPABASE_ANON_KEY || ''}',
  YOUTUBE_API_KEY: '${env.YOUTUBE_API_KEY || ''}',
  YOUTUBE_PLAYLIST_ID: '${env.YOUTUBE_PLAYLIST_ID || ''}',
};
`;

const destino = resolve(raiz, 'src/js/config/env.js');
writeFileSync(destino, salida);
console.log('✅ env.js generado en: ' + destino);
console.log('   SUPABASE_URL: ' + (env.VITE_SUPABASE_URL ? 'OK' : 'FALTA'));
console.log('   SUPABASE_ANON_KEY: ' + (env.VITE_SUPABASE_ANON_KEY ? 'OK' : 'FALTA'));
