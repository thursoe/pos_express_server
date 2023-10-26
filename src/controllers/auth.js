const { User, Role } = require("../models");
const { ErrorHandler } = require("../utils/ErrorHandler.js");
const { validateUser } = require("../utils/validation/validation.js");
const { catchAsyncError } = require("../middlewares");
const {
  generateToken,
  ACCESS_TOKEN_OPTION,
  REFRESH_TOKEN_OPTION,
  jwt,
} = require("../utils/jwt");

signup = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = await validateUser(req.body);

  const roleList = await Role.find({}).exec();
  const role = roleList.find(
    (r) => r.id === req.body.role || r.name === "user"
  );

  const user = await User.create({
    username: username,
    email: email,
    password: password,
    role: role?.id,
  });

  res.status(200).send({
    success: true,
    message: "User created sucessfully!",
  });
});

signin = catchAsyncError(async (req, res, next) => {
  const { password, email } = await validateUser(req.body);
  const user = await User.findOne({ email }).exec();

  if (!user) return next(new ErrorHandler("Oops! User Not Found", 404));

  const auth = await user.comparePassword(password);

  if (!auth) return next(new ErrorHandler("Invaild Password", 401));

  const { accessToken, refreshToken } = await generateToken(user);

  res.cookie("accessToken", accessToken, ACCESS_TOKEN_OPTION);
  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTION);

  res.json({
    success: true,
    message: "Login successfully!",
    tokens: { accessToken, refreshToken },
  });
});

signout = catchAsyncError(async (req, res, next) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });

  // need to check user session here

  return res.status(200).send({
    success: true,
    message: "successfully signed out!",
  });
});

refreshTokens = catchAsyncError(async (req, res, next) => {
  let token =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  const user = await User.findOne({ _id: decoded.id }).exec();

  if (!user) return next(new ErrorHandler("Unauthorized", 404));

  const { accessToken, refreshToken } = await generateToken(user);

  res.cookie("accessToken", accessToken, ACCESS_TOKEN_OPTION);
  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTION);

  res.json({
    success: true,
    message: "Refresh successfully! New tokens created.",
    tokens: { accessToken, refreshToken },
  });
});

module.exports = { signup, signin, signout, refreshTokens };
