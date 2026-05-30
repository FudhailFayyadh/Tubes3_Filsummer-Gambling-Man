## A. Test Case RegEx

| No | Input Teks | Pola yang Diuji | Ekspektasi |
|---|---|---|---|
| 1 | GACOR99 | Kata + 2 angka | Terdeteksi |
| 2 | MAXWIN88 | Kata + 2 angka | Terdeteksi |
| 3 | MADU308 | Kata + 3 angka | Terdeteksi |
| 4 | SLOT777 | Kata + 3 angka | Terdeteksi |
| 5 | BONUS123 | Kata + 3 angka | Terdeteksi |
| 6 | belajar123 | Kata umum + angka | Perlu dicek, tidak selalu judol |
| 7 | tugas88 | Kata umum + angka | Tidak terdeteksi jika tidak ada keyword |

## B. Test Case Keyword Matching

| No | Input Teks | Keyword | Algoritma | Ekspektasi |
|---|---|---|---|---|
| 1 | situs gacor terpercaya | gacor | KMP / Boyer-Moore | Terdeteksi |
| 2 | rtp slot hari ini | slot | KMP / Boyer-Moore | Terdeteksi |
| 3 | maxwin mudah menang | maxwin | KMP / Boyer-Moore | Terdeteksi |
| 4 | jackpot besar malam ini | jackpot | KMP / Boyer-Moore | Terdeteksi |
| 5 | bonus new member | bonus | KMP / Boyer-Moore | Terdeteksi |

## C. Test Case Fuzzy Matching

| No | Input Teks | Bentuk Asli | Bentuk Modifikasi | Ekspektasi |
|---|---|---|---|---|
| 1 | g4cor | gacor | Huruf diganti angka | Terdeteksi |
| 2 | sl0t | slot | Huruf o diganti 0 | Terdeteksi |
| 3 | m4xwin | maxwin | Huruf a diganti 4 | Terdeteksi |
| 4 | j4ckp0t | jackpot | Huruf a dan o diganti angka | Terdeteksi |
| 5 | b0nus | bonus | Huruf o diganti 0 | Terdeteksi |

## D. Test Case Negatif

| No | Input Teks | Ekspektasi |
|---|---|---|
| 1 | Hari ini saya belajar algoritma | Tidak terdeteksi |
| 2 | Website ini berisi materi kuliah | Tidak terdeteksi |
| 3 | Saya sedang mengerjakan tugas besar | Tidak terdeteksi |
| 4 | Chrome extension berhasil dijalankan | Tidak terdeteksi |
| 5 | Data berhasil disimpan | Tidak terdeteksi |

## E. Test Case Tampilan Extension

| No | Skenario | Ekspektasi |
|---|---|---|
| 1 | Membuka website yang mengandung kata judol | Kata mencurigakan diberi highlight |
| 2 | Membuka website tanpa kata judol | Tidak ada highlight |
| 3 | Menekan popup extension | Statistik deteksi ditampilkan |
| 4 | Mengaktifkan fitur blur | Teks mencurigakan disamarkan |
| 5 | Mematikan fitur blur | Teks kembali terlihat normal |
