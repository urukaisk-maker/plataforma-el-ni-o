# Integración SSO — Google Classroom / Clever

> Estado: Planificación técnica. Sin implementación backend en esta fase.

---

## 1. Objetivo

Permitir que colegios e instituciones inicien sesión en El Niño usando sus credenciales existentes (Google Workspace / Microsoft 365 / Clever) y sincronicen listas de alumnos automáticamente.

---

## 2. Opciones de SSO evaluadas

### 2.1 Google OAuth 2.0 (Google Classroom)

**Flujo**
```
Usuario clickea "Entrar con Google"
    ↓
Redirect a Google OAuth consent screen
    ↓
Google devuelve ID Token (JWT)
    ↓
Backend valida JWT + extrae email, nombre, foto
    ↓
Backend busca/crea usuario en PostgreSQL
    ↓
Devuelve sesión propia (JWT de El Niño)
```

**Scopes requeridos**
- `openid` (perfil básico)
- `profile` (nombre, foto)
- `email`
- `https://www.googleapis.com/auth/classroom.courses.readonly` (listar cursos)
- `https://www.googleapis.com/auth/classroom.rosters.readonly` (listar alumnos)

**Implementación**
```javascript
// Cliente (React / Vanilla)
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Backend (Supabase Edge Function)
import { createClient } from '@supabase/supabase-js';

export async function handleGoogleCallback(req) {
  const { credential } = req.body;
  const payload = await verifyGoogleToken(credential);
  
  // Buscar o crear usuario
  const { data: user } = await supabase
    .from('players')
    .upsert({ 
      email: payload.email,
      name: payload.name,
      avatar_url: payload.picture,
      auth_provider: 'google'
    })
    .select()
    .single();
    
  return { token: generateJWT(user) };
}
```

---

### 2.2 Clever Instant Login

**Flujo**
```
Colegio configura El Niño en Clever Portal
    ↓
Alumno clickea icono de El Niño en Clever
    ↓
Clever envía Bearer token vía POST
    ↓
Backend valida token con Clever API
    ↓
Backend obtiene datos del distrito, escuela, maestro, alumno
    ↓
Devuelve sesión + contexto de clase
```

**Endpoints Clever**
```
GET https://api.clever.com/v3.0/me        → Datos del usuario actual
GET https://api.clever.com/v3.0/users      → Listar usuarios del distrito
GET https://api.clever.com/v3.0/classes    → Secciones/cursos
```

**Implementación**
```javascript
// Supabase Edge Function
export async function handleCleverLogin(req) {
  const { token } = req.body;
  
  // Validar token con Clever
  const cleverRes = await fetch('https://api.clever.com/v3.0/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const userData = await cleverRes.json();
  
  // Mapear roles
  const role = userData.type; // 'student' | 'teacher' | 'district_admin'
  
  // Crear sesión
  return { token: generateJWT({ ...userData, role }) };
}
```

---

### 2.3 Microsoft Azure AD / Entra ID

Similar a Google OAuth pero con Microsoft Graph API. Útil para colegios que usan Microsoft 365 Education.

---

## 3. Arquitectura de autorización

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Supabase Auth    │────▶│   PostgreSQL    │
│  (Google/Clever)│     │  (OAuth proxy)    │     │   (usuarios)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         ▼              ▼                 ▼
  Google OAuth    Clever API      Custom JWT
  consent screen  validation      (El Niño)
```

### Roles de usuario

| Rol | Permisos |
|-----|----------|
| `student` | Jugar, completar misiones, ver perfil |
| `teacher` | Crear misiones, ver progreso de clase, gestionar leaderboard |
| `parent` | Ver perfil de hijo, recibir resumen semanal |
| `admin` | Configurar colegio, importar CSV, gestionar licencias |

---

## 4. Sincronización de listas

### Importación desde Google Classroom

```javascript
// Supabase Edge Function (programada cada 24h)
export async function syncGoogleClassroom(req) {
  const { teacherId, accessToken } = req.body;
  
  // Obtener cursos del profesor
  const courses = await fetchGoogleAPI(
    'https://classroom.googleapis.com/v1/courses',
    accessToken
  );
  
  for (const course of courses) {
    // Obtener alumnos del curso
    const students = await fetchGoogleAPI(
      `https://classroom.googleapis.com/v1/courses/${course.id}/students`,
      accessToken
    );
    
    // Insertar en PostgreSQL
    await supabase.from('class_students').upsert(
      students.map(s => ({
        course_id: course.id,
        course_name: course.name,
        student_email: s.profile.emailAddress,
        student_name: s.profile.name.fullName,
        synced_at: new Date().toISOString()
      }))
    );
  }
}
```

### Importación manual (CSV)

Para colegios sin Google Classroom:

```
nombre,email,clase
"Ana García","ana@colegio.es","3A"
"Luis Martínez","luis@colegio.es","3A"
```

Subida vía drag-and-drop en panel de profesor.

---

## 5. Consentimiento parental (COPPA / GDPR-K)

Para menores de 13/16 años:

1. **Verificación de edad**: Pregunta en onboarding (`birthYear`)
2. **Si menor**: Bloquear funciones sociales (chat, comentarios públicos)
3. **Email parental**: Solicitar email del tutor para:
   - Resumen semanal de progreso
   - Aprobación para funciones sociales
   - Notificaciones de rachas y logros
4. **Datos**: Solo guardar email hasheado (SHA-256), nunca datos sensibles

---

## 6. Stub frontend (simulación)

```html
<!-- Botón SSO (visible solo en landing/panel admin) -->
<button class="button button--primary" id="googleSSO" type="button">
  <img src="./img/google-icon.svg" alt="" style="width:18px;height:18px;margin-right:8px;" />
  Entrar con Google
</button>
```

```javascript
// src/js/utils/sso-stub.js
export function initSSO() {
  document.getElementById('googleSSO')?.addEventListener('click', () => {
    alert('Integración SSO disponible en plan Colegio e Institución. Contacta ventas para activarla.');
  });
}
```

---

## 7. Roadmap de implementación SSO

| Fase | Tarea | Tiempo estimado |
|------|-------|-----------------|
| 1 | Setup Google OAuth en Supabase Auth | 4 horas |
| 2 | Login básico con Google | 4 horas |
| 3 | Mapeo de roles (student/teacher) | 4 horas |
| 4 | Importación de Classroom | 1 día |
| 5 | Panel de profesor | 2 días |
| 6 | Clever Instant Login | 1 día |
| 7 | Consentimiento parental | 1 día |

**Total: ~6-7 días de desarrollo backend**

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Niño — 2026*
