import en from './en.js';
export default {
  ...en,
  missions: { ...en.missions, streakDays: '{{count}} days in a row' },
  relative: {
    justNow: 'Just now',
    minutesAgo: { one: '{{count}} minute ago', other: '{{count}} minutes ago' },
    hoursAgo: { one: '{{count}} hour ago', other: '{{count}} hours ago' },
    daysAgo: { one: '{{count}} day ago', other: '{{count}} days ago' },
  },
};
