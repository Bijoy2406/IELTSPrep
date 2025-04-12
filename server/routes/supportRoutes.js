const express = require('express');
const router = express.Router();
const {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  addTicketMessage,
  markMessagesAsRead
} = require('../controllers/supportController');
const { protect, admin } = require('../middlewares/authMiddleware');

// User routes
router.route('/tickets')
  .get(protect, getUserTickets)
  .post(protect, createTicket);

router.route('/tickets/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket);

router.post('/tickets/:id/messages', protect, addTicketMessage);
router.put('/tickets/:id/read', protect, markMessagesAsRead);

// Admin routes
router.get('/all-tickets', protect, admin, getAllTickets);

module.exports = router;
