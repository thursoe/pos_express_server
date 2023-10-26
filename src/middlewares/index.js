const { isAuthenticated, authorizeRole } = require("./authJwt.js");
const { errorMiddleware } = require("./errorMiddleware.js");
const { catchAsyncError } = require("./catchAsyncErrors.js");
const multer = require("./multer");

module.exports = {
  isAuthenticated,
  authorizeRole,
  errorMiddleware,
  catchAsyncError,
  multer,
};
