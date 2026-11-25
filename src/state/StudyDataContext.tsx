import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  FlashcardMap,
  FlashcardStatus,
  ModuleId,
  QuizAttempt,
  StoredQuizData,
  StudyProgress,
} from '../types';
import {
  STORAGE_KEYS,
  clearStudyData,
  getBrowserStorage,
  loadFlashcards,
  loadProgress,
  loadQuizData,
  saveFlashcards,
  saveProgress,
  saveQuizData,
} from '../lib/storage';
import { addAttemptToStore } from '../lib/quiz';

interface StudyDataContextValue {
  progress: StudyProgress;
  flashcards: FlashcardMap;
  quizData: StoredQuizData;
  markModule: (moduleId: ModuleId, complete: boolean) => void;
  toggleModule: (moduleId: ModuleId) => void;
  setLastRoute: (route: string) => void;
  setFlashcardStatus: (cardId: string, status: FlashcardStatus | null) => void;
  resetFlashcards: () => void;
  recordAttempt: (attempt: QuizAttempt) => void;
  clearMissedQuestions: () => void;
  resetQuizHistory: () => void;
  resetAll: () => void;
}

const StudyDataContext = createContext<StudyDataContextValue | null>(null);

export function StudyDataProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StudyProgress>(() => loadProgress());
  const [flashcards, setFlashcards] = useState<FlashcardMap>(() => loadFlashcards());
  const [quizData, setQuizData] = useState<StoredQuizData>(() => loadQuizData());
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!hydrated.current) return;
    saveFlashcards(flashcards);
  }, [flashcards]);

  useEffect(() => {
    if (!hydrated.current) return;
    saveQuizData(quizData);
  }, [quizData]);

  useEffect(() => {
    const storage = getBrowserStorage();
    if (!storage || typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.progress) setProgress(loadProgress(storage));
      if (event.key === STORAGE_KEYS.flashcards) setFlashcards(loadFlashcards(storage));
      if (event.key === STORAGE_KEYS.quiz) setQuizData(loadQuizData(storage));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const markModule = useCallback((moduleId: ModuleId, complete: boolean) => {
    setProgress((current) => {
      const exists = current.completedModules.includes(moduleId);
      if (complete === exists) return current;
      return {
        ...current,
        completedModules: complete
          ? [...current.completedModules, moduleId]
          : current.completedModules.filter((id) => id !== moduleId),
      };
    });
  }, []);

  const toggleModule = useCallback((moduleId: ModuleId) => {
    setProgress((current) => {
      const exists = current.completedModules.includes(moduleId);
      return {
        ...current,
        completedModules: exists
          ? current.completedModules.filter((id) => id !== moduleId)
          : [...current.completedModules, moduleId],
      };
    });
  }, []);

  const setLastRoute = useCallback((route: string) => {
    setProgress((current) => {
      if (current.lastRoute === route && current.lastVisitedAt !== null) return current;
      return {
        ...current,
        lastRoute: route,
        lastVisitedAt: Date.now(),
      };
    });
  }, []);

  const setFlashcardStatus = useCallback((cardId: string, status: FlashcardStatus | null) => {
    setFlashcards((current) => {
      const next = { ...current };
      if (status === null) delete next[cardId];
      else next[cardId] = status;
      return next;
    });
  }, []);

  const resetFlashcards = useCallback(() => {
    setFlashcards({});
  }, []);

  const recordAttempt = useCallback((attempt: QuizAttempt) => {
    setQuizData((current) => addAttemptToStore(current, attempt));
  }, []);

  const clearMissedQuestions = useCallback(() => {
    setQuizData((current) => ({ ...current, missedQuestionIds: [] }));
  }, []);

  const resetQuizHistory = useCallback(() => {
    setQuizData({ attempts: [], missedQuestionIds: [] });
  }, []);

  const resetAll = useCallback(() => {
    clearStudyData();
    const freshProgress: StudyProgress = {
      completedModules: [],
      lastRoute: '/',
      lastVisitedAt: null,
    };
    setProgress(freshProgress);
    setFlashcards({});
    setQuizData({ attempts: [], missedQuestionIds: [] });
  }, []);

  const value = useMemo<StudyDataContextValue>(
    () => ({
      progress,
      flashcards,
      quizData,
      markModule,
      toggleModule,
      setLastRoute,
      setFlashcardStatus,
      resetFlashcards,
      recordAttempt,
      clearMissedQuestions,
      resetQuizHistory,
      resetAll,
    }),
    [
      progress,
      flashcards,
      quizData,
      markModule,
      toggleModule,
      setLastRoute,
      setFlashcardStatus,
      resetFlashcards,
      recordAttempt,
      clearMissedQuestions,
      resetQuizHistory,
      resetAll,
    ],
  );

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export function useStudyData(): StudyDataContextValue {
  const context = useContext(StudyDataContext);
  if (!context) throw new Error('useStudyData must be used inside StudyDataProvider');
  return context;
}
