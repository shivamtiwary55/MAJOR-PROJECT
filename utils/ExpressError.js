class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);   // important
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;