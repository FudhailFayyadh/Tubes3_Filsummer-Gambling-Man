import type { MatchResult } from '../types/index';

// ─── Member 2: implement Boyer-Moore from scratch ────────────────────────────
//
// Required components (per spec):
//   • Last-occurrence table (bad-character heuristic)
//   • Right-to-left scanning of pattern against text window
//   • Shifting process using last-occurrence table
//   • Comparison counting
//   • NO string.includes / indexOf / built-in search
//
// Function signatures below must remain unchanged so content.ts can call them.

/**
 * Builds the last-occurrence table for `pattern`.
 * Returns a map from character → last index in pattern (-1 if absent).
 */
export function buildLastOccurrenceTable(
  _pattern: string,
): Record<string, number> {
  throw new Error('Boyer-Moore buildLastOccurrenceTable — not implemented (Member 2)');
}

/**
 * Searches for all occurrences of `pattern` in `text` using Boyer-Moore.
 * Returns starting positions (0-indexed) and total comparison count.
 */
export function bmSearch(
  _text: string,
  _pattern: string,
): { positions: number[]; comparisons: number } {
  throw new Error('Boyer-Moore bmSearch — not implemented (Member 2)');
}

/**
 * Runs Boyer-Moore for every keyword against the text (case-insensitive).
 * Returns one MatchResult per keyword that has at least one hit.
 */
export function bmSearchAllKeywords(
  _text: string,
  _keywords: string[],
): MatchResult[] {
  throw new Error('Boyer-Moore bmSearchAllKeywords — not implemented (Member 2)');
}
