# API Pública — Plataforma El Niño

> Versión: 1.0.0 (diseño preliminar)
> Estado: Sin implementación backend. Este documento sirve como contrato para desarrollo futuro.

---

## Base URL

```
https://api.elnino.app/v1
```

## Autenticación

Todas las rutas de lectura pública no requieren auth.
Para escritura: `Authorization: Bearer <token>` (JWT de Supabase Auth).

---

## Endpoints

### Leaderboard

```
GET /leaderboard
```

**Response 200**
```json
{
  "players": [
    {
      "id": "uuid",
      "name": "El Niño",
      "level": 5,
      "xp": 1240,
      "badges": ["first_mission", "daily_streak_3"],
      "avatar": "🎮",
      "rank": 1
    }
  ],
  "total": 42,
  "lastUpdated": "2026-05-29T08:00:00Z"
}
```

**Query params**
| Param | Type | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | integer | 10 | Máximo resultados |
| `period` | string | `all` | `all`, `week`, `month` |

---

### Perfil público

```
GET /players/:id
```

**Response 200**
```json
{
  "id": "uuid",
  "name": "El Niño",
  "level": 5,
  "xp": 1240,
  "badges": [
    {
      "id": "first_mission",
      "name": "Primera Misión",
      "icon": "🎯",
      "unlockedAt": "2026-05-20T10:00:00Z"
    }
  ],
  "stats": {
    "completedMissions": 12,
    "totalPhotos": 8,
    "dailyStreak": 5
  },
  "createdAt": "2026-05-01T00:00:00Z"
}
```

**Response 404**
```json
{ "error": "Player not found" }
```

---

### Galería pública

```
GET /photos
```

**Response 200**
```json
{
  "photos": [
    {
      "id": "uuid",
      "url": "https://cdn.elnino.app/photos/uuid.jpg",
      "thumbnail": "https://cdn.elnino.app/photos/uuid_thumb.jpg",
      "caption": "Hermano Manu",
      "uploaderName": "El Niño",
      "likes": 5,
      "comments": 2,
      "createdAt": "2026-05-28T15:00:00Z"
    }
  ],
  "total": 24,
  "hasMore": true
}
```

**Query params**
| Param | Type | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | integer | 20 | Máximo resultados |
| `cursor` | string | — | Paginación cursor-based |
| `tag` | string | — | Filtrar por etiqueta |

---

### Misiones públicas

```
GET /missions
```

**Response 200**
```json
{
  "missions": [
    {
      "id": "mission_01",
      "title": "Entrada a la arena",
      "description": "Activa tu perfil gamer",
      "difficulty": "easy",
      "xpReward": 50,
      "category": "onboarding",
      "active": true
    }
  ]
}
```

---

### Eventos recientes (timeline)

```
GET /timeline
```

**Response 200**
```json
{
  "events": [
    {
      "id": "evt_uuid",
      "type": "badge",
      "title": "Primera Misión completada",
      "playerName": "El Niño",
      "timestamp": "2026-05-29T09:00:00Z"
    }
  ]
}
```

---

## Rate Limiting

| Tipo | Límite |
|------|--------|
| Lectura (GET) | 100 req/min por IP |
| Escritura (POST/PUT) | 20 req/min por token |

**Headers de respuesta**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1716975600
```

---

## Errores

| Código | Significado |
|--------|-------------|
| 400 | Bad Request — parámetros inválidos |
| 401 | Unauthorized — token inválido o ausente |
| 403 | Forbidden — sin permisos para esta acción |
| 404 | Not Found — recurso no existe |
| 429 | Too Many Requests — rate limit excedido |
| 500 | Internal Server Error |

**Formato de error**
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Has excedido el límite de 100 peticiones por minuto.",
  "retryAfter": 45
}
```

---

## Webhooks (futuro)

Suscribirse a eventos de la plataforma:

```
POST /webhooks/subscribe
```

**Body**
```json
{
  "url": "https://tu-backend.com/webhook",
  "events": ["player.levelup", "badge.unlocked", "photo.uploaded"],
  "secret": "whsec_tu_secreto"
}
```

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Niño — 2026*
