/**
 * Routes untuk Notification
 * Menggunakan pendekatan DDD dengan resource-based URL
 * Menggunakan shared middleware autentikasi
 */
const express = require('express');
const NotificationController = require('../controllers/notificationController');

// Import shared middleware
// Catatan: Perlu menambahkan dependency di package.json:
// "pisces65-shared": "file:../../shared"
const { authMiddleware } = require('pisces65-shared');

const router = express.Router();

// CRUD operations dengan resource-based URL - memerlukan autentikasi
router.post('/notifications', authMiddleware.authenticateJWT, NotificationController.createNotification);       // Create notifikasi baru
router.get('/notifications', authMiddleware.authenticateJWT, NotificationController.getUserNotifications);      // Get notifikasi user
router.get('/notifications/unread', authMiddleware.authenticateJWT, NotificationController.getUnreadNotifications); // Get notifikasi belum dibaca
router.get('/notifications/unread/count', authMiddleware.authenticateJWT, NotificationController.getUnreadCount);   // Get jumlah notifikasi belum dibaca
router.put('/notifications/:id/read', authMiddleware.authenticateJWT, NotificationController.markAsRead);       // Tandai notifikasi sebagai dibaca
router.put('/notifications/read-all', authMiddleware.authenticateJWT, NotificationController.markAllAsRead);    // Tandai semua notifikasi sebagai dibaca

// Endpoint untuk domain actions - memerlukan autentikasi
router.post('/events/feed-level-low', authMiddleware.authenticateJWT, NotificationController.createFeedLevelLowNotification);       // Notifikasi feed level rendah
router.post('/events/water-level-low', authMiddleware.authenticateJWT, NotificationController.createWaterLevelLowNotification);     // Notifikasi water level rendah
router.post('/events/feeding-success', authMiddleware.authenticateJWT, NotificationController.createFeedingSuccessNotification);    // Notifikasi feeding berhasil
router.post('/events/feeding-failed', authMiddleware.authenticateJWT, NotificationController.createFeedingFailedNotification);      // Notifikasi feeding gagal

module.exports = router;
