import type { MatchResult } from '../types/index';

/**
 * Visual look-alike substitutions.
 * Maps an uppercase letter to a regex character class that also matches
 * common visual replacements used to obfuscate gambling keywords.
 * e.g. "GACOR" → may appear as "G4C0R", "GΑC0R", etc.
 */
const VISUAL_SUBS: Readonly<Record<string, string>> = {
  A: '[A4@ÀÁÂÃÄÅĀĂĄαΑ]',
  B: '[B8ß]',
  C: '[C(¢©Ç]',
  D: '[Dð]',
  E: '[E3ÈÉÊËĒĔĖĘĚεΕЕ]',
  F: '[Fƒ]',
  G: '[G6Ğ]',
  H: '[H#]',
  I: '[I1|!ÌÍÎÏĪĬĮİιΙ]',
  J: '[Jʝ]',
  K: '[Kκ]',
  L: '[L1|ŁλΛ]',
  M: '[MмМ]',
  N: '[NñŃŅŇηΗ]',
  O: '[O0ÒÓÔÕÖØŌŎŐοΟОо]',
  P: '[PрΡ]',
  Q: '[Qq]',
  R: '[RrŔŖŘρΡ]',
  S: '[S5$§ŚŜŞŠσΣ]',
  T: '[T7+ŢŤτΤ]',
  U: '[UÙÚÛÜŪŬŮŰŲΥ]',
  V: '[Vν]',
  W: '[Wω]',
  X: '[X×χΧ]',
  Y: '[YÝŶŸγΥ]',
  Z: '[Z2ŹŻŽζ]',
};

/**
 * Escapes special regex characters in a literal string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex pattern string for `keyword` that matches the keyword
 * (case-insensitive, with visual look-alike substitutions) followed by
 * 2–4 digits.  e.g. "GACOR" → "[G6][A4@...][C(...]...\d{2,4}"
 */
export function buildKeywordPattern(keyword: string): string {
  const parts = keyword
    .toUpperCase()
    .split('')
    .map((ch) => VISUAL_SUBS[ch] ?? `[${escapeRegex(ch)}${escapeRegex(ch.toLowerCase())}]`);

  return parts.join('') + '\\d{2,4}';
}

/**
 * Runs all keyword-based patterns plus a generic catch-all against `text`.
 * Returns one MatchResult per keyword that has at least one hit.
 *
 * Note: JS RegExp engine is permitted per spec.
 */
export function regexSearch(text: string, keywords: string[]): MatchResult[] {
  const start = performance.now();
  const results: MatchResult[] = [];
  const matchedWords = new Set<string>();

  for (const keyword of keywords) {
    const trimmed = keyword.trim();
    if (!trimmed) continue;

    const pattern = buildKeywordPattern(trimmed);
    const regex = new RegExp(pattern, 'g');

    const positions: number[] = [];
    let m: RegExpExecArray | null;
    regex.lastIndex = 0;
    while ((m = regex.exec(text)) !== null) {
      positions.push(m.index);
      matchedWords.add(trimmed.toUpperCase());
    }

    if (positions.length > 0) {
      results.push({
        keyword: trimmed,
        positions,
        count: positions.length,
        algorithm: 'Regex',
        executionTime: performance.now() - start,
      });
    }
  }

  // Generic catch-all: <word of 2+ letters><2-4 digits>
  // Catches obfuscated gambling terms not covered by keyword list.
  const catchAll = /\b([A-Za-zͰ-Ͽ][A-Za-z0-9Ͱ-Ͽ]{1,})\d{2,4}\b/g;
  const catchPositions: number[] = [];
  const catchTerms: string[] = [];
  let cm: RegExpExecArray | null;

  catchAll.lastIndex = 0;
  while ((cm = catchAll.exec(text)) !== null) {
    const word = cm[1].toUpperCase();
    if (!matchedWords.has(word)) {
      catchPositions.push(cm.index);
      if (!catchTerms.includes(cm[0])) catchTerms.push(cm[0]);
    }
  }

  if (catchPositions.length > 0) {
    const preview = catchTerms.slice(0, 3).join(', ') + (catchTerms.length > 3 ? '…' : '');
    results.push({
      keyword: `(catch-all: ${preview})`,
      positions: catchPositions,
      count: catchPositions.length,
      algorithm: 'Regex',
      executionTime: performance.now() - start,
    });
  }

  return results;
}
