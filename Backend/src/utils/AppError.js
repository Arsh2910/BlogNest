class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // passes message to the built-in Error class
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
