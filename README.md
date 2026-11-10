# Peta Fasilitas Mahasiswa di Sekitar Kampus UNTAN

Proyek praktikum Web Mapping interaktif berbasis **Node.js**, **Express.js**, dan **Leaflet.js** untuk memetakan fasilitas mahasiswa (kafe, area belajar, kuliner), batas kampus, area parkir, serta jaringan jalan di sekitar kawasan Universitas Tanjungpura (UNTAN), Pontianak.

## Identitas Mahasiswa
- **Nama**: M. Arifqu Wa Liin
- **NIM**: H1101241058
- **Program Studi**: Sistem Informasi
- **Fakultas**: Matematika dan Ilmu Pengetahuan Alam
- **Perguruan Tinggi**: Universitas Tanjungpura, Pontianak (2026)

---

## Fitur Aplikasi
1. **Visualisasi Data Vektor Spasial (GeoJSON)**:
   - **Titik Favorit (Point)**: Fasilitas kafe, perpustakaan/tempat belajar, dan spot kuliner di sekitar kampus.
   - **Batas Kampus (Polygon)**: Delimitasi wilayah kampus Universitas Tanjungpura.
   - **Area Parkir (Polygon)**: Area parkir fakultas dan rektorat dengan visualisasi kapasitas bertingkat (*graduated symbology*).
   - **Jaringan Jalan (LineString)**: Jaringan jalan utama (primer) dan jalan penghubung (sekunder).
2. **Identifikasi Atribut Dinamis (Popup)**: Menampilkan detail nama, kategori, dan informasi fasilitas melalui pop-up interaktif saat marker diklik.
3. **Digitasi Vektor di Browser (Leaflet.draw)**: Pengguna dapat menggambar poligon area parkir baru langsung pada peta dan menyimpannya secara persisten ke backend server.
4. **Marker Clustering (Leaflet.markercluster)**: Mengelompokkan titik marker yang bertumpukan pada tingkat zoom rendah menjadi lingkaran berangka, serta memecahnya secara otomatis saat diperbesar (*zoom in*).
5. **Filter Kategori Reaktif**: Menyaring dan menampilkan penanda fasilitas berdasarkan kategori tertentu (*Kafe*, *Belajar*, *Kuliner*) dengan pengelolaan status (*state management*) terpusat.
6. **Rule-Based Labeling**: Pelabelan otomatis menggunakan tooltip ber-halo putih untuk mencegah tabrakan label (*collision*) pada peta.

---

## Struktur Folder
```text
peta-fasilitas-untan/
├── data/
│   ├── titik_favorit.geojson
│   ├── batas_kampus.geojson
│   ├── parkir_kampus.geojson
│   └── jalan.geojson
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── server.js
├── package.json
├── Laporan_Praktikum_Web_Mapping_H1101241058.docx
├── Laporan_Praktikum_Web_Mapping_H1101241058.pdf
├── JAWABAN_LATIHAN.md
└── README.md
```

---

## Panduan Menjalankan

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/arifquuu/webmapping-fasilitas-untan.git
   cd webmapping-fasilitas-untan
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server Express:**
   ```bash
   npm start
   ```
   *Atau mode development:*
   ```bash
   npm run dev
   ```

4. **Buka di peramban (browser):**
   Akses [http://localhost:3000](http://localhost:3000) pada browser Anda.
