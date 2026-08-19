export const HOMEPAGE_NOTES_PRIMARY_FAMILY = 'Comic Code';

export const HOMEPAGE_NOTES_CSS_PROPERTY = '--homepage-notes-font-family';

export const HOMEPAGE_NOTES_FONT_STACK =
  "'Comic Code', ui-monospace, monospace, system-ui, sans-serif";

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

export function isComicCodePrimary(stack: string): boolean {
  return primaryFontFamily(stack) === HOMEPAGE_NOTES_PRIMARY_FAMILY;
}

export function homepageNotesInlineStyle(): string {
  return `${HOMEPAGE_NOTES_CSS_PROPERTY}: ${HOMEPAGE_NOTES_FONT_STACK}`;
}

export function homepageNotesFontFaceCss(): string {
  return [
    '@font-face {',
    `  font-family: '${HOMEPAGE_NOTES_PRIMARY_FAMILY}';`,
    "  src: local('Comic Code'), local('ComicCode');",
    '  font-style: normal;',
    '  font-weight: 100 900;',
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

export function extractFontFaceFamilyAndLocals(
  css: string
): Array<{ family: string; locals: string[] }> {
  const faces: Array<{ family: string; locals: string[] }> = [];
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
    if (family) {
      faces.push({ family, locals });
    }
  }

  return faces;
}

export function comicCodeFontFaceIsDeclared(css: string): boolean {
  return extractFontFaceFamilyAndLocals(css).some(
    (face) =>
      face.family === HOMEPAGE_NOTES_PRIMARY_FAMILY &&
      face.locals.includes(HOMEPAGE_NOTES_PRIMARY_FAMILY)
  );
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
