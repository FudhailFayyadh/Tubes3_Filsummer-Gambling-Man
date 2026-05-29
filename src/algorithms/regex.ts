import type { MatchResult } from '../types/index';
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


function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildKeywordPattern(keyword: string): string {
  const parts = keyword
    .toUpperCase()
    .split('')
    .map((ch) => VISUAL_SUBS[ch] ?? `[${escapeRegex(ch)}${escapeRegex(ch.toLowerCase())}]`);

  return parts.join('') + '\\d{2,4}';
}

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


  const catchAll = /\b([A-Za-zͰ-Ͽ][A-Za-z0-9Ͱ-Ͽ]{1,})\d{2,4}\b/g;
  const catchPositions: number[] = [];
  const catchTerms: string[] = [];
  let cm: RegExpExecArray | null;

  catchAll.lastIndex = 0;
  while ((cm = catchAll.exec(text)) !== null) {
    const word = cm[1].toUpperCase();
    if (!matchedWords.has(word)) {
      catchPositions.push(cm.index);
      const term = cm[0];
      if (!catchTerms.some((existing) => existing === term)) catchTerms.push(term);
    }
  }

  if (catchPositions.length > 0) {
    const preview = catchTerms.slice(0, 3).join(', ') + (catchTerms.length > 3 ? '...' : '');
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
