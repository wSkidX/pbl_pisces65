/**
 * Routes untuk User
 * Menggunakan pendekatan DDD dengan resource-based URL
 * Menggunakan middleware autentikasi untuk routes yang membutuhkan autentikasi
 */
const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateJWT, optionalAuthenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes - tidak memerlukan autentikasi
router.post('/auth/register', UserController.register);  // Register user baru
router.post('/auth/login', UserController.login);        // Login user
router.post('/auth/logout', UserController.logout);      // Logout user

// User resource routes - memerlukan autentikasi
router.get('/users', authenticateJWT, UserController.getAll);            // Get semua user
router.get('/users/:id', authenticateJWT, UserController.getById);       // Get user by ID
router.put('/users/:id', authenticateJWT, UserController.update);        // Update user
router.delete('/users/:id', authenticateJWT, UserController.delete);     // Delete user

// Profile route - mendapatkan data user yang sedang login
router.get('/profile', authenticateJWT, (req, res) => {
  // Redirect ke endpoint get user by id dengan id dari token
  req.params.id = req.userId;
  UserController.getById(req, res);
});

// Backward compatibility untuk API lama
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/', authenticateJWT, UserController.getAll);
router.get('/:id', authenticateJWT, UserController.getById);
router.put('/:id', authenticateJWT, UserController.update);
router.delete('/:id', authenticateJWT, UserController.delete);

module.exports = router;
