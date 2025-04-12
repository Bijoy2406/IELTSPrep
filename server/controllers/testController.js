const { Test, Question, TestAttempt, Answer, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

/**
 * @desc    Create a new test
 * @route   POST /api/tests
 * @access  Private/Admin
 */
const createTest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    difficultyLevel,
    duration,
    instructions,
    isPremium
  } = req.body;

  // Create test
  const test = await Test.create({
    title,
    description,
    type,
    difficultyLevel,
    duration,
    instructions,
    isPremium: isPremium || false,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: test
  });
});

/**
 * @desc    Get all tests
 * @route   GET /api/tests
 * @access  Private
 */
const getAllTests = asyncHandler(async (req, res) => {
  // Get query parameters
  const { type, difficulty, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (type) filter.type = type;
  if (difficulty) filter.difficultyLevel = difficulty;

  // Only show active tests to regular users
  if (req.user.role !== 'admin') {
    filter.isActive = true;
  }

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Find tests
  const tests = await Test.findAndCountAll({
    where: filter,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'firstname', 'lastname']
      }
    ]
  });

  // Calculate total pages
  const totalPages = Math.ceil(tests.count / limit);

  res.json({
    success: true,
    data: tests.rows,
    pagination: {
      total: tests.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get a single test by ID
 * @route   GET /api/tests/:id
 * @access  Private
 */
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'firstname', 'lastname']
      },
      {
        model: Question,
        as: 'questions',
        // Do not include correctAnswer unless user is admin
        attributes: req.user.role === 'admin'
          ? undefined
          : { exclude: ['correctAnswer'] },
        order: [['order', 'ASC']]
      }
    ]
  });

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // If test is not active and user is not admin, deny access
  if (!test.isActive && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to access this test');
  }

  res.json({
    success: true,
    data: test
  });
});

/**
 * @desc    Update a test
 * @route   PUT /api/tests/:id
 * @access  Private/Admin
 */
const updateTest = asyncHandler(async (req, res) => {
  let test = await Test.findByPk(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Update test fields
  test = await test.update(req.body);

  res.json({
    success: true,
    data: test
  });
});

/**
 * @desc    Delete a test
 * @route   DELETE /api/tests/:id
 * @access  Private/Admin
 */
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findByPk(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  await test.destroy();

  res.json({
    success: true,
    message: 'Test deleted successfully'
  });
});

/**
 * @desc    Add a question to a test
 * @route   POST /api/tests/:id/questions
 * @access  Private/Admin
 */
const addQuestion = asyncHandler(async (req, res) => {
  const test = await Test.findByPk(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Get max order from existing questions
  const lastQuestion = await Question.findOne({
    where: { testId: test.id },
    order: [['order', 'DESC']]
  });

  const order = lastQuestion ? lastQuestion.order + 1 : 0;

  // Create question
  const question = await Question.create({
    ...req.body,
    testId: test.id,
    order
  });

  res.status(201).json({
    success: true,
    data: question
  });
});

/**
 * @desc    Start a test attempt
 * @route   POST /api/tests/:id/start
 * @access  Private
 */
const startTest = asyncHandler(async (req, res) => {
  const test = await Test.findByPk(req.params.id, {
    include: [
      {
        model: Question,
        as: 'questions',
        attributes: { exclude: ['correctAnswer'] },
        order: [['order', 'ASC']]
      }
    ]
  });

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // If test is not active and user is not admin, deny access
  if (!test.isActive && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to access this test');
  }

  // Check if user already has an in-progress attempt for this test
  const existingAttempt = await TestAttempt.findOne({
    where: {
      userId: req.user.id,
      testId: test.id,
      status: 'in-progress'
    }
  });

  // If there's an existing attempt, return it instead of creating a new one
  if (existingAttempt) {
    return res.json({
      success: true,
      message: 'Resumed existing test attempt',
      data: {
        testAttempt: existingAttempt,
        test
      }
    });
  }

  // Create new test attempt
  const testAttempt = await TestAttempt.create({
    userId: req.user.id,
    testId: test.id,
    startTime: new Date(),
    status: 'in-progress'
  });

  res.json({
    success: true,
    message: 'Test started successfully',
    data: {
      testAttempt,
      test
    }
  });
});

/**
 * @desc    Submit an answer for a question
 * @route   POST /api/tests/attempts/:attemptId/answers
 * @access  Private
 */
const submitAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { questionId, answerText, selectedOptions, timeSpent, audioRecording } = req.body;

  // Find the test attempt
  const testAttempt = await TestAttempt.findOne({
    where: {
      id: attemptId,
      userId: req.user.id
    },
    include: [
      {
        model: Test,
        as: 'test',
        include: [
          {
            model: Question,
            as: 'questions',
            where: { id: questionId }
          }
        ]
      }
    ]
  });

  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found or not authorized');
  }

  if (testAttempt.status !== 'in-progress') {
    res.status(400);
    throw new Error('This test attempt is no longer in progress');
  }

  // Check if question exists in the test
  if (!testAttempt.test.questions || testAttempt.test.questions.length === 0) {
    res.status(404);
    throw new Error('Question not found in this test');
  }

  const question = testAttempt.test.questions[0];

  // Check if an answer already exists for this question
  let answer = await Answer.findOne({
    where: {
      testAttemptId: attemptId,
      questionId
    }
  });

  // Determine if answer is correct for objective questions
  let isCorrect = null;
  let score = null;

  if (['multiple-choice', 'true-false', 'matching', 'fill-blank'].includes(question.questionType)) {
    // For objective questions, check correctness
    if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
      // Convert to array for consistency
      const selected = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
      const correct = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : JSON.parse(question.correctAnswer);

      // Simple array comparison - correct if selected options match exactly
      isCorrect =
        selected.length === correct.length &&
        selected.every(item => correct.includes(item));

      // Award full marks if correct, zero if incorrect
      score = isCorrect ? question.marks : 0;
    }
    else if (question.questionType === 'matching' || question.questionType === 'fill-blank') {
      // For matching and fill-blank, we need more complex logic
      // This is a simplified implementation
      const userAnswers = typeof selectedOptions === 'string'
        ? JSON.parse(selectedOptions)
        : selectedOptions;

      const correctAnswers = typeof question.correctAnswer === 'string'
        ? JSON.parse(question.correctAnswer)
        : question.correctAnswer;

      // Count how many answers are correct
      let correctCount = 0;
      const totalAnswers = Object.keys(correctAnswers).length;

      for (const key in correctAnswers) {
        if (userAnswers[key] && userAnswers[key] === correctAnswers[key]) {
          correctCount++;
        }
      }

      // Calculate partial score
      score = (correctCount / totalAnswers) * question.marks;
      isCorrect = correctCount === totalAnswers;
    }
  }

  // Create or update the answer
  if (answer) {
    // Update existing answer
    answer = await answer.update({
      answerText,
      selectedOptions,
      isCorrect,
      score,
      timeSpent,
      audioRecording
    });
  } else {
    // Create new answer
    answer = await Answer.create({
      testAttemptId: attemptId,
      questionId,
      answerText,
      selectedOptions,
      isCorrect,
      score,
      timeSpent,
      audioRecording
    });
  }

  res.json({
    success: true,
    data: answer
  });
});

/**
 * @desc    Complete a test attempt
 * @route   POST /api/tests/attempts/:attemptId/complete
 * @access  Private
 */
const completeTest = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  // Find the test attempt
  const testAttempt = await TestAttempt.findOne({
    where: {
      id: attemptId,
      userId: req.user.id
    },
    include: [
      {
        model: Test,
        as: 'test',
        include: [
          {
            model: Question,
            as: 'questions'
          }
        ]
      },
      {
        model: Answer,
        as: 'answers'
      }
    ]
  });

  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found or not authorized');
  }

  if (testAttempt.status !== 'in-progress') {
    res.status(400);
    throw new Error('This test attempt is already completed');
  }

  // Calculate total score for objective questions
  let totalScore = 0;
  let totalPossibleScore = 0;
  let answeredQuestions = 0;

  // Calculate score
  for (const question of testAttempt.test.questions) {
    totalPossibleScore += question.marks;

    // Find the answer for this question
    const answer = testAttempt.answers.find(a => a.questionId === question.id);

    if (answer) {
      answeredQuestions++;

      // For objective questions, we already calculated the score when submitting
      if (['multiple-choice', 'true-false', 'matching', 'fill-blank'].includes(question.questionType)) {
        totalScore += answer.score || 0;
      }
    }
  }

  // Calculate band score (a simplified version - real IELTS uses complex band calculations)
  // This maps the percentage score to a band from 0-9 with 0.5 increments
  const percentageScore = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) : 0;
  let bandScore = Math.floor(percentageScore * 9);

  // Add 0.5 for half bands if the decimal part is between 0.25 and 0.75
  const decimalPart = (percentageScore * 9) - bandScore;
  if (decimalPart >= 0.25 && decimalPart < 0.75) {
    bandScore += 0.5;
  } else if (decimalPart >= 0.75) {
    bandScore += 1;
  }

  // For writing and speaking tests, band scores are calculated by humans
  if (['writing', 'speaking'].includes(testAttempt.test.type)) {
    // Mark as submitted rather than completed
    await testAttempt.update({
      endTime: new Date(),
      status: 'submitted'
    });

    res.json({
      success: true,
      message: 'Test submitted successfully and is pending review',
      data: {
        ...testAttempt.toJSON(),
        answeredQuestions,
        totalQuestions: testAttempt.test.questions.length
      }
    });
  } else {
    // For objective tests, mark as completed
    await testAttempt.update({
      endTime: new Date(),
      totalScore,
      bandScore,
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'Test completed successfully',
      data: {
        ...testAttempt.toJSON(),
        answeredQuestions,
        totalQuestions: testAttempt.test.questions.length,
        percentageScore: (percentageScore * 100).toFixed(2)
      }
    });
  }
});

/**
 * @desc    Get user's test attempts
 * @route   GET /api/tests/attempts
 * @access  Private
 */
const getUserTestAttempts = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = { userId: req.user.id };
  if (status) filter.status = status;

  // Add test type filter
  const testFilter = {};
  if (type) testFilter.type = type;

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get user's test attempts
  const attempts = await TestAttempt.findAndCountAll({
    where: filter,
    include: [
      {
        model: Test,
        as: 'test',
        where: Object.keys(testFilter).length > 0 ? testFilter : undefined
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['updatedAt', 'DESC']]
  });

  // Calculate total pages
  const totalPages = Math.ceil(attempts.count / limit);

  res.json({
    success: true,
    data: attempts.rows,
    pagination: {
      total: attempts.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get a test attempt by ID
 * @route   GET /api/tests/attempts/:id
 * @access  Private
 */
const getTestAttemptById = asyncHandler(async (req, res) => {
  // Add admin check
  const isAdmin = req.user.role === 'admin';
  const filter = { id: req.params.id };

  // If not admin, restrict to user's own attempts
  if (!isAdmin) {
    filter.userId = req.user.id;
  }

  const testAttempt = await TestAttempt.findOne({
    where: filter,
    include: [
      {
        model: Test,
        as: 'test',
        include: [
          {
            model: Question,
            as: 'questions',
            order: [['order', 'ASC']]
          }
        ]
      },
      {
        model: Answer,
        as: 'answers',
        include: [
          {
            model: Question,
            as: 'question'
          }
        ]
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: User,
        as: 'reviewer',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    ]
  });

  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found or not authorized');
  }

  res.json({
    success: true,
    data: testAttempt
  });
});

/**
 * @desc    Review a test attempt (for writing/speaking)
 * @route   PUT /api/tests/attempts/:id/review
 * @access  Private/Admin
 */
const reviewTestAttempt = asyncHandler(async (req, res) => {
  const { bandScore, feedback } = req.body;

  const testAttempt = await TestAttempt.findByPk(req.params.id, {
    include: [
      {
        model: Test,
        as: 'test'
      }
    ]
  });

  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Ensure the test is writing or speaking type
  if (!['writing', 'speaking'].includes(testAttempt.test.type)) {
    res.status(400);
    throw new Error('Only writing and speaking tests can be reviewed');
  }

  // Ensure the test is submitted
  if (testAttempt.status !== 'submitted') {
    res.status(400);
    throw new Error('Only submitted tests can be reviewed');
  }

  // Update test attempt with review
  await testAttempt.update({
    bandScore,
    feedback,
    feedbackBy: req.user.id,
    feedbackDate: new Date(),
    status: 'reviewed'
  });

  res.json({
    success: true,
    message: 'Test attempt reviewed successfully',
    data: testAttempt
  });
});

module.exports = {
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
};
