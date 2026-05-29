/**
 * Motor de concursos y olimpiadas virtuales.
 * Competencias anonimas por colegio/region con ranking y premios digitales.
 */

import { getItem, setItem } from '../utils/storage-adapter.js';
import { addXP, awardBadge } from './gamification-service.js';
import { logActivity } from './activity-service.js';

const CONTESTS_KEY = 'elnino_contests';
const PARTICIPATIONS_KEY = 'elnino_contest_participations';
const RANKING_KEY = 'elnino_contest_rankings';

const DEFAULT_CONTESTS = [
  {
    id: 'contest_math_01',
    title: 'Olimpiada de Matematicas Primavera',
    description: '20 preguntas de sumas, restas y multiplicacion. Tienes 15 minutos.',
    subject: 'matematicas',
    difficulty: 'medium',
    timeLimit: 900,
    questions: [
      { question: 'Cuanto es 24 + 37?', options: [51, 61, 71, 81], correct: 1 },
      { question: 'Cuanto es 100 - 47?', options: [53, 63, 43, 57], correct: 0 },
      { question: 'Cuanto es 8 x 7?', options: [54, 56, 48, 64], correct: 1 },
      { question: 'Cuanto es 45 / 9?', options: [4, 5, 6, 7], correct: 1 },
      { question: 'Cual es el doble de 23?', options: [43, 46, 56, 66], correct: 1 },
    ],
    xpReward: 200,
    badgeReward: 'olympiad_bronze',
    minScore: 3,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    region: 'global',
    anonymous: true,
  },
];

function ensureContests() {
  const existing = getItem(CONTESTS_KEY, []);
  if (existing.length === 0) {
    setItem(CONTESTS_KEY, DEFAULT_CONTESTS);
    return DEFAULT_CONTESTS;
  }
  return existing;
}

export function getContests() { return ensureContests(); }
export function getContest(id) { return getContests().find(c => c.id === id); }

export function getActiveContests() {
  const now = new Date().toISOString();
  return getContests().filter(c => c.startDate <= now && c.endDate >= now);
}

export function getParticipation(contestId) {
  const all = getItem(PARTICIPATIONS_KEY, {});
  return all[contestId];
}

function saveParticipation(contestId, participation) {
  const all = getItem(PARTICIPATIONS_KEY, {});
  all[contestId] = participation;
  setItem(PARTICIPATIONS_KEY, all);
}

export function startContest(contestId) {
  const contest = getContest(contestId);
  if (!contest) return null;
  const existing = getParticipation(contestId);
  if (existing?.completed) return existing;
  const participation = {
    contestId, startedAt: Date.now(), answers: [],
    currentQuestion: 0, completed: false,
  };
  saveParticipation(contestId, participation);
  return participation;
}

export function answerQuestion(contestId, answerIndex) {
  const contest = getContest(contestId);
  const participation = getParticipation(contestId);
  if (!contest || !participation || participation.completed) return null;

  const question = contest.questions[participation.currentQuestion];
  const correct = question.correct === answerIndex;
  participation.answers.push({
    questionIndex: participation.currentQuestion,
    selected: answerIndex, correct, timestamp: Date.now(),
  });
  participation.currentQuestion++;

  if (participation.currentQuestion >= contest.questions.length) {
    participation.completed = true;
    participation.finishedAt = Date.now();
    participation.score = participation.answers.filter(a => a.correct).length;

    if (participation.score >= contest.minScore) {
      addXP(contest.xpReward);
      if (contest.badgeReward) awardBadge(contest.badgeReward);
      logActivity('contest', `Concurso completado: ${contest.title}`, `Puntuacion: ${participation.score}/${contest.questions.length}`, contest.xpReward);
    }

    updateRanking(contestId, participation.score);
  }

  saveParticipation(contestId, participation);
  return { ...participation, question, correct };
}

export function getCurrentQuestion(contestId) {
  const contest = getContest(contestId);
  const participation = getParticipation(contestId);
  if (!contest || !participation || participation.completed) return null;
  return contest.questions[participation.currentQuestion];
}

export function getContestResult(contestId) {
  const participation = getParticipation(contestId);
  if (!participation?.completed) return null;
  return {
    score: participation.score,
    total: participation.answers.length,
    timeMs: participation.finishedAt - participation.startedAt,
    xpEarned: participation.score >= getContest(contestId)?.minScore ? getContest(contestId).xpReward : 0,
  };
}

function updateRanking(contestId, score) {
  const all = getItem(RANKING_KEY, {});
  all[contestId] = all[contestId] || [];
  all[contestId].push({ score, timestamp: Date.now(), anonymous: true });
  all[contestId].sort((a, b) => b.score - a.score);
  if (all[contestId].length > 100) all[contestId].length = 100;
  setItem(RANKING_KEY, all);
}

export function getRanking(contestId, topN = 20) {
  const all = getItem(RANKING_KEY, {});
  return (all[contestId] || []).slice(0, topN);
}
