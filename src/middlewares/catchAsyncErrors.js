// Middleware for handling exceptions inside of async express routes
// and passing them to express error handlers. Based on 'express-async-handler' module

const catchAsyncError = (fn) =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

module.exports = { catchAsyncError };
