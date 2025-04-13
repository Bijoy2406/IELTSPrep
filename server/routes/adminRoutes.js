const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTestStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All routes are protected by admin middleware
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/test-stats', protect, admin, getTestStats);

router.route('/users')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, createUser);

router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
