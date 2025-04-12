const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

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
    lastLogin: new Date()
  });

  if (user) {
    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        token
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ where: { email } });

  // Check if user exists and password is correct
  if (user && (await user.matchPassword(password))) {
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data
    res.json({
      success: true,
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        token
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Clear cookie
  res.clearCookie('jwt');

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // Get user from request (set by auth middleware)
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (user) {
    res.json({
      success: true,
      data: user
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  // Get user from request (set by auth middleware)
  const user = await User.findByPk(req.user.id);

  if (user) {
    // Update fields that are sent
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.targetBand = req.body.targetBand || user.targetBand;
    user.examDate = req.body.examDate || user.examDate;
    user.profileImage = req.body.profileImage || user.profileImage;

    // If password is included, update it (hashing happens in model hook)
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save user
    const updatedUser = await user.save();

    // Return updated user
    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        role: updatedUser.role,
        targetBand: updatedUser.targetBand,
        examDate: updatedUser.examDate,
        profileImage: updatedUser.profileImage
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};
