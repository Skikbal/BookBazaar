class ApiError extends Error {
  constructor(statusCode,
     message = "somthing went wromg !",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    }
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
