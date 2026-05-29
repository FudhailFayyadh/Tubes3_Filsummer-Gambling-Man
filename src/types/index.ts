export interface MatchResult {
  keyword: string;
  positions: number[];
  count: number;
  algorithm: 'KMP' | 'BM' | 'Regex' | 'Fuzzy' | 'RK' | 'AC';
  executionTime: number;
  comparisons?: number;
  isFuzzy?: boolean;
  similarity?: number;
}

export interface AlgorithmStats {
  algorithm: 'KMP' | 'BM' | 'Regex' | 'Fuzzy' | 'RK' | 'AC';
  totalMatches: number;
  executionTime: number;
  comparisons: number;
}

export interface OCRResult {
  imagesScanned: number;
  imagesDetected: number;
  detectedImages: Array<{ src: string; keywords: string[] }>;
  executionTime: number;
  timestamp: number;
}

export interface ScanResult {
  matches: MatchResult[];
  algorithmStats: AlgorithmStats[];
  totalKeywordsFound: number;
  timestamp: number;
}

export interface DetectorSettings {
  blurTextEnabled: boolean;
  acRkEnabled: boolean;
}

export interface DetectedElement {
  element: Element;
  matches: MatchResult[];
  originalText: string;
}

export type ExtensionMessage =
  | { type: 'RESCAN' }
  | { type: 'SET_BLUR_TEXT'; enabled: boolean }
  | { type: 'SCAN_COMPLETE'; result: ScanResult }
  | { type: 'OCR_COMPLETE'; result: OCRResult };
