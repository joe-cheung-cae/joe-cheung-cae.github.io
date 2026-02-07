import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import type { SearchResult } from '@/utils/searchIndex';

interface SearchDocument {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  language?: string;
}

interface SearchModalProps {
  searchIndex: SearchDocument[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function SearchModal({ searchIndex }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Simple search function
  const search = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const scored = searchIndex
      .map((doc) => {
        let score = 0;
        const matches: string[] = [];

        // Title match (highest weight)
        if (doc.title.toLowerCase().includes(query)) {
          score += 10;
          matches.push('title');
        }

        // Description match
        if (doc.description.toLowerCase().includes(query)) {
          score += 5;
          matches.push('description');
        }

        // Tags match
        if (doc.tags.some((tag) => tag.toLowerCase().includes(query))) {
          score += 3;
          matches.push('tags');
        }

        // Language match
        if (doc.language?.toLowerCase().includes(query)) {
          score += 2;
          matches.push('language');
        }

        return {
          ...doc,
          score,
          match: matches.join(', '),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return scored;
  }, [searchIndex]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-search', handleOpen);
    return () => window.removeEventListener('open-search', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const searchResults = search(query);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, search]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    const controlKeys = new Set(['Escape', 'ArrowDown', 'ArrowUp', 'Enter']);
    if (!controlKeys.has(e.key) && (e.isComposing || (e as KeyboardEvent & { keyCode?: number }).keyCode === 229)) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      return;
    }

    if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = `/blog/${results[selectedIndex].slug}`;
    }
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!resultsRef.current || results.length === 0) return;

    const selectedItem = resultsRef.current.querySelectorAll('ul li a')[selectedIndex] as HTMLElement | undefined;
    selectedItem?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, results.length]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
    >
      <div className="w-full max-w-2xl mx-4 bg-notion-bg dark:bg-notion-bg-dark rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-notion-border dark:border-notion-border-dark">
          <svg className="w-5 h-5 text-notion-text dark:text-notion-text-dark/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="Search posts, tags, or languages..."
            className="flex-1 bg-transparent text-notion-text dark:text-notion-text-dark placeholder:text-notion-text dark:placeholder:text-notion-text-dark/50 focus:outline-none text-lg"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono bg-notion-gray dark:bg-notion-gray-dark rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {query.length > 0 && results.length === 0 ? (
            <div className="px-4 py-8 text-center text-notion-text dark:text-notion-text-dark/60">
              No results found for "{query}"
            </div>
          ) : (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={result.id}>
                  <a
                    href={`/blog/${result.slug}`}
                    className={`block px-4 py-3 mx-2 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-notion-blue-light dark:bg-blue-900/30'
                        : 'hover:bg-notion-gray dark:hover:bg-notion-gray-dark'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-notion-text dark:text-notion-text-dark truncate">
                          {highlightMatch(result.title, query)}
                        </h3>
                        <p className="text-sm text-notion-text dark:text-notion-text-dark/60 line-clamp-1 mt-0.5">
                          {result.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {result.language && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-notion-blue-light dark:bg-blue-900/30 text-notion-blue">
                            {result.language}
                          </span>
                        )}
                        {result.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="hidden sm:inline-block px-2 py-0.5 text-xs rounded-full bg-notion-gray dark:bg-notion-gray-dark text-notion-text dark:text-notion-text-dark/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-notion-text dark:text-notion-text-dark/50 border-t border-notion-border dark:border-notion-border-dark bg-notion-gray/50 dark:bg-notion-gray-dark/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-notion-bg dark:bg-notion-bg-dark rounded">↑↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-notion-bg dark:bg-notion-bg-dark rounded">↵</kbd>
              to select
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
