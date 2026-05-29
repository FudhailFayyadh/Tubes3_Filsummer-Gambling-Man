import type { MatchResult } from '../types/index';

type TrieNode = {
  children: Record<string, number>;
  fail: number;
  outputs: string[];
};

function newNode(): TrieNode {
  return {
    children: {},
    fail: 0,
    outputs: [],
  };
}

function cleanKeywords(keywords: string[]): string[] {
  const patterns: string[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim().toUpperCase();
    if (pattern.length > 0) patterns.push(pattern);
  }

  return patterns;
}

function buildTrie(patterns: string[]): TrieNode[] {
  const nodes: TrieNode[] = [newNode()];

  for (const pattern of patterns) {
    let nodeIndex = 0;

    for (const char of pattern) {
      const existingChild = nodes[nodeIndex].children[char];

      if (existingChild === undefined) {
        nodes[nodeIndex].children[char] = nodes.length;
        nodes.push(newNode());
      }

      nodeIndex = nodes[nodeIndex].children[char];
    }

    nodes[nodeIndex].outputs.push(pattern);
  }

  return nodes;
}

function addRootChildrenToQueue(nodes: TrieNode[], queue: number[]): void {
  for (const char of Object.keys(nodes[0].children)) {
    const childIndex = nodes[0].children[char];
    nodes[childIndex].fail = 0;
    queue.push(childIndex);
  }
}

function setChildFailure(nodes: TrieNode[], parentIndex: number, char: string, childIndex: number): void {
  let fallback = nodes[parentIndex].fail;

  while (fallback !== 0 && nodes[fallback].children[char] === undefined) {
    fallback = nodes[fallback].fail;
  }

  const fallbackChild = nodes[fallback].children[char];
  nodes[childIndex].fail = fallbackChild === undefined ? 0 : fallbackChild;
  nodes[childIndex].outputs.push(...nodes[nodes[childIndex].fail].outputs);
}

function buildFailureLinks(nodes: TrieNode[]): void {
  const queue: number[] = [];
  let head = 0;

  addRootChildrenToQueue(nodes, queue);

  while (head < queue.length) {
    const parentIndex = queue[head];
    head++;

    for (const char of Object.keys(nodes[parentIndex].children)) {
      const childIndex = nodes[parentIndex].children[char];
      setChildFailure(nodes, parentIndex, char, childIndex);
      queue.push(childIndex);
    }
  }
}

function saveMatch(positions: Map<string, number[]>, pattern: string, position: number): void {
  const existing = positions.get(pattern);

  if (existing) {
    existing.push(position);
  } else {
    positions.set(pattern, [position]);
  }
}

function scanText(text: string, nodes: TrieNode[]): { positions: Map<string, number[]>; comparisons: number } {
  const positions = new Map<string, number[]>();
  let comparisons = 0;
  let nodeIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    while (nodeIndex !== 0 && nodes[nodeIndex].children[char] === undefined) {
      comparisons++;
      nodeIndex = nodes[nodeIndex].fail;
    }

    comparisons++;
    const nextNode = nodes[nodeIndex].children[char];
    nodeIndex = nextNode === undefined ? 0 : nextNode;

    for (const pattern of nodes[nodeIndex].outputs) {
      saveMatch(positions, pattern, i - pattern.length + 1);
    }
  }

  return { positions, comparisons };
}

function makeResults(
  keywords: string[],
  positionsByPattern: Map<string, number[]>,
  executionTime: number,
  comparisons: number,
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const keyword of keywords) {
    const pattern = keyword.trim().toUpperCase();
    const positions = positionsByPattern.get(pattern);

    if (!positions || positions.length === 0) continue;

    results.push({
      keyword,
      positions,
      count: positions.length,
      algorithm: 'AC',
      executionTime,
      comparisons,
    });
  }

  return results;
}

export function acSearchAllKeywords(text: string, keywords: string[]): MatchResult[] {
  const patterns = cleanKeywords(keywords);
  if (patterns.length === 0) return [];

  const start = performance.now();
  const trie = buildTrie(patterns);

  buildFailureLinks(trie);

  const scan = scanText(text.toUpperCase(), trie);
  const executionTime = performance.now() - start;

  return makeResults(keywords, scan.positions, executionTime, scan.comparisons);
}
