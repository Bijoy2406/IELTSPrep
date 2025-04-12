const express = require('express');
const router = express.Router();
const {
  createSpeakingSchedule,
  getUserSpeakingSchedules,
  getAllSpeakingSchedules,
  getSpeakingScheduleById,
  assignExaminer,
  updateSpeakingSchedule,
  cancelSpeakingSchedule
} = require('../controllers/speakingController');
const { protect, admin } = require('../middlewares/authMiddleware');

// User routes
router.post('/schedule', protect, createSpeakingSchedule);
router.get('/schedules', protect, getUserSpeakingSchedules);
router.get('/schedules/:id', protect, getSpeakingScheduleById);
router.put('/schedules/:id', protect, updateSpeakingSchedule);
router.delete('/schedules/:id', protect, cancelSpeakingSchedule);

// Admin routes
router.get('/all-schedules', protect, admin, getAllSpeakingSchedules);
router.put('/schedules/:id/assign', protect, admin, assignExaminer);

module.exports = router;
