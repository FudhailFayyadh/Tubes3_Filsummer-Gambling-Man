import { bmSearchAllKeywords } from '../algorithms/boyerMoore';
import { fuzzySearch } from '../algorithms/fuzzy';
import { kmpSearchAllKeywords } from '../algorithms/kmp';
import { regexSearch } from '../algorithms/regex';
import type { AlgorithmStats, MatchResult, ScanResult } from '../types/index';
import keywordsRaw from '../../keywords/keywords.txt?raw';

type TextPart = {
  node: Text;
  text: string;
  start: number;
  end: number;
};

type HighlightRange = {
  node: Text;
  start: number;
  end: number;
  matches: MatchResult[];
};

const keywords = keywordsRaw
  .split('\n')
  .map((keyword) => keyword.trim())
  .filter((keyword) => keyword.length > 0 && !keyword.startsWith('#'));

const algorithms: Array<AlgorithmStats['algorithm']> = ['KMP', 'BM', 'Regex', 'Fuzzy'];
const highlightClass = 'judol-detector-highlight';
const tooltipClass = 'judol-detector-tooltip';
const fuzzyThreshold = 0.3;

function isIgnoredElement(element: Element): boolean {
  const tag = element.tagName.toLowerCase();
  return (
    tag === 'script' ||
    tag === 'style' ||
    tag === 'noscript' ||
    tag === 'textarea' ||
    tag === 'input' ||
    element.classList.contains(highlightClass) ||
    element.classList.contains(tooltipClass)
  );
}

function isVisibleElement(element: Element): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function collectTextParts(): { text: string; parts: TextPart[] } {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const value = node.nodeValue ?? '';

      if (!parent || value.trim().length === 0) return NodeFilter.FILTER_REJECT;
      if (isIgnoredElement(parent) || !isVisibleElement(parent)) return NodeFilter.FILTER_REJECT;

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const parts: TextPart[] = [];
  let text = '';
  let current = walker.nextNode();

  while (current) {
    const node = current as Text;
    const value = node.nodeValue ?? '';
    const start = text.length;
    text += value;
    const end = text.length;
    parts.push({ node, text: value, start, end });
    text += '\n';
    current = walker.nextNode();
  }

  return { text, parts };
}

function removePreviousScan(): void {
  document.querySelectorAll<HTMLElement>(`.${highlightClass}`).forEach((span) => {
    const parent = span.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(span.textContent ?? ''), span);
    parent.normalize();
  });

  document.querySelectorAll(`.${tooltipClass}`).forEach((tooltip) => tooltip.remove());
}

function keywordsWithExactHits(matches: MatchResult[]): Set<string> {
  const found = new Set<string>();

  for (const match of matches) {
    if (match.algorithm === 'KMP' || match.algorithm === 'BM') {
      found.add(match.keyword.trim().toUpperCase());
    }
  }

  return found;
}

function getWordLength(text: string, position: number): number {
  let length = 0;

  while (position + length < text.length && /[A-Za-z0-9\u00C0-\uFFFF]/.test(text[position + length])) {
    length++;
  }

  return Math.max(length, 1);
}

function getMatchLength(text: string, match: MatchResult, position: number): number {
  if (match.algorithm === 'Regex' || match.algorithm === 'Fuzzy') {
    return getWordLength(text, position);
  }

  return Math.max(match.keyword.length, 1);
}

function rangesOverlap(left: HighlightRange, right: HighlightRange): boolean {
  return left.node === right.node && left.start < right.end && right.start < left.end;
}

function mergeRange(ranges: HighlightRange[], next: HighlightRange): void {
  for (const range of ranges) {
    if (!rangesOverlap(range, next)) continue;
    range.start = Math.min(range.start, next.start);
    range.end = Math.max(range.end, next.end);
    range.matches.push(...next.matches);
    return;
  }

  ranges.push(next);
}

function mapMatchesToRanges(text: string, parts: TextPart[], matches: MatchResult[]): HighlightRange[] {
  const ranges: HighlightRange[] = [];

  for (const match of matches) {
    for (const position of match.positions) {
      const length = getMatchLength(text, match, position);
      const end = position + length;

      for (const part of parts) {
        if (position >= part.end || end <= part.start) continue;

        mergeRange(ranges, {
          node: part.node,
          start: Math.max(0, position - part.start),
          end: Math.min(part.text.length, end - part.start),
          matches: [match],
        });
      }
    }
  }

  return ranges
    .filter((range) => range.end > range.start)
    .sort((a, b) => {
      if (a.node === b.node) return b.start - a.start;
      return 0;
    });
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} us`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function uniqueMatchSummary(matches: MatchResult[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];

  for (const match of matches) {
    const key = `${match.algorithm}:${match.keyword}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push(`${match.keyword} (${match.algorithm})`);
  }

  return parts.join(', ');
}

function showTooltip(target: HTMLElement, matches: MatchResult[]): void {
  hideTooltip();

  const tooltip = document.createElement('div');
  const first = matches[0];
  const rect = target.getBoundingClientRect();
  const totalCount = matches.reduce((sum, match) => sum + match.count, 0);
  const totalTime = matches.reduce((sum, match) => sum + match.executionTime, 0);

  tooltip.className = tooltipClass;
  tooltip.textContent = `Keyword: ${uniqueMatchSummary(matches)} | Algoritma: ${first.algorithm} | Kemunculan: ${totalCount} | Waktu: ${formatTime(totalTime)}`;
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${Math.max(8, rect.left)}px`;
  tooltip.style.top = `${Math.max(8, rect.top - 34)}px`;
  tooltip.style.zIndex = '2147483647';
  tooltip.style.background = '#111827';
  tooltip.style.color = '#ffffff';
  tooltip.style.padding = '6px 8px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.font = '12px Arial, sans-serif';
  tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
  tooltip.style.maxWidth = '420px';
  tooltip.style.pointerEvents = 'none';

  document.body.appendChild(tooltip);
}

function hideTooltip(): void {
  document.querySelectorAll(`.${tooltipClass}`).forEach((tooltip) => tooltip.remove());
}

function createHighlight(text: string, matches: MatchResult[]): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = highlightClass;
  span.textContent = text;
  span.style.background = '#fde047';
  span.style.color = 'inherit';
  span.style.borderRadius = '3px';
  span.style.padding = '0 2px';
  span.style.boxShadow = '0 0 0 1px rgba(202,138,4,0.35)';
  span.addEventListener('mouseenter', () => showTooltip(span, matches));
  span.addEventListener('mouseleave', hideTooltip);
  return span;
}

function applyHighlights(ranges: HighlightRange[]): void {
  const rangesByNode = new Map<Text, HighlightRange[]>();

  for (const range of ranges) {
    const existing = rangesByNode.get(range.node) ?? [];
    existing.push(range);
    rangesByNode.set(range.node, existing);
  }

  for (const [node, nodeRanges] of rangesByNode) {
    const value = node.nodeValue ?? '';
    const fragment = document.createDocumentFragment();
    let cursor = 0;

    nodeRanges.sort((a, b) => a.start - b.start);

    for (const range of nodeRanges) {
      if (range.start > cursor) {
        fragment.appendChild(document.createTextNode(value.slice(cursor, range.start)));
      }

      fragment.appendChild(createHighlight(value.slice(range.start, range.end), range.matches));
      cursor = range.end;
    }

    if (cursor < value.length) {
      fragment.appendChild(document.createTextNode(value.slice(cursor)));
    }

    node.parentNode?.replaceChild(fragment, node);
  }
}

function statsFor(matches: MatchResult[]): AlgorithmStats[] {
  return algorithms.map((algorithm) => {
    const related = matches.filter((match) => match.algorithm === algorithm);

    return {
      algorithm,
      totalMatches: related.reduce((sum, match) => sum + match.count, 0),
      executionTime: related.reduce((sum, match) => sum + match.executionTime, 0),
      comparisons: related.reduce((sum, match) => sum + (match.comparisons ?? 0), 0),
    };
  });
}

function scanText(text: string): MatchResult[] {
  const kmpMatches = kmpSearchAllKeywords(text, keywords);
  const bmMatches = bmSearchAllKeywords(text, keywords);
  const regexMatches = regexSearch(text, keywords);
  const exactKeywords = keywordsWithExactHits([...kmpMatches, ...bmMatches]);
  const fuzzyKeywords = keywords.filter((keyword) => !exactKeywords.has(keyword.toUpperCase()));
  const fuzzyMatches = fuzzySearch(text, fuzzyKeywords, fuzzyThreshold);

  return [...kmpMatches, ...bmMatches, ...regexMatches, ...fuzzyMatches];
}

async function runScan(): Promise<void> {
  removePreviousScan();

  const { text, parts } = collectTextParts();
  const matches = scanText(text);
  const ranges = mapMatchesToRanges(text, parts, matches);

  applyHighlights(ranges);

  const result: ScanResult = {
    matches,
    algorithmStats: statsFor(matches),
    totalKeywordsFound: matches.reduce((sum, match) => sum + match.count, 0),
    timestamp: Date.now(),
  };

  await chrome.storage.local.set({ scanResult: result });
}

chrome.runtime.onMessage.addListener((message: { type: string }) => {
  if (message.type === 'RESCAN') {
    runScan();
  }
});

runScan();
