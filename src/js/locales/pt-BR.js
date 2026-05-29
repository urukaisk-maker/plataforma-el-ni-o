import pt from './pt.js';
export default {
  ...pt,
  relative: {
    justNow: 'Agora mesmo',
    minutesAgo: { one: 'Ha {{count}} minuto', other: 'Ha {{count}} minutos' },
    hoursAgo: { one: 'Ha {{count}} hora', other: 'Ha {{count}} horas' },
    daysAgo: { one: 'Ha {{count}} dia', other: 'Ha {{count}} dias' },
  },
};
