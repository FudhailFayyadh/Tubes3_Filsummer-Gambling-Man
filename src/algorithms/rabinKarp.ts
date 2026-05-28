import type { MatchResult } from '../types/index';

const BASE = 31;
const MOD = 1_000_000_007;

function charVal(c: string): number {
  return c.charCodeAt(0);
}

function modMul(a: number, b: number): number {
  return Number(BigInt(a) * BigInt(b) % BigInt(MOD));
}

function modAdd(a: number, b: number): number {
  return (a + b) % MOD;
}

function computeInitialHash(text: string, start: number, len: number): number {
  let h = 0;
  for (let i = 0; i < len; i++) {
    h = modAdd(modMul(h, BASE), charVal(text[start + i]));
  }
  return h;
}

export function rbSearch(
  text: string,
  pattern: string,
): { positions: number[]; comparisons: number; hashComparisons: number } {
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) return { positions: [], comparisons: 0, hashComparisons: 0 };

  // h = BASE^(m-1) mod MOD
  let h = 1;
  for (let i = 0; i < m - 1; i++) h = modMul(h, BASE);

  const patternHash = computeInitialHash(pattern, 0, m);
  let windowHash = computeInitialHash(text, 0, m);

  const positions: number[] = [];
  let comparisons = 0;
  let hashComparisons = 0;

  for (let i = 0; i <= n - m; i++) {
    if (i > 0) {
      // Rolling hash: remove leading char, add new trailing char
      windowHash = modAdd(
        modMul(
          modAdd(windowHash - modMul(charVal(text[i - 1]), h) + MOD, 0),
          BASE,
        ),
        charVal(text[i + m - 1]),
      );
    }

    hashComparisons++;
    if (windowHash === patternHash) {
      // Verify to rule out hash collisions
      let match = true;
      for (let j = 0; j < m; j++) {
        comparisons++;
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) positions.push(i);
    }
  }

  return { positions, comparisons, hashComparisons };
}

export function rbSearchAllKeywords(
  text: string,
  keywords: string[],
): MatchResult[] {
  const upperText = text.toUpperCase();
  const results: MatchResult[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim().toUpperCase();
    if (!pattern) continue;

    const start = performance.now();
    const { positions, comparisons } = rbSearch(upperText, pattern);
    const executionTime = performance.now() - start;

    if (positions.length > 0) {
      results.push({
        keyword,
        positions,
        count: positions.length,
        algorithm: 'RK',
        executionTime,
        comparisons,
      });
    }
  }

  return results;
}
