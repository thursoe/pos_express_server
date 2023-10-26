const { ErrorHandler } = require("../utils/ErrorHandler.js");

errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err?.name == "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err?.code == 11000 && err.keyPattern?.email == 1) {
    const message = `Email address already in use. Please choose another email address.`;
    err = new ErrorHandler(message, 400);
  }

  if (err?.code == 11000 && err.name == "MongoBulkWriteError") {
    const message = `Duplicate entries while uploading to database. Please try again`;
    err = new ErrorHandler(message, err.statusCode);
  }

  if (err?.code == 11000 && err.name == "MongoServerError") {
    const message = `Duplicate entry: ${err?.keyValue && `Keys: ${Object.keys(err.keyValue).join(', ')}`}`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { errorMiddleware };
