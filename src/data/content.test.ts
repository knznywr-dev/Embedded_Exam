import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { FLASHCARDS } from './flashcards';
import { NOTE_SECTION_MAP, NOTE_SECTIONS } from './notes';
import { FORMULAS } from './formulas';
import { MODULE_IDS } from './modules';

describe('reviewer content integrity', () => {
  it('has enough grounded questions and covers every module', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(QUESTIONS.length);
    for (const moduleId of MODULE_IDS) {
      expect(QUESTIONS.some((question) => question.moduleId === moduleId)).toBe(true);
    }
  });

  it('keeps every question linked to an existing note section', () => {
    const missing = QUESTIONS.filter((question) => !NOTE_SECTION_MAP[question.reviewNoteId]);
    expect(missing.map((question) => `${question.id} → ${question.reviewNoteId}`)).toEqual([]);
  });

  it('keeps answer indexes and accepted answers valid', () => {
    for (const question of QUESTIONS) {
      if (question.kind === 'mcq' || question.kind === 'code' || question.kind === 'lab') {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
      }
      if (question.kind === 'fill') {
        expect(question.accepted.length).toBeGreaterThan(0);
      }
      if (question.kind === 'ordering') {
        expect(new Set(question.items).size).toBe(question.items.length);
      }
      if (question.kind === 'matching') {
        for (const item of question.left) {
          expect(question.right).toContain(question.correct[item.id]);
        }
      }
    }
  });

  it('has a flashcard for every module and unique ids', () => {
    expect(new Set(FLASHCARDS.map((card) => card.id)).size).toBe(FLASHCARDS.length);
    for (const moduleId of MODULE_IDS) {
      expect(FLASHCARDS.some((card) => card.moduleId === moduleId)).toBe(true);
    }
  });

  it('lists the ten formulas and keeps each linked to a calculator', () => {
    expect(FORMULAS).toHaveLength(10);
    expect(FORMULAS.every((formula) => formula.calculatorId.length > 0)).toBe(true);
    expect(new Set(FORMULAS.map((formula) => formula.calculatorId)).size).toBe(FORMULAS.length);
  });

  it('has note sections for all six modules with source pages', () => {
    expect(NOTE_SECTIONS.length).toBeGreaterThan(20);
    for (const moduleId of MODULE_IDS) {
      expect(NOTE_SECTIONS.some((section) => section.moduleId === moduleId)).toBe(true);
    }
    expect(NOTE_SECTIONS.every((section) => section.page !== undefined)).toBe(true);
  });
});
