# Arquitectura de IA — Plataforma El Niño

> Estado: Stub local funcional + documentación para integración con APIs externas.

---

## 1. Tutor Conversacional por Voz

### Componentes

| Capa | Tecnología | Estado |
|------|-----------|--------|
| STT (voz → texto) | Web Speech API (`SpeechRecognition`) | ✅ Funcional en Chrome/Edge |
| STT avanzado | OpenAI Whisper API | 📋 Documentado (requiere API key) |
| LLM (chat) | OpenAI GPT-4o-mini / Claude Haiku | 📋 Documentado (requiere API key) |
| TTS (texto → voz) | Web Speech API (`speechSynthesis`) | ✅ Funcional |
| TTS avanzado | ElevenLabs / OpenAI TTS | 📋 Documentado |

### Flujo completo (producción)

```
Niño habla al micrófono
    ↓
[Web Speech API] → Texto (fallback local)
    ↓
[Whisper API] → Texto mejorado (opcional)
    ↓
[GPT-4o-mini] → Respuesta personalizada
    ↓
[OpenAI TTS / ElevenLabs] → Audio con voz de personaje
    ↓
Reproduce en altavoz
```

### Coste estimado (producción)

| Servicio | Uso estimado | Coste/mes |
|----------|-------------|-----------|
| Whisper | 1000 minutos | ~$1.00 |
| GPT-4o-mini | 50K tokens | ~$0.50 |
| OpenAI TTS | 1000 minutos | ~$1.50 |
| **Total** | | **~$3.00/mes** |

### Implementación stub → producción

```javascript
// src/js/services/tutor-ai-service.js

async function askTutorProduction(question, personalityId) {
  const personality = PERSONALITIES[personalityId];

  // 1. Llamar a OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres ${personality.name}, un tutor ${personality.tone} para niños de 6-12 años. Explica conceptos de forma sencilla, usa emojis y sé animado. Máximo 3 frases.`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

---

## 2. Generación Automática de Ejercicios

### Stub local → IA

Actualmente los ejercicios se generan con templates locales. Para producción:

```javascript
async function generateExerciseWithAI(topic) {
  const prompt = `Genera un ejercicio de ${topic} para un niño de 8 años.
  Incluye: pregunta, 4 opciones (1 correcta, 3 distractores plausibles), pista corta.
  Formato JSON: {question, options[], correct, hint}`;

  const response = await fetchOpenAI(prompt);
  return JSON.parse(response);
}
```

### Modelos recomendados

| Modelo | Precio | Calidad | Latencia |
|--------|--------|---------|----------|
| GPT-4o-mini | $0.15/1M tokens | Alta | ~1s |
| Claude Haiku | $0.25/1M tokens | Alta | ~1s |
| Mistral 7B (local) | $0 | Media | ~3s |

---

## 3. Detección de Emociones

### Enfoque actual (sin IA externa)

Análisis de patrones locales:
- **Error rate** > 70% + 3 fallos seguidos → Frustración
- **Tiempo** < 3s + 100% aciertos → Aburrimiento
- **Error rate** < 20% + tiempo razonable → Dominio

### Enfoque futuro (con IA)

```javascript
// Análisis de texto del niño vía sentiment analysis
async function analyzeEmotion(text) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: 'Analiza el estado emocional de este niño basado en su mensaje. Responde solo: frustrated|bored|mastering|neutral|excited'
      }, { role: 'user', content: text }],
      max_tokens: 10,
    }),
  });
  return parseEmotion(await response.json());
}
```

---

## 4. Recomendaciones Semanales

### Stub local → IA

Actualmente usa plantillas con datos locales. Para producción:

```javascript
async function generateAIReport(stats) {
  const prompt = `Genera un informe semanal para padres en español, tono cálido y profesional.
  Datos: ${JSON.stringify(stats)}
  Incluye: desempeño académico, estado emocional, recomendaciones prácticas.`;

  const response = await fetchOpenAI(prompt);
  return response;
}
```

---

## 5. Roadmap de implementación IA

| Fase | Tarea | Coste | Tiempo |
|------|-------|-------|--------|
| 1 | Obtener API key OpenAI | $5 crédito | 10 min |
| 2 | Conectar tutor a GPT-4o-mini | ~$0.50/mes | 4 horas |
| 3 | Integrar Whisper para STT | ~$1/mes | 4 horas |
| 4 | Generador de ejercicios con IA | ~$0.50/mes | 6 horas |
| 5 | Reportes semanales con IA | ~$0.50/mes | 4 horas |
| 6 | Optimizar prompts y cache | - | 4 horas |

**Total: ~18-20 horas de desarrollo + ~$3/mes en APIs**

---

## 6. Consideraciones de privacidad (COPPA / GDPR-K)

- **Voz de niños**: Nunca enviar audio sin consentimiento parental explícito
- **Datos de chat**: Anonimizar antes de enviar a APIs externas
- **Cache local**: Guardar respuestas frecuentes para reducir llamadas a API
- **Retención**: Borrar historial de chat cada 30 días
- **Opt-in**: Tutor IA desactivado por defecto, padre debe activarlo

---

*Documento creado por Manuel Casimiro Carrasco, Desarrollador Web*
*Plataforma El Niño — 2026*
