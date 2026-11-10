const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: daftar semua layer tersedia
app.get('/api/layers', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  fs.readdir(dataDir, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const layers = files
      .filter(f => f.endsWith('.geojson'))
      .map(f => ({
        name: f.replace('.geojson', ''),
        file: `/api/data/${f.replace('.geojson', '')}`
      }));
    res.json(layers);
  });
});

// API: ambil satu file GeoJSON
app.get('/api/data/:file', (req, res) => {
  const filePath = path.join(__dirname, 'data', `${req.params.file}.geojson`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON' });
    }
  });
});

// API: statistik jumlah fitur per kategori
app.get('/api/stats/kategori', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'titik_favorit.geojson');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const geojson = JSON.parse(data);
    const stats = {};
    geojson.features.forEach(f => {
      const kat = (f.properties && f.properties.kategori) || 'lainnya';
      stats[kat] = (stats[kat] || 0) + 1;
    });
    res.json(stats);
  });
});

// API: simpan fitur baru (digitasi)
app.post('/api/feature/:layer', (req, res) => {
  const filePath = path.join(__dirname, 'data', `${req.params.layer}.geojson`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Layer not found' });
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const geojson = JSON.parse(data);
    if (!geojson.features) geojson.features = [];
    geojson.features.push(req.body.feature);
    fs.writeFile(filePath, JSON.stringify(geojson, null, 2), (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, total: geojson.features.length });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
