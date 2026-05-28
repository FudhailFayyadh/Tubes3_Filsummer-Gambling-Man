import type { MatchResult } from '../types/index';

export function buildFailureFunction(pattern: string): number[] {
  const m = pattern.length;
  const failure = new Array<number>(m).fill(0);
  let k = 0;

  for (let q = 1; q < m; q++) {
    while (k > 0 && pattern[k] !== pattern[q]) {
      k = failure[k - 1];
    }
    if (pattern[k] === pattern[q]) {
      k++;
    }
    failure[q] = k;
  }

  return failure;
}

export function kmpSearch(
  text: string,
  pattern: string,
): { positions: number[]; comparisons: number } {
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) return { positions: [], comparisons: 0 };

  const failure = buildFailureFunction(pattern);
  const positions: number[] = [];
  let q = 0;
  let comparisons = 0;

  for (let i = 0; i < n; i++) {
    while (true) {
      comparisons++;
      if (pattern[q] === text[i]) {
        q++;
        if (q === m) {
          positions.push(i - m + 1);
          q = failure[q - 1];
        }
        break;
      } else if (q > 0) {
        q = failure[q - 1];
      } else {
        break;
      }
    }
  }

  return { positions, comparisons };
}

export function kmpSearchAllKeywords(
  text: string,
  keywords: string[],
): MatchResult[] {
  const upperText = text.toUpperCase();
  const results: MatchResult[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim().toUpperCase();
    if (!pattern) continue;

    const start = performance.now();
    const { positions, comparisons } = kmpSearch(upperText, pattern);
    const executionTime = performance.now() - start;

    if (positions.length > 0) {
      results.push({
        keyword,
        positions,
        count: positions.length,
        algorithm: 'KMP',
        executionTime,
        comparisons,
      });
    }
  }

  return results;
}
