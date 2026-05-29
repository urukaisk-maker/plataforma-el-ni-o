/**
 * Generador de informes semanales para padres.
 * Analiza datos locales y genera insights en lenguaje natural.
 * Sin IA externa — usa plantillas inteligentes con datos reales.
 */

import { getEmotionDistribution } from './emotion-detector.js';
import { getExerciseStats } from './exercise-generator.js';
import { getActivitySummary } from './activity-service.js';
import { getPlayerStats } from './gamification-service.js';

/**
 * Genera un informe semanal completo.
 * @returns {object}
 */
export function generateWeeklyReport() {
  const emotionDist = getEmotionDistribution(7);
  const exerciseStats = getExerciseStats();
  const activitySummary = getActivitySummary();
  const playerStats = getPlayerStats();

  const totalEmotions = Object.values(emotionDist).reduce((a, b) => a + b, 0) || 1;
  const frustratedPct = Math.round(((emotionDist.frustrated || 0) / totalEmotions) * 100);
  const boredPct = Math.round(((emotionDist.bored || 0) / totalEmotions) * 100);
  const masteringPct = Math.round(((emotionDist.mastering || 0) / totalEmotions) * 100);

  // Determinar tema destacado y débil
  const topicStats = exerciseStats.byTopic || {};
  const topics = Object.entries(topicStats);
  let strongTopic = null;
  let weakTopic = null;

  if (topics.length > 0) {
    topics.sort((a, b) => (b[1].correct / Math.max(b[1].total, 1)) - (a[1].correct / Math.max(a[1].total, 1)));
    strongTopic = topics[0];
    weakTopic = topics[topics.length - 1];
  }

  const sections = [];

  // Saludo personalizado
  sections.push({
    type: 'greeting',
    title: `Informe semanal de ${playerStats.name || 'El Niño'}`,
    text: `Esta semana ${playerStats.name || 'tu hijo'} ha acumulado ${playerStats.xp || 0} XP y alcanzado el nivel ${playerStats.level || 1}. ¡Sigue progresando!`,
  });

  // Desempeño académico
  if (exerciseStats.completed > 0) {
    const accuracy = Math.round((exerciseStats.correct / exerciseStats.completed) * 100);
    sections.push({
      type: 'academic',
      title: 'Desempeño académico',
      text: `Ha completado ${exerciseStats.completed} ejercicios con un ${accuracy}% de aciertos.${strongTopic ? ` Destacó en **${strongTopic[0]}** con ${Math.round((strongTopic[1].correct / strongTopic[1].total) * 100)}% de aciertos.` : ''}${weakTopic && weakTopic[0] !== strongTopic[0] ? ` Sería bueno reforzar **${weakTopic[0]}**, donde acertó ${Math.round((weakTopic[1].correct / weakTopic[1].total) * 100)}%.` : ''}`,
    });
  }

  // Estado emocional
  sections.push({
    type: 'emotional',
    title: 'Estado emocional',
    text: `Durante las sesiones de esta semana:${masteringPct > 0 ? `\n- ${masteringPct}% del tiempo mostró dominio del tema.` : ''}${frustratedPct > 0 ? `\n- ${frustratedPct}% del tiempo mostró signos de frustración.` : ''}${boredPct > 0 ? `\n- ${boredPct}% del tiempo completó ejercicios muy rápido (posible aburrimiento).` : ''}\n\n${frustratedPct > 30 ? '**Sugerencia:** Los ejercicios actuales pueden ser demasiado difíciles. Considera bajar el nivel de dificultad.' : boredPct > 30 ? '**Sugerencia:** Va volando por los ejercicios. ¡Es hora de subir el nivel!' : '**Sugerencia:** El ritmo de aprendizaje es equilibrado. Sigue así.'}`,
  });

  // Actividad en la plataforma
  sections.push({
    type: 'activity',
    title: 'Actividad en la plataforma',
    text: `Esta semana ha:\n- Subido ${activitySummary.totalPhotos} fotos\n- Enviado ${activitySummary.totalMessages} mensajes en el chat\n- Completado ${playerStats.completedMissions || 0} misiones\n- Conseguido ${playerStats.badges || 0} insignias nuevas`,
  });

  // Recomendaciones
  const recommendations = [];
  if (frustratedPct > 30) {
    recommendations.push('Practicar 10 minutos diarios en vez de sesiones largas.');
    recommendations.push('Usar la función de pistas antes de rendirse.');
  }
  if (boredPct > 30) {
    recommendations.push('Activar el modo difícil en los ejercicios.');
    recommendations.push('Explorar temas nuevos como historia o ciencia.');
  }
  if (!recommendations.length) {
    recommendations.push('Mantener la rutina actual — está funcionando bien.');
    recommendations.push('Celebrar los logros de la semana con una actividad especial.');
  }

  sections.push({
    type: 'recommendations',
    title: 'Recomendaciones para esta semana',
    items: recommendations,
  });

  return {
    generatedAt: new Date().toISOString(),
    period: '7 días',
    playerName: playerStats.name || 'El Niño',
    sections,
    rawStats: {
      xp: playerStats.xp || 0,
      level: playerStats.level || 1,
      streak: playerStats.dailyStreak || 0,
      completedExercises: exerciseStats.completed || 0,
      accuracy: exerciseStats.completed > 0 ? Math.round((exerciseStats.correct / exerciseStats.completed) * 100) : 0,
    },
  };
}

/**
 * Exporta el informe como texto plano para compartir.
 */
export function exportReportAsText(report) {
  const lines = [
    `📊 INFORME SEMANAL — ${report.playerName}`,
    `Período: ${report.period} | Generado: ${new Date(report.generatedAt).toLocaleDateString('es-ES')}`,
    '',
    ...report.sections.map(s => {
      if (s.type === 'recommendations') {
        return `📝 ${s.title}\n${s.items.map(i => `• ${i}`).join('\n')}`;
      }
      return `📌 ${s.title}\n${s.text}`;
    }),
    '',
    '---',
    'Plataforma El Niño — Generado automáticamente',
  ];
  return lines.join('\n');
}
