const { User, Test, TestAttempt, SupportTicket, SpeakingSchedule } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total users count
  const totalUsers = await User.count({
    where: { role: 'user' }
  });

  // Get new users in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newUsers = await User.count({
    where: {
      role: 'user',
      createdAt: {
        [Op.gte]: thirtyDaysAgo
      }
    }
  });

  // Get total tests count
  const totalTests = await Test.count();

  // Get total test attempts
  const totalAttempts = await TestAttempt.count();

  // Get pending writing/speaking reviews
  const pendingReviews = await TestAttempt.count({
    where: {
      status: 'submitted'
    },
    include: [
      {
        model: Test,
        as: 'test',
        where: {
          type: {
            [Op.in]: ['writing', 'speaking']
          }
        }
      }
    ]
  });

  // Get open support tickets
  const openTickets = await SupportTicket.count({
    where: {
      status: {
        [Op.in]: ['open', 'in-progress']
      }
    }
  });

  // Get upcoming speaking schedules that need assignment
  const upcomingSpeakingTests = await SpeakingSchedule.count({
    where: {
      examinerUserId: null,
      scheduledDate: {
        [Op.gt]: new Date()
      },
      status: 'scheduled'
    }
  });

  // Return stats
  res.json({
    success: true,
    data: {
      totalUsers,
      newUsers,
      totalTests,
      totalAttempts,
      pendingReviews,
      openTickets,
      upcomingSpeakingTests
    }
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Get query parameters
  const { search, page = 1, limit = 10 } = req.query;

  // Build filter object for search
  let filter = {};
  if (search) {
    filter = {
      [Op.or]: [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };
  }

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get users
  const users = await User.findAndCountAll({
    where: filter,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  // Calculate total pages
  const totalPages = Math.ceil(users.count / limit);

  res.json({
    success: true,
    data: users.rows,
    pagination: {
      total: users.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get a user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: TestAttempt,
        as: 'testAttempts',
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Test,
            as: 'test'
          }
        ]
      },
      {
        model: SupportTicket,
        as: 'supportTickets',
        limit: 5,
        order: [['createdAt', 'DESC']]
      }
    ]
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * @desc    Create a new admin user
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    role: role || 'user'
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Update a user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, role, isActive } = req.body;

  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user
  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.email = email || user.email;

  // Only update role if provided
  if (role) {
    user.role = role;
  }

  // Only update isActive if provided
  if (isActive !== undefined) {
    user.isActive = isActive;
  }

  // If password included, it will be hashed by the User model hooks
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      id: updatedUser.id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    }
  });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deleting oneself
  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  await user.destroy();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Get test statistics
 * @route   GET /api/admin/test-stats
 * @access  Private/Admin
 */
const getTestStats = asyncHandler(async (req, res) => {
  // Get test completion statistics by test type
  const testAttemptsByType = await TestAttempt.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    include: [
      {
        model: Test,
        as: 'test',
        attributes: ['type']
      }
    ],
    group: ['test.type']
  });

  // Get average scores by test type
  const avgScoresByType = await TestAttempt.findAll({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('bandScore')), 'avgBandScore']
    ],
    where: {
      bandScore: {
        [Op.not]: null
      }
    },
    include: [
      {
        model: Test,
        as: 'test',
        attributes: ['type']
      }
    ],
    group: ['test.type']
  });

  // Get tests by difficulty
  const testsByDifficulty = await Test.count({
    attributes: ['difficultyLevel'],
    group: ['difficultyLevel']
  });

  res.json({
    success: true,
    data: {
      testAttemptsByType,
      avgScoresByType,
      testsByDifficulty
    }
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTestStats
};
