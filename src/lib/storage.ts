import type {
  FlashcardMap,
  ModuleId,
  QuizAttempt,
  StoredQuizData,
  StudyProgress,
} from '../types';
import { MODULE_IDS } from '../data/modules';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_PREFIX = 'embedded-reviewer:v1:';

export const STORAGE_KEYS = {
  progress: `${STORAGE_PREFIX}progress`,
  flashcards: `${STORAGE_PREFIX}flashcards`,
  quiz: `${STORAGE_PREFIX}quiz`,
} as const;

export const DEFAULT_PROGRESS: StudyProgress = {
  completedModules: [],
  lastRoute: '/',
  lastVisitedAt: null,
};

export const DEFAULT_QUIZ_DATA: StoredQuizData = {
  attempts: [],
  missedQuestionIds: [],
};

export function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(
  key: string,
  fallback: T,
  storage: StorageLike | null = getBrowserStorage(),
): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(
  key: string,
  value: T,
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function isModuleId(value: unknown): value is ModuleId {
  return typeof value === 'string' && (MODULE_IDS as string[]).includes(value);
}

export function sanitizeProgress(value: unknown): StudyProgress {
  if (!value || typeof value !== 'object') return { ...DEFAULT_PROGRESS };
  const record = value as Record<string, unknown>;
  const completed = Array.isArray(record.completedModules)
    ? Array.from(new Set(record.completedModules.filter(isModuleId)))
    : [];
  return {
    completedModules: completed,
    lastRoute:
      typeof record.lastRoute === 'string' && record.lastRoute.startsWith('/')
        ? record.lastRoute
        : DEFAULT_PROGRESS.lastRoute,
    lastVisitedAt:
      typeof record.lastVisitedAt === 'number' && Number.isFinite(record.lastVisitedAt)
        ? record.lastVisitedAt
        : null,
  };
}

export function loadProgress(storage: StorageLike | null = getBrowserStorage()): StudyProgress {
  return sanitizeProgress(readJSON<unknown>(STORAGE_KEYS.progress, null, storage));
}

export function saveProgress(
  progress: StudyProgress,
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  return writeJSON(STORAGE_KEYS.progress, progress, storage);
}

export function sanitizeFlashcards(value: unknown): FlashcardMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: FlashcardMap = {};
  for (const [key, status] of Object.entries(value as Record<string, unknown>)) {
    if (status === 'known' || status === 'review') {
      result[key] = status;
    }
  }
  return result;
}

export function loadFlashcards(storage: StorageLike | null = getBrowserStorage()): FlashcardMap {
  return sanitizeFlashcards(readJSON<unknown>(STORAGE_KEYS.flashcards, null, storage));
}

export function saveFlashcards(
  flashcards: FlashcardMap,
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  return writeJSON(STORAGE_KEYS.flashcards, flashcards, storage);
}

function sanitizeAttempt(value: unknown): QuizAttempt | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string') return null;
  if (typeof record.startedAt !== 'number') return null;
  if (typeof record.total !== 'number' || typeof record.correct !== 'number') return null;
  if (!Array.isArray(record.answers)) return null;
  const scope = record.scope;
  if (
    scope !== 'mixed' &&
    !isModuleId(scope)
  ) {
    return null;
  }
  const answers = record.answers
    .filter((answer): answer is Record<string, unknown> => Boolean(answer && typeof answer === 'object'))
    .map((answer) => ({
      questionId: typeof answer.questionId === 'string' ? answer.questionId : '',
      correct: Boolean(answer.correct),
      response: typeof answer.response === 'string' ? answer.response : '',
      topic: typeof answer.topic === 'string' ? answer.topic : '',
      moduleId: isModuleId(answer.moduleId) ? answer.moduleId : ('m1' as ModuleId),
      answeredAt: typeof answer.answeredAt === 'number' ? answer.answeredAt : Date.now(),
    }))
    .filter((answer) => answer.questionId.length > 0);

  return {
    id: record.id,
    scope,
    startedAt: record.startedAt,
    finishedAt: typeof record.finishedAt === 'number' ? record.finishedAt : undefined,
    total: record.total,
    correct: record.correct,
    missedTopics: Array.isArray(record.missedTopics)
      ? record.missedTopics.filter((topic): topic is string => typeof topic === 'string')
      : [],
    answers,
    feedback: record.feedback === 'end' ? 'end' : 'immediate',
  };
}

export function sanitizeQuizData(value: unknown): StoredQuizData {
  if (!value || typeof value !== 'object') return { ...DEFAULT_QUIZ_DATA };
  const record = value as Record<string, unknown>;
  const attempts = Array.isArray(record.attempts)
    ? record.attempts
        .map(sanitizeAttempt)
        .filter((attempt): attempt is QuizAttempt => attempt !== null)
        .slice(0, 50)
    : [];
  const missedQuestionIds = Array.isArray(record.missedQuestionIds)
    ? Array.from(
        new Set(
          record.missedQuestionIds.filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
        ),
      )
    : [];
  return { attempts, missedQuestionIds };
}

export function loadQuizData(storage: StorageLike | null = getBrowserStorage()): StoredQuizData {
  return sanitizeQuizData(readJSON<unknown>(STORAGE_KEYS.quiz, null, storage));
}

export function saveQuizData(
  data: StoredQuizData,
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  return writeJSON(STORAGE_KEYS.quiz, data, storage);
}

export function clearStudyData(storage: StorageLike | null = getBrowserStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEYS.progress);
    storage.removeItem(STORAGE_KEYS.flashcards);
    storage.removeItem(STORAGE_KEYS.quiz);
  } catch {
    // Storage can be unavailable (private mode/quota). The UI still works in memory.
  }
}
