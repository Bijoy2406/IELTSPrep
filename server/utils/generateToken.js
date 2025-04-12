const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {number} id - User ID
 * @param {object} options - Additional options
 * @returns {string} - JWT token
 */
const generateToken = (id, options = {}) => {
  const payload = {
    id,
    ...options
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = generateToken;
