export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract table of contents from markdown content
 * @param content - Markdown content
 * @returns Array of TOC items
 */
export function extractTOC(content: string): TOCItem[] {
  const toc: TOCItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Generate slug from heading text
 * @param text - Heading text
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
