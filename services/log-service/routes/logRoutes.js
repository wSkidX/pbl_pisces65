const express = require('express');
const LogController = require('../controllers/logController');

const router = express.Router();

router.post('/logs', LogController.createLog);
router.get('/logs', LogController.getLogs);
router.get('/logs/:id', LogController.getLogById);
router.put('/logs/:id', LogController.updateLog);
router.delete('/logs/:id', LogController.deleteLog);

module.exports = router;
