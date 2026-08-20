export const HOMEPAGE_NOTES_PRIMARY_FAMILY = 'Maple Mono NF CN';

export const HOMEPAGE_NOTES_CSS_PROPERTY = '--homepage-notes-font-family';

export const HOMEPAGE_NOTES_WOFF2_FILE = 'MapleMono-NF-CN-Regular.woff2';

export const HOMEPAGE_NOTES_WOFF2_PATH = `/fonts/${HOMEPAGE_NOTES_WOFF2_FILE}`;

export const HOMEPAGE_NOTES_FONT_STACK =
  "'Maple Mono NF CN', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

export const HOMEPAGE_NOTES_LIGATURE_FEATURES =
  '"calt" 1, "liga" 1, "clig" 1, "dlig" 1, "ss03" 1, "ss07" 1, "ss08" 1, "ss09" 1, "ss10" 1, "ss11" 1, "kern" 1';

export const HOMEPAGE_NOTES_FONT_RELEASE = {
  source: 'https://github.com/subframe7536/maple-font',
  tag: 'v7.9',
  zip: 'MapleMono-NF-CN.zip',
  zipBytes: 159498447,
  ttf: 'MapleMono-NF-CN-Regular.ttf',
  license: 'OFL-1.1',
} as const;

export function parseFontFamilyStack(stack: string): string[] {
  const families: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (const char of stack) {
    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === ',') {
      const family = current.trim();
      if (family) families.push(family);
      current = '';
      continue;
    }

    current += char;
  }

  const last = current.trim();
  if (last) families.push(last);
  return families;
}

export function primaryFontFamily(stack: string): string {
  const first = parseFontFamilyStack(stack)[0];
  if (!first) {
    throw new Error('font-family stack has no primary family');
  }
  return first;
}

export function isHomepageNotesPrimary(stack: string): boolean {
  return primaryFontFamily(stack) === HOMEPAGE_NOTES_PRIMARY_FAMILY;
}

export function homepageNotesInlineStyle(): string {
  return `${HOMEPAGE_NOTES_CSS_PROPERTY}: ${HOMEPAGE_NOTES_FONT_STACK}`;
}

export function homepageNotesFontFaceCss(): string {
  return [
    '@font-face {',
    `  font-family: '${HOMEPAGE_NOTES_PRIMARY_FAMILY}';`,
    `  src: url('${HOMEPAGE_NOTES_WOFF2_PATH}') format('woff2');`,
    '  font-style: normal;',
    '  font-weight: 400;',
    '  font-display: swap;',
    '}',
  ].join('\n');
}

export function extractCssVarFontFallback(css: string, property: string): string {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`var\\(\\s*${escaped}\\s*,\\s*([^)]+)\\)`, 'i'));
  const fallback = match?.[1]?.trim();
  if (!fallback) {
    throw new Error(`No CSS var fallback for ${property}`);
  }
  return fallback;
}

export type FontFaceDeclaration = {
  family: string;
  locals: string[];
  urls: string[];
  formats: string[];
  display: string | null;
};

export function extractFontFaceDeclarations(css: string): FontFaceDeclaration[] {
  const faces: FontFaceDeclaration[] = [];
  const faceRe = /@font-face\s*\{([^}]+)\}/gi;

  for (let match = faceRe.exec(css); match; match = faceRe.exec(css)) {
    const body = match[1] ?? '';
    const familyMatch = body.match(/font-family\s*:\s*(?:['"]([^'"]+)['"]|([^;,\s]+))/i);
    const family = (familyMatch?.[1] ?? familyMatch?.[2] ?? '').trim();
    const locals: string[] = [];
    const localRe = /local\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    for (let localMatch = localRe.exec(body); localMatch; localMatch = localRe.exec(body)) {
      const name = localMatch[1]?.trim();
      if (name) locals.push(name);
    }
    const urls: string[] = [];
    const urlRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    for (let urlMatch = urlRe.exec(body); urlMatch; urlMatch = urlRe.exec(body)) {
      const url = urlMatch[1]?.trim();
      if (url) urls.push(url);
    }
    const formats: string[] = [];
    const formatRe = /format\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    for (let formatMatch = formatRe.exec(body); formatMatch; formatMatch = formatRe.exec(body)) {
      const format = formatMatch[1]?.trim();
      if (format) formats.push(format);
    }
    const display = body.match(/font-display\s*:\s*([^;]+)/i)?.[1]?.trim() ?? null;
    if (family) {
      faces.push({ family, locals, urls, formats, display });
    }
  }

  return faces;
}

export function extractFontFaceFamilyAndLocals(
  css: string
): Array<{ family: string; locals: string[] }> {
  return extractFontFaceDeclarations(css).map(({ family, locals }) => ({ family, locals }));
}

export function mapleMonoNfCnFontFaceIsDeclared(css: string): boolean {
  return extractFontFaceDeclarations(css).some(
    (face) =>
      face.family === HOMEPAGE_NOTES_PRIMARY_FAMILY &&
      face.urls.some((url) => url.includes(HOMEPAGE_NOTES_WOFF2_FILE)) &&
      face.formats.includes('woff2') &&
      face.display === 'swap' &&
      face.locals.length === 0
  );
}

export function cssUsesComicCodeLocal(css: string): boolean {
  return /local\(\s*['"]?Comic\s*Code['"]?\s*\)/i.test(css);
}

export function homepageNotesCssTargetsBothLangs(css: string): boolean {
  const ruleRe = /\.homepage-notes[^{]*\{[^}]+\}/g;
  const rules = css.match(ruleRe) ?? [];
  return rules.some((rule) => {
    const hasFamily = /font-family\s*:/.test(rule);
    const hasEn = /\.i18n-en/.test(rule);
    const hasZh = /\.i18n-zh/.test(rule);
    return hasFamily && hasEn && hasZh;
  });
}

export function homepageNotesLigatureFeatureSettings(): string {
  return HOMEPAGE_NOTES_LIGATURE_FEATURES;
}

export function cssEnablesMapleMonoLigatures(css: string): boolean {
  const ruleRe = /\.homepage-notes[^{]*\{[^}]+\}/g;
  const rules = css.match(ruleRe) ?? [];
  return rules.some((rule) => {
    const features = rule.match(/font-feature-settings\s*:\s*([^;]+)/i)?.[1] ?? '';
    const hasCaltOn = /["']calt["']\s*1/.test(features);
    const hasLigaOn = /["']liga["']\s*1/.test(features);
    const hasEn = /\.i18n-en/.test(rule);
    const hasZh = /\.i18n-zh/.test(rule);
    return hasCaltOn && hasLigaOn && hasEn && hasZh;
  });
}

export function mapleMonoCodeSnippetCss(): string {
  return [
    '.prose-custom pre,',
    '.prose-custom :not(pre) > code,',
    '.astro-code,',
    '.astro-code code,',
    '.astro-code span {',
    `  font-family: ${HOMEPAGE_NOTES_FONT_STACK};`,
    '  font-variant-ligatures: common-ligatures discretionary-ligatures contextual;',
    `  font-feature-settings: ${HOMEPAGE_NOTES_LIGATURE_FEATURES};`,
    '}',
  ].join('\n');
}

export function cssAppliesMapleMonoToCodeSnippets(css: string): boolean {
  const hasAstro = /\.astro-code/.test(css);
  const hasFamily = /font-family\s*:[^;]*Maple Mono NF CN/.test(css);
  const hasCalt = /font-feature-settings\s*:[^;]*["']calt["']\s*1/.test(css);
  return hasAstro && hasFamily && hasCalt;
}
