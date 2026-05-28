import type { MatchResult } from '../types/index';

// ─── Member 2: implement Weighted Levenshtein Distance ───────────────────────
//
// Requirements (per spec):
//   • Weighted substitution costs: lower penalty for visually similar chars
//     e.g. O↔0, A↔4, I↔1 should cost ~0.1 instead of 1.0
//   • Threshold: reject matches above a similarity threshold to avoid FP
//   • Called ONLY for keywords that got 0 hits from exact (KMP/BM) matching
//   • Tokenise DOM text into words before comparison
//
// Formula: standard Levenshtein DP with per-pair substitution weights.

/**
 * Computes the Weighted Levenshtein Distance between strings `a` and `b`.
 * Visually similar character pairs receive a smaller substitution cost.
 */
export function weightedLevenshtein(_a: string, _b: string): number {
  throw new Error('Fuzzy weightedLevenshtein — not implemented (Member 2)');
}

/**
 * Searches `text` for tokens similar to any keyword using Weighted Levenshtein.
 * Only called for keywords that had zero exact-match hits.
 * `threshold` (0–1): maximum normalised distance to accept as a match.
 */
export function fuzzySearch(
  _text: string,
  _keywords: string[],
  _threshold: number,
): MatchResult[] {
  throw new Error('Fuzzy fuzzySearch — not implemented (Member 2)');
}
