# Jawaban Latihan 1–6 — Peta Fasilitas Mahasiswa UNTAN

## Latihan 1 — Memahami Vektor
1. **Jumlah fitur:** 20 fitur.
2. **Tipe geometri:** semuanya `Point`.
3. **Field atribut:** `nama`, `kategori`, `catatan`.

## Latihan 2 — Atribut (5 marker yang diklik)
| No | nama | kategori | catatan |
|---|---|---|---|
| 1 | Kopi Reformasi | kafe | Buka hingga larut |
| 2 | Ruai Coffee Space | kafe | Coworking |
| 3 | Perpustakaan UNTAN | belajar | Referensi lengkap |
| 4 | Kantin FT | kuliner | Makan cepat |
| 5 | Taman Kuliner Sepakat | kuliner | Area terbuka |

Statistik sidebar (`/api/stats/kategori`): **kafe 11, belajar 4, kuliner 5** (total 20).
Hasilnya sesuai: popup menampilkan kategori yang sama dengan yang dihitung server.

## Latihan 3 — Digitasi
Area baru **"Parkir Latihan"** dengan kapasitas **50** (jenis terbuka) sudah disimpan lewat
`POST /api/feature/parkir_kampus` (jalur yang sama dengan Leaflet.draw). Respons server:
`{"success": true, "total": 6}`. Fitur ini sekarang ada di `data/parkir_kampus.geojson`
(fitur ke-6). Kalau mau mencoba sendiri lewat toolbar, klik ikon polygon → gambar → isi nama & kapasitas.

## Latihan 4 — Simbologi
- `WARNA_KATEGORI.kafe` diubah dari `#c62828` (merah) ke `#fbc02d` (kuning) — legenda di CSS ikut diubah.
- Ambang `warnaKapasitas` diubah dari 100/60/30 menjadi **80/50/25**.

**Pengamatan:** semua titik kafe jadi kuning. Pada parkir: Rektorat (120) tetap merah, Parkir FT (60) tetap
oranye, **Parkir Latihan (50) jadi oranye** (sebelumnya kuning), Parkir FE (40) & Perpustakaan (30) kuning,
**Parkir FH (25) jadi kuning** (sebelumnya hijau muda). Mengubah ambang batas berarti mengubah kelas graduasi.
Kuning parkir diganti ke `#fff176` supaya tidak sama dengan kuning kafe.

## Latihan 5 — Labeling
Jika kondisi diubah menjadi `'kuliner'` (di `app.js` cukup ganti `LABEL_KATEGORI = 'kuliner'`),
label kafe hilang dan yang tampil sekarang adalah label 5 titik kuliner:
Area Jajanan UNTAN, Kuliner Malam UNTAN, Warteg Kampus, Kantin FT, Taman Kuliner Sepakat.
(Label area parkir tetap tampil karena tidak memakai aturan kategori.)
Nilai bawaan dikembalikan ke `'kafe'` supaya uji Latihan 6 sesuai modul.

## Latihan 6 — Clustering + Filter
`index.html`, `style.css`, dan `app.js` sudah diganti ke versi v2 (MarkerCluster + filter + state terpusat).
Tambahan: layer control "Titik Favorit" dan "Area Parkir" sudah berfungsi penuh lewat *wrapper*
`L.layerGroup` yang tetap, jadi tidak lagi berupa placeholder.

Uji coba: matikan "Belajar" → marker biru hilang; aktifkan cluster → ikon berangka; matikan label →
label kafe hilang; filter hanya Kafe + cluster → hanya kafe yang muncul dalam bentuk cluster.
