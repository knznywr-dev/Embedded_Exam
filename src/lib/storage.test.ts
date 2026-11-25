import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PROGRESS,
  STORAGE_KEYS,
  clearStudyData,
  loadFlashcards,
  loadProgress,
  loadQuizData,
  readJSON,
  sanitizeFlashcards,
  sanitizeProgress,
  sanitizeQuizData,
  saveProgress,
} from './storage';
import type { StorageLike } from './storage';

function memoryStorage(initial: Record<string, string> = {}): StorageLike & {
  data: Record<string, string>;
} {
  const data = { ...initial };
  return {
    data,
    getItem(key) {
      return key in data ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = value;
    },
    removeItem(key) {
      delete data[key];
    },
  };
}

describe('storage safety', () => {
  it('falls back on malformed JSON', () => {
    const storage = memoryStorage({ [STORAGE_KEYS.progress]: 'not json' });
    expect(loadProgress(storage)).toEqual(DEFAULT_PROGRESS);
    expect(readJSON('missing', null, storage)).toBeNull();
  });

  it('sanitizes progress, dropping unknown modules and unsafe routes', () => {
    const value = sanitizeProgress({
      completedModules: ['m1', 'm1', 'not-a-module', 'm4b'],
      lastRoute: 'https://example.com',
      lastVisitedAt: 'yesterday',
    });
    expect(value.completedModules).toEqual(['m1', 'm4b']);
    expect(value.lastRoute).toBe('/');
    expect(value.lastVisitedAt).toBeNull();
  });

  it('round-trips progress', () => {
    const storage = memoryStorage();
    const progress = {
      completedModules: ['m2' as const],
      lastRoute: '/notes',
      lastVisitedAt: 1234,
    };
    expect(saveProgress(progress, storage)).toBe(true);
    expect(loadProgress(storage)).toEqual(progress);
  });

  it('drops invalid flashcard statuses', () => {
    expect(
      sanitizeFlashcards({ a: 'known', b: 'review', c: 'maybe', d: 3 }),
    ).toEqual({ a: 'known', b: 'review' });
    expect(sanitizeFlashcards([])).toEqual({});
    expect(sanitizeFlashcards(null)).toEqual({});
  });

  it('filters malformed quiz attempts and deduplicates missed ids', () => {
    const data = sanitizeQuizData({
      attempts: [
        {
          id: 'ok',
          scope: 'm3',
          startedAt: 1,
          total: 1,
          correct: 1,
          answers: [
            {
              questionId: 'q1',
              correct: true,
              response: 'x',
              topic: 't',
              moduleId: 'm3',
              answeredAt: 2,
            },
          ],
        },
        { id: 'bad-scope', scope: 'm9', startedAt: 1, total: 1, correct: 0, answers: [] },
        { scope: 'm1', startedAt: 1, total: 1, correct: 0, answers: [] },
      ],
      missedQuestionIds: ['q2', 'q2', 5, ''],
    });
    expect(data.attempts).toHaveLength(1);
    expect(data.attempts[0].id).toBe('ok');
    expect(data.missedQuestionIds).toEqual(['q2']);
  });

  it('clears all three study keys without touching unrelated data', () => {
    const storage = memoryStorage({
      [STORAGE_KEYS.progress]: '{}',
      [STORAGE_KEYS.flashcards]: '{}',
      [STORAGE_KEYS.quiz]: '{}',
      other: 'keep',
    });
    clearStudyData(storage);
    expect(storage.data).toEqual({ other: 'keep' });
    expect(loadQuizData(storage)).toEqual({ attempts: [], missedQuestionIds: [] });
  });

  it('survives a storage that throws', () => {
    const storage: StorageLike = {
      getItem() {
        throw new Error('blocked');
      },
      setItem() {
        throw new Error('blocked');
      },
      removeItem() {
        throw new Error('blocked');
      },
    };
    expect(loadProgress(storage)).toEqual(DEFAULT_PROGRESS);
    expect(saveProgress(DEFAULT_PROGRESS, storage)).toBe(false);
    expect(loadFlashcards(storage)).toEqual({});
    expect(() => clearStudyData(storage)).not.toThrow();
  });
});
