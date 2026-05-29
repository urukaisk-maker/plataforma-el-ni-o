# Internacionalizacion Real — Plataforma El Nino

> Objetivo: conquistar mercados de habla hispana, portuguesa e inglesa.

---

## 1. Sistema i18n (Vanilla JS)

### Arquitectura

```
src/js/utils/i18n.js          — Motor i18n (carga lazy, interpolacion, plurales, fechas)
src/js/locales/
  es.js                         — Espanol (base)
  es-MX.js                      — Mexico
  es-AR.js                      — Argentina
  es-CO.js                      — Colombia
  en.js                         — Ingles (US)
  en-GB.js                      — Ingles (UK)
  pt.js                         — Portugues (Portugal)
  pt-BR.js                      — Portugues (Brasil)
```

### Features implementados

| Feature | Estado | Detalle |
|---------|--------|---------|
| Carga lazy de traducciones | ✅ | `import()` dinamico por locale |
| Interpolacion `{{var}}` | ✅ | `t('missions.streakDays', { count: 5 })` |
| Plurales | ✅ | `zero/one/other` por locale |
| Fechas relativas | ✅ | `formatRelativeDate(date)` → "Hace 3 minutos" |
| Formato de numeros | ✅ | `formatNumber(1234.5)` → "1.234,5" (es) |
| Persistencia | ✅ | `localStorage` guarda locale seleccionado |
| RTL | ✅ | Atributo `dir` en `<html>` |

### API

```javascript
import { t, tn, formatDate, formatRelativeDate, formatNumber, loadLocale, getCurrentLocale } from './i18n.js';

// Traduccion simple
t('nav.home'); // "Inicio" | "Home" | "Inicio"

// Con interpolacion
t('profile.level', { level: 3 }); // "Nivel 3" | "Level 3" | "Nivel 3"

// Plural
tn('relative.minutesAgo', 5); // "Hace 5 minutos" | "5 minutes ago" | "Ha 5 minutos"

// Fecha relativa
formatRelativeDate(new Date(Date.now() - 180000)); // "Hace 3 minutos"
```

---

## 2. Voces TTS Nativas por Idioma

### Mapeo de voces por locale

| Locale | Voces preferidas (prioridad) | Fallback |
|--------|------------------------------|----------|
| `es` | Google espanol, Microsoft Helena, Monica | Cualquier voz `es-*` |
| `es-MX` | Google espanol de Estados Unidos, Microsoft Sabina | `es-*` |
| `es-AR` | Google espanol de Estados Unidos, Microsoft Helena | `es-*` |
| `en` | Google US English, Microsoft David, Samantha | Cualquier voz `en-*` |
| `en-GB` | Google UK English Female/Male, Microsoft George/Hazel | `en-*` |
| `pt` | Google portugues, Microsoft Helia, Joana | Cualquier voz `pt-*` |
| `pt-BR` | Google portugues do Brasil, Microsoft Heloisa | `pt-*` |

### Integracion

```javascript
import { speak } from './speech.js';

// Automaticamente selecciona la mejor voz del locale actual
speak('Hola mundo', { lang: 'es-MX', rate: 0.85 });
```

### Reconocimiento de voz (STT)

El SpeechRecognition API usa el locale actual:

```javascript
recognition.lang = getCurrentLocale(); // 'es-MX', 'en-US', etc.
```

---

## 3. Contenido Curricular por Pais

### Secretarias de educacion soportadas

| Pais | Autoridad | Estructura curricular |
|------|-----------|----------------------|
| Mexico | SEP | Preescolar → Primaria 1-6 → Secundaria 1-3 |
| Colombia | MEN | Preescolar → Basica primaria 1-5 → Basica secundaria 6-9 → Media 10-11 |
| Argentina | Ministerio de Educacion | Inicial → Primaria 1-6 → Secundaria 1-6 |
| Espana | LOMLOE | Infantil → Primaria 1-6 → ESO 1-4 → Bachillerato |
| Brasil | MEC / BNCC | Educacao infantil → Fundamental 1-9 → Medio |
| Estados Unidos | Common Core | Pre-K → K → Grade 1-5 → Middle 6-8 → High 9-12 |

### Adaptacion automatica

```javascript
import { getCurriculum, getSubjectsForCountry } from './data/curriculum.js';

const mx = getCurriculum('mx');
mx.subjects.matematicas; // ['Numeros', 'Formas', 'Medida', ...]
mx.culturalRefs; // ['Chapultepec', 'Alebrijes', 'Dia de Muertos', ...]
```

### Temas culturales por pais

Los ejercicios y cuentos adaptan referencias culturales:
- **Mexico**: Chapultepec, Alebrijes, Dia de Muertos, Lucha libre
- **Colombia**: Carnaval de Barranquilla, Arepa, Cafe, Vallenato
- **Argentina**: Mate, Dulce de leche, Tango, Asado
- **Espana**: Sagrada Familia, Paella, Flamenco, Falla
- **Brasil**: Carnaval, Feijoada, Futebol, Capoeira
- **EE.UU.**: Baseball, Hamburger, Hollywood, Thanksgiving

---

## 4. Selector de Idioma

Componente UI ubicado en el header de la aplicacion:
- Dropdown con banderas y etiquetas
- Persistencia automatica via localStorage
- Recarga de pagina al cambiar (para aplicar traducciones)
- CSS con efectos hover y estado activo

---

## 5. Roadmap de Expansión

| Prioridad | Mercado | Estrategia |
|-----------|---------|------------|
| 1 | Mexico | Contenido SEP completo, marketing en TikTok/Educativo |
| 2 | Colombia | MEN, alianzas con SENA, contenido cafe/agro |
| 3 | Argentina | Primaria + secundaria, precio en pesos argentinos |
| 4 | Brasil | BNCC, traduccion PT-BR completa, WhatsApp marketing |
| 5 | Espana | LOMLOE, GDPR-K completo, precio en EUR |
| 6 | Peru / Chile | Minedu + Mineduc, contenido andino |
| 7 | Estados Unidos | Common Core, ESL, mercado hispano |

---

## 6. Costos de expansion

| Item | Costo estimado |
|------|---------------|
| Traduccion profesional (es→en, pt) | $500-1,000 |
| Locuciones TTS profesionales | $200-400 por idioma |
| Adaptacion curricular por pais | $300-500 por pais |
| Marketing local (TikTok, Meta) | $500-2,000/mes por pais |
| **Total fase inicial** | **~$3,000-5,000** |

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Nino — 2026*
