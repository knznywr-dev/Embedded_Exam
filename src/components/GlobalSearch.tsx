import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { SourceRef } from './ui';
import { SEARCH_ENTRIES, SEARCH_TYPE_LABELS } from '../data/searchIndex';
import { searchEntries } from '../lib/search';

const typeIcon = {
  note: 'notes',
  formula: 'formula',
  lab: 'flask',
  question: 'quiz',
  term: 'book',
} as const;

export function GlobalSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const results = useMemo(() => searchEntries(SEARCH_ENTRIES, query, 18), [query]);

  useEffect(() => {
    setOpen(false);
    setActiveIndex(0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [open]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const choose = (route: string) => {
    setOpen(false);
    setQuery('');
    navigate(route);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, Math.max(0, results.length - 1)));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }
    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex].route);
    }
  };

  return (
    <div className="global-search" ref={containerRef}>
      <div className={`search-field ${open ? 'is-open' : ''}`}>
        <Icon name="search" size={18} />
        <input
          ref={inputRef}
          id="global-search-input"
          type="search"
          value={query}
          placeholder="Search notes, formulas, labs, questions…"
          aria-label="Search the reviewer"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="global-search-results"
          aria-activedescendant={
            open && results[activeIndex] ? `search-result-${results[activeIndex].id}` : undefined
          }
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setOpen(false);
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={15} />
          </button>
        ) : (
          <kbd className="search-kbd">/</kbd>
        )}
      </div>

      {open && query.trim() ? (
        <div className="search-results" id="global-search-results">
          {results.length === 0 ? (
            <div className="search-empty">
              <Icon name="search" size={20} />
              <p>
                No matches for <strong>{query}</strong>.
              </p>
              <span>Try a topic, function, pin, formula, or lab component.</span>
            </div>
          ) : (
            <>
              <div className="search-results-head">
                <span>{results.length} local results</span>
                <span>Searches only this reviewer</span>
              </div>
              <ul role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                  <li key={result.id} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      id={`search-result-${result.id}`}
                      className={`search-result ${index === activeIndex ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(result.route)}
                    >
                      <span className={`search-result-icon type-${result.type}`}>
                        <Icon name={typeIcon[result.type]} size={16} />
                      </span>
                      <span className="search-result-copy">
                        <span className="search-result-top">
                          <strong>{result.title}</strong>
                          <span className="search-type">{SEARCH_TYPE_LABELS[result.type]}</span>
                        </span>
                        <span className="search-result-snippet">{result.snippet}</span>
                        <SourceRef page={result.page} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
