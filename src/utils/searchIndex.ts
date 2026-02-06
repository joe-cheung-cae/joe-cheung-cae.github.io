import MiniSearch from 'minisearch';

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  language?: string;
  slug: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  language?: string;
  match: string;
  score: number;
}

/**
 * Create a MiniSearch instance with blog post documents
 * @param documents - Array of search documents
 * @returns MiniSearch instance
 */
export function createSearchIndex(documents: SearchDocument[]): MiniSearch<SearchDocument> {
  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ['title', 'description', 'content', 'tags', 'language'],
    storeFields: ['title', 'description', 'slug', 'tags', 'language'],
    searchOptions: {
      boost: { title: 3, description: 2, tags: 2, language: 1.5 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  miniSearch.addAll(documents);
  return miniSearch;
}

/**
 * Search the index and return formatted results
 * @param miniSearch - MiniSearch instance
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Array of search results
 */
export function search(
  miniSearch: MiniSearch<SearchDocument>,
  query: string,
  limit = 10
): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = miniSearch.search(query, { limit });

  return results.map((result) => ({
    id: result.id,
    title: result.title,
    description: result.description,
    slug: result.slug,
    tags: result.tags,
    language: result.language,
    match: result.terms.join(', '),
    score: result.score,
  }));
}

/**
 * Extract excerpt from content around search terms
 * @param content - Full content
 * @param query - Search query
 * @param maxLength - Maximum excerpt length
 * @returns Excerpt string
 */
export function extractExcerpt(
  content: string,
  query: string,
  maxLength = 150
): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return content.slice(0, maxLength).trim() + (content.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  let excerpt = content.slice(start, end);

  if (start > 0) {
    excerpt = '...' + excerpt;
  }
  if (end < content.length) {
    excerpt = excerpt + '...';
  }

  return excerpt;
}
