import type { AlgorithmStats, DetectorSettings, OCRResult, ScanResult } from '../types/index';

const defaultSettings: DetectorSettings = { blurTextEnabled: false };

function formatTime(ms: number): string {
  if (ms < 0.001) return '< 1 us';
  if (ms < 1) return `${(ms * 1000).toFixed(0)} us`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function getAlgorithmClass(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

function getSettings(data: { detectorSettings?: unknown }): DetectorSettings {
  const saved = data.detectorSettings as Partial<DetectorSettings> | undefined;
  return {
    blurTextEnabled: saved?.blurTextEnabled === true,
  };
}

function renderTotal(total: number): void {
  const totalElement = document.getElementById('total-count')!;
  const badge = document.getElementById('status-badge')!;

  totalElement.textContent = total.toString();
  totalElement.className = total === 0 ? 'total-count zero' : 'total-count';

  if (total === 0) {
    badge.textContent = 'Aman';
    badge.className = 'badge safe';
  } else {
    badge.textContent = `${total} Terdeteksi`;
    badge.className = 'badge';
  }
}

function renderChart(stats: AlgorithmStats[]): void {
  const container = document.getElementById('chart-container')!;

  if (stats.length === 0) {
    container.innerHTML = '<div class="empty-state">Belum ada data scan</div>';
    return;
  }

  let maxMatches = 1;
  for (const item of stats) {
    if (item.totalMatches > maxMatches) maxMatches = item.totalMatches;
  }

  let html = '';
  for (const item of stats) {
    const width = item.totalMatches === 0 ? 0 : Math.max(4, (item.totalMatches / maxMatches) * 100);
    const className = getAlgorithmClass(item.algorithm);

    html += `
      <div class="chart-row">
        <div class="chart-name">${item.algorithm}</div>
        <div class="bar">
          <div class="bar-fill ${className}" style="width:${width}%"></div>
        </div>
        <div class="chart-value">${item.totalMatches}</div>
      </div>`;
  }

  container.innerHTML = html;
}

function renderStats(stats: AlgorithmStats[]): void {
  const tableBody = document.getElementById('stats-body')!;

  if (stats.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada data</td></tr>';
    return;
  }

  let html = '';
  for (const item of stats) {
    const comparisons = item.comparisons > 0 ? item.comparisons.toLocaleString('id-ID') : '-';

    html += `
      <tr>
        <td>${item.algorithm}</td>
        <td>${item.totalMatches}</td>
        <td>${formatTime(item.executionTime)}</td>
        <td>${comparisons}</td>
      </tr>`;
  }

  tableBody.innerHTML = html;
}

function renderTimestamp(timestamp: number): void {
  const element = document.getElementById('timestamp')!;
  element.textContent = timestamp > 0 ? `Terakhir scan: ${new Date(timestamp).toLocaleTimeString('id-ID')}` : '';
}

function renderScan(result: ScanResult | null): void {
  if (!result) {
    const badge = document.getElementById('status-badge')!;
    badge.textContent = 'Belum di-scan';
    badge.className = 'badge pending';
    return;
  }

  renderTotal(result.totalKeywordsFound);
  renderChart(result.algorithmStats);
  renderStats(result.algorithmStats);
  renderTimestamp(result.timestamp);
}

function renderOCR(result: OCRResult | null): void {
  const main = document.getElementById('ocr-main')!;
  const sub = document.getElementById('ocr-sub')!;
  const count = document.getElementById('ocr-count')!;

  if (!result) {
    main.textContent = 'Belum ada scan gambar';
    sub.textContent = '';
    count.textContent = '-';
    count.className = 'ocr-count zero';
    return;
  }

  main.textContent = `${result.imagesScanned} gambar dipindai`;
  sub.textContent = result.executionTime > 0 ? `Waktu: ${formatTime(result.executionTime)}` : '';
  count.textContent = result.imagesDetected.toString();
  count.className = result.imagesDetected === 0 ? 'ocr-count zero' : 'ocr-count';
}

function renderSettings(settings: DetectorSettings): void {
  const toggle = document.getElementById('blur-toggle') as HTMLInputElement;
  toggle.checked = settings.blurTextEnabled;
}

function loadData(): void {
  chrome.storage.local.get(['scanResult', 'ocrResult', 'detectorSettings'], (data) => {
    renderScan((data.scanResult as ScanResult) ?? null);
    renderOCR((data.ocrResult as OCRResult) ?? null);
    renderSettings(getSettings(data));
  });
}

function sendMessageToActiveTab(message: { type: 'RESCAN' } | { type: 'SET_BLUR_TEXT'; enabled: boolean }): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId === undefined) return;
    chrome.tabs.sendMessage(tabId, message);
  });
}

function setupStorageListener(): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes.scanResult) renderScan(changes.scanResult.newValue as ScanResult);
    if (changes.ocrResult) renderOCR(changes.ocrResult.newValue as OCRResult);
    if (changes.detectorSettings) renderSettings(getSettings({ detectorSettings: changes.detectorSettings.newValue }));

    const button = document.getElementById('rescan-btn') as HTMLButtonElement;
    if (changes.scanResult && button.disabled) {
      button.disabled = false;
      button.textContent = 'Rescan Halaman Ini';
    }
  });
}

function setupRescanButton(): void {
  const button = document.getElementById('rescan-btn') as HTMLButtonElement;

  button.addEventListener('click', () => {
    button.disabled = true;
    button.textContent = 'Scanning...';
    sendMessageToActiveTab({ type: 'RESCAN' });

    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Rescan Halaman Ini';
      loadData();
    }, 5000);
  });
}

function setupBlurToggle(): void {
  const toggle = document.getElementById('blur-toggle') as HTMLInputElement;

  toggle.addEventListener('change', () => {
    const settings: DetectorSettings = { blurTextEnabled: toggle.checked };

    chrome.storage.local.set({ detectorSettings: settings }, () => {
      sendMessageToActiveTab({ type: 'SET_BLUR_TEXT', enabled: settings.blurTextEnabled });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupStorageListener();
  setupRescanButton();
  setupBlurToggle();
});
