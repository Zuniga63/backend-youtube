module.exports = class AuthError extends Error {
  constructor(message, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
    this.name = 'AuthError';
    this.message = message;
  }
};
