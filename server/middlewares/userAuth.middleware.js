/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const AuthError = require('../utils/customErrors/AuthError');
const sendError = require('../utils/sendError');

exports.userAuth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new AuthError('Su sesión expiró');

    const [_, token] = authorization.split(' ');
    if (!token) throw new AuthError('Su sesión expiró');

    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = id;

    next();
  } catch (err) {
    sendError(err, res);
  }
};
