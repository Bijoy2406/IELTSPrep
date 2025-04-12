const { SpeakingSchedule, User, Test } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

/**
 * @desc    Create a new speaking test schedule
 * @route   POST /api/speaking-tests/schedule
 * @access  Private
 */
const createSpeakingSchedule = asyncHandler(async (req, res) => {
  const { testId, scheduledDate, duration, notes } = req.body;

  // Check if test exists if testId is provided
  if (testId) {
    const test = await Test.findByPk(testId);
    if (!test) {
      res.status(404);
      throw new Error('Test not found');
    }

    // Check if test is a speaking test
    if (test.type !== 'speaking') {
      res.status(400);
      throw new Error('Test must be a speaking test');
    }
  }

  // Create schedule
  const speakingSchedule = await SpeakingSchedule.create({
    userId: req.user.id,
    testId,
    scheduledDate,
    duration: duration || 15,
    notes,
    status: 'scheduled'
  });

  res.status(201).json({
    success: true,
    data: speakingSchedule
  });
});

/**
 * @desc    Get user's speaking schedules
 * @route   GET /api/speaking-tests/schedules
 * @access  Private
 */
const getUserSpeakingSchedules = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = { userId: req.user.id };
  if (status) filter.status = status;

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get user's speaking schedules
  const schedules = await SpeakingSchedule.findAndCountAll({
    where: filter,
    include: [
      {
        model: Test,
        as: 'test'
      },
      {
        model: User,
        as: 'examiner',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['scheduledDate', 'DESC']]
  });

  // Calculate total pages
  const totalPages = Math.ceil(schedules.count / limit);

  res.json({
    success: true,
    data: schedules.rows,
    pagination: {
      total: schedules.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get all speaking schedules (admin only)
 * @route   GET /api/speaking-tests/all-schedules
 * @access  Private/Admin
 */
const getAllSpeakingSchedules = asyncHandler(async (req, res) => {
  const { status, userId, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.userId = userId;

  // Filter for upcoming schedules that need an examiner
  const upcoming = req.query.upcoming === 'true';
  if (upcoming) {
    filter.examinerUserId = null;
    filter.scheduledDate = {
      [Op.gt]: new Date()
    };
    filter.status = 'scheduled';
  }

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get speaking schedules
  const schedules = await SpeakingSchedule.findAndCountAll({
    where: filter,
    include: [
      {
        model: Test,
        as: 'test'
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: User,
        as: 'examiner',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['scheduledDate', 'ASC']]
  });

  // Calculate total pages
  const totalPages = Math.ceil(schedules.count / limit);

  res.json({
    success: true,
    data: schedules.rows,
    pagination: {
      total: schedules.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get a speaking schedule by ID
 * @route   GET /api/speaking-tests/schedules/:id
 * @access  Private
 */
const getSpeakingScheduleById = asyncHandler(async (req, res) => {
  // Admin check
  const isAdmin = req.user.role === 'admin';

  // Set up filter based on user role
  const filter = { id: req.params.id };
  if (!isAdmin) {
    // If not admin, user can only see their own schedules or ones they're examining
    filter[Op.or] = [
      { userId: req.user.id },
      { examinerUserId: req.user.id }
    ];
  }

  const schedule = await SpeakingSchedule.findOne({
    where: filter,
    include: [
      {
        model: Test,
        as: 'test'
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: User,
        as: 'examiner',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: TestAttempt,
        as: 'testAttempt'
      }
    ]
  });

  if (!schedule) {
    res.status(404);
    throw new Error('Speaking schedule not found or not authorized');
  }

  res.json({
    success: true,
    data: schedule
  });
});

/**
 * @desc    Assign an examiner to a speaking schedule
 * @route   PUT /api/speaking-tests/schedules/:id/assign
 * @access  Private/Admin
 */
const assignExaminer = asyncHandler(async (req, res) => {
  const { examinerId, meetingLink } = req.body;

  // Find schedule
  const schedule = await SpeakingSchedule.findByPk(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Speaking schedule not found');
  }

  // Check if the schedule is already assigned
  if (schedule.examinerUserId) {
    res.status(400);
    throw new Error('This schedule already has an examiner');
  }

  // Check if the examiner exists
  const examiner = await User.findOne({
    where: {
      id: examinerId,
      role: 'admin'
    }
  });

  if (!examiner) {
    res.status(404);
    throw new Error('Examiner not found or is not an admin');
  }

  // Update schedule
  await schedule.update({
    examinerUserId: examinerId,
    meetingLink
  });

  res.json({
    success: true,
    message: 'Examiner assigned successfully',
    data: schedule
  });
});

/**
 * @desc    Update speaking schedule status
 * @route   PUT /api/speaking-tests/schedules/:id
 * @access  Private
 */
const updateSpeakingSchedule = asyncHandler(async (req, res) => {
  const { status, notes, meetingLink, scheduledDate } = req.body;

  // Find schedule
  let schedule = await SpeakingSchedule.findByPk(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Speaking schedule not found');
  }

  // Check authorization
  const isAdmin = req.user.role === 'admin';
  const isOwner = schedule.userId === req.user.id;
  const isExaminer = schedule.examinerUserId === req.user.id;

  if (!isAdmin && !isOwner && !isExaminer) {
    res.status(403);
    throw new Error('Not authorized to update this schedule');
  }

  // Create update object
  const updateData = {};
  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;
  if (meetingLink && (isAdmin || isExaminer)) updateData.meetingLink = meetingLink;
  if (scheduledDate && (isAdmin || isExaminer)) updateData.scheduledDate = scheduledDate;

  // Update schedule
  schedule = await schedule.update(updateData);

  res.json({
    success: true,
    message: 'Schedule updated successfully',
    data: schedule
  });
});

/**
 * @desc    Cancel a speaking schedule
 * @route   DELETE /api/speaking-tests/schedules/:id
 * @access  Private
 */
const cancelSpeakingSchedule = asyncHandler(async (req, res) => {
  // Find schedule
  const schedule = await SpeakingSchedule.findByPk(req.params.id);

  if (!schedule) {
    res.status(404);
    throw new Error('Speaking schedule not found');
  }

  // Check authorization
  const isAdmin = req.user.role === 'admin';
  const isOwner = schedule.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to cancel this schedule');
  }

  // Check if the schedule is already completed
  if (schedule.status === 'completed') {
    res.status(400);
    throw new Error('Cannot cancel a completed schedule');
  }

  // Update status to cancelled
  await schedule.update({
    status: 'cancelled'
  });

  res.json({
    success: true,
    message: 'Schedule cancelled successfully'
  });
});

module.exports = {
  createSpeakingSchedule,
  getUserSpeakingSchedules,
  getAllSpeakingSchedules,
  getSpeakingScheduleById,
  assignExaminer,
  updateSpeakingSchedule,
  cancelSpeakingSchedule
};
