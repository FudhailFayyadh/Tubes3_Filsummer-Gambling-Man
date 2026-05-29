import type { MatchResult } from '../types/index';

export function buildLastOccurrenceTable(pattern: string): Record<string, number> {
  const table: Record<string, number> = {};

  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
  }

  return table;
}

export function bmSearch(
  text: string,
  pattern: string,
): { positions: number[]; comparisons: number } {
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) return { positions: [], comparisons: 0 };

  const last = buildLastOccurrenceTable(pattern);
  const positions: number[] = [];
  let comparisons = 0;
  let shift = 0;

  while (shift <= n - m) {
    let j = m - 1;

    while (j >= 0) {
      comparisons++;
      if (pattern[j] !== text[shift + j]) break;
      j--;
    }

    if (j < 0) {
      positions.push(shift);
      shift += 1;
      continue;
    }

    const badChar = text[shift + j];
    const badCharIndex = last[badChar] ?? -1;
    shift += Math.max(1, j - badCharIndex);
  }

  return { positions, comparisons };
}

export function bmSearchAllKeywords(
  text: string,
  keywords: string[],
): MatchResult[] {
  const upperText = text.toUpperCase();
  const results: MatchResult[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim().toUpperCase();
    if (!pattern) continue;

    const start = performance.now();
    const { positions, comparisons } = bmSearch(upperText, pattern);
    const executionTime = performance.now() - start;

    if (positions.length > 0) {
      results.push({
        keyword,
        positions,
        count: positions.length,
        algorithm: 'BM',
        executionTime,
        comparisons,
      });
    }
  }

  return results;
}
