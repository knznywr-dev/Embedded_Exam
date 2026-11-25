import { describe, expect, it } from 'vitest';
import type { Question, QuizAttempt, QuizConfig } from '../types';
import {
  addAttemptToStore,
  buildAttempt,
  evaluateAnswer,
  getWeakTopics,
  missedQuestionIds,
  sampleQuestions,
  shuffleWithSeed,
  summarizeAttempts,
} from './quiz';

const base = {
  moduleId: 'm1' as const,
  page: 1,
  reviewNoteId: 'note-test',
  explanation: 'Because the reviewer says so.',
};

const mcq: Question = {
  ...base,
  id: 'q-mcq',
  kind: 'mcq',
  topic: 'MCQ topic',
  prompt: 'Pick one',
  options: ['A', 'B', 'C'],
  answer: 1,
};

const tf: Question = {
  ...base,
  id: 'q-tf',
  kind: 'tf',
  topic: 'TF topic',
  prompt: 'True or false',
  answer: true,
};

const fill: Question = {
  ...base,
  id: 'q-fill',
  kind: 'fill',
  topic: 'Fill topic',
  prompt: 'Type it',
  accepted: ['millis()', 'millis'],
};

const numeric: Question = {
  ...base,
  id: 'q-num',
  kind: 'numeric',
  topic: 'Numeric topic',
  prompt: 'Compute it',
  answer: 3,
  tolerance: 0.01,
  unit: 'ms',
};

const matching: Question = {
  ...base,
  id: 'q-match',
  kind: 'matching',
  topic: 'Matching topic',
  prompt: 'Match it',
  left: [
    { id: 'l1', label: 'Green' },
    { id: 'l2', label: 'Red' },
  ],
  right: ['D8', 'D10'],
  correct: { l1: 'D8', l2: 'D10' },
};

const ordering: Question = {
  ...base,
  id: 'q-order',
  kind: 'ordering',
  topic: 'Ordering topic',
  prompt: 'Order it',
  items: ['preprocess', 'compile', 'link', 'flash'],
};

describe('evaluateAnswer', () => {
  it('scores a correct and incorrect multiple choice', () => {
    expect(evaluateAnswer(mcq, { type: 'choice', index: 1 }).correct).toBe(true);
    expect(evaluateAnswer(mcq, { type: 'choice', index: 0 }).correct).toBe(false);
  });

  it('scores true/false', () => {
    expect(evaluateAnswer(tf, { type: 'boolean', value: true }).correct).toBe(true);
    expect(evaluateAnswer(tf, { type: 'boolean', value: false }).correct).toBe(false);
  });

  it('normalizes fill-in answers', () => {
    expect(evaluateAnswer(fill, { type: 'text', value: '  MILLIS() ' }).correct).toBe(true);
    expect(evaluateAnswer(fill, { type: 'text', value: 'delay' }).correct).toBe(false);
  });

  it('allows a numeric tolerance', () => {
    expect(evaluateAnswer(numeric, { type: 'text', value: '3.01' }).correct).toBe(true);
    expect(evaluateAnswer(numeric, { type: 'text', value: '3.02' }).correct).toBe(false);
  });

  it('scores matching part by part', () => {
    const perfect = evaluateAnswer(matching, {
      type: 'matching',
      value: { l1: 'D8', l2: 'D10' },
    });
    expect(perfect.correct).toBe(true);
    expect(perfect.correctCount).toBe(2);

    const partial = evaluateAnswer(matching, {
      type: 'matching',
      value: { l1: 'D8', l2: 'D8' },
    });
    expect(partial.correct).toBe(false);
    expect(partial.correctCount).toBe(1);
    expect(partial.matchingResults).toEqual({ l1: true, l2: false });
  });

  it('scores an ordering exactly', () => {
    expect(evaluateAnswer(ordering, { type: 'ordering', value: [...ordering.items] }).correct).toBe(
      true,
    );
    expect(
      evaluateAnswer(ordering, { type: 'ordering', value: ['compile', 'preprocess', 'link', 'flash'] })
        .correct,
    ).toBe(false);
  });
});

describe('sampling', () => {
  it('shuffles deterministically for a seed', () => {
    const first = shuffleWithSeed([1, 2, 3, 4, 5], 42);
    const second = shuffleWithSeed([1, 2, 3, 4, 5], 42);
    expect(first).toEqual(second);
    expect([...first].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('filters to a module and clamps the requested count', () => {
    const pool = [mcq, tf, fill, numeric, matching, ordering];
    const result = sampleQuestions(pool, 'm1', 100, 7);
    expect(result.available).toBe(6);
    expect(result.questions).toHaveLength(6);
    expect(result.clamped).toBe(true);
    expect(new Set(result.questions.map((question) => question.id)).size).toBe(6);
  });

  it('returns an empty list for a scope with no questions', () => {
    const result = sampleQuestions([mcq], 'm5', 10, 1);
    expect(result.questions).toHaveLength(0);
    expect(result.available).toBe(0);
  });
});

describe('attempts and weak topics', () => {
  const config: QuizConfig = { scope: 'm1', count: 2, feedback: 'end', selfPaced: false };

  function attemptFrom(answers: Map<string, { type: 'choice'; index: number }>) {
    const evaluations = new Map(
      [...answers].map(([id, answer]) => {
        const question = [mcq, tf].find((item) => item.id === id) as Question;
        return [id, evaluateAnswer(question, answer)];
      }),
    );
    return buildAttempt(config, { questions: [mcq, tf], answers, evaluations }, 1000, 2000);
  }

  it('builds an attempt with a score and missed topics', () => {
    const attempt = attemptFrom(
      new Map([
        ['q-mcq', { type: 'choice' as const, index: 1 }],
        ['q-tf', { type: 'choice' as const, index: 0 }],
      ]),
    );
    expect(attempt.total).toBe(2);
    expect(attempt.correct).toBe(1);
    expect(attempt.missedTopics).toEqual(['TF topic']);
    expect(attempt.feedback).toBe('end');
  });

  it('adds a missed question and removes it after a later correct answer', () => {
    const failed = attemptFrom(
      new Map([
        ['q-mcq', { type: 'choice' as const, index: 1 }],
        ['q-tf', { type: 'choice' as const, index: 0 }],
      ]),
    );
    expect(missedQuestionIds(failed)).toEqual(['q-tf']);

    const afterFail = addAttemptToStore({ attempts: [], missedQuestionIds: [] }, failed);
    expect(afterFail.missedQuestionIds).toEqual(['q-tf']);

    const repaired = buildAttempt(
      config,
      {
        questions: [mcq, tf],
        answers: new Map([
          ['q-mcq', { type: 'choice' as const, index: 1 }],
          ['q-tf', { type: 'boolean' as const, value: true }],
        ]),
        evaluations: new Map([
          ['q-mcq', evaluateAnswer(mcq, { type: 'choice', index: 1 })],
          ['q-tf', evaluateAnswer(tf, { type: 'boolean', value: true })],
        ]),
      },
      3000,
      4000,
    );
    const afterPass = addAttemptToStore(afterFail, repaired);
    expect(afterPass.missedQuestionIds).toEqual([]);
    expect(afterPass.attempts[0]).toBe(repaired);
  });

  it('ranks topics by misses', () => {
    const attempts: QuizAttempt[] = [
      {
        id: 'a',
        scope: 'm1',
        startedAt: 1,
        total: 2,
        correct: 0,
        missedTopics: ['A', 'B'],
        feedback: 'end',
        answers: [
          {
            questionId: 'q-mcq',
            correct: false,
            response: 'A',
            topic: 'B',
            moduleId: 'm1',
            answeredAt: 1,
          },
          {
            questionId: 'q-tf',
            correct: false,
            response: 'False',
            topic: 'B',
            moduleId: 'm1',
            answeredAt: 1,
          },
        ],
      },
    ];
    const weak = getWeakTopics(attempts);
    expect(weak[0].topic).toBe('B');
    expect(weak[0].misses).toBe(2);
  });

  it('summarizes averages and the best score', () => {
    const attempts = [
      { ...attemptFrom(new Map()), total: 2, correct: 1 },
      { ...attemptFrom(new Map()), total: 4, correct: 4 },
    ] as QuizAttempt[];
    const summary = summarizeAttempts(attempts);
    expect(summary.attempts).toBe(2);
    expect(summary.totalQuestions).toBe(6);
    expect(summary.totalCorrect).toBe(5);
    expect(summary.averagePercent).toBeCloseTo(75, 10);
    expect(summary.bestPercent).toBe(100);
  });

  it('handles an empty attempt list', () => {
    const summary = summarizeAttempts([]);
    expect(summary.averagePercent).toBeNull();
    expect(summary.lastAttempt).toBeNull();
  });
});
