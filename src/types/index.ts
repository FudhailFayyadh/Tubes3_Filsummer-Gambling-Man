export interface MatchResult {
  keyword: string;
  positions: number[];
  count: number;
  algorithm: 'KMP' | 'BM' | 'Regex' | 'Fuzzy';
  executionTime: number;
  comparisons?: number;
  isFuzzy?: boolean;
  similarity?: number;
}

export interface AlgorithmStats {
  algorithm: 'KMP' | 'BM' | 'Regex' | 'Fuzzy';
  totalMatches: number;
  executionTime: number;
  comparisons: number;
}

export interface ScanResult {
  matches: MatchResult[];
  algorithmStats: AlgorithmStats[];
  totalKeywordsFound: number;
  timestamp: number;
}

export interface DetectedElement {
  element: Element;
  matches: MatchResult[];
  originalText: string;
}

export type ExtensionMessage =
  | { type: 'RESCAN' }
  | { type: 'SCAN_COMPLETE'; result: ScanResult };
