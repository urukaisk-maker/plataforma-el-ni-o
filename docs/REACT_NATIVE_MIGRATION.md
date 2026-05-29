# Migración a React Native — Plataforma El Niño

> Estado: Investigación y planificación. Sin implementación de RN en esta fase.

---

## 1. Por qué React Native

La PWA actual funciona bien en móvil, pero una app nativa ofrece:

- **Mejor acceso offline** — Cache nativo + SQLite (no depende del navegador)
- **Notificaciones push** — Sin restricciones de iOS Safari
- **Acceso a hardware** — Cámara, galería, sensores, vibración
- **Distribución en stores** — Google Play / App Store aumenta visibilidad
- **Experiencia más fluida** — 60fps nativo, transiciones nativas

---

## 2. Arquitectura propuesta (React Native + Expo)

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                         │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │   React    │  │  React     │  │   Native Modules    │   │
│  │  Navigation│  │  Native    │  │  (Camera, Share,    │   │
│  │  (Stack+Tab)│  │  Paper     │  │   Storage, Push)    │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AsyncStorage / SQLite                     │ │
│  │         (datos offline locales)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │ sync                              │
└──────────────────────────┼──────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │       Supabase API          │
            │   (Auth + REST + Realtime)  │
            └─────────────────────────────┘
```

### Por qué Expo

- Sin configuración nativa (Xcode/Android Studio)
- OTA updates (actualizaciones sin store)
- EAS Build para compilación en cloud
- SDK unificado para cámara, notificaciones, etc.

---

## 3. Mapeo de componentes PWA → React Native

| PWA (HTML/CSS) | React Native | Librería |
|----------------|-------------|----------|
| `index.html` (hero) | `<HomeScreen />` | React Native |
| `misiones.html` | `<MissionsScreen />` | React Native |
| `galeria.html` | `<GalleryScreen />` | `expo-image-picker`, `expo-media-library` |
| `chat.html` | `<ChatScreen />` | `@supabase/realtime` |
| `perfil.html` | `<ProfileScreen />` | React Native |
| `main.css` (glassmorphism) | `StyleSheet` + `react-native-linear-gradient` | `expo-linear-gradient` |
| `localStorage` | `AsyncStorage` / `expo-sqlite` | `@react-native-async-storage` |
| Service Worker | Background sync + SQLite | `expo-background-fetch` |
| Video background | `<Video>` component | `expo-av` |
| Web Speech API | `expo-speech` | `expo-speech` |
| Web Audio API | `expo-av` (Audio) | `expo-av` |
| Web Share API | `Share` API | React Native built-in |

---

## 4. Estructura de carpetas (RN)

```
ElNinoApp/
├── app/
│   ├── (tabs)/              # Navegación por pestañas
│   │   ├── index.tsx        # Inicio (hero + misiones)
│   │   ├── misiones.tsx     # Misiones
│   │   ├── galeria.tsx      # Galería
│   │   ├── chat.tsx         # Chat
│   │   └── perfil.tsx       # Perfil
│   ├── _layout.tsx          # Layout raíz (theme provider)
│   └── login.tsx            # Auth
├── components/
│   ├── ui/                  # Botones, cards, modals
│   ├── gamification/        # XP bar, badges, streak
│   └── social/              # Chat bubble, photo card
├── hooks/
│   ├── useAuth.ts           # Supabase auth
│   ├── useGamification.ts   # Estado de jugador
│   └── useOfflineSync.ts    # Sync offline → online
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── storage.ts           # AsyncStorage wrapper
│   └── api.ts               # API adapter
├── types/
│   └── index.ts             # Tipos TypeScript
├── constants/
│   └── theme.ts             # Colores, fuentes, spacing
└── package.json
```

---

## 5. Flujo de sincronización offline-first

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   App RN     │────▶│  SQLite      │────▶│  Supabase    │
│  (escritura) │     │  (local)     │     │  (cloud)     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │              ┌─────┴─────┐              │
       │              │           │              │
       ▼              ▼           ▼              ▼
  Optimistic     Background   Conflict    Realtime
  UI update      sync queue   resolution  subscriptions
```

### Estrategia de conflictos

- **Misiones**: Última escritura gana (timestamp)
- **Fotos**: Si existe en cloud, descartar duplicado por hash
- **Chat**: Ordenar por timestamp, merge automático
- **XP/Nivel**: Tomar el valor más alto (nunca restar progreso)

---

## 6. Roadmap de migración

| Fase | Tarea | Duración estimada |
|------|-------|-------------------|
| 1 | Setup Expo + Supabase + Auth | 1 día |
| 2 | Migrar gamification (XP, niveles, misiones) | 2 días |
| 3 | Migrar galería (cámara, storage, lightbox) | 2 días |
| 4 | Migrar chat (realtime, notificaciones push) | 2 días |
| 5 | Migrar perfil + personalización | 1 día |
| 6 | Testing en iOS y Android | 2 días |
| 7 | Publicación en stores | 1-2 días |

**Total estimado: 10-12 días de desarrollo**

---

## 7. Decisiones técnicas clave

### Expo SDK vs bare workflow

**Recomendación: Expo SDK (managed)**
- Suficiente para esta app (no necesita código nativo custom)
- OTA updates son críticos para una app en evolución
- EAS Build compila sin Mac local

### Navegación

**Recomendación: Expo Router (file-based)**
- Sistema de rutas basado en archivos (como Next.js)
- Deep linking automático
- Transiciones nativas por defecto

### Estado global

**Recomendación: Zustand**
- Más ligero que Redux
- Persistencia automática con `zustand/middleware`
- Perfecto para gamificación offline-first

---

## 8. Recursos útiles

- [Expo Documentation](https://docs.expo.dev)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Supabase JS Reference](https://supabase.com/docs/reference/javascript)
- [React Native Directory](https://reactnative.directory)

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Niño — 2026*
