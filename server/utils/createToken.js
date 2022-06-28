const jwt = require('jsonwebtoken');

/**
 * Create a token using JWT
 * @param {*} userId ID of the user for payload of token
 * @param {number} duration duration fo token in seconds
 */
const createToken = (userId, duration = 60 * 60 * 24) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ id: userId }, secretKey, { expiresIn: duration });
};

module.exports = createToken;
