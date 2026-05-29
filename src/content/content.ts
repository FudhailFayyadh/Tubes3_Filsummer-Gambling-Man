import { acSearchAllKeywords } from '../algorithms/ahoCorasick';
import { bmSearchAllKeywords } from '../algorithms/boyerMoore';
import { fuzzySearch } from '../algorithms/fuzzy';
import { kmpSearchAllKeywords } from '../algorithms/kmp';
import { rbSearchAllKeywords } from '../algorithms/rabinKarp';
import { regexSearch } from '../algorithms/regex';
import type { AlgorithmStats, DetectorSettings, MatchResult, ScanResult } from '../types/index';
import keywordsRaw from '../../keywords/keywords.txt?raw';

type TextPart = {
  node: Text;
  text: string;
  start: number;
  end: number;
};

type TextSource = {
  text: string;
  parts: TextPart[];
};

type HighlightRange = {
  node: Text;
  start: number;
  end: number;
  matches: MatchResult[];
};

type ContentMessage = {
  type: string;
};

const algorithms: Array<AlgorithmStats['algorithm']> = ['KMP', 'BM', 'Regex', 'RK', 'AC', 'Fuzzy'];
const highlightClass = 'judol-detector-highlight';
const tooltipClass = 'judol-detector-tooltip';
const fuzzyThreshold = 0.3;
const defaultSettings: DetectorSettings = { blurTextEnabled: false };

const keywords = keywordsRaw
  .split('\n')
  .map((keyword) => keyword.trim())
  .filter((keyword) => keyword.length > 0 && !keyword.startsWith('#'));

function isIgnoredTag(tag: string): boolean {
  return tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'textarea' || tag === 'input';
}

function isOwnElement(element: Element): boolean {
  return element.classList.contains(highlightClass) || element.classList.contains(tooltipClass);
}

function isVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function canReadTextNode(node: Node): number {
  const parent = node.parentElement;
  const text = node.nodeValue ?? '';

  if (!parent) return NodeFilter.FILTER_REJECT;
  if (text.trim().length === 0) return NodeFilter.FILTER_REJECT;
  if (isIgnoredTag(parent.tagName.toLowerCase())) return NodeFilter.FILTER_REJECT;
  if (isOwnElement(parent)) return NodeFilter.FILTER_REJECT;
  if (!isVisible(parent)) return NodeFilter.FILTER_REJECT;

  return NodeFilter.FILTER_ACCEPT;
}

function collectText(): TextSource {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: canReadTextNode,
  });

  const parts: TextPart[] = [];
  let fullText = '';
  let current = walker.nextNode();

  while (current) {
    const node = current as Text;
    const text = node.nodeValue ?? '';
    const start = fullText.length;
    const end = start + text.length;

    fullText += text;
    fullText += '\n';
    parts.push({ node, text, start, end });

    current = walker.nextNode();
  }

  return { text: fullText, parts };
}

function removeOldHighlights(): void {
  const highlights = Array.from(document.querySelectorAll<HTMLElement>(`.${highlightClass}`));

  for (const span of highlights) {
    const parent = span.parentNode;
    if (!parent) continue;

    parent.replaceChild(document.createTextNode(span.textContent ?? ''), span);
    parent.normalize();
  }
}

function removeTooltips(): void {
  const tooltips = Array.from(document.querySelectorAll(`.${tooltipClass}`));

  for (const tooltip of tooltips) {
    tooltip.remove();
  }
}

function clearOldScan(): void {
  removeTooltips();
  removeOldHighlights();
}

function isExactAlgorithm(algorithm: MatchResult['algorithm']): boolean {
  return algorithm === 'KMP' || algorithm === 'BM' || algorithm === 'RK' || algorithm === 'AC';
}

function getExactKeywords(matches: MatchResult[]): Set<string> {
  const found = new Set<string>();

  for (const match of matches) {
    if (isExactAlgorithm(match.algorithm)) {
      found.add(match.keyword.trim().toUpperCase());
    }
  }

  return found;
}

function getFuzzyKeywords(exactKeywords: Set<string>): string[] {
  const result: string[] = [];

  for (const keyword of keywords) {
    if (!exactKeywords.has(keyword.toUpperCase())) {
      result.push(keyword);
    }
  }

  return result;
}

function runAlgorithms(text: string): MatchResult[] {
  const kmpMatches = kmpSearchAllKeywords(text, keywords);
  const bmMatches = bmSearchAllKeywords(text, keywords);
  const rkMatches = rbSearchAllKeywords(text, keywords);
  const acMatches = acSearchAllKeywords(text, keywords);
  const regexMatches = regexSearch(text, keywords);
  const exactKeywords = getExactKeywords([...kmpMatches, ...bmMatches, ...rkMatches, ...acMatches]);
  const fuzzyMatches = fuzzySearch(text, getFuzzyKeywords(exactKeywords), fuzzyThreshold);

  return [...kmpMatches, ...bmMatches, ...rkMatches, ...acMatches, ...regexMatches, ...fuzzyMatches];
}

function isWordCharacter(char: string): boolean {
  return /[A-Za-z0-9\u00C0-\uFFFF]/.test(char);
}

function getWordLength(text: string, position: number): number {
  let length = 0;

  while (position + length < text.length && isWordCharacter(text[position + length])) {
    length++;
  }

  if (length === 0) return 1;
  return length;
}

function getMatchLength(text: string, match: MatchResult, position: number): number {
  if (match.algorithm === 'Regex' || match.algorithm === 'Fuzzy') {
    return getWordLength(text, position);
  }

  return Math.max(1, match.keyword.length);
}

function rangesOverlap(left: HighlightRange, right: HighlightRange): boolean {
  if (left.node !== right.node) return false;
  return left.start < right.end && right.start < left.end;
}

function addRange(ranges: HighlightRange[], next: HighlightRange): void {
  for (const range of ranges) {
    if (!rangesOverlap(range, next)) continue;

    range.start = Math.min(range.start, next.start);
    range.end = Math.max(range.end, next.end);
    range.matches.push(...next.matches);
    return;
  }

  ranges.push(next);
}

function addMatchRange(text: string, parts: TextPart[], ranges: HighlightRange[], match: MatchResult, position: number): void {
  const length = getMatchLength(text, match, position);
  const end = position + length;

  for (const part of parts) {
    if (position >= part.end) continue;
    if (end <= part.start) continue;

    addRange(ranges, {
      node: part.node,
      start: Math.max(0, position - part.start),
      end: Math.min(part.text.length, end - part.start),
      matches: [match],
    });
  }
}

function mapMatchesToRanges(source: TextSource, matches: MatchResult[]): HighlightRange[] {
  const ranges: HighlightRange[] = [];

  for (const match of matches) {
    for (const position of match.positions) {
      addMatchRange(source.text, source.parts, ranges, match, position);
    }
  }

  return ranges.filter((range) => range.end > range.start);
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} us`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function getUniqueMatchText(matches: MatchResult[]): string {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const match of matches) {
    const label = `${match.keyword} (${match.algorithm})`;
    if (seen.has(label)) continue;

    seen.add(label);
    labels.push(label);
  }

  return labels.join(', ');
}

function getTotalCount(matches: MatchResult[]): number {
  let total = 0;

  for (const match of matches) {
    total += match.count;
  }

  return total;
}

function getTotalTime(matches: MatchResult[]): number {
  let total = 0;

  for (const match of matches) {
    total += match.executionTime;
  }

  return total;
}

function hideTooltip(): void {
  removeTooltips();
}

function showTooltip(target: HTMLElement, matches: MatchResult[]): void {
  hideTooltip();

  const rect = target.getBoundingClientRect();
  const tooltip = document.createElement('div');

  tooltip.className = tooltipClass;
  tooltip.textContent = `Keyword: ${getUniqueMatchText(matches)} | Kemunculan: ${getTotalCount(matches)} | Waktu: ${formatTime(getTotalTime(matches))}`;
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${Math.max(8, rect.left)}px`;
  tooltip.style.top = `${Math.max(8, rect.top - 34)}px`;
  tooltip.style.zIndex = '2147483647';
  tooltip.style.background = '#111827';
  tooltip.style.color = '#ffffff';
  tooltip.style.padding = '6px 8px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.font = '12px Arial, sans-serif';
  tooltip.style.maxWidth = '420px';
  tooltip.style.pointerEvents = 'none';

  document.body.appendChild(tooltip);
}

function makeHighlight(text: string, matches: MatchResult[], settings: DetectorSettings): HTMLSpanElement {
  const span = document.createElement('span');

  span.className = highlightClass;
  span.textContent = text;
  span.style.background = '#fde047';
  span.style.color = 'inherit';
  span.style.borderRadius = '3px';
  span.style.padding = '0 2px';

  if (settings.blurTextEnabled) {
    span.style.filter = 'blur(4px)';
    span.style.userSelect = 'none';
  }

  span.addEventListener('mouseenter', () => showTooltip(span, matches));
  span.addEventListener('mouseleave', hideTooltip);

  return span;
}

function groupRangesByNode(ranges: HighlightRange[]): Map<Text, HighlightRange[]> {
  const groups = new Map<Text, HighlightRange[]>();

  for (const range of ranges) {
    const group = groups.get(range.node);

    if (group) {
      group.push(range);
    } else {
      groups.set(range.node, [range]);
    }
  }

  return groups;
}

function renderNodeRanges(node: Text, ranges: HighlightRange[], settings: DetectorSettings): void {
  const text = node.nodeValue ?? '';
  const fragment = document.createDocumentFragment();
  let cursor = 0;

  ranges.sort((a, b) => a.start - b.start);

  for (const range of ranges) {
    if (range.start > cursor) {
      fragment.appendChild(document.createTextNode(text.slice(cursor, range.start)));
    }

    fragment.appendChild(makeHighlight(text.slice(range.start, range.end), range.matches, settings));
    cursor = range.end;
  }

  if (cursor < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(cursor)));
  }

  node.parentNode?.replaceChild(fragment, node);
}

function renderHighlights(ranges: HighlightRange[], settings: DetectorSettings): void {
  const groups = groupRangesByNode(ranges);

  for (const [node, nodeRanges] of groups) {
    renderNodeRanges(node, nodeRanges, settings);
  }
}

function makeStats(matches: MatchResult[]): AlgorithmStats[] {
  const stats: AlgorithmStats[] = [];

  for (const algorithm of algorithms) {
    let totalMatches = 0;
    let executionTime = 0;
    let comparisons = 0;

    for (const match of matches) {
      if (match.algorithm !== algorithm) continue;

      totalMatches += match.count;
      executionTime += match.executionTime;
      comparisons += match.comparisons ?? 0;
    }

    stats.push({ algorithm, totalMatches, executionTime, comparisons });
  }

  return stats;
}

function makeScanResult(matches: MatchResult[]): ScanResult {
  return {
    matches,
    algorithmStats: makeStats(matches),
    totalKeywordsFound: getTotalCount(matches),
    timestamp: Date.now(),
  };
}

function loadSettings(): Promise<DetectorSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['detectorSettings'], (data) => {
      const saved = data.detectorSettings as Partial<DetectorSettings> | undefined;
      resolve({
        blurTextEnabled: saved?.blurTextEnabled === true,
      });
    });
  });
}

async function runScan(): Promise<void> {
  clearOldScan();

  const settings = await loadSettings();
  const source = collectText();
  const matches = runAlgorithms(source.text);
  const ranges = mapMatchesToRanges(source, matches);

  renderHighlights(ranges, settings);
  await chrome.storage.local.set({ scanResult: makeScanResult(matches) });
}

chrome.runtime.onMessage.addListener((message: ContentMessage) => {
  if (message.type === 'RESCAN' || message.type === 'SET_BLUR_TEXT') {
    runScan();
  }
});

runScan();
