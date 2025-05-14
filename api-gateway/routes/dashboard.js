const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint: GET /dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Dummy user, ganti sesuai implementasi JWT jika sudah ada
    const user = {
      id: 1,
      username: 'admin'
    };

    // Panggil semua endpoint yang sudah ada dan pasti tersedia
    const [sensorStatusRes, sensorLogsRes, sensorSystemStatusRes, nextScheduleRes, lastFeedingRes] = await Promise.all([
      axios.get('http://localhost:8080/sensor/status'),         // Semua data real-time sensor
      axios.get('http://localhost:8080/sensor/logs'),           // Histori feeding
      axios.get('http://localhost:8080/sensor/system_status'),  // Status/error sistem
      axios.get('http://localhost:8080/jadwal/next'),           // Jadwal berikutnya
      axios.get('http://localhost:8080/jadwal/last_feeding_log')// Log feeding terakhir
    ]);

    res.json({
      user,
      sensor_status: sensorStatusRes.data,
      feeding_logs: sensorLogsRes.data,
      system_status: sensorSystemStatusRes.data,
      next_schedule: nextScheduleRes.data,
      last_feeding_log: lastFeedingRes.data
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data', detail: err.message });
  }
});

module.exports = router;
