/**
 * Routes untuk FeedingSchedule
 * Menggunakan pendekatan DDD dengan resource-based URL
 * Menggunakan shared middleware autentikasi
 */
const express = require('express');
const JadwalController = require('../controllers/jadwalController');

// Import shared middleware
// Catatan: Perlu menambahkan dependency di package.json:
// "pisces65-shared": "file:../../shared"
const { authMiddleware } = require('pisces65-shared');

const router = express.Router();

// CRUD operations dengan resource-based URL - memerlukan autentikasi
router.post('/schedules', authMiddleware.authenticateJWT, JadwalController.createJadwal);       // Create jadwal baru
router.get('/schedules', authMiddleware.authenticateJWT, JadwalController.getJadwals);          // Get semua jadwal
router.get('/schedules/:id', authMiddleware.authenticateJWT, JadwalController.getJadwalById);   // Get jadwal by ID
router.put('/schedules/:id', authMiddleware.authenticateJWT, JadwalController.updateJadwal);    // Update jadwal
router.delete('/schedules/:id', authMiddleware.authenticateJWT, JadwalController.deleteJadwal); // Delete jadwal

// Endpoint untuk dashboard dan monitoring - opsional autentikasi
router.get('/schedules/next', authMiddleware.optionalAuthenticateJWT, JadwalController.getNextJadwal);          // Jadwal berikutnya
router.get('/feeding-logs/latest', authMiddleware.optionalAuthenticateJWT, JadwalController.getLastFeedingLog); // Log feeding terakhir

// Endpoint untuk domain actions - memerlukan autentikasi
router.post('/actions/execute-feedings', authMiddleware.authenticateJWT, JadwalController.executeScheduledFeedings); // Trigger feeding

// Backward compatibility untuk API lama - dengan autentikasi yang sama
router.post('/add', authMiddleware.authenticateJWT, JadwalController.createJadwal);
router.get('/get', authMiddleware.authenticateJWT, JadwalController.getJadwals);
router.get('/get/:id', authMiddleware.authenticateJWT, JadwalController.getJadwalById);
router.put('/update/:id', authMiddleware.authenticateJWT, JadwalController.updateJadwal);
router.delete('/delete/:id', authMiddleware.authenticateJWT, JadwalController.deleteJadwal);
router.get('/next', authMiddleware.optionalAuthenticateJWT, JadwalController.getNextJadwal);
router.get('/last_feeding_log', authMiddleware.optionalAuthenticateJWT, JadwalController.getLastFeedingLog);

module.exports = router;
