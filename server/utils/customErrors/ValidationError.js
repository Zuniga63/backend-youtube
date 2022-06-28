module.exports = class ValidationError extends Error {
  constructor(message, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.name = 'ValidationError';
    this.message = message;
  }
};
