class ExpressError extends Error {
    constructor(statusCode, message) {
      super(message);  // Calling parent constructor with the message
      this.statusCode = statusCode;  // Adding statusCode property to the error
      this.message = message;
    }
  }
  
  module.exports = ExpressError;
  