const express = require('express');
const JadwalController = require('../controllers/jadwalController');

const router = express.Router();

router.post('/add', JadwalController.createJadwal);
router.get('/get', JadwalController.getJadwals);
router.get('/get/:id', JadwalController.getJadwalById);
router.put('/update/:id', JadwalController.updateJadwal);
router.delete('/delete/:id', JadwalController.deleteJadwal);

// Endpoint tambahan untuk dashboard
router.get('/next', JadwalController.getNextJadwal);
router.get('/last_feeding_log', JadwalController.getLastFeedingLog);

module.exports = router;
