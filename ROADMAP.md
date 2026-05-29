# Roadmap Plataforma El Niño — PWA

> Plan de trabajo adaptado al stack actual: HTML5, CSS3, JS ES modules, localStorage, Service Worker. Sin backend ni base de datos.

---

## Fase 0 — Cimientos (1 semana)

| ID  | Tarea                                 | Descripción                                                                                                        | Prioridad |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------- |
| 0.1 | Configurar ESLint + Prettier          | Reglas unificadas para JS y CSS; scripts `npm run lint` y `npm run format`.                                        | P0        |
| 0.2 | Git hooks con Husky                   | Pre-commit con lint-staged (formatear archivos modificados).                                                       | P0        |
| 0.3 | Estructurar `package.json`            | Añadir scripts de desarrollo, dependencias de lint y un servidor local (`vite` o `live-server`).                   | P0        |
| 0.4 | Documentar variables de configuración | Crear `src/js/config.js` con URLs base, fechas clave (cumpleaños), secretos de admin. Eliminar hardcodeos sueltos. | P0        |

---

## Fase 1 — Estabilización y calidad (2-3 semanas)

| ID  | Tarea                           | Descripción                                                                                                                           | Prioridad |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1.1 | Refactorizar servicios de datos | Unificar lógica de `localStorage` en `src/js/services/` (usuarios, progreso, fotos, chat). Funciones puras, sin side-effects ocultos. | P0        |
| 1.2 | Añadir tests unitarios (Jest)   | Tests para servicios de datos y utilidades. Cobertura mínima 70 %.                                                                    | P0        |
| 1.3 | Validación de entrada robusta   | Sanitizar inputs de chat, comentarios, formularios. Prevenir XSS básico (escapar HTML).                                               | P0        |
| 1.4 | Manejo de errores global        | Wrapper `try/catch` en funciones críticas; mensajes de error amigables en UI.                                                         | P1        |
| 1.5 | Auditar accesibilidad (a11y)    | Revisar `aria-label`, contraste de color, navegación por teclado, foco visible.                                                       | P1        |
| 1.6 | Revisar y limpiar CSS           | Eliminar estilos duplicados, unificar variables CSS, comentar secciones complejas.                                                    | P1        |

---

## Fase 2 — Experiencia infantil y gamificación (3-4 semanas)

| ID  | Tarea                                  | Descripción                                                                                                    | Prioridad |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------- |
| 2.1 | **Rediseño UI temático gamer**         | Mejorar paleta actual, añadir tipografía display más vibrante, animaciones CSS suaves (sin librerías pesadas). | P0        |
| 2.2 | Adaptación táctil y responsive         | Botones mínimo 48×48 px, áreas de toque amplias, navegación simplificada para tablets.                         | P0        |
| 2.3 | Feedback auditivo y visual             | Sonidos con Web Audio API (aciertos, errores, logros); confeti en logros (ya existe, mejorar triggers).        | P1        |
| 2.4 | **PWA completa**                       | Service Worker ya existe: añadir pantalla de "sin conexión", sincronización de datos locales al recuperar red. | P0        |
| 2.5 | Sistema de monedas e insignias (local) | Modelo en `localStorage`: monedas por completar misiones, insignias visuales en perfil.                        | P1        |
| 2.6 | Desafíos diarios y rachas              | Lógica en frontend: generar misión diaria aleatoria, contador de días consecutivos de visita.                  | P2        |
| 2.7 | Lectura en voz alta con Web Speech API | Botón grande para narrar instrucciones y textos en misiones y recuerdos.                                       | P1        |
| 2.8 | Modo "Niño pequeño"                    | Interfaz simplificada: botones más grandes, menos texto, iconos prominentes. Toggle en perfil.                 | P2        |

---

## Fase 3 — Contenido y comunidad (2-3 semanas)

| ID  | Tarea                          | Descripción                                                                       | Prioridad |
| --- | ------------------------------ | --------------------------------------------------------------------------------- | --------- |
| 3.1 | Editor de misiones mejorado    | Formulario visual para crear misiones personalizadas con preview en tiempo real.  | P1        |
| 3.2 | Galería multimedia enriquecida | Soporte para videos embebidos (YouTube), carrusel táctil, lightbox para fotos.    | P1        |
| 3.3 | Sistema de logros compartidos  | Exportar/importar progreso (JSON) para compartir entre dispositivos o familiares. | P2        |
| 3.4 | Historial de actividad         | Timeline visual de misiones completadas, fotos subidas, logros desbloqueados.     | P2        |

---

## Fase 4 — Escalabilidad futura (investigación)

| ID  | Tarea                         | Descripción                                                                                            | Prioridad |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | --------- |
| 4.1 | Evaluación de backend ligero  | Documentar pros/contras de añadir Firebase/Supabase (auth, base de datos real) vs mantener todo local. | P3        |
| 4.2 | Diseño de API futura          | Si se añade backend, esbozar endpoints necesarios (usuarios, progreso, contenido).                     | P3        |
| 4.3 | Investigación de monetización | Análisis de Stripe/MercadoPago en frontend (Checkout Session) sin backend propio.                      | P3        |

---

## 🗓️ Cronograma orientativo (1 desarrollador)

| Mes   | Fases                      | Entregable                                                      |
| ----- | -------------------------- | --------------------------------------------------------------- |
| Mes 1 | Fase 0 + Fase 1            | Código limpio, testeado, sin errores de consola                 |
| Mes 2 | Fase 2 (core)              | UI pulida, gamificación completa, PWA 100 % funcional offline   |
| Mes 3 | Fase 2 (restante) + Fase 3 | Modo niño, desafíos diarios, galería mejorada, comunidad activa |
| Mes 4 | Fase 4                     | Documentación para futura expansión, decisión de backend        |

---

## 🧰 Stack actual (mantener)

- **Frontend:** HTML5 semántico, CSS3 con custom properties, JavaScript ES modules
- **Datos:** `localStorage` + `JSON` (export/import para portabilidad)
- **PWA:** Service Worker, `manifest.json`, iconos adaptativos
- **Hosting:** Netlify (CDN global, HTTPS, formularios estáticos)
- **Herramientas:** ESLint, Prettier, Jest, Husky

---

## ✅ Próximos pasos inmediatos

1. Crear `package.json` con scripts de lint y dev server.
2. Instalar y configurar ESLint + Prettier.
3. Refactorizar `src/js/services/social-service.js` y `gamification-service.js` para que sean 100 % testeables.
