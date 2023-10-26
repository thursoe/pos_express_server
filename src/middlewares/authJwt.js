require("dotenv").config();
const { User } = require("../models/index.js");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { jwt } = require("../utils/jwt.js");
const { catchAsyncError } = require("./catchAsyncErrors.js");

isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  const user = await User.findOne({ _id: decoded.id })
    .populate("role", "name")
    .exec();

  if (!user) return next(new ErrorHandler("Unauthorized", 404));

  req.user = user;

  next();
});

authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role.name || "")) {
      return next(
        new ErrorHandler(
          `You do not have permission to perform this action.`,
          403
        )
      );
    }
    next();
  };
};

const authJwt = {
  isAuthenticated,
  authorizeRole,
};
module.exports = authJwt;
