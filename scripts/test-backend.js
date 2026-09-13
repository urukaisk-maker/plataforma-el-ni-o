#!/usr/bin/env node
/**
 * Test de conexion con Supabase.
 * Uso: node scripts/test-backend.js
 */
import { supabase, supabaseConfigurado } from '../src/js/utils/supabase-client.js';

async function probar() {
  console.log('==========================================');
  console.log('  Test de conexion con Supabase');
  console.log('==========================================');
  console.log('');

  if (!supabaseConfigurado) {
    console.error('❌ Supabase no esta configurado');
    process.exit(1);
  }
  console.log('✅ Cliente de Supabase configurado');

  // Test 1: Leer tablas
  console.log('');
  console.log('1) Comprobando tablas...');
  const tablas = ['families', 'profiles', 'progress', 'achievements', 'activity', 'consent', 'photos'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).select('*').limit(1);
    if (error && error.code === 'PGRST205') {
      console.log(`   ❌ Tabla "${tabla}" no existe`);
    } else if (error && error.code === 'PGRST301') {
      console.log(`   ✅ Tabla "${tabla}" existe (protegida por RLS)`);
    } else if (error) {
      console.log(`   ⚠️  Tabla "${tabla}": ${error.message}`);
    } else {
      console.log(`   ✅ Tabla "${tabla}" OK`);
    }
  }

  // Test 2: Crear cuenta de prueba (magic link)
  console.log('');
  console.log('2) Test de autenticacion...');
  const emailTest = 'test-' + Date.now() + '@example.com';
  const { error: errAuth } = await supabase.auth.signInWithOtp({
    email: emailTest,
    options: { shouldCreateUser: true },
  });
  if (errAuth) {
    console.log('   ⚠️  Error enviando magic link:', errAuth.message);
  } else {
    console.log('   ✅ Magic link generado (revisa el email)');
  }

  console.log('');
  console.log('==========================================');
  console.log('  Test completado');
  console.log('==========================================');
  process.exit(0);
}

probar().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
