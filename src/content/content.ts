// ─── Member 2: Main Content Script ───────────────────────────────────────────
//
// Responsibilities:
//   1. Extract visible text from DOM nodes (walk text nodes, skip scripts/style)
//   2. Run KMP  → kmpSearchAllKeywords  (src/algorithms/kmp.ts)
//   3. Run BM   → bmSearchAllKeywords   (src/algorithms/boyerMoore.ts)
//   4. Run Regex→ regexSearch           (src/algorithms/regex.ts)
//   5. For keywords with 0 exact hits → run fuzzySearch (src/algorithms/fuzzy.ts)
//   6. Aggregate into ScanResult and save to chrome.storage.local
//   7. Highlight matching DOM elements  (implement in this file or highlight.ts)
//   8. Listen for { type: 'RESCAN' } from popup and repeat steps 1-7
//
// Keywords are loaded from keywords.txt via Vite's ?raw import below.
//
// HOW TO LOAD KEYWORDS (uncomment when implementing):
//   import keywordsRaw from '../../keywords/keywords.txt?raw';
//   const keywords = keywordsRaw
//     .split('\n')
//     .map(k => k.trim())
//     .filter(k => k.length > 0 && !k.startsWith('#'));
//
// HOW TO IMPORT ALGORITHMS (uncomment when implementing):
//   import { kmpSearchAllKeywords } from '../algorithms/kmp';
//   import { bmSearchAllKeywords }  from '../algorithms/boyerMoore';
//   import { regexSearch }          from '../algorithms/regex';
//   import { fuzzySearch }          from '../algorithms/fuzzy';

import type { ScanResult } from '../types/index';

const EMPTY_RESULT: ScanResult = {
  matches: [],
  algorithmStats: [],
  totalKeywordsFound: 0,
  timestamp: Date.now(),
};

// Push an empty result immediately so the popup never shows stale data.
chrome.storage.local.set({ scanResult: EMPTY_RESULT });

chrome.runtime.onMessage.addListener((message: { type: string }) => {
  if (message.type === 'RESCAN') {
    // TODO: Member 2 — trigger full scan pipeline here
    console.log('[Judol Detector] Rescan requested — implementation pending');
  }
});
