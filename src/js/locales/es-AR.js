import es from './es.js';
export default {
  ...es,
  relative: {
    justNow: 'Ahora mismo',
    minutesAgo: { one: 'Hace {{count}} minuto', other: 'Hace {{count}} minutos' },
    hoursAgo: { one: 'Hace {{count}} hora', other: 'Hace {{count}} horas' },
    daysAgo: { one: 'Hace {{count}} dia', other: 'Hace {{count}} dias' },
  },
};
