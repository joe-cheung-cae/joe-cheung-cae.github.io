export function countWords(markdown: string): number {
  if (!markdown || markdown.trim().length === 0) {
    return 0;
  }

  const cleanContent = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanContent) {
    return 0;
  }

  return cleanContent.split(/\s+/).filter((word) => word.length > 0).length;
}
