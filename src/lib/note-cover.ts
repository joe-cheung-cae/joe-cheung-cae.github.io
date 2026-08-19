export type CoverStops = {
  start: string;
  mid: string;
  end: string;
};

export function hashString(slug: string): number {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hexChannel(value: number): string {
  return value.toString(16).padStart(2, '0');
}

function hexColor(r: number, g: number, b: number): string {
  return `#${hexChannel(r)}${hexChannel(g)}${hexChannel(b)}`;
}

function tone(hash: number, shift: number, min: number, span: number): number {
  return min + ((hash >>> shift) % (span + 1));
}

export function coverStops(slug: string): CoverStops {
  const hash = hashString(slug);
  return {
    start: hexColor(tone(hash, 0, 92, 78), tone(hash, 8, 68, 72), tone(hash, 16, 48, 70)),
    mid: hexColor(tone(hash, 4, 124, 78), tone(hash, 12, 88, 80), tone(hash, 20, 64, 82)),
    end: hexColor(tone(hash, 2, 36, 58), tone(hash, 10, 42, 56), tone(hash, 18, 46, 68)),
  };
}
