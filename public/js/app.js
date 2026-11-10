// ===========================================================
// PETA FASILITAS UNTAN — Versi v2
// Clustering + Filter Kategori + State Terpusat
// (sudah termasuk perubahan Latihan 4 & opsi Latihan 5)
// ===========================================================

// ---------- KONFIGURASI ----------
const MAP_CENTER = [-0.0575, 109.3450];
const MAP_ZOOM = 16;

const WARNA_KATEGORI = {
  'kafe':    '#fbc02d', // Latihan 4: diubah dari merah (#c62828) ke kuning
  'belajar': '#1565c0',
  'kuliner': '#ef6c00',
  'lainnya': '#6a1b9a'
};

// Latihan 4: ambang batas graduasi kapasitas diubah
// (asli: >=100 merah, >=60 oranye, >=30 kuning, sisanya hijau muda)
function warnaKapasitas(kapasitas) {
  if (kapasitas >= 80) return '#b71c1c';
  if (kapasitas >= 50) return '#ef6c00';
  if (kapasitas >= 25) return '#fff176';
  return '#a5d6a7';
}

// Latihan 5: kategori yang diberi label (rule-based labeling).
// Ganti ke 'kuliner' untuk melihat hasil Latihan 5.
const LABEL_KATEGORI = 'kafe';

// ---------- STATE TERPUSAT ----------
const state = {
  showLabels: true,
  cluster: false,
  filters: { kafe: true, belajar: true, kuliner: true }
};

// ---------- PENYIMPANAN DATA MENTAH ----------
const rawData = { titik: null, parkir: null, jalan: null, batas: null };

// ---------- REFERENSI LAYER YANG SEDANG AKTIF ----------
const activeLayers = {
  titik: null,        // dirender ulang saat filter/cluster berubah
  parkir: null,
  jalan: null,
  batas: null
};

// Wrapper tetap agar Titik Favorit bisa di-toggle lewat layer control
const titikWrapper = L.layerGroup();
const parkirWrapper = L.layerGroup();

// ---------- INISIALISASI PETA ----------
const map = L.map('map', { center: MAP_CENTER, zoom: MAP_ZOOM, zoomControl: true });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// ---------- HELPER: IKON LINGKARAN UNTUK CLUSTER ----------
function createCircleIcon(color) {
  return L.divIcon({
    className: 'custom-circle-marker',
    html: `<span style="display:block;width:16px;height:16px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
}

// ---------- HELPER: POPUP (Topik 2) ----------
function buildPopupHTML(feature) {
  const props = feature.properties || {};
  let html = '<div style="min-width:200px">';
  html += `<h4>${props.nama || 'Tanpa Nama'}</h4><table>`;
  Object.keys(props).forEach(key => {
    if (key === 'nama') return;
    html += `<tr><td>${key}</td><td>${props[key]}</td></tr>`;
  });
  html += '</table></div>';
  return html;
}

// ---------- HELPER: LABEL (Topik 6) ----------
function bindLabel(layer, feature) {
  const nama = feature.properties && feature.properties.nama;
  if (!nama) return;
  layer.bindTooltip(nama, {
    permanent: true,
    direction: 'top',
    offset: [0, -10],
    className: 'label-fasilitas'
  });
}

// ---------- DIGITASI (Topik 3) ----------
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  position: 'topleft',
  draw: {
    polygon: {
      allowIntersection: false,
      shapeOptions: { color: '#6a1b9a', fillColor: '#ce93d8', fillOpacity: 0.5 }
    },
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false
  },
  edit: { featureGroup: drawnItems }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, async function (e) {
  const geojson = e.layer.toGeoJSON();
  const nama = prompt('Nama area parkir baru:', 'Parkir Baru');
  if (!nama) return;
  const kapasitas = parseInt(prompt('Kapasitas:', '20')) || 20;
  geojson.properties = { nama: nama, kapasitas: kapasitas, jenis: 'terbuka' };
  try {
    const res = await fetch('/api/feature/parkir_kampus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: geojson })
    });
    if (!res.ok) throw new Error('Gagal menyimpan');
    const result = await res.json();
    alert(`Area "${nama}" tersimpan. Total: ${result.total}`);
    location.reload();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
});

// ---------- RENDER TITIK (Cluster + Filter) ----------
function renderTitik() {
  titikWrapper.clearLayers();
  if (!rawData.titik) return;

  const container = state.cluster
    ? L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      })
    : L.layerGroup();

  rawData.titik.features.forEach(f => {
    const kat = f.properties.kategori || 'lainnya';
    if (state.filters[kat] === false) return; // FILTER

    const latlng = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
    const color = WARNA_KATEGORI[kat] || WARNA_KATEGORI.lainnya;
    const marker = L.marker(latlng, { icon: createCircleIcon(color) });
    marker.bindPopup(buildPopupHTML(f));

    if (state.showLabels && kat === LABEL_KATEGORI) bindLabel(marker, f);

    marker.__kategori = kat;
    container.addLayer(marker);
  });

  titikWrapper.addLayer(container);
  activeLayers.titik = container;
}

// ---------- RENDER PARKIR ----------
function renderParkir() {
  parkirWrapper.clearLayers();
  if (!rawData.parkir) return;
  const layer = L.geoJSON(rawData.parkir, {
    style: (f) => ({
      color: '#fff',
      weight: 2,
      fillColor: warnaKapasitas(f.properties.kapasitas || 0),
      fillOpacity: 0.75
    }),
    onEachFeature: (f, l) => {
      l.bindPopup(buildPopupHTML(f));
      if (state.showLabels) bindLabel(l, f);
    }
  });
  parkirWrapper.addLayer(layer);
  activeLayers.parkir = layer;
}

// ---------- RENDER BATAS & JALAN (statis) ----------
function renderBatas() {
  if (!rawData.batas) return;
  activeLayers.batas = L.geoJSON(rawData.batas, {
    style: { color: '#2e7d32', weight: 2, fillColor: '#a5d6a7', fillOpacity: 0.25, dashArray: '6 4' },
    onEachFeature: (f, l) => l.bindPopup(buildPopupHTML(f))
  }).addTo(map);
}

function renderJalan() {
  if (!rawData.jalan) return;
  activeLayers.jalan = L.geoJSON(rawData.jalan, {
    style: (f) => {
      if (f.properties.kelas === 'primary') return { color: '#374151', weight: 5, opacity: 0.8 };
      return { color: '#6b7280', weight: 3, opacity: 0.7 };
    },
    onEachFeature: (f, l) => l.bindPopup(buildPopupHTML(f))
  }).addTo(map);
}

// ---------- MUAT SEMUA DATA (Topik 4) ----------
async function muatSemuaData() {
  try {
    const [titik, batas, parkir, jalan] = await Promise.all([
      fetch('/api/data/titik_favorit').then(r => r.json()),
      fetch('/api/data/batas_kampus').then(r => r.json()),
      fetch('/api/data/parkir_kampus').then(r => r.json()),
      fetch('/api/data/jalan').then(r => r.json())
    ]);
    rawData.titik = titik;
    rawData.batas = batas;
    rawData.parkir = parkir;
    rawData.jalan = jalan;

    // Urutan render: bawah ke atas
    renderJalan();
    renderBatas();
    parkirWrapper.addTo(map);
    renderParkir();
    titikWrapper.addTo(map);
    renderTitik();

    L.control.layers(null, {
      'Titik Favorit': titikWrapper,
      'Batas Kampus': activeLayers.batas,
      'Area Parkir': parkirWrapper,
      'Jaringan Jalan': activeLayers.jalan
    }, { collapsed: false, position: 'topright' }).addTo(map);

    const stats = await fetch('/api/stats/kategori').then(r => r.json());
    renderStatistik(stats);
  } catch (err) {
    console.error(err);
    document.getElementById('stats').innerHTML =
      '<p style="color:#c62828">Gagal memuat. Pastikan server berjalan.</p>';
  }
}

// ---------- STATISTIK ----------
function renderStatistik(stats) {
  const box = document.getElementById('stats');
  let html = '<ul>';
  Object.entries(stats).forEach(([kat, count]) => {
    const color = WARNA_KATEGORI[kat] || '#6a1b9a';
    html += `<li><span style="display:inline-block;width:10px;height:10px;background:${color};border-radius:50%;margin-right:6px"></span>${kat}: <strong>${count}</strong></li>`;
  });
  html += '</ul>';
  box.innerHTML = html;
}

// ---------- EVENT: FILTER KATEGORI ----------
document.querySelectorAll('.filter-kategori').forEach(cb => {
  cb.addEventListener('change', e => {
    state.filters[e.target.value] = e.target.checked;
    renderTitik();
  });
});

// ---------- EVENT: TOGGLE LABEL ----------
document.getElementById('toggleLabels').addEventListener('change', e => {
  state.showLabels = e.target.checked;
  renderTitik();
  renderParkir();
});

// ---------- EVENT: TOGGLE CLUSTER ----------
document.getElementById('toggleCluster').addEventListener('change', e => {
  state.cluster = e.target.checked;
  renderTitik();
});

// ---------- JALANKAN ----------
muatSemuaData();
