const express = require('express');
const router = express.Router();
const {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  addQuestion,
  startTest,
  submitAnswer,
  completeTest,
  getUserTestAttempts,
  getTestAttemptById,
  reviewTestAttempt
} = require('../controllers/testController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Protected routes
router.route('/')
  .get(protect, getAllTests)
  .post(protect, admin, createTest);

router.route('/:id')
  .get(protect, getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

router.post('/:id/questions', protect, admin, addQuestion);
router.post('/:id/start', protect, startTest);

// Test attempt routes
router.get('/attempts', protect, getUserTestAttempts);
router.get('/attempts/:id', protect, getTestAttemptById);
router.post('/attempts/:attemptId/answers', protect, submitAnswer);
router.post('/attempts/:attemptId/complete', protect, completeTest);
router.put('/attempts/:id/review', protect, admin, reviewTestAttempt);

module.exports = router;
