import type { MatchResult } from '../types/index';

const SIMILAR_GROUPS = [
  'A4@',
  'B8',
  'E3',
  'G6',
  'I1!|',
  'L1|',
  'O0',
  'S5$',
  'T7+',
  'Z2',
];

function areVisuallySimilar(a: string, b: string): boolean {
  const left = a.toUpperCase();
  const right = b.toUpperCase();

  for (const group of SIMILAR_GROUPS) {
    let hasLeft = false;
    let hasRight = false;

    for (const ch of group) {
      if (ch === left) hasLeft = true;
      if (ch === right) hasRight = true;
    }

    if (hasLeft && hasRight) return true;
  }

  return false;
}

function substitutionCost(a: string, b: string): number {
  if (a.toUpperCase() === b.toUpperCase()) return 0;
  return areVisuallySimilar(a, b) ? 0.2 : 1;
}

function tokenize(text: string): Array<{ value: string; position: number }> {
  const tokens: Array<{ value: string; position: number }> = [];
  const regex = /[A-Za-z0-9\u00C0-\uFFFF]+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    tokens.push({ value: match[0], position: match.index });
  }

  return tokens;
}

export function weightedLevenshtein(a: string, b: string): number {
  const left = a.toUpperCase();
  const right = b.toUpperCase();
  const rows = left.length + 1;
  const cols = right.length + 1;
  const dp = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const remove = dp[i - 1][j] + 1;
      const insert = dp[i][j - 1] + 1;
      const replace = dp[i - 1][j - 1] + substitutionCost(left[i - 1], right[j - 1]);
      dp[i][j] = Math.min(remove, insert, replace);
    }
  }

  return dp[left.length][right.length];
}

export function fuzzySearch(
  text: string,
  keywords: string[],
  threshold: number,
): MatchResult[] {
  const tokens = tokenize(text);
  const results: MatchResult[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim();
    if (!pattern) continue;

    const start = performance.now();
    const positions: number[] = [];
    let bestSimilarity = 0;

    for (const token of tokens) {
      const maxLength = Math.max(pattern.length, token.value.length);
      if (maxLength === 0) continue;
      if (Math.abs(pattern.length - token.value.length) > Math.max(2, pattern.length * threshold)) {
        continue;
      }

      const distance = weightedLevenshtein(pattern, token.value);
      const normalizedDistance = distance / maxLength;

      if (normalizedDistance <= threshold && normalizedDistance > 0) {
        positions.push(token.position);
        bestSimilarity = Math.max(bestSimilarity, 1 - normalizedDistance);
      }
    }

    const executionTime = performance.now() - start;

    if (positions.length > 0) {
      results.push({
        keyword: pattern,
        positions,
        count: positions.length,
        algorithm: 'Fuzzy',
        executionTime,
        isFuzzy: true,
        similarity: bestSimilarity,
      });
    }
  }

  return results;
}
