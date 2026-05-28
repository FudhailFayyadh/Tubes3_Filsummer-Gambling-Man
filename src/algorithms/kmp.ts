import type { MatchResult } from '../types/index';

/**
 * Builds the KMP failure (prefix / border) function for a given pattern.
 * failure[i] = length of the longest proper prefix of pattern[0..i]
 * that is also a suffix.
 */
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

/**
 * Searches for all occurrences of `pattern` in `text` using KMP.
 * Returns every starting position (0-indexed) and the total comparison count.
 *
 * Restrictions: no string.includes / indexOf / built-in search used.
 */
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
    // Each iteration of this inner loop is one character comparison.
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
        // Mismatch: fall back using the failure function and retry same text[i].
        q = failure[q - 1];
      } else {
        // q === 0 and still no match; move to next text character.
        break;
      }
    }
  }

  return { positions, comparisons };
}

/**
 * Runs KMP for every keyword in the list against the given text.
 * Performs case-insensitive matching by uppercasing both sides.
 * Returns one MatchResult per keyword that has at least one hit.
 */
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
