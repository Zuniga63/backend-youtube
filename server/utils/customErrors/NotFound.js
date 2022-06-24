module.exports = class NotFoundError extends Error {
  constructor(message, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = 'NotFoundError';
    this.message = message;
  }
};
