# Tubes3_Filsummer-Gambling-Man

Judol Detector adalah Chromium extension untuk mendeteksi konten judi online pada halaman web menggunakan TypeScript.

## Algoritma

KMP membangun failure function untuk menentukan panjang prefix yang masih bisa digunakan ketika terjadi mismatch. Pencarian dilakukan dari kiri ke kanan dan setiap karakter dibandingkan secara manual.

Boyer-Moore menggunakan last occurrence table untuk menentukan pergeseran pattern saat mismatch. Pencarian setiap window dilakukan dari kanan ke kiri dengan bad-character shift.

Regex digunakan untuk mendeteksi pola kata yang diikuti 2 sampai 4 angka, seperti `GACOR99`, `MAXWIN234`, dan `SLOT88`.

Fuzzy matching menggunakan Weighted Levenshtein Distance untuk mendeteksi variasi visual seperti `H0KI`, `G4COR`, dan `MAXW1N`.

## Requirement

- Node.js
- npm
- Chromium browser atau Google Chrome

## Instalasi

```bash
npm install
```

## Build

```bash
npm run build
```

Hasil build tersedia di folder `dist`.

## Menjalankan Extension

1. Buka `chrome://extensions/`.
2. Aktifkan Developer Mode.
3. Pilih Load unpacked.
4. Pilih folder `dist`.
5. Buka halaman web yang ingin diperiksa.
6. Gunakan popup Judol Detector untuk melihat statistik dan melakukan rescan.

## Author

- Filsummer - Gambling Man

| NIM | Nama |
| --- | --- |
| 18223009 | Muhammad Faiz Alfikrona |
| 18223121 | Fudhail Fayyadh |
| 13524114 | Mirza Tsabita Wafa'ana |
