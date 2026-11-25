import type {
  AnswerRecord,
  ModuleId,
  Question,
  QuizAttempt,
  QuizConfig,
  QuizScope,
} from '../types';
import { parseNumber } from './formulas';
import { MODULE_MAP } from '../data/modules';

export type QuizAnswer =
  | { type: 'choice'; index: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'matching'; value: Record<string, string> }
  | { type: 'ordering'; value: string[] };

export interface Evaluation {
  correct: boolean;
  responseLabel: string;
  matchingResults?: Record<string, boolean>;
  correctCount?: number;
  totalParts?: number;
}

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—−]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .trim();
}

export function isAnswerProvided(question: Question, answer: QuizAnswer | null): boolean {
  if (!answer) return false;
  switch (question.kind) {
    case 'mcq':
    case 'code':
    case 'lab':
      return answer.type === 'choice' && answer.index >= 0;
    case 'tf':
      return answer.type === 'boolean';
    case 'fill':
    case 'numeric':
      return answer.type === 'text' && answer.value.trim().length > 0;
    case 'matching':
      return (
        answer.type === 'matching' &&
        question.left.every((item) => Boolean(answer.value[item.id]))
      );
    case 'ordering':
      return answer.type === 'ordering' && answer.value.length === question.items.length;
  }
}

export function evaluateAnswer(question: Question, answer: QuizAnswer | null): Evaluation {
  if (!answer) {
    return { correct: false, responseLabel: 'No answer' };
  }

  switch (question.kind) {
    case 'mcq':
    case 'code':
    case 'lab': {
      if (answer.type !== 'choice') return { correct: false, responseLabel: 'Invalid answer' };
      const selected = question.options[answer.index] ?? 'No answer';
      return { correct: answer.index === question.answer, responseLabel: selected };
    }
    case 'tf': {
      if (answer.type !== 'boolean') return { correct: false, responseLabel: 'Invalid answer' };
      return {
        correct: answer.value === question.answer,
        responseLabel: answer.value ? 'True' : 'False',
      };
    }
    case 'fill': {
      if (answer.type !== 'text') return { correct: false, responseLabel: 'Invalid answer' };
      const normalized = normalizeAnswer(answer.value);
      const correct = question.accepted.some((accepted) => normalizeAnswer(accepted) === normalized);
      return { correct, responseLabel: answer.value.trim() };
    }
    case 'numeric': {
      if (answer.type !== 'text') return { correct: false, responseLabel: 'Invalid answer' };
      const parsed = parseNumber(answer.value);
      const correct =
        parsed !== null && Math.abs(parsed - question.answer) <= question.tolerance + 1e-12;
      return {
        correct,
        responseLabel:
          parsed === null
            ? answer.value.trim() || 'No answer'
            : `${answer.value.trim()} ${question.unit}`.trim(),
      };
    }
    case 'matching': {
      if (answer.type !== 'matching') return { correct: false, responseLabel: 'Invalid answer' };
      const matchingResults: Record<string, boolean> = {};
      let correctCount = 0;
      for (const item of question.left) {
        const isCorrect = answer.value[item.id] === question.correct[item.id];
        matchingResults[item.id] = isCorrect;
        if (isCorrect) correctCount += 1;
      }
      return {
        correct: correctCount === question.left.length,
        responseLabel: `${correctCount} of ${question.left.length} pairs correct`,
        matchingResults,
        correctCount,
        totalParts: question.left.length,
      };
    }
    case 'ordering': {
      if (answer.type !== 'ordering') return { correct: false, responseLabel: 'Invalid answer' };
      const correct =
        answer.value.length === question.items.length &&
        answer.value.every((value, index) => value === question.items[index]);
      return { correct, responseLabel: answer.value.join(' → ') };
    }
  }
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const random = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function questionsForScope(questions: Question[], scope: QuizScope): Question[] {
  if (scope === 'mixed') return questions;
  return questions.filter((question) => question.moduleId === scope);
}

export function sampleQuestions(
  questions: Question[],
  scope: QuizScope,
  count: number,
  seed: number,
): { questions: Question[]; available: number; clamped: boolean } {
  const pool = questionsForScope(questions, scope);
  const wanted = Math.max(0, Math.floor(count));
  const take = Math.min(wanted, pool.length);
  const sampled = shuffleWithSeed(pool, seed).slice(0, take);
  return { questions: sampled, available: pool.length, clamped: take < wanted };
}

export function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export interface QuizSessionResult {
  questions: Question[];
  answers: Map<string, QuizAnswer>;
  evaluations: Map<string, Evaluation>;
}

export function buildAttempt(
  config: QuizConfig,
  session: QuizSessionResult,
  startedAt: number,
  finishedAt = Date.now(),
): QuizAttempt {
  const records: AnswerRecord[] = session.questions.map((question) => {
    const answer = session.answers.get(question.id) ?? null;
    const evaluation = session.evaluations.get(question.id) ?? evaluateAnswer(question, answer);
    return {
      questionId: question.id,
      correct: evaluation.correct,
      response: evaluation.responseLabel,
      topic: question.topic,
      moduleId: question.moduleId,
      answeredAt: finishedAt,
    };
  });
  const correct = records.filter((record) => record.correct).length;
  const missedTopics = Array.from(
    new Set(records.filter((record) => !record.correct).map((record) => record.topic)),
  );
  return {
    id: makeId(),
    scope: config.scope,
    startedAt,
    finishedAt,
    total: records.length,
    correct,
    missedTopics,
    answers: records,
    feedback: config.feedback,
  };
}

export function missedQuestionIds(attempt: QuizAttempt): string[] {
  return attempt.answers.filter((answer) => !answer.correct).map((answer) => answer.questionId);
}

export function addAttemptToStore(
  store: { attempts: QuizAttempt[]; missedQuestionIds: string[] },
  attempt: QuizAttempt,
): { attempts: QuizAttempt[]; missedQuestionIds: string[] } {
  const attemptMissed = new Set(missedQuestionIds(attempt));
  const stillMissed = new Set(store.missedQuestionIds);
  for (const id of attemptMissed) stillMissed.add(id);
  for (const answer of attempt.answers) {
    if (answer.correct) stillMissed.delete(answer.questionId);
  }
  return {
    attempts: [attempt, ...store.attempts].slice(0, 50),
    missedQuestionIds: Array.from(stillMissed),
  };
}

export interface TopicStat {
  topic: string;
  label: string;
  moduleId: ModuleId;
  reviewNoteId: string;
  misses: number;
  attempts: number;
}

export function getWeakTopics(attempts: QuizAttempt[]): TopicStat[] {
  const stats = new Map<string, TopicStat>();
  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      const existing = stats.get(answer.topic);
      if (existing) {
        existing.attempts += 1;
        if (!answer.correct) existing.misses += 1;
      } else {
        stats.set(answer.topic, {
          topic: answer.topic,
          label: answer.topic,
          moduleId: answer.moduleId,
          reviewNoteId: '',
          misses: answer.correct ? 0 : 1,
          attempts: 1,
        });
      }
    }
  }
  return Array.from(stats.values())
    .filter((stat) => stat.misses > 0)
    .sort((a, b) => b.misses - a.misses || b.attempts - a.attempts || a.label.localeCompare(b.label));
}

export function enrichTopicStats(stats: TopicStat[], questions: Question[]): TopicStat[] {
  const byTopic = new Map<string, Question>();
  for (const question of questions) {
    if (!byTopic.has(question.topic)) byTopic.set(question.topic, question);
  }
  return stats.map((stat) => {
    const question = byTopic.get(stat.topic);
    return {
      ...stat,
      moduleId: question?.moduleId ?? stat.moduleId,
      reviewNoteId: question?.reviewNoteId ?? '',
      label: stat.topic,
    };
  });
}

export interface QuizSummary {
  attempts: number;
  totalQuestions: number;
  totalCorrect: number;
  averagePercent: number | null;
  bestPercent: number | null;
  lastAttempt: QuizAttempt | null;
}

export function summarizeAttempts(attempts: QuizAttempt[]): QuizSummary {
  if (attempts.length === 0) {
    return {
      attempts: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averagePercent: null,
      bestPercent: null,
      lastAttempt: null,
    };
  }
  const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const percentages = attempts
    .filter((attempt) => attempt.total > 0)
    .map((attempt) => (attempt.correct / attempt.total) * 100);
  return {
    attempts: attempts.length,
    totalQuestions,
    totalCorrect,
    averagePercent:
      percentages.length > 0
        ? percentages.reduce((sum, value) => sum + value, 0) / percentages.length
        : null,
    bestPercent: percentages.length > 0 ? Math.max(...percentages) : null,
    lastAttempt: attempts[0] ?? null,
  };
}

export function scopeLabel(scope: QuizScope): string {
  return scope === 'mixed' ? 'Mixed review' : MODULE_MAP[scope].code;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDateTime(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return '—';
  }
}
