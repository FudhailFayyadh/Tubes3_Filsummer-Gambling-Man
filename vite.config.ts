import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'content') {
    // Second build pass: content script as self-contained IIFE
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/content/content.ts'),
          name: 'JudolDetectorContent',
          fileName: () => 'content.js',
          formats: ['iife'],
        },
        outDir: 'dist',
        emptyOutDir: false,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      },
    }
  }

  // Default build: popup script + copy public/ to dist/
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/popup/popup.ts'),
        name: 'JudolDetectorPopup',
        fileName: () => 'popup.js',
        formats: ['iife'],
      },
      outDir: 'dist',
      emptyOutDir: true,
      copyPublicDir: true,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    publicDir: 'public',
  }
})
