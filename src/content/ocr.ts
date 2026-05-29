import { createWorker } from 'tesseract.js';
import type { OCRResult } from '../types/index';
import { kmpSearch } from '../algorithms/kmp';
import keywordsRaw from '../../keywords/keywords.txt?raw';

const keywords: string[] = keywordsRaw
  .split('\n')
  .map((k) => k.trim())
  .filter((k) => k.length > 0 && !k.startsWith('#'));

const BLUR_CLASS = 'judol-ocr-blur';
const LABEL_CLASS = 'judol-ocr-label';

function findKeywordsInText(text: string): string[] {
  const upper = text.toUpperCase();
  const found: string[] = [];
  for (const kw of keywords) {
    const pattern = kw.trim().toUpperCase();
    if (!pattern) continue;
    const { positions } = kmpSearch(upper, pattern);
    if (positions.length > 0) found.push(kw);
  }
  return found;
}

async function fetchImageBlob(src: string): Promise<Blob | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

function blurImage(img: HTMLImageElement): void {
  if (img.classList.contains(BLUR_CLASS)) return;
  img.classList.add(BLUR_CLASS);
  img.style.filter = 'blur(10px)';
  img.style.transition = 'filter 0.3s ease';

  const wrapper = img.parentElement;
  if (!wrapper) return;

  const label = document.createElement('div');
  label.className = LABEL_CLASS;
  label.textContent = 'Konten Judol Terdeteksi';
  label.style.cssText = [
    'position:absolute',
    'top:50%',
    'left:50%',
    'transform:translate(-50%,-50%)',
    'background:rgba(231,76,60,0.85)',
    'color:#fff',
    'padding:4px 10px',
    'border-radius:4px',
    'font-size:12px',
    'font-weight:700',
    'pointer-events:none',
    'z-index:9999',
    'white-space:nowrap',
  ].join(';');

  if (getComputedStyle(wrapper).position === 'static') {
    wrapper.style.position = 'relative';
  }
  wrapper.appendChild(label);
}

function removeBlurs(): void {
  document.querySelectorAll<HTMLImageElement>(`.${BLUR_CLASS}`).forEach((img) => {
    img.classList.remove(BLUR_CLASS);
    img.style.filter = '';
    img.style.transition = '';
  });
  document.querySelectorAll(`.${LABEL_CLASS}`).forEach((el) => el.remove());
}

async function runOCR(): Promise<void> {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter(
    (img) => img.complete && img.naturalWidth > 50 && img.src && !img.classList.contains(BLUR_CLASS),
  );

  if (images.length === 0) {
    await chrome.storage.local.set({
      ocrResult: {
        imagesScanned: 0,
        imagesDetected: 0,
        detectedImages: [],
        executionTime: 0,
        timestamp: Date.now(),
      } satisfies OCRResult,
    });
    return;
  }

  const start = performance.now();
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  try {
    worker = await createWorker('eng');
  } catch {
    return;
  }

  const detectedImages: OCRResult['detectedImages'] = [];

  for (const img of images) {
    try {
      const blob = await fetchImageBlob(img.src);
      if (!blob) continue;

      const { data } = await worker.recognize(blob);
      const found = findKeywordsInText(data.text);

      if (found.length > 0) {
        blurImage(img);
        detectedImages.push({ src: img.src, keywords: found });
      }
    } catch {}
  }

  await worker.terminate();

  const result: OCRResult = {
    imagesScanned: images.length,
    imagesDetected: detectedImages.length,
    detectedImages,
    executionTime: performance.now() - start,
    timestamp: Date.now(),
  };

  await chrome.storage.local.set({ ocrResult: result });
}

chrome.runtime.onMessage.addListener((message: { type: string }) => {
  if (message.type === 'RESCAN') {
    removeBlurs();
    runOCR();
  }
});

runOCR();
