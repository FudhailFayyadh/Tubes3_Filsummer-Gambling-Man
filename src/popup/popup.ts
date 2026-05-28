import type { ScanResult, AlgorithmStats } from '../types/index';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  if (ms < 0.001) return '< 1 µs';
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
  if (ms < 1000) return `${ms.toFixed(3)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function algoClass(algorithm: string): string {
  return algorithm.toLowerCase().replace(/[^a-z]/g, '');
}

// ─── Render functions ─────────────────────────────────────────────────────────

function renderTotalKeywords(total: number): void {
  const el = document.getElementById('total-count')!;
  el.textContent = total.toString();
  el.className = 'total-count' + (total === 0 ? ' zero' : '');
}

function renderBadge(total: number): void {
  const badge = document.getElementById('status-badge')!;
  if (total > 0) {
    badge.textContent = `${total} Terdeteksi`;
    badge.className = 'badge';
  } else {
    badge.textContent = 'Aman';
    badge.className = 'badge safe';
  }
}

function renderBarChart(stats: AlgorithmStats[]): void {
  const container = document.getElementById('chart-container')!;

  if (!stats.length) {
    container.innerHTML = '<div class="empty-state">Belum ada data scan</div>';
    return;
  }

  const maxMatches = Math.max(...stats.map((s) => s.totalMatches), 1);

  container.innerHTML = stats
    .map((s) => {
      const pct = Math.max((s.totalMatches / maxMatches) * 100, s.totalMatches > 0 ? 4 : 0);
      const cls = algoClass(s.algorithm);
      const label = s.totalMatches > 0 ? String(s.totalMatches) : '';
      return `
        <div class="bar-row">
          <div class="bar-label">${s.algorithm}</div>
          <div class="bar-track">
            <div class="bar-fill ${cls}" style="width:${pct}%">
              <span class="bar-value">${label}</span>
            </div>
          </div>
        </div>`;
    })
    .join('');
}

function renderStats(stats: AlgorithmStats[]): void {
  const tbody = document.getElementById('stats-body')!;

  if (!stats.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="empty-state">Belum ada data</td></tr>';
    return;
  }

  tbody.innerHTML = stats
    .map((s) => {
      const cls = algoClass(s.algorithm);
      const cmp = s.comparisons > 0 ? s.comparisons.toLocaleString('id-ID') : '—';
      return `
        <tr>
          <td><span class="algo-tag ${cls}">${s.algorithm}</span></td>
          <td>${s.totalMatches}</td>
          <td>${formatTime(s.executionTime)}</td>
          <td>${cmp}</td>
        </tr>`;
    })
    .join('');
}

function renderTimestamp(ts: number): void {
  const el = document.getElementById('timestamp')!;
  if (!ts) {
    el.textContent = '';
    return;
  }
  el.textContent = `Terakhir scan: ${new Date(ts).toLocaleTimeString('id-ID')}`;
}

function render(result: ScanResult | null): void {
  const badge = document.getElementById('status-badge')!;

  if (!result) {
    badge.textContent = 'Belum di-scan';
    badge.className = 'badge pending';
    return;
  }

  renderTotalKeywords(result.totalKeywordsFound);
  renderBadge(result.totalKeywordsFound);
  renderBarChart(result.algorithmStats);
  renderStats(result.algorithmStats);
  renderTimestamp(result.timestamp);
}

// ─── Data loading ─────────────────────────────────────────────────────────────

function loadAndRender(): void {
  chrome.storage.local.get(['scanResult'], (data) => {
    render((data.scanResult as ScanResult) ?? null);
  });
}

// ─── Realtime updates via storage listener ────────────────────────────────────

function setupStorageListener(): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.scanResult) return;
    render(changes.scanResult.newValue as ScanResult);

    const btn = document.getElementById('rescan-btn') as HTMLButtonElement;
    if (btn.disabled) {
      btn.disabled = false;
      btn.textContent = 'Rescan Halaman Ini';
      btn.classList.remove('scanning');
    }
  });
}

// ─── Rescan button ────────────────────────────────────────────────────────────

function setupRescanButton(): void {
  const btn = document.getElementById('rescan-btn') as HTMLButtonElement;

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Scanning...';
    btn.classList.add('scanning');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId !== undefined) {
        chrome.tabs.sendMessage(tabId, { type: 'RESCAN' });
      }
    });

    // Re-enable after 5 s as a safety fallback (storage listener re-enables sooner).
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Rescan Halaman Ini';
      btn.classList.remove('scanning');
      loadAndRender();
    }, 5000);
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadAndRender();
  setupRescanButton();
  setupStorageListener();
});
