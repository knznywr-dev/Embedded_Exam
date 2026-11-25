import type { SearchEntry } from '../types';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—−]/g, '-')
    .replace(/[^a-z0-9\s.+×*/^()_=-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

export function searchEntries(
  entries: SearchEntry[],
  query: string,
  limit = 24,
): SearchEntry[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  const normalizedQuery = normalize(trimmed);
  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of entries) {
    const title = normalize(entry.title);
    const snippet = normalize(entry.snippet);
    const keywords = normalize(entry.keywords ?? '');
    const haystack = `${title} ${snippet} ${keywords}`;
    if (!tokens.every((token) => haystack.includes(token))) continue;

    let score = 0;
    if (title === normalizedQuery) score += 120;
    if (title.includes(normalizedQuery)) score += 60;
    if (snippet.includes(normalizedQuery)) score += 24;
    if (keywords.includes(normalizedQuery)) score += 16;
    for (const token of tokens) {
      if (title.startsWith(token)) score += 18;
      else if (title.includes(token)) score += 12;
      if (snippet.includes(token)) score += 5;
      if (keywords.includes(token)) score += 3;
    }
    const typeBoost: Record<SearchEntry['type'], number> = {
      note: 12,
      formula: 10,
      lab: 8,
      question: 4,
      term: 6,
    };
    score += typeBoost[entry.type];
    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map((item) => item.entry);
}

export function highlightSnippet(snippet: string, query: string, maxLength = 160): string {
  const trimmed = snippet.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const index = trimmed.toLowerCase().indexOf(query.trim().toLowerCase());
  if (index < 0) return `${trimmed.slice(0, maxLength)}…`;
  const start = Math.max(0, index - 50);
  return `${start > 0 ? '…' : ''}${trimmed.slice(start, start + maxLength)}…`;
}
