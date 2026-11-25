import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StudyDataProvider } from './state/StudyDataContext';
import { DashboardPage } from './pages/Dashboard';
import { NotesPage } from './pages/Notes';
import { ConceptLabPage } from './pages/ConceptLab';
import { FlashcardsPage } from './pages/Flashcards';
import { QuizPage } from './pages/Quiz';
import { FormulaPracticePage } from './pages/FormulaPractice';
import { ProgressPage } from './pages/Progress';
import { Link } from 'react-router-dom';
import { Icon } from './components/Icon';
import { EmptyState, PageHeader } from './components/ui';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
}

function NotFoundPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="404" title="Page not found" />
      <EmptyState
        icon="search"
        title="That page is not part of the reviewer"
        action={
          <Link className="btn btn-primary btn-small" to="/">
            <Icon name="home" size={15} /> Back to dashboard
          </Link>
        }
      >
        <p>Use the sidebar to open Study Notes, the Concept Lab, Flashcards, or the Quiz.</p>
      </EmptyState>
    </div>
  );
}

export default function App() {
  return (
    <StudyDataProvider>
      <HashRouter>
        <ScrollManager />
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/lab" element={<ConceptLabPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/formulas" element={<FormulaPracticePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StudyDataProvider>
  );
}
