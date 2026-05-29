# Arquitectura Backend — Investigación para Plataforma El Niño

> Estado: Investigación preliminar. Sin implementación de backend en esta fase.

---

## 1. Objetivo

Definir una hoja de ruta técnica para migrar de `localStorage` (solo frontend) a una arquitectura con backend real, preservando la PWA y la experiencia offline-first.

---

## 2. Requisitos funcionales futuros

| Requisito | Prioridad | Complejidad |
|-----------|-----------|-------------|
| Persistencia real de datos (progreso, fotos, chat) | Alta | Media |
| Autenticación de usuarios (familia) | Alta | Media |
| Sincronización offline → online | Alta | Alta |
| Chat en tiempo real | Media | Alta |
| Subida de fotos a storage | Media | Media |
| Leaderboard global | Baja | Baja |
| Notificaciones push | Baja | Media |

---

## 3. Opciones evaluadas

### 3.1 Supabase (PostgreSQL + Auth + Storage)

**Pros**
- Open source, puede autoalojarse
- PostgreSQL relacional: bueno para gamificación con relaciones complejas
- Auth integrado (magic links, OAuth)
- Storage para fotos
- Realtime subscriptions para chat
- Generosa capa gratuita

**Contras**
- Más complejo que Firebase para setups simples
- Requiere conocimientos de SQL/PostgreSQL

**Coste estimado (arranque)**
| Plan | Precio | Límite |
|------|--------|--------|
| Gratuito | $0 | 500MB DB, 1GB storage, 50K usuarios/mes |
| Pro | $25/mes | 8GB DB, 100GB storage |

**Veredicto**: **Opción recomendada** para esta plataforma. PostgreSQL permite consultas complejas de gamificación y el realtime es nativo.

---

### 3.2 Firebase (Firestore + Auth + Storage)

**Pros**
- SDK muy maduro para web
- Firestore es NoSQL documental: rápido para desarrollo
- Hosting integrado con Netlify/Vercel
- Cloud Functions serverless

**Contras**
- Vendor lock-in (Google)
- Firestore tiene límites de complejidad en queries
- Precio puede escalar rápido con lecturas frecuentes

**Coste estimado (arranque)**
| Plan | Precio | Límite |
|------|--------|--------|
| Spark | $0 | 1GB storage, 50K lecturas/día |
| Blaze | Pay-as-you-go | ~$0.06/100K lecturas |

**Veredicto**: Buena opción si se prioriza velocidad de desarrollo sobre flexibilidad de consultas.

---

### 3.3 PocketBase (SQLite autoalojado)

**Pros**
- Un solo ejecutable, sin dependencias externas
- Auth, DB, storage y realtime en uno
- Ideal para autoalojamiento en VPS barato (~$5/mes)

**Contras**
- SQLite no escala a múltiples servidores
- Comunidad más pequeña
- Menos maduro que Supabase/Firebase

**Coste estimado**: $5-10/mes (VPS) + dominio.

**Veredicto**: Opción atractiva si se quiere control total y bajo coste.

---

### 3.4 Appwrite

**Pros**
- Open source, autoalojable o cloud
- Alternativa directa a Firebase
- Buena documentación

**Contras**
- Comunidad menor que Supabase
- Algunas features aún en beta

**Veredicto**: Opción viable, pero Supabase tiene más tracción.

---

## 4. Arquitectura objetivo propuesta

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PWA Frontend  │────▶│   Supabase API  │────▶│   PostgreSQL    │
│  (Netlify/Vercel)│     │   (Auth/REST)   │     │   (Datos)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         ▼              ▼                 ▼
┌─────────────────┐ ┌──────────┐  ┌──────────────┐
│  Service Worker │ │  Storage │  │  Realtime    │
│  (Cache/offline)│ │  (Fotos) │  │  (Chat/Notis)│
└─────────────────┘ └──────────┘  └──────────────┘
```

### Flujo offline-first

1. **Escritura**: Frontend guarda en `localStorage` + IndexedDB inmediatamente
2. **Sync**: Cuando hay conexión, se sincroniza con Supabase
3. **Lectura**: Cache del Service Worker + datos locales → fallback a API
4. **Conflictos**: Última escritura gana (timestamp-based)

---

## 5. Modelo de datos preliminar (PostgreSQL)

```sql
-- Jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  avatar TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Misiones completadas
CREATE TABLE completed_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  mission_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Fotos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  url TEXT NOT NULL,
  caption TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mensajes de chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insignias
CREATE TABLE player_badges (
  player_id UUID REFERENCES players(id),
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (player_id, badge_id)
);
```

---

## 6. API pública (futura)

Si se abre una API pública (solo lectura):

```
GET /api/v1/leaderboard          → Top jugadores por XP
GET /api/v1/players/:id          → Perfil público (solo nombre, nivel, insignias)
GET /api/v1/photos               → Galería pública reciente
```

**Rate limiting**: 100 req/min por IP.

---

## 7. Monetización

### 7.1 Opciones evaluadas

| Opción | Implementación | Ingreso estimado |
|--------|---------------|------------------|
| Buy Me a Coffee / Ko-fi | Enlace externo en footer | Variable (donaciones) |
| Afiliados Amazon (gaming) | Links en zona YouTube/Películas | 1-4% por compra |
| Patreon / suscripción | Contenido exclusivo (fondos, avatares) | $3-10/mes por suscriptor |
| Publicidad no invasiva | Banner sutil en footer | Bajo (~$1-5 CPM) |

### 7.2 Recomendación

1. **Fase inicial**: Buy Me a Coffee + afiliados Amazon (sin coste, sin fricción)
2. **Si crece**: Patreon con beneficios exclusivos (temas premium, avatares personalizados)
3. **Evitar**: Publicidad invasiva (ruina la experiencia infantil)

---

## 8. Próximos pasos

1. Crear cuenta de desarrollador en Supabase (gratuito)
2. Diseñar schema SQL completo con RLS (Row Level Security)
3. Crear adaptador de storage (`localStorage` → Supabase) con feature flag
4. Implementar autentificación con magic links
5. Migrar datos existentes (`data-portability.js`) como script de seed
6. Tests de integración con Supabase local (`supabase start`)

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Niño — 2026*
