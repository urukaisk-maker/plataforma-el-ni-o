# El Niño — Plataforma Gamer Educativa

Plataforma web progresiva (PWA) gamer educativa construida en vanilla JavaScript. Incluye gamificación, tutor IA, cuentos interactivos, concursos, comunidad, internacionalización y cumplimiento normativo para menores.

## Stack tecnológico

- **Frontend**: HTML5, CSS3, Vanilla ES Modules (sin framework)
- **Estilos**: CSS custom properties, diseño responsive, modo oscuro
- **PWA**: Service Worker, manifest.json, offline-first
- **Storage**: localStorage con adaptador abstracto (preparado para API remota)
- **IA**: Stub local con integración preparada para OpenAI / Whisper / TTS
- **Crypto**: Web Crypto API (AES-GCM 256-bit)
- **Tests**: Jest + jsdom
- **CI/CD**: ESLint, Prettier, Husky, GitHub Actions (Netlify deploy)

## Estructura del proyecto

```
src/
  js/
    app.js                  — Arranque y router principal
    services/               — Lógica de negocio
      tutor-ai-service.js   — Tutor conversacional (stub → OpenAI)
      exercise-generator.js — Generación automática de ejercicios
      emotion-detector.js   — Detección de emociones en aprendizaje
      weekly-report.js      — Informes semanales para padres
      lesson-editor.js      — Editor de lecciones drag & drop
      story-engine.js       — Motor de cuentos interactivos
      contest-engine.js     — Concursos y olimpiadas virtuales
      referral-service.js   — Sistema de referidos
      activity-service.js   — Timeline de actividad
      parental-consent.js   — Consentimiento parental COPPA/GDPR-K
    ui/                     — Componentes de interfaz
      tutor-ai-view.js      — Modal de chat con tutor IA
      story-view.js         — Visualización de cuentos interactivos
      social-view.js        — Chat y galería de fotos
      privacy-panel.js      — Panel de privacidad para padres
      language-selector.js  — Selector de idioma
    utils/                  — Utilidades
      i18n.js               — Motor de internacionalización
      speech.js             — TTS multi-idioma con voces nativas
      e2e-crypto.js         — Cifrado E2E con Web Crypto API
      security-headers.js   — Headers de seguridad y checklist
      data-portability.js   — Exportar/importar datos JSON
      onboarding.js         — Onboarding gamificado
      push-notifications.js — Notificaciones push locales
    data/                   — Datos estáticos y curriculares
      curriculum.js         — Contenido por país (MX, CO, AR, ES, BR, US)
      missions.js           — Misiones y logros
      gamification.js       — Sistema de niveles e insignias
      memories.js           — Recuerdos digitales
    locales/                — Traducciones
      es.js, en.js, pt.js   — Bases
      es-MX, es-AR, es-CO   — Variantes regionales
      en-GB, pt-BR          — Variantes regionales
  styles/
    main.css                — Estilos consolidados
panel-privacidad.html       — Panel de privacidad para padres
cuentos.html                — Biblioteca de cuentos interactivos
concursos.html              — Lista de concursos y olimpiadas
concurso.html               — Interfaz de concurso individual
perfil.html                 — Perfil del jugador con timeline
personalizacion.html        — Personalización y backup de datos
landing.html                — Landing page comercial
```

## Fases implementadas

| Fase | Tema | Estado |
|------|------|--------|
| 0 | Infraestructura (ESLint, Prettier, Husky, tests) | ✅ |
| 1 | Refactorización, seguridad XSS, tests | ✅ |
| 2 | TTS, offline mode, kid mode, descarga de datos | ✅ |
| 3 | Backup completo, lightbox fotos, timeline actividad | ✅ |
| 4 | Documentación backend, analytics, data portability | ✅ |
| 5 | PWA, sincronización offline, documentación API | ✅ |
| 6 | Referidos, onboarding gamificado, push notifications | ✅ |
| 7 | Tutor IA, ejercicios auto-generados, emociones, informes semanales | ✅ |
| 8 | Cuentos interactivos, concursos, marketplace docs | ✅ |
| 9 | Internacionalización (8 idiomas), TTS nativo, curriculum por país | ✅ |
| 10 | *(no solicitada)* | — |
| 11 | Seguridad extrema, COPPA/GDPR-K, panel privacidad, cifrado E2E | ✅ |

## Internacionalización

Soporta 8 locales con carga lazy, interpolación `{{var}}`, plurales (`zero/one/other`), fechas relativas y formato de números local:

- `es` (España), `es-MX`, `es-AR`, `es-CO`
- `en` (EE.UU.), `en-GB`
- `pt` (Portugal), `pt-BR`

## Seguridad y cumplimiento

- **Headers**: CSP estricto, HSTS, X-Frame-Options DENY, Permissions-Policy
- **COPPA/GDPR-K**: Verificación de edad mínima (13 años), consentimiento parental por token, revocación
- **Panel de privacidad**: Control granular de 7 categorías de datos, exportación JSON, borrado total con doble confirmación
- **Cifrado E2E**: AES-GCM 256-bit para mensajería profesor-padre (stub listo)
- **Checklist de auditoría**: 24 ítems de pentest incluidos

## Variables de entorno

La clave de YouTube debe guardarse en `.env.local`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_PLAYLIST_ID=your_playlist_id_here
```

## Tests

```bash
# Ejecutar todos los tests
$env:NODE_OPTIONS='--experimental-vm-modules'; node node_modules/jest/bin/jest.js

# Con cobertura
$env:NODE_OPTIONS='--experimental-vm-modules'; node node_modules/jest/bin/jest.js --coverage
```

**Estado actual**: 6 suites, 48 tests, 0 fallos.

## Documentación técnica

- `docs/ARQUITECTURA_BACKEND.md` — Análisis de backends (Supabase, Firebase, PocketBase)
- `docs/API_PUBLICA.md` — Diseño de API REST pública
- `docs/REACT_NATIVE_MIGRATION.md` — Roadmap de migración a mobile
- `docs/SSO_INTEGRATION.md` — Integración con Google Classroom / Clever
- `docs/IA_ARQUITECTURA.md` — Arquitectura de IA (Whisper, OpenAI, TTS)
- `docs/MARKETPLACE_2.0.md` — Marketplace de lecciones con reputación
- `docs/INTERNACIONALIZACION.md` — Roadmap de expansión por país
- `docs/SEGURIDAD_CUMPLIMIENTO.md` — COPPA, GDPR-K, certificaciones

## Próximos pasos estratégicos

1. **Backend**: Elegir entre Supabase, Firebase o PocketBase para persistencia real
2. **Monetización**: Implementar suscripciones por país con precios locales
3. **Mobile**: Evaluar React Native / Capacitor según `docs/REACT_NATIVE_MIGRATION.md`
4. **Certificaciones**: Auditoría externa, COPPA Safe Harbor, GDPR-K completo
5. **Marketing**: TikTok Educativo por país (MX → CO → AR → BR → ES)

## Créditos

Desarrollado por **Manuel Casimiro Carrasco** — 2026
