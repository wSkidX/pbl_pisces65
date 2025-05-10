const express = require('express');
const JadwalController = require('../controllers/jadwalController');

const router = express.Router();

router.post('/jadwals', JadwalController.createJadwal);
router.get('/jadwals', JadwalController.getJadwals);
router.get('/jadwals/:id', JadwalController.getJadwalById);
router.put('/jadwals/:id', JadwalController.updateJadwal);
router.delete('/jadwals/:id', JadwalController.deleteJadwal);

module.exports = router;
