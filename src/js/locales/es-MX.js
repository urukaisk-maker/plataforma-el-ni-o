import es from './es.js';
export default {
  ...es,
  missions: { ...es.missions, streakDays: '{{count}} dias seguidos' },
  relative: {
    justNow: 'Ahorita',
    minutesAgo: { one: 'Hace {{count}} minutillo', other: 'Hace {{count}} minutillos' },
    hoursAgo: { one: 'Hace {{count}} horita', other: 'Hace {{count}} horitas' },
    daysAgo: { one: 'Hace {{count}} dia', other: 'Hace {{count}} dias' },
  },
};
