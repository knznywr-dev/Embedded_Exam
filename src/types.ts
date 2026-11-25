export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4a' | 'm4b' | 'm5';

export type ModuleKind = 'lecture' | 'lab' | 'reference';

export interface ModuleMeta {
  id: ModuleId;
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  pages: [number, number];
  kind: ModuleKind;
  accent: 'teal' | 'indigo' | 'amber' | 'rose' | 'red' | 'violet';
  priority?: boolean;
}

export type PageRef = number | number[];

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ListBlock {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export interface ParagraphBlock {
  type: 'p';
  text: string;
}

export interface CodeBlock {
  type: 'code';
  code: string;
  caption?: string;
  language?: string;
}

export interface CalloutBlock {
  type: 'callout';
  tone: 'info' | 'important' | 'warning' | 'lab' | 'note';
  title?: string;
  text?: string;
  items?: string[];
}

export interface DefinitionBlock {
  type: 'definition';
  term: string;
  text: string;
}

export interface StepsBlock {
  type: 'steps';
  title?: string;
  items: { title: string; text?: string }[];
  ordered?: boolean;
}

export interface CompareBlock {
  type: 'compare';
  leftTitle: string;
  rightTitle: string;
  rows: { label: string; left: string; right: string }[];
}

export interface FormulaBlock {
  type: 'formula';
  expression: string;
  caption?: string;
}

export type NoteBlock =
  | ParagraphBlock
  | ListBlock
  | TableBlock
  | CodeBlock
  | CalloutBlock
  | DefinitionBlock
  | StepsBlock
  | CompareBlock
  | FormulaBlock;

export interface NoteSection {
  id: string;
  moduleId: ModuleId;
  title: string;
  page: PageRef;
  summary?: string;
  blocks: NoteBlock[];
}

export interface FormulaDef {
  id: string;
  topic: string;
  expression: string;
  variables: string[];
  unit: string;
  page: PageRef;
  example?: string;
  note?: string;
  calculatorId: string;
}

export interface Flashcard {
  id: string;
  moduleId: ModuleId;
  topic: string;
  front: string;
  back: string;
  page: PageRef;
}

export type QuestionKind =
  | 'mcq'
  | 'tf'
  | 'fill'
  | 'numeric'
  | 'matching'
  | 'ordering'
  | 'code'
  | 'lab';

interface QuestionBase {
  id: string;
  moduleId: ModuleId;
  topic: string;
  prompt: string;
  explanation: string;
  page: PageRef;
  reviewNoteId: string;
}

export interface McqQuestion extends QuestionBase {
  kind: 'mcq' | 'code' | 'lab';
  options: string[];
  answer: number;
  snippet?: string;
  snippetCaption?: string;
}

export interface TrueFalseQuestion extends QuestionBase {
  kind: 'tf';
  answer: boolean;
}

export interface FillQuestion extends QuestionBase {
  kind: 'fill';
  accepted: string[];
  placeholder?: string;
}

export interface NumericQuestion extends QuestionBase {
  kind: 'numeric';
  answer: number;
  tolerance: number;
  unit: string;
  placeholder?: string;
}

export interface MatchingQuestion extends QuestionBase {
  kind: 'matching';
  left: { id: string; label: string }[];
  right: string[];
  correct: Record<string, string>;
}

export interface OrderingQuestion extends QuestionBase {
  kind: 'ordering';
  items: string[];
}

export type Question =
  | McqQuestion
  | TrueFalseQuestion
  | FillQuestion
  | NumericQuestion
  | MatchingQuestion
  | OrderingQuestion;

export type QuizScope = 'mixed' | ModuleId;

export interface QuizConfig {
  scope: QuizScope;
  count: number;
  feedback: 'immediate' | 'end';
  selfPaced: boolean;
}

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  response: string;
  topic: string;
  moduleId: ModuleId;
  answeredAt: number;
}

export interface QuizAttempt {
  id: string;
  scope: QuizScope;
  startedAt: number;
  finishedAt?: number;
  total: number;
  correct: number;
  missedTopics: string[];
  answers: AnswerRecord[];
  feedback: 'immediate' | 'end';
}

export interface StudyProgress {
  completedModules: ModuleId[];
  lastRoute: string;
  lastVisitedAt: number | null;
}

export type FlashcardStatus = 'known' | 'review';
export type FlashcardMap = Record<string, FlashcardStatus>;

export interface StoredQuizData {
  attempts: QuizAttempt[];
  missedQuestionIds: string[];
}

export interface SearchEntry {
  id: string;
  type: 'note' | 'formula' | 'lab' | 'question' | 'term';
  title: string;
  snippet: string;
  page: PageRef;
  route: string;
  moduleId?: ModuleId;
  keywords?: string;
}
