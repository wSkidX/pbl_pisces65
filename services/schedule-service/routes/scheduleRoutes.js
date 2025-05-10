const express = require('express');
const ScheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('/schedules', ScheduleController.createSchedule);
router.get('/schedules', ScheduleController.getSchedules);
router.get('/schedules/:id', ScheduleController.getScheduleById);
router.put('/schedules/:id', ScheduleController.updateSchedule);
router.delete('/schedules/:id', ScheduleController.deleteSchedule);

module.exports = router;
